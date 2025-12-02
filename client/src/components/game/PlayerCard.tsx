import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { X, Circle, Wifi, WifiOff } from "lucide-react";

interface PlayerCardProps {
  name: string;
  symbol: "X" | "O";
  isActive: boolean;
  isYou?: boolean;
  score?: number;
  isConnected?: boolean;
}

export function PlayerCard({
  name,
  symbol,
  isActive,
  isYou = false,
  score = 0,
  isConnected = true,
}: PlayerCardProps) {
  const initials = name.slice(0, 2).toUpperCase();
  const bgColor = symbol === "X" ? "bg-chart-1" : "bg-chart-4";

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg transition-all duration-300",
        "border",
        isActive
          ? "bg-primary/5 border-primary shadow-sm"
          : "bg-card border-card-border",
      )}
      data-testid={`player-card-${symbol.toLowerCase()}`}
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarFallback className={cn(bgColor, "text-white font-semibold")}>
            {initials}
          </AvatarFallback>
        </Avatar>
        {isActive && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-status-online rounded-full border-2 border-background" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground truncate">{name}</span>
          {isYou && (
            <span className="text-xs text-muted-foreground">(You)</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Score: {score}</span>
          {!isConnected && <WifiOff className="w-3 h-3 text-status-offline" />}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {symbol === "X" ? (
          <X className="w-6 h-6 text-chart-1 stroke-[3]" />
        ) : (
          <Circle className="w-5 h-5 text-chart-4 stroke-[3]" />
        )}
      </div>
    </div>
  );
}
