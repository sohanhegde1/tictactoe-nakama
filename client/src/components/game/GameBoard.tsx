import { cn } from "@/lib/utils";
import { X, Circle } from "lucide-react";

export type CellValue = "X" | "O" | null;
export type BoardState = CellValue[];

interface GameBoardProps {
  board: BoardState;
  onCellClick: (index: number) => void;
  disabled?: boolean;
  winningLine?: number[] | null;
  lastMove?: number | null;
}

export function GameBoard({ 
  board, 
  onCellClick, 
  disabled = false,
  winningLine = null,
  lastMove = null
}: GameBoardProps) {
  const isWinningCell = (index: number) => winningLine?.includes(index);

  return (
    <div 
      className="grid grid-cols-3 gap-2 w-full max-w-[320px] aspect-square mx-auto"
      data-testid="game-board"
    >
      {board.map((cell, index) => (
        <button
          key={index}
          onClick={() => onCellClick(index)}
          disabled={disabled || cell !== null}
          className={cn(
            "aspect-square rounded-lg flex items-center justify-center",
            "bg-card border border-card-border",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            !disabled && cell === null && "hover-elevate active-elevate-2 cursor-pointer",
            disabled && "cursor-not-allowed opacity-60",
            isWinningCell(index) && "bg-primary/10 border-primary",
            lastMove === index && !isWinningCell(index) && "ring-2 ring-primary/50"
          )}
          data-testid={`cell-${index}`}
          aria-label={cell ? `Cell ${index + 1}: ${cell}` : `Cell ${index + 1}: empty`}
        >
          {cell === "X" && (
            <X 
              className={cn(
                "w-12 h-12 sm:w-16 sm:h-16 text-chart-1 stroke-[3]",
                isWinningCell(index) && "animate-pulse"
              )} 
            />
          )}
          {cell === "O" && (
            <Circle 
              className={cn(
                "w-10 h-10 sm:w-14 sm:h-14 text-chart-4 stroke-[3]",
                isWinningCell(index) && "animate-pulse"
              )} 
            />
          )}
        </button>
      ))}
    </div>
  );
}
