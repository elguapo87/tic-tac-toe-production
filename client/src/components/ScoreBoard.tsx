type Props = {
    scores: {
        xScore: number;
        oScore: number;
    };
    xPlaying: boolean;
    gameOver: boolean;
    winner: string | null;
};

const ScoreBoard = ({ scores, xPlaying, gameOver, winner }: Props) => {

    const { xScore, oScore } = scores;
  
    return (
        <div className="flex flex-col gap-3 w-[20rem] text-[1.5rem] my-[3rem] mx-auto font-bold">
            <div className="flex items-center gap-5">
                {/* XScore */}
                <span 
                    className={`w-full text-center py-[1rem] px-0 text-[rgb(255_70_37)] rounded-[0.5rem]
                        shadow-[0px_0px_8px_#888] border-[5px] transition-all duration-300 ${(xPlaying && !gameOver) ? "border-[rgb(255_70_37)]" : "border-transparent"}`}
                >
                    X - {xScore}
                </span>

                {/* OScore */}
                <span
                    className={`w-full text-center py-[1rem] px-0 text-[rgb(44_135_255)] rounded-[0.5rem] 
                        shadow-[0px_0px_8px_#888] border-[5px] transition-all duration-300 ${(!xPlaying && !gameOver)? "border-[rgb(44_135_255)]" : "border-transparent"}`}
                >
                    O - {oScore}
                </span>
            </div>

            {
                !gameOver
                   &&
                <p>{xPlaying}</p>
            }

            <div className={`text-2xl mx-auto ${gameOver && "-mb-9"}`}>
                {
                    gameOver && winner !== "Draw"
                    &&
                    <p className="text-green-500 font-semibold">Game Over - <span className="text-3xl">{winner}</span> won </p>
                    ||
                    gameOver && winner === "Draw"
                    &&
                    <p className="text-green-500 font-semibold">Game Over it's a {winner} </p>
                }

            </div>

        </div>
    )
}

export default ScoreBoard
