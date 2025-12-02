import type { Express } from "express";
import { type Server } from "http";

const playerStats = new Map<string, {
  wins: number;
  losses: number;
  draws: number;
  winStreak: number;
  bestStreak: number;
  username: string;
}>();

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // API routes for stats and leaderboard
  
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const records = Array.from(playerStats.entries())
        .map(([userId, stats], index) => ({
          rank: index + 1,
          userId,
          username: stats.username,
          wins: stats.wins,
          losses: stats.losses,
          winStreak: stats.winStreak,
        }))
        .sort((a, b) => b.wins - a.wins)
        .slice(0, 20)
        .map((record, index) => ({
          ...record,
          rank: index + 1,
        }));
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: "Failed to get leaderboard" });
    }
  });

  app.get("/api/player/:userId/stats", async (req, res) => {
    try {
      const stats = playerStats.get(req.params.userId) || {
        wins: 0,
        losses: 0,
        draws: 0,
        winStreak: 0,
        bestStreak: 0,
        username: `Player_${req.params.userId.slice(-4)}`,
      };
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to get stats" });
    }
  });

  app.post("/api/player/:userId/game-result", async (req, res) => {
    try {
      const { userId } = req.params;
      const { result } = req.body;

      let stats = playerStats.get(userId);
      if (!stats) {
        stats = {
          wins: 0,
          losses: 0,
          draws: 0,
          winStreak: 0,
          bestStreak: 0,
          username: `Player_${userId.slice(-4)}`,
        };
      }

      if (result === "won") {
        stats.wins += 1;
        stats.winStreak += 1;
        stats.bestStreak = Math.max(stats.bestStreak, stats.winStreak);
      } else if (result === "lost") {
        stats.losses += 1;
        stats.winStreak = 0;
      } else if (result === "draw") {
        stats.draws += 1;
        stats.winStreak = 0;
      }

      playerStats.set(userId, stats);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to save game result" });
    }
  });

  app.post("/api/player/:userId/username", async (req, res) => {
    try {
      const { userId } = req.params;
      const { username } = req.body;

      if (!username || username.length < 2 || username.length > 50) {
        return res.status(400).json({ error: "Invalid username length" });
      }

      let stats = playerStats.get(userId);
      if (!stats) {
        stats = {
          wins: 0,
          losses: 0,
          draws: 0,
          winStreak: 0,
          bestStreak: 0,
          username: `Player_${userId.slice(-4)}`,
        };
      }

      stats.username = username;
      playerStats.set(userId, stats);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to update username" });
    }
  });

  return httpServer;
}
