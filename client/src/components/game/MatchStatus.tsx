import { cn } from "@/lib/utils";
import { Users, Clock, Trophy, Loader2, AlertCircle } from "lucide-react";

type MatchStatusType = 
  | "searching" 
  | "waiting" 
  | "your_turn" 
  | "opponent_turn" 
  | "won" 
  | "lost" 
  | "draw"
  | "disconnected";

interface MatchStatusProps {
  status: MatchStatusType;
  opponentName?: string;
  timeRemaining?: number;
}

const statusConfig: Record<MatchStatusType, {
  icon: typeof Users;
  text: string | ((name?: string) => string);
  className: string;
}> = {
  searching: {
    icon: Users,
    text: "Searching for opponent...",
    className: "bg-muted text-muted-foreground"
  },
  waiting: {
    icon: Clock,
    text: "Waiting for opponent...",
    className: "bg-muted text-muted-foreground"
  },
  your_turn: {
    icon: Clock,
    text: "Your turn!",
    className: "bg-primary text-primary-foreground"
  },
  opponent_turn: {
    icon: Clock,
    text: (name) => `${name || "Opponent"}'s turn`,
    className: "bg-secondary text-secondary-foreground"
  },
  won: {
    icon: Trophy,
    text: "You won!",
    className: "bg-status-online text-white"
  },
  lost: {
    icon: Trophy,
    text: "You lost",
    className: "bg-status-busy text-white"
  },
  draw: {
    icon: Trophy,
    text: "It's a draw!",
    className: "bg-status-away text-white"
  },
  disconnected: {
    icon: AlertCircle,
    text: "Connection lost",
    className: "bg-status-busy text-white"
  }
};

export function MatchStatus({ status, opponentName, timeRemaining }: MatchStatusProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const text = typeof config.text === "function" 
    ? config.text(opponentName) 
    : config.text;
  
  const isSearching = status === "searching";
  
  return (
    <div 
      className={cn(
        "flex items-center justify-center gap-2 px-4 py-3 rounded-lg",
        "font-medium text-sm",
        config.className
      )}
      data-testid="match-status"
      role="status"
      aria-live="polite"
    >
      {isSearching ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Icon className="w-4 h-4" />
      )}
      <span>{text}</span>
      {timeRemaining !== undefined && timeRemaining > 0 && (
        <span className="ml-2 font-mono tabular-nums">
          {timeRemaining}s
        </span>
      )}
    </div>
  );
}
