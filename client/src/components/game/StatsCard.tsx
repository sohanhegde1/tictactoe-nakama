import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatItemProps {
  label: string;
  value: string | number;
  subValue?: string;
  highlight?: boolean;
}

function StatItem({ label, value, subValue, highlight }: StatItemProps) {
  return (
    <div className="text-center">
      <div className={cn(
        "text-2xl font-bold",
        highlight ? "text-primary" : "text-foreground"
      )}>
        {value}
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
      {subValue && (
        <div className="text-xs text-muted-foreground mt-0.5">{subValue}</div>
      )}
    </div>
  );
}

interface StatsCardProps {
  wins: number;
  losses: number;
  draws: number;
  winStreak: number;
  bestStreak: number;
}

export function StatsCard({ wins, losses, draws, winStreak, bestStreak }: StatsCardProps) {
  const total = wins + losses + draws;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;
  
  return (
    <Card data-testid="stats-card">
      <CardContent className="p-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <StatItem label="Wins" value={wins} highlight />
          <StatItem label="Losses" value={losses} />
          <StatItem label="Draws" value={draws} />
        </div>
        <div className="h-px bg-border mb-4" />
        <div className="grid grid-cols-3 gap-4">
          <StatItem label="Win Rate" value={`${winRate}%`} />
          <StatItem label="Current Streak" value={winStreak} subValue="games" />
          <StatItem label="Best Streak" value={bestStreak} subValue="games" />
        </div>
      </CardContent>
    </Card>
  );
}
