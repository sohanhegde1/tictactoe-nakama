import { useState } from "react";
import { GameBoard, BoardState } from "../game/GameBoard";

export default function GameBoardExample() {
  const [board, setBoard] = useState<BoardState>([
    "X", null, "O",
    null, "X", null,
    null, null, null
  ]);
  
  const handleClick = (index: number) => {
    if (board[index]) return;
    const newBoard = [...board];
    newBoard[index] = "O";
    setBoard(newBoard);
    console.log(`Cell ${index} clicked`);
  };
  
  return (
    <GameBoard 
      board={board} 
      onCellClick={handleClick}
      lastMove={4}
    />
  );
}
