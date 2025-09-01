import { useContext } from 'react'
import { AppContext } from '../context/AppContext';
import assets from '../assets/assets';

const Profile = ({ type } : { type: "lobby" | "game" }) => {

    const context = useContext(AppContext);
    if (!context) throw new Error("Profile must be within AppContextProvider");
    const { authUser, logout, quitGame } = context;

    const handleLogout = async () => {
        if (type === "game") {
            await quitGame();
        } else {
            await logout();
        }
    };

    return (
        <div className="absolute top-3 right-3 flex items-center gap-2">
            <img src={authUser?.userImg || assets.avatar_icon} alt={authUser?.name} className="w-8 h-8 md:w-10 md:h-10 aspect-square rounded-full" />
            <button onClick={handleLogout} className="bg-yellow-500 text-stone-800 rounded font-semibold text-sm md:text-base py-[0.1rem] px-[0.5rem] md:py-[0.3rem] md:px-[1.5rem] hover:bg-yellow-400 transition-all ease-in-out duration-200">
                {type === "lobby" ? "Logout" : "Quit"}
            </button>
        </div>
    )
}

export default Profile
