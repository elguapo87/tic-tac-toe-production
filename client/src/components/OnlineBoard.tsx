import OnlineBox from "./OnlineBox";

type Props = {
    board: (string | number | null)[];
    onClickBox: (index: number) => Promise<void>;
};

const OnlineBoard = ({ board, onClickBox }: Props) => {
  return (
    <div className="grid grid-cols-[repeat(3,6rem)] justify-center">
      {board.map((item, index) => (
        <OnlineBox key={index} value={item} onClickBox={() => item === null && onClickBox(index)} />
      ))}
    </div>
  )
}

export default OnlineBoard
