import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Frown, Handshake, RotateCcw, Home } from "lucide-react";
import { cn } from "@/lib/utils";

type GameResult = "won" | "lost" | "draw";

interface GameResultModalProps {
  isOpen: boolean;
  result: GameResult;
  onPlayAgain: () => void;
  onBackToLobby: () => void;
  stats?: {
    yourScore: number;
    opponentScore: number;
    winStreak: number;
  };
}

const resultConfig: Record<
  GameResult,
  {
    icon: typeof Trophy;
    title: string;
    subtitle: string;
    iconClass: string;
    bgClass: string;
  }
> = {
  won: {
    icon: Trophy,
    title: "Victory!",
    subtitle: "Great game! You outplayed your opponent.",
    iconClass: "text-yellow-500",
    bgClass: "bg-gradient-to-b from-yellow-500/20 to-transparent",
  },
  lost: {
    icon: Frown,
    title: "Defeat",
    subtitle: "Better luck next time!",
    iconClass: "text-muted-foreground",
    bgClass: "bg-gradient-to-b from-muted/50 to-transparent",
  },
  draw: {
    icon: Handshake,
    title: "Draw!",
    subtitle: "A well-matched game!",
    iconClass: "text-chart-4",
    bgClass: "bg-gradient-to-b from-chart-4/20 to-transparent",
  },
};

export function GameResultModal({
  isOpen,
  result,
  onPlayAgain,
  onBackToLobby,
  stats,
}: GameResultModalProps) {
  const config = resultConfig[result];
  const Icon = config.icon;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-sm"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogTitle className="sr-only">Game Result</DialogTitle>
        <div
          className={cn("absolute inset-0 rounded-lg -z-10", config.bgClass)}
        />

        <div className="flex flex-col items-center text-center py-4">
          <div
            className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center mb-4",
              "bg-card border border-card-border",
            )}
          >
            <Icon className={cn("w-10 h-10", config.iconClass)} />
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-1">
            {config.title}
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            {config.subtitle}
          </p>

          {stats && (
            <div className="grid grid-cols-3 gap-4 w-full mb-6 p-4 bg-muted/50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {stats.yourScore}
                </div>
                <div className="text-xs text-muted-foreground">Your Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {stats.opponentScore}
                </div>
                <div className="text-xs text-muted-foreground">Opponent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-chart-2">
                  {stats.winStreak}
                </div>
                <div className="text-xs text-muted-foreground">Win Streak</div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 w-full">
            <Button
              onClick={onPlayAgain}
              className="w-full"
              data-testid="button-play-again"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
            <Button
              variant="outline"
              onClick={onBackToLobby}
              className="w-full"
              data-testid="button-back-to-lobby"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Lobby
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
