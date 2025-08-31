import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";

const History = () => {

    const context = useContext(AppContext);
    if (!context) throw new Error("History must be within AppContextProvider");
    const { authUser, setShowHistory, getHistory, history, game, users } = context;

    const opponentId = authUser ? game?.players.find((id: string) => id !== authUser._id) : undefined;
    const opponent = users.find((user) => user._id === opponentId);

    useEffect(() => {
        const fetchHistory = async () => {
            if (authUser && opponentId) {
                await getHistory(authUser._id, opponentId)
            }
        };
        fetchHistory();
    }, [authUser, opponentId, game]);

    return (
        <div className="absolute top-0 left-0 w-full h-screen backdrop-blur-lg text-gray-600 flex items-start justify-center z-50">
            <div className="relative bg-stone-200 rounded-xl p-6 w-[90%] md:w-[40%] max-h-[85vh] flex flex-col mt-10">
                <button onClick={() => setShowHistory(false)} className="absolute top-3 right-3 text-gray-600 hover:text-white">✕</button>

                {/* TITLE */}
                <h2 className="text-xl font-bold mb-4">Game History with {opponent?.name}</h2>

                {/* STATS SUMMARY */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 text-center font-semibold">
                    <div className="bg-white rounded-lg p-3 shadow-md">
                        <p className="text-gray-500 text-sm">Total</p>
                        <p className="text-lg">{history?.total}</p>
                    </div>

                    <div className="bg-green-100 rounded-lg p-3 shadow-md">
                        <p className="text-gray-500 text-sm">Your Wins</p>
                        <p className="text-lg">
                            {authUser && history?.user1Wins}
                        </p>
                    </div>

                    <div className="bg-red-100 rounded-lg p-3 shadow-md">
                        <p className="text-gray-500 text-sm">Opponent Wins</p>
                        <p className="text-lg">{history?.user2Wins}</p>
                    </div>

                    <div className="bg-yellow-100 rounded-lg p-3 shadow-md">
                        <p className="text-gray-500 text-sm">Draws</p>
                        <p className="text-lg">{history?.draws}</p>
                    </div>
                </div>

                {/* Recent games */}
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Recent Games</h3>
                <ul className="space-y-3 overflow-y-scroll">
                    {history?.recent.map((game) => (
                        <li key={game._id} className="bg-gray-700 text-white rounded-lg p-3 shadow-md flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-300">
                                    {new Date(game.createdAt).toLocaleString()}{" "}
                                    {/* {new Date(game.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} */}
                                </p>

                                <p className="font-semibold">
                                    {
                                        game.winner === "draw"
                                            ?
                                            "Draw"
                                            :
                                            game.winner === "X"
                                                ? "Winner: X"
                                                : "Winner: O"
                                    }
                                </p>
                            </div>

                            {/* Mini board preview */}
                            <div className="grid grid-cols-3 gap-1 w-16 h-16">
                                {game.board.map((cell: string | null, i: number) => {
                                    const isWinning = game.winningLine?.includes(i);
                                    return (
                                        <div
                                            key={i}
                                            className={`flex items-center justify-center text-xs font-bold rounded ${isWinning ? "bg-green-300 text-black" : "bg-gray-600"}`}
                                        >
                                            {cell || ""}
                                        </div>
                                    );
                                })}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default History
