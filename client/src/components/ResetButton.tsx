type Props = {
  resetBoard: () => void;
  gameOver: boolean;
};

const ResetButton = ({ resetBoard, gameOver }: Props) => {
  return (
    <button onClick={resetBoard} className="border-none rounded-[0.5rem] bg-[rgb(0,110,255)] text-white text-[2rem] py-[0.5rem] px-[1rem] my-[2rem] mx-auto block cursor-pointer">
      {!gameOver ? "Reset" : "Play Again"}
    </button>
  )
}

export default ResetButton
