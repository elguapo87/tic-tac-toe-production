type Props = {
    value: string | number | null;
    onClickBox: () => void;
};

const OnlineBox = ({ value, onClickBox }: Props) => {

    const style =
        value === "X" 
            ? "text-[rgb(255,70,37)]" // X always red
            : "text-[rgb(44,135,255)]"; // O always blue

    return (
        <button onClick={onClickBox} className={`bg-white border-none rounded-[10%] shadow-md w-20 h-20 text-center text-4xl md:text-5xl font-bold m-2 md:leading-[5rem] hover:shadow-lg font-[Fredoka] ${style }`}>
            {value}
        </button>
    )
}

export default OnlineBox
