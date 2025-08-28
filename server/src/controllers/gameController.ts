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

        // emit socket event to both players
        const io = getIO();
        [newGame.players[0], newGame.players[1]].forEach((player: any) => {
            const playerId = player._id ? player._id.toString() : player.toString();
            const socketId = userSocketMap[playerId];
            if (socketId) {
                io.to(socketId).emit("gameStarted", newGame);
                console.log("Emitting gameStarted to", playerId, "->", socketId);
            } else {
                console.log("⚠️ No socket found for", playerId);
            }
        });

        res.json({
            success: true,
            message: "Game started",
            game: newGame,
            opponent: opponentId
        });

    } catch (error) {

    }
};