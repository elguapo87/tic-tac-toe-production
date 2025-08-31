import { useContext } from "react";
import { AppContext } from "../context/AppContext";

type Props = {
    handleResetGame: () => Promise<void>;
};

const ResetBtn = ({ handleResetGame }: Props) => {

    const context = useContext(AppContext);
    if (!context) throw new Error("ResetBtn must be within AppContextProvider");
    const { game } = context;

    return game?.isOver && (
        <button onClick={handleResetGame} className="border-none rounded-[0.5rem] bg-[rgb(0,110,255)] text-white text-[1.5rem] md:text-[2rem] py-[0.5rem] px-[1rem] my-[2rem] mx-auto block hover:bg-blue-500 hover:scale-105 hover:text-stone-200 transition-all duration-300 cursor-pointer">
            Play Again
        </button>
    )
}

export default ResetBtn
