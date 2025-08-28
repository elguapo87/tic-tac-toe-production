import { useContext, useState } from "react"
import Board from "../components/Board"
import ScoreBoard from "../components/ScoreBoard";
import ResetButton from "../components/ResetButton";
import PlayOnlineBtn from "../components/PlayOnlineBtn";
import { AppContext } from "../context/AppContext";

const Home = () => {

    const appContext = useContext(AppContext);
    if (!appContext) throw new Error("Home must be within AppContextProvider");
    const { authUser } = appContext;

    const [board, setBoard] = useState(Array(9).fill(null));
    const [xPlaying, setXPlaying] = useState(true);
    const [gameOver, setGameOver] = useState(false);
    const [scores, setScores] = useState({ xScore: 0, oScore: 0 });
    const [winner, setWinner] = useState<string | null>(null);
    const [winningLine, setWinningLine] = useState<number[] | null>(null)

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

        const result = checkWinner(updatedBoard);
        if (result) {
            if (result.winner === "X") {
                setScores((prev) => ({ ...prev, xScore: prev.xScore + 1 }));
            } else if (result.winner === "O") {
                setScores((prev) => ({ ...prev, oScore: prev.oScore + 1 }));
            }

            setWinningLine(result.line);
        }
    };

    const checkWinner = (board: (string | null)[]) => {
        for (const condition of winningConditions) {
            const [a, b, c] = condition;
            if (board[a] && board[a] === board[b] && board[b] === board[c]) {
                setGameOver(true);
                setWinner(board[a]);
                return { winner: board[a], line: [a, b, c] }
            }
        }

        if (!board.includes(null)) {
            setGameOver(true);
            setWinner("Draw");
            return null;
        }
    };

    const resetBoard = () => {
        setBoard(Array(9).fill(null));
        setGameOver(false);
        setWinner(null);
        setXPlaying(true);
        setWinningLine(null);
    };


    return (
        <div className="relative flex flex-col">
            {
              !authUser                                     
                 &&
              <div className='max-md:block hidden'>
                <PlayOnlineBtn />
              </div>
            }

            <ScoreBoard scores={scores} xPlaying={xPlaying} gameOver={gameOver} winner={winner} />
            <Board board={board} onClickBox={gameOver ? () => { } : handleBoxClick} winningLine={winningLine} />
            <ResetButton resetBoard={resetBoard} gameOver={gameOver} />

            {
                !authUser
                   &&
                <div className='max-md:hidden'>
                    <PlayOnlineBtn />
                </div>
            }
        </div>
    )
}

export default Home
