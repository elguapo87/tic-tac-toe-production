import Box from "./Box";

type Props = {
  board: (string | null)[];
  onClickBox: (index: number) => void;
};



const Board = ({ board, onClickBox }: Props) => {
  return (
    <div className="grid grid-cols-[repeat(3,6rem)] justify-center">
      {board.map((item, index) => (
        <Box key={index} value={item} onClickBox={() => item === null && onClickBox(index)} />
      ))}
    </div>
  )
}

export default Board
