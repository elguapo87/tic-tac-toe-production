import OnlineBox from "./OnlineBox";

type Props = {
    board: (string | number | null)[];
};

const OnlineBoard = ({ board }: Props) => {
  return (
    <div className="grid grid-cols-[repeat(3,6rem)] justify-center">
      {board.map((item, index) => (
        <OnlineBox key={index} value={item} />
      ))}
    </div>
  )
}

export default OnlineBoard
