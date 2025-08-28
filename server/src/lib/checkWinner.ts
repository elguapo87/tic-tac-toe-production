export type WinnerResult = 
    | { winner: "X" | "O"; line: number }
    | { winner: "draw"; line: null }
    | null;


const winPatterns = [
    [0, 1, 2], // top row
    [3, 4, 5], // middle row
    [6, 7, 8], // bottom row
    [0, 3, 6], // left column
    [1, 4, 7], // middle column
    [2, 5, 8], // right column
    [0, 4, 8], // diagonal \
    [2, 4, 6], // diagonal /
  ];

export const checkWinner = (board: (string | null)[]) => {
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[b] === board[c]) {
            return { winner: board[a] as "X" | "O", line: pattern };
        } 
    }

    if (board.every((cell) => cell !== null)) {
        return { winner: "draw", line: null };
    }

    return null;
};