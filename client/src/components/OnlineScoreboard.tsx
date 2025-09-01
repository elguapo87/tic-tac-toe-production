import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import History from "./History";

const OnlineScoreboard = () => {

    const context = useContext(AppContext);
    if (!context) throw new Error("OnlineScoreBoard must be within AppContextProvider");
    const { game, users, authUser, getHistory, history, setShowHistory, showHistory } = context;

    const [scores, setScores] = useState({ xScore: 0, oScore: 0 });

    if (!game) return null;

    // IDs
    const playerXId = game.players[0];
    const playerOId = game.players[1];

    // Find actual user objects
    const playerX = users.find((user) => user._id === playerXId);
    const playerO = users.find((user) => user._id === playerOId);

    // Resolve names:
    const playerXName =
        authUser && authUser._id === playerXId ? authUser.name : playerX?.name || "Player X";
    const playerOName =
        authUser && authUser._id === playerOId ? authUser.name : playerO?.name || "Player O";

    // Track score updates when game ends
    useEffect(() => {
        if (game.isOver && game.winner) {
            setScores((prev) => {
                if (game.winner === "X") return { ...prev, xScore: prev.xScore + 1 };
                if (game.winner === "O") return { ...prev, oScore: prev.oScore + 1 };
                return prev;
            });
        }
    }, [game.isOver, game.winner])

    // Symbol colors (absolute)
    const COLOR_X = "text-[rgb(255_70_37)]";
    const COLOR_O = "text-[rgb(44_135_255)]";
    const BORDER_X = "border-[rgb(255_70_37)]";
    const BORDER_O = "border-[rgb(44_135_255)]";

    // Whose turn
    const currentTurn = game.xPlaying ? "X" : "O";

    // Borders: only show while game is NOT over
    const xBorderClass = !game.isOver && currentTurn === "X" ? BORDER_X : "border-transparent";
    const oBorderClass = !game.isOver && currentTurn === "O" ? BORDER_O : "border-transparent";

    // Message color: winner-based when over; otherwise turn-based
    const messageColorClass = game.isOver
        ? game.winner === "X"
            ? COLOR_X
            : game.winner === "O"
            ? COLOR_O
            : "text-gray-300"
        : currentTurn === "X"
            ? COLOR_X
            : COLOR_O;

    const opponentId = authUser ? game.players.find((id: string) => id !== authUser._id) : undefined;

    useEffect(() => {
        const fetchHistory = async () => {
            if (authUser && opponentId) {
                await getHistory(authUser._id, opponentId);
            }
        };
        fetchHistory();
    }, [authUser, opponentId, game]);

    return (
        <div className="flex items-center gap-5 w-[20rem] text-[1rem] md:text-[1.5rem] mt-[5rem] mb-[1rem] md:mb-[2rem] mx-auto font-bold">
            <div className="w-full flex flex-col gap-3">

                {
                    history && history?.total > 0
                      &&
                    <button onClick={() => setShowHistory(true)} className="w-[70%] mb-3 md:mb-5 mx-auto bg-transparent border border-amber-400 text-white px-[1.5rem] py-[0.2rem] rounded-lg hover:bg-amber-400 hover:text-gray-100 transition-all ease-in duration-200 cursor-pointer">
                        Game History
                    </button>
                }

                {showHistory && <History />}

                <div className="flex items-center gap-5">
                    {/* X Player */}
                    <span
                        className={`w-full text-center py-[0.3rem] md:py-[1rem] px-0 ${COLOR_X}
                            rounded-[0.5rem] shadow-[0px_0px_8px_#888] border-[5px] transition-all duration-300 ${xBorderClass}`}
                    >
                        {authUser?._id === playerXId ? "You (X)" : playerXName.length > 6 ? playerXName.slice(0, 8) + "..." : playerXName} - {scores.xScore}
                    </span>

                    {/* O Player */}
                    <span
                        className={`w-full text-center py-[0.3rem] md:py-[1rem] px-0 ${COLOR_O}
                            rounded-[0.5rem] shadow-[0px_0px_8px_#888] border-[5px] transition-all duration-300 ${oBorderClass}`}
                    >
                        {authUser?._id === playerOId ? "You (O)" : playerOName.length > 6 ? playerOName.slice(0, 8) + "..." : playerOName} - {scores.oScore}
                    </span>
                </div>

                {/* Status message */}
                <div className={`mt-2 text-center font-semibold ${messageColorClass}`}>
                    {game.isOver ? (
                        game.winner === "draw" ? (
                            <span>Game Over — It’s a draw!</span>
                        ) : game.winner === "X" ? (
                            <span>
                                Game Over - {authUser?._id === playerXId ? "You" : playerXName} won 🎉
                            </span>
                        ) : (
                            <span>
                                Game Over - {authUser?._id === playerOId ? "You" : playerOName} won 🎉
                            </span>
                        )
                    ) : currentTurn === "X" ? (
                        authUser?._id === playerXId ? "Your turn to play" : `${playerXName} turn to play`
                    ) : authUser?._id === playerOId ? (
                        "Your turn to play"
                    ) : (
                        `${playerOName} turn to play` 
                    )}
                </div>
            </div>
        </div>
    )
}

export default OnlineScoreboard
