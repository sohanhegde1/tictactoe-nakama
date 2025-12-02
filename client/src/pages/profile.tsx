import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/game/StatsCard";
import { ThemeToggle } from "@/components/game/ThemeToggle";
import { useSocketIO } from "@/hooks/use-socket-io";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Target, Flame, Edit2, Check, X } from "lucide-react";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

interface Achievement {
  icon: typeof Trophy;
  label: string;
  description: string;
  unlocked: boolean;
}

export default function Profile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { isConnected, username, userId } = useSocketIO();
  const [stats, setStats] = useState({
    wins: 0,
    losses: 0,
    draws: 0,
    winStreak: 0,
    bestStreak: 0,
    username: username || "Player",
  });
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(username || "");
  const [isSaving, setIsSaving] = useState(false);

  const [achievements, setAchievements] = useState<Achievement[]>([
    { icon: Trophy, label: "First Win", description: "Win your first game", unlocked: false },
    { icon: Flame, label: "Hot Streak", description: "Win 5 games in a row", unlocked: false },
    { icon: Target, label: "Sharpshooter", description: "Win 50 games", unlocked: false },
  ]);

  useEffect(() => {
    async function loadStats() {
      if (!userId) return;
      try {
        const response = await fetch(`/api/player/${userId}/stats`);
        const data = await response.json();
        setStats(data);
        setNewUsername(data.username);

        setAchievements(prev => [
          { ...prev[0], unlocked: data.wins >= 1 },
          { ...prev[1], unlocked: data.bestStreak >= 5 },
          { ...prev[2], unlocked: data.wins >= 50 },
        ]);
      } catch (error) {
        console.error("Failed to load stats:", error);
      }
    }

    loadStats();
  }, [userId, isConnected]);

  const handleSaveUsername = async () => {
    if (!newUsername.trim() || newUsername.length < 2) {
      toast({
        title: "Invalid username",
        description: "Username must be at least 2 characters",
        variant: "destructive",
      });
      return;
    }

    if (!userId) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/player/${userId}/username`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUsername }),
      });

      if (!response.ok) throw new Error("Failed to save username");

      const data = await response.json();
      setStats(data);
      setIsEditingUsername(false);
      toast({
        title: "Username updated",
        description: `Your username is now ${newUsername}`,
      });
    } catch (error) {
      toast({
        title: "Failed to update username",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const totalGames = stats.wins + stats.losses + stats.draws;
  const winRate = totalGames > 0 ? Math.round((stats.wins / totalGames) * 100) : 0;

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
          <h1 className="font-semibold text-foreground">Profile</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-white text-xl font-bold">
                  {(stats.username || "P").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                {isEditingUsername ? (
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="Enter new username"
                      data-testid="input-username"
                      maxLength={50}
                    />
                    <Button
                      size="icon"
                      onClick={handleSaveUsername}
                      disabled={isSaving}
                      data-testid="button-save-username"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setIsEditingUsername(false);
                        setNewUsername(stats.username);
                      }}
                      data-testid="button-cancel-username"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-foreground">{stats.username}</h2>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setIsEditingUsername(true)}
                      data-testid="button-edit-username"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  Win Rate: {winRate}% ({totalGames} games)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <StatsCard
          wins={stats.wins}
          losses={stats.losses}
          draws={stats.draws}
          winStreak={stats.winStreak}
          bestStreak={stats.bestStreak}
        />

        <div>
          <h3 className="font-semibold text-foreground mb-3">Achievements</h3>
          <div className="grid grid-cols-1 gap-2">
            {achievements.map((achievement, index) => (
              <Card
                key={index}
                className={achievement.unlocked ? "opacity-100" : "opacity-50"}
              >
                <CardContent className="flex items-center gap-3 py-3">
                  <achievement.icon
                    className={`w-6 h-6 ${
                      achievement.unlocked ? "text-yellow-500" : "text-muted-foreground"
                    }`}
                  />
                  <div>
                    <p className="font-medium text-sm">{achievement.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
