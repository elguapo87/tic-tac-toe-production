import assets from "../assets/assets";
import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import Profile from "../components/Profile";
import Loader from "../components/Loader";

const OnlineLobby = () => {

    const context = useContext(AppContext);
    if (!context) throw new Error("OnlineLobby must be within AppContextProvider");
    const { authUser, users, onlineUsers, getUsers, startGame, loadingUsers } = context;

    const filteredUsers = users
        .filter((user) => onlineUsers.includes(user._id))
        .filter((user) => !user.inGame)
        .filter((user) => user._id !== authUser?._id);

    const handleStartGame = async (userId: string) => {
        await startGame(userId);
    };

    useEffect(() => {
        getUsers();
    }, [onlineUsers, authUser]);

    return (
        <div className="relative min-h-screen bg-gray-700 text-white px-4 md:px-8 flex md:items-center">

            <Profile type="lobby" />

            <div className="flex items-start w-full max-md:mt-10">
                <div className="flex-1">
                    <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-10 text-center">Online Players</h1>
                    <div className="space-y-4 max-h-[400px] overflow-y-scroll pr-2">

                        {loadingUsers ? (
                            <div className="flex flex-col items-center gap-5">
                                <h2 className="text-stone-100 md:text-center text-lg md:text-2xl">Loading players...</h2>
                                <Loader />
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <>
                                <h2 className="text-stone-100 md:text-center text-lg md:text-2xl">No players online</h2>
                                <p className="text-gray-400 md:text-center">Players will appear here when they log in</p>
                            </>
                        ) : (
                            filteredUsers.map((user) => (
                                <div key={user._id} className="flex items-center justify-between bg-gray-800 p-4 rounded-lg shadow-md">
                                    <div className="flex items-center space-x-3">
                                        <img src={user.userImg || assets.avatar_icon} alt={user.name} className="w-10 h-10 rounded-full" />
                                        <span className="text-lg">{user.name}</span>
                                    </div>
                                    <button onClick={() => handleStartGame(user._id)} className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded">
                                        Challenge
                                    </button>
                                </div>
                            ))
                        )}

                    </div>
                </div>

                <div className="flex-1 max-md:hidden flex justify-center">
                    <img className="" src={assets.tic_tac_toe} alt="" />
                </div>
            </div>

        </div>
    )
}

export default OnlineLobby