type Props = {
  value: string | null;
  onClickBox: () => void;
  isWinning: boolean
};

const Box = ({ value, onClickBox, isWinning }: Props) => {

  const style = value === "X" ? "text-[rgb(255,70,37)]" : value === "O" ? "text-[rgb(44,135,255)]" : "";

  return (
    <button 
      onClick={onClickBox} 
      className={`bg-white border-none rounded-[10%] shadow-md w-20 h-20 md:w-25 md:h-25 text-center text-5xl md:text-6xl font-bold leading-[5rem] hover:shadow-lg cursor-pointer font-[Fredoka] ${style} ${isWinning ? "bg-green-300!" : ""}`}
    >
      {value}
    </button>
  )
}

export default Box
