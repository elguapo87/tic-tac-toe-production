import { useState } from "react"
import Board from "../components/Board"

const Home = () => {

    const [board, setBoard] = useState(Array(9).fill(null));

    return (
        <div className="relative flex flex-col">
            <Board board={board} onClickBox={() => null} />
        </div>
    )
}

export default Home
