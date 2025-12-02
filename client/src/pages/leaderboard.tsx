import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/game/ThemeToggle";
import { LeaderboardEntry } from "@/components/game/LeaderboardEntry";
import { useSocketIO } from "@/hooks/use-socket-io";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

interface LeaderboardRecord {
  rank: number;
  username: string;
  wins: number;
  losses: number;
  winStreak: number;
}

export default function Leaderboard() {
  const [, setLocation] = useLocation();
  const { isConnected } = useSocketIO();
  const [records, setRecords] = useState<LeaderboardRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const response = await fetch("/api/leaderboard");
        const data = await response.json();
        setRecords(data || []);
      } catch (error) {
        console.error("Failed to load leaderboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboard();
  }, [isConnected]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold text-foreground">Leaderboard</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Top Players</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : records.length > 0 ? (
              records.map((record) => (
                <LeaderboardEntry
                  key={record.rank}
                  rank={record.rank}
                  name={record.username}
                  wins={record.wins}
                  losses={record.losses}
                  winStreak={record.winStreak}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  No leaderboard data yet. Play your first game!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
