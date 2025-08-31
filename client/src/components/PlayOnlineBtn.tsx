import { useNavigate } from "react-router-dom"

const PlayOnlineBtn = () => {

    const authUser = false;
   
    const navigate = useNavigate();

    const handleClick = () => {
        if (!authUser) {
            navigate("/login")
        } else {
            navigate("/lobby");
        }
    };

    return (
        <button onClick={handleClick} className="max-md:absolute top-3 right-3 border-none rounded md:rounded-[0.5rem] bg-amber-500 text-black font-semibold text-[1rem] md:text-4xl py-[0.2rem] px-[0.5rem] md:py-[1rem] md:px-[2rem] mx-auto block md:mt-10 hover:bg-amber-400 hover:scale-105 hover:text-gray-800 transition-all duration-300 cursor-pointer">
            Play Online
        </button>
    )
}

export default PlayOnlineBtn
