import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";

const OnlineLobby = () => {

    const context = useContext(AppContext);
    if (!context) throw new Error("OnlineLobby must be within AppContextProvider");
    const { authUser, users, onlineUsers, getUsers } = context;

    const navigate = useNavigate();

    const filteredUsers = users.filter((user) => onlineUsers.includes(user._id));

    const handleChallenge = (userId: string) => {
        navigate("/online");
    };
    

    useEffect(() => {
        getUsers();
    }, [onlineUsers, authUser]);

    return (
        <div className="relative min-h-screen bg-gray-700 text-white px-4 md:px-8 flex md:items-center">
            <div onClick={() => navigate("/")} className="absolute top-3 right-3 md:top-4 md:right-4 bg-stone-100 text-gray-600 rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-bold text-xl cursor-pointer hover:bg-stone-200 transition-all duration-200">X</div>

            <div className="flex items-start w-full max-md:mt-10">
                <div className="flex-1">
                    <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-10 text-center">Online Players</h1>
                    <div className="space-y-4 max-h-[400px] overflow-y-scroll pr-2">

                        {
                            filteredUsers.length === 0
                               ?
                            <h2 className="text-stone-100 md:text-center text-lg md:text-2xl">Users will appear here when they log in</h2>
                               :
                            filteredUsers.map((user) => (
                                <div key={user._id} className="flex items-center justify-between bg-gray-800 p-4 rounded-lg shadow-md">
                                    <div className="flex items-center space-x-3">
                                        <img src={user.userImg || assets.avatar_icon} alt={user.name} className="w-10 h-10 rounded-full" />
                                        <span className="text-lg">{user.name}</span>
                                    </div>

                                    <button onClick={() => handleChallenge(user._id)} className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded">Challange</button>
                                </div>
                            ))
                        }

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