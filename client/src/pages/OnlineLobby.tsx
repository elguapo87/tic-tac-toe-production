import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";

const OnlineLobby = () => {

    const navigate = useNavigate();

    const onlineUsers = [
        { id: "1", name: "Alice", userImage: "https://i.pravatar.cc/40?u=alice" },
        { id: "2", name: "Bob", userImage: "https://i.pravatar.cc/40?u=bob" },
        { id: "3", name: "Charlie", userImage: "https://i.pravatar.cc/40?u=charlie" },

        { id: "4", name: "Charlie", userImage: "https://i.pravatar.cc/40?u=charlie" },
        { id: "5", name: "Charlie", userImage: "https://i.pravatar.cc/40?u=charlie" },
        { id: "6", name: "Charlie", userImage: "https://i.pravatar.cc/40?u=charlie" },
        { id: "7", name: "Charlie", userImage: "https://i.pravatar.cc/40?u=charlie" },
        { id: "8", name: "Charlie", userImage: "https://i.pravatar.cc/40?u=charlie" },
    ];

    const handleChallenge = (userId: string) => {
        navigate("/online");
    };

    return (
        <div className="relative min-h-screen bg-gray-700 text-white px-4 md:px-8 flex md:items-center">
            <div onClick={() => navigate("/")} className="absolute top-3 right-3 md:top-4 md:right-4 bg-stone-100 text-gray-600 rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-bold text-xl cursor-pointer hover:bg-stone-200 transition-all duration-200">X</div>

            <div className="flex items-start w-full max-md:mt-10">
                <div className="flex-1">
                    <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-10 text-center">Online Players</h1>
                    <div className="space-y-4 max-h-[400px] overflow-y-scroll pr-2">
                        {onlineUsers.map((user) => (
                            <div key={user.id} className="flex items-center justify-between bg-gray-800 p-4 rounded-lg shadow-md">
                                <div className="flex items-center space-x-3">
                                    <img src={user.userImage} alt={user.name} className="w-10 h-10 rounded-full" />
                                    <span className="text-lg">{user.name}</span>
                                </div>

                                <button onClick={() => handleChallenge(user.id)} className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded">Challange</button>
                            </div>
                        ))}

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