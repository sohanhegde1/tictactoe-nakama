import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { GameBoard, BoardState, CellValue } from "@/components/game/GameBoard";
import { PlayerCard } from "@/components/game/PlayerCard";
import { MatchStatus } from "@/components/game/MatchStatus";
import { GameResultModal } from "@/components/game/GameResultModal";
import { ThemeToggle } from "@/components/game/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSocketIO } from "@/hooks/use-socket-io";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";

type GameResult = "won" | "lost" | "draw" | null;

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function checkWinner(board: BoardState): { winner: CellValue; line: number[] | null } {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  return { winner: null, line: null };
}

export default function Game() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const {
    gameState,
    userId,
    username,
    makeMove,
    requestRematch,
    leaveGame,
    error,
    clearError,
  } = useSocketIO();

  const [localBoard, setLocalBoard] = useState<BoardState>(Array(9).fill(null));
  const [isYourTurn, setIsYourTurn] = useState(false);
  const [isSendingMove, setIsSendingMove] = useState(false);
  const [lastMove, setLastMove] = useState<number | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [gameResult, setGameResult] = useState<GameResult>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [playerSymbol, setPlayerSymbol] = useState<CellValue>("X");
  const [opponentName, setOpponentName] = useState("Opponent");
  const [lastGameOverState, setLastGameOverState] = useState(false);
  const [yourScore, setYourScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);

  useEffect(() => {
    if (!gameState) {
      setLocation("/");
    }
  }, [gameState, setLocation]);

  useEffect(() => {
    if (gameState) {
      const board = gameState.board.map(cell => 
        cell === "X" ? "X" : cell === "O" ? "O" : null
      ) as BoardState;
      setLocalBoard(board);

      const myPlayer = gameState.players.find(p => p.id === userId);
      const opponent = gameState.players.find(p => p.id !== userId);

      if (myPlayer) {
        setPlayerSymbol(myPlayer.symbol as CellValue);
      }
      if (opponent) {
        setOpponentName(opponent.username);
      }

      setIsYourTurn(gameState.currentTurn === userId);
      setIsSendingMove(false);

      if (gameState.gameOver) {
        if (gameState.winningLine) {
          setWinningLine(gameState.winningLine);
        }
        
        if (!lastGameOverState) {
          let result: "won" | "lost" | "draw";
          if (gameState.isDraw) {
            setGameResult("draw");
            result = "draw";
          } else if (gameState.winner === userId) {
            setGameResult("won");
            setYourScore(prev => prev + 1);
            result = "won";
          } else {
            setGameResult("lost");
            setOpponentScore(prev => prev + 1);
            result = "lost";
          }
          
          // Save game result to server
          if (userId) {
            fetch(`/api/player/${userId}/game-result`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ result }),
            }).catch(err => console.error("Failed to save game result:", err));
          }
          
          setTimeout(() => setShowResultModal(true), 1000);
        }
        setLastGameOverState(true);
      } else {
        if (lastGameOverState) {
          setGameResult(null);
          setShowResultModal(false);
          setWinningLine(null);
          setLastMove(null);
        }
        setLastGameOverState(false);
      }
    }
  }, [gameState, userId, lastGameOverState]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Game Error",
        description: error,
        variant: "destructive",
      });
      clearError();
    }
  }, [error, toast, clearError]);

  const handleCellClick = useCallback(async (index: number) => {
    if (!isYourTurn || isSendingMove || localBoard[index] || gameResult || !gameState) return;

    setIsSendingMove(true);
    setIsYourTurn(false);
    
    const previousBoard = [...localBoard];
    const optimisticBoard = [...localBoard];
    optimisticBoard[index] = playerSymbol;
    setLocalBoard(optimisticBoard);
    setLastMove(index);

    try {
      await makeMove(gameState.id, index);
    } catch (err) {
      setLocalBoard(previousBoard);
      setIsYourTurn(true);
      setIsSendingMove(false);
      toast({
        title: "Move Failed",
        description: "Failed to make move. Try again.",
        variant: "destructive",
      });
    }
  }, [isYourTurn, isSendingMove, localBoard, gameResult, gameState, playerSymbol, makeMove, toast]);

  const handlePlayAgain = async () => {
    if (!gameState) return;
    try {
      await requestRematch(gameState.id);
      setLocalBoard(Array(9).fill(null));
      setIsYourTurn(false);
      setLastMove(null);
      setWinningLine(null);
      setGameResult(null);
      setShowResultModal(false);
    } catch {
      toast({
        title: "Rematch Failed",
        description: "Could not request rematch",
        variant: "destructive",
      });
    }
  };

  const handleBackToLobby = async () => {
    if (gameState) {
      await leaveGame(gameState.id);
    }
    setLocation("/");
  };

  const getMatchStatus = () => {
    if (!gameState) return "searching";
    if (gameResult === "won") return "won";
    if (gameResult === "lost") return "lost";
    if (gameResult === "draw") return "draw";
    return isYourTurn ? "your_turn" : "opponent_turn";
  };

  const opponentSymbol: CellValue = playerSymbol === "X" ? "O" : "X";

  if (!gameState) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
          <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackToLobby}
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-semibold text-foreground">Finding Match</h1>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <Card>
            <CardContent className="py-12 flex flex-col items-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">
                Waiting for opponent...
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackToLobby}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold text-foreground">Game</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto px-4 py-6 w-full flex flex-col">
        <MatchStatus
          status={getMatchStatus()}
          opponentName={opponentName}
        />

        <div className="mt-6">
          <PlayerCard
            name={opponentName}
            symbol={opponentSymbol!}
            isActive={!isYourTurn && !gameResult}
            score={opponentScore}
          />
        </div>

        <div className="flex-1 flex items-center justify-center py-8">
          <GameBoard
            board={localBoard}
            onCellClick={handleCellClick}
            disabled={!isYourTurn || !!gameResult}
            winningLine={winningLine}
            lastMove={lastMove}
          />
        </div>

        <div className="mt-auto">
          <PlayerCard
            name={username || "You"}
            symbol={playerSymbol!}
            isActive={isYourTurn && !gameResult}
            isYou
            score={yourScore}
          />
        </div>
      </main>

      {gameResult && (
        <GameResultModal
          isOpen={showResultModal}
          result={gameResult}
          onPlayAgain={handlePlayAgain}
          onBackToLobby={handleBackToLobby}
          stats={{
            yourScore,
            opponentScore,
            winStreak: 0,
          }}
        />
      )}
    </div>
  );
}
