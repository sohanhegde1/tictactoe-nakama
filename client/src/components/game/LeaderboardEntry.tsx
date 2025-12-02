import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Flame, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LeaderboardEntryProps {
  rank: number;
  name: string;
  wins: number;
  losses: number;
  winStreak: number;
  isCurrentUser?: boolean;
  trend?: "up" | "down" | "same";
}

export function LeaderboardEntry({ 
  rank, 
  name, 
  wins, 
  losses, 
  winStreak,
  isCurrentUser = false,
  trend = "same"
}: LeaderboardEntryProps) {
  const initials = name.slice(0, 2).toUpperCase();
  const winRate = wins + losses > 0 
    ? Math.round((wins / (wins + losses)) * 100) 
    : 0;
  
  const getRankStyle = () => {
    if (rank === 1) return "bg-yellow-500 text-white";
    if (rank === 2) return "bg-gray-400 text-white";
    if (rank === 3) return "bg-amber-700 text-white";
    return "bg-muted text-muted-foreground";
  };
  
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-status-online" : trend === "down" ? "text-status-busy" : "text-muted-foreground";
  
  return (
    <div 
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg transition-colors",
        isCurrentUser 
          ? "bg-primary/5 border border-primary" 
          : "hover-elevate bg-card border border-card-border"
      )}
      data-testid={`leaderboard-entry-${rank}`}
    >
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
        getRankStyle()
      )}>
        {rank <= 3 ? <Trophy className="w-4 h-4" /> : rank}
      </div>
      
      <Avatar className="h-10 w-10">
        <AvatarFallback className="bg-chart-1 text-white font-medium text-sm">
          {initials}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground truncate">{name}</span>
          {isCurrentUser && (
            <Badge variant="secondary" className="text-xs">You</Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{wins}W - {losses}L</span>
          <span>({winRate}%)</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {winStreak > 0 && (
          <div className="flex items-center gap-1 text-chart-4">
            <Flame className="w-4 h-4" />
            <span className="font-medium text-sm">{winStreak}</span>
          </div>
        )}
        <TrendIcon className={cn("w-4 h-4", trendColor)} />
      </div>
    </div>
  );
}
