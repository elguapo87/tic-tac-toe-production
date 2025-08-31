import { Request, Response } from "express";
import userModel, { UserDocument } from "../models/userModel";
import gameModel from "../models/gameModel";
import { checkWinner } from "../lib/checkWinner";
import { getIO } from "../lib/socketServer";
import { userSocketMap } from "../lib/socket";

interface AuthenticatedRequest extends Request {
    user?: UserDocument;
};

export const makeMove = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?._id as string;
        const { gameId } = req.params;
        const { boxIndex } = req.body;

        const game = await gameModel.findById(gameId);
        if (!game || game.isOver) return res.json({ success: false, message: "Invalid game" });

        // Enforce turn logic
        const currentSymbol = game.xPlaying ? "X" : "O";
        const playerIndex = game.players.findIndex((p: string) => p.toString() === userId.toString());
        if ((game.xPlaying && playerIndex !== 0) || (!game.xPlaying && playerIndex !== 1)) {
            return res.json({ success: false, message: "Not your turn" });
        }

        if (game.board[boxIndex]) {
            return res.json({ success: false, message: "Cell already taken" });
        }

        // Place move
        game.board[boxIndex] = currentSymbol;
        game.xPlaying = !game.xPlaying;

        // Update move
        const result = checkWinner(game.board);
        if (result) {
            game.isOver = true;
            game.winner = result.winner;
            game.winningLine = result.line;

            // Free up players when game ends
            await userModel.updateMany(
                { _id: { $in: game.players } },
                { $set: { inGame: false } }
            );
        }

        await game.save();

        // Emit update to both players
        const io = getIO();
        game.players.forEach((pId: string) => {
            const sId = userSocketMap[pId];
            if (sId) io.to(sId).emit("gameUpdated", game)
        });

        res.json({ success: true, game })

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        res.status(500).json({ success: false, message: errMessage });
    }
};

export const startGame = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?._id as string;
        const { opponentId } = req.body;

        if (!opponentId) {
            return res.json({ success: false, message: "Opponent ID is required" });
        }

        if (opponentId === userId.toString()) {
            return res.json({ success: false, message: "You cannot play against yourself" });
        }

        const newGame = await gameModel.create({
            players: [userId, opponentId],
            board: Array(9).fill(null),
            xPlaying: true,
            winner: null,
            isOver: false
        });

        await newGame.populate("players", "name email userImg");

        await userModel.updateMany(
            { _id: { $in: [userId, opponentId] } },
            { $set: { inGame: true } }
        );

        const io = getIO();

        // Broadcast updated users list to everyone
        const updatedUsers = await userModel.find({}, "name email userImg inGame");
        io.emit("usersUpdated", updatedUsers);

        // emit socket event to both players
        [newGame.players[0], newGame.players[1]].forEach((player: any) => {
            const playerId = player._id ? player._id.toString() : player.toString();
            const socketId = userSocketMap[playerId];

            if (socketId) {
                const isStarter = playerId === userId.toString();
                const msg = isStarter
                    ? "You started a game!"
                    : "You have been challenged!";

                io.to(socketId).emit("gameStarted", {
                    game: newGame,
                    message: msg
                });
                console.log("Emitting gameStarted to", playerId, "->", socketId);
            } else {
                console.log("⚠️ No socket found for", playerId);
            }
        });

        res.json({
            success: true,
            game: newGame,
            opponent: opponentId
        });

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return res.status(500).json({ success: false, message: errMessage });
    }
};


export const quitGame = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        // Find any game where this user is a player
        const existingGame = await gameModel.findOne({
            players: userId
        });

        if (existingGame) {
            const opponentId = existingGame.players.find(
                (p: any) => p.toString() !== userId.toString()
            );

            if (!existingGame.isOver) {
                // ❌ Unfinished → delete it
                await gameModel.findByIdAndDelete(existingGame._id);
            } else {
                // ✅ Finished → keep in DB, just mark players free
                await userModel.updateMany(
                    { _id: { $in: existingGame.players } },
                    { $set: { inGame: false } }
                );
            }

            // Free both players in both cases
            await userModel.updateMany(
                { _id: { $in: existingGame.players } },
                { $set: { inGame: false } }
            );

            const io = getIO();

            // Broadcast updated users list
            const updatedUsers = await userModel.find({}, "name email userImg inGame");
            io.emit("usersUpdated", updatedUsers);

            // Notify opponent
            if (opponentId) {
                const opponentSocketId = userSocketMap[opponentId.toString()];
                if (opponentSocketId) {
                    io.to(opponentSocketId).emit("gameEnded", {
                        message: existingGame.isOver
                            ? "Opponent left the finished game"
                            : "Opponent left the game",
                    });
                }
            }
        } else {
            // No game found → just free the user
            await userModel.findByIdAndUpdate(userId, { inGame: false });
        }

        return res.json({ success: true, message: "You left the game" });

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return res.status(500).json({ success: false, message: errMessage });
    }
};

export const resetGame = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?._id as string;
        const { gameId } = req.params;

        const oldGame = await gameModel.findById(gameId);
        if (!oldGame) return res.json({ success: false, message: "Game not found" });

        // Only players can reset
        if (!oldGame.players.some((p: any) => p.toString() === userId.toString())) {
            return res.json({ success: false, message: "Not authorized" });
        }

        if (!oldGame.isOver) {
            return res.json({ success: false, message: "Game is not finished yet" });
        }

        const swappedPlayers = [...oldGame.players].reverse();

        // Create a new game with the same players
        const newGame = await gameModel.create({
            players: swappedPlayers,
            board: Array(9).fill(null),
            xPlaying: true,
            isOver: false,
            winner: null,
            winningLine: null
        });

        await newGame.save();

        // Emit update to both players
        const io = getIO();
        oldGame.players.forEach((pId: string) => {
            const sId = userSocketMap[pId];
            if (sId) io.to(sId).emit("gameUpdated", newGame);
        });

        res.json({ success: true, game: newGame })

    } catch (error) {
        console.error("Reset game error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getHistory = async (req: Request, res: Response) => {
    try {
        const { user1Id, user2Id } = req.params;

        const games = await gameModel.find({
            players: { $all: [user1Id, user2Id] },
            isOver: true
        }).sort({ createdAt: -1 });

        const stats = {
            total: games.length,
            draws: games.filter((game) => game.winner === "draw").length,

            user1Wins: games.filter((game) =>
                (game.winner === "X" && game.players[0].toString() === user1Id) ||
                (game.winner === "O" && game.players[1].toString() === user1Id)
            ).length,

            user2Wins: games.filter((game) =>
                (game.winner === "X" && game.players[0].toString() === user2Id) ||
                (game.winner === "O" && game.players[1].toString() === user2Id)
            ).length,

            recent: games.slice(0, 10)
        };

        res.json({ success: true, stats });

    } catch (error) {
        console.error("Failed to get stats:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};