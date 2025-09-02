import OnlineBox from "./OnlineBox";

type Props = {
    board: (string | number | null)[];
    onClickBox: (index: number) => Promise<void>;
    winningLine: [number] | null;
};

const OnlineBoard = ({ board, onClickBox, winningLine }: Props) => {
  return (
    <div className="grid grid-cols-[repeat(3,5rem)] md:grid-cols-[repeat(3,6rem)] gap-2 md:gap-y-2 md:gap-x-3 justify-center">
      {board.map((item, index) => (
        <OnlineBox key={index} value={item} onClickBox={() => item === null && onClickBox(index)} isWinning={winningLine?.includes(index) ?? false}  />
      ))}
    </div>
  )
}

export default OnlineBoard
