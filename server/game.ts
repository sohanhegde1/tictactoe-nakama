export type BoardState = (string | null)[];

export interface GameState {
  id: string;
  board: BoardState;
  currentTurn: string;
  players: {
    id: string;
    username: string;
    symbol: "X" | "O";
  }[];
  winner: string | null;
  isDraw: boolean;
  gameOver: boolean;
  winningLine: number[] | null;
}

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

export function checkWinner(board: BoardState): { winner: string | null; line: number[] | null } {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  return { winner: null, line: null };
}

export function checkDraw(board: BoardState): boolean {
  return board.every(cell => cell !== null);
}

export function validateMove(board: BoardState, position: number): boolean {
  if (position < 0 || position > 8) return false;
  if (board[position] !== null) return false;
  return true;
}

export function makeMove(board: BoardState, position: number, symbol: string): BoardState {
  const newBoard = [...board];
  newBoard[position] = symbol;
  return newBoard;
}

export function getGameStatus(state: GameState): string {
  if (state.gameOver) {
    if (state.isDraw) return "draw";
    return state.winner ? "won" : "lost";
  }
  return state.currentTurn === state.players[0].id ? "your_turn" : "opponent_turn";
}
