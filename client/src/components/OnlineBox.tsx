import { useContext } from "react";
import { AppContext } from "../context/AppContext";

type Props = {
    value: string | number | null;
    onClickBox: () => void;
    isWinning: boolean;
};

const OnlineBox = ({ value, onClickBox, isWinning }: Props) => {

    const context = useContext(AppContext);
    if (!context) throw new Error("OnlineBox must be within AppContextProvider");
    const { game } = context;

    if (!game) return;

    // Symbol colors
    const style =
        value === "X"
            ? "text-[rgb(255,70,37)]" // X always red
            : "text-[rgb(44,135,255)]"; // O always blue

    return (
        <button onClick={onClickBox} className={`bg-white border-none rounded-[10%] shadow-md w-20 h-20 text-center text-4xl md:text-5xl font-bold m-2 md:leading-[5rem] hover:shadow-lg font-[Fredoka] ${style} ${isWinning ? "bg-green-300!" : ""}`}>
            {value}
        </button>
    )
}

export default OnlineBox
