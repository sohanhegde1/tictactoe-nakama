import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatsCard } from "@/components/game/StatsCard";
import { MatchHistoryItem } from "@/components/game/MatchHistoryItem";
import { ThemeToggle } from "@/components/game/ThemeToggle";
import { MatchStatus } from "@/components/game/MatchStatus";
import { useSocketIO } from "@/hooks/use-socket-io";
import { useToast } from "@/hooks/use-toast";
import { Users, X, Loader2, WifiOff } from "lucide-react";

interface MatchHistoryEntry {
  opponent: string;
  result: "won" | "lost" | "draw";
  date: string;
  yourSymbol: "X" | "O";
}

export default function Lobby() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const {
    isConnected,
    socket,
    userId,
    username,
    gameState,
    isSearching,
    error,
    joinLobby,
    findMatch,
    leaveGame,
    clearError,
  } = useSocketIO();

  const [stats, setStats] = useState({
    wins: 0,
    losses: 0,
    draws: 0,
    winStreak: 0,
    bestStreak: 0,
  });

  useEffect(() => {
    if (!userId) {
      const id = `player_${Math.random().toString(36).substring(7)}`;
      const uname = `Player_${id.slice(-4)}`;
      joinLobby(id, uname);
    }
  }, [userId, joinLobby]);

  useEffect(() => {
    if (gameState) {
      setLocation("/game");
    }
  }, [gameState, setLocation]);

  useEffect(() => {
    async function loadStats() {
      if (!userId) return;
      try {
        const response = await fetch(`/api/player/${userId}/stats`);
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to load stats:", error);
      }
    }

    loadStats();
  }, [userId, isConnected]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      clearError();
    }
  }, [error, toast, clearError]);

  const handleFindMatch = () => {
    findMatch();
  };

  const handleCancelSearch = () => {
    if (gameState) {
      leaveGame(gameState.id);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarFallback className="bg-chart-1 text-white font-semibold">
                {(username || "Player").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-semibold text-foreground truncate" data-testid="text-player-name">
                  {username || "Loading..."}
                </h1>
                {!isConnected && (
                  <WifiOff className="w-3 h-3 text-muted-foreground shrink-0" />
                )}
                {!isConnected && socket && (
                  <Loader2 className="w-3 h-3 text-muted-foreground animate-spin shrink-0" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.wins} wins · {stats.winStreak} streak
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {isSearching ? (
          <Card>
            <CardContent className="py-12 flex flex-col items-center">
              <MatchStatus status="searching" opponentName="" />
              <p className="text-sm text-muted-foreground mt-4 mb-6">
                Looking for an opponent to challenge...
              </p>
              <Button
                variant="outline"
                onClick={handleCancelSearch}
                data-testid="button-cancel-search"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <CardContent className="py-8 flex flex-col items-center bg-gradient-to-b from-primary/5 to-transparent">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                Ready to Play?
              </h2>
              <p className="text-sm text-muted-foreground text-center mb-6">
                {isConnected
                  ? "Find an opponent and test your skills!"
                  : "Connecting to server..."}
              </p>
              <Button
                size="lg"
                className="w-full max-w-xs"
                onClick={handleFindMatch}
                disabled={!isConnected}
                data-testid="button-find-match"
              >
                {!isConnected ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Users className="w-5 h-5 mr-2" />
                    Find Match
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        <StatsCard
          wins={stats.wins}
          losses={stats.losses}
          draws={stats.draws}
          winStreak={stats.winStreak}
          bestStreak={stats.bestStreak}
        />

        <div>
          <h3 className="font-semibold text-foreground mb-3">Recent Matches</h3>
          <div className="space-y-2">
            <Card>
              <CardContent className="py-6 text-center text-sm text-muted-foreground">
                No matches yet. Start playing to build your history!
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
