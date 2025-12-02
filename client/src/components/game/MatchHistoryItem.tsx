import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, X as XIcon, Minus } from "lucide-react";

type MatchResult = "won" | "lost" | "draw";

interface MatchHistoryItemProps {
  opponent: string;
  result: MatchResult;
  date: string;
  yourSymbol: "X" | "O";
}

const resultConfig: Record<MatchResult, {
  icon: typeof Trophy;
  label: string;
  className: string;
}> = {
  won: {
    icon: Trophy,
    label: "Won",
    className: "text-status-online bg-status-online/10"
  },
  lost: {
    icon: XIcon,
    label: "Lost",
    className: "text-status-busy bg-status-busy/10"
  },
  draw: {
    icon: Minus,
    label: "Draw",
    className: "text-status-away bg-status-away/10"
  }
};

export function MatchHistoryItem({ opponent, result, date, yourSymbol }: MatchHistoryItemProps) {
  const config = resultConfig[result];
  const Icon = config.icon;
  const initials = opponent.slice(0, 2).toUpperCase();
  
  return (
    <div 
      className="flex items-center gap-3 p-3 rounded-lg bg-card border border-card-border hover-elevate"
      data-testid="match-history-item"
    >
      <Avatar className="h-10 w-10">
        <AvatarFallback className="bg-chart-4 text-white font-medium text-sm">
          {initials}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="font-medium text-foreground truncate">
          vs. {opponent}
        </div>
        <div className="text-xs text-muted-foreground">
          {date} · You played {yourSymbol}
        </div>
      </div>
      
      <div className={cn(
        "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
        config.className
      )}>
        <Icon className="w-3 h-3" />
        <span>{config.label}</span>
      </div>
    </div>
  );
}
