import { useState } from "react"
import Board from "../components/Board"

const Home = () => {

    const [board, setBoard] = useState(Array(9).fill(null));
    const [xPlaying, setXPlaying] = useState(true);
    const [gameOver, setGameOver] = useState(false);

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const handleBoxClick = (boxIndex: number) => {
        const updatedBoard = board.map((item, index) => {
            if (boxIndex === index) {
                return xPlaying ? "X" : "O";
            } else {
                return item;
            }
        });

        setBoard(updatedBoard);
        setXPlaying(!xPlaying);
        checkWinner(updatedBoard);
    };

    const checkWinner = (board: (string | null)[]) => {
        for (const condition of winningConditions) {
            const [a, b, c] = condition;
            if (board[a] && board[a] === board[b] && board[b] === board[c]) {
                setGameOver(true);
                return board[a]
            }
        }
    };


    return (
        <div className="relative flex flex-col">
            <Board board={board} onClickBox={gameOver ? () => {} : handleBoxClick} />
        </div>
    )
}

export default Home
