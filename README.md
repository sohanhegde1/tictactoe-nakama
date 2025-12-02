# Multiplayer Tic-Tac-Toe Game

## Overview
A production-ready multiplayer Tic-Tac-Toe game built with React frontend and Nakama backend. Features server-authoritative gameplay, real-time matchmaking, global leaderboards, and persistent player statistics.

## Architecture

### Frontend (React + TypeScript)
- **Framework**: React with TypeScript, Vite bundler
- **Routing**: wouter for client-side routing
- **State Management**: React Query for server state, React hooks for local state
- **UI Components**: shadcn/ui component library with Tailwind CSS
- **Real-time**: Nakama JavaScript SDK for WebSocket communication

### Backend (Nakama Game Server)
The game requires a Nakama server deployed externally (Docker not available in Replit). The client connects to Nakama for:
- Device-based authentication (anonymous players)
- Real-time matchmaking (2 players)
- WebSocket match state synchronization
- Leaderboards and player statistics storage

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── game/           # Game-specific components
│   │   │   ├── GameBoard.tsx
│   │   │   ├── PlayerCard.tsx
│   │   │   ├── MatchStatus.tsx
│   │   │   ├── GameResultModal.tsx
│   │   │   ├── LeaderboardEntry.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   ├── MatchHistoryItem.tsx
│   │   │   ├── BottomNav.tsx
│   │   │   └── ThemeToggle.tsx
│   │   └── ui/             # shadcn/ui components
│   ├── hooks/
│   │   ├── use-nakama.tsx  # Nakama context and hooks
│   │   └── use-toast.ts
│   ├── lib/
│   │   ├── nakama.ts       # Nakama client service
│   │   └── queryClient.ts
│   ├── pages/
│   │   ├── lobby.tsx       # Main lobby with matchmaking
│   │   ├── game.tsx        # Game board and gameplay
│   │   ├── leaderboard.tsx # Global rankings
│   │   └── profile.tsx     # Player profile and stats
│   └── App.tsx
server/
├── routes.ts               # Express API routes
├── storage.ts              # Storage interface
└── index.ts                # Server entry point
```

## Environment Variables

### Required for Nakama Connection
Set these environment variables to connect to your Nakama server:

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_NAKAMA_HOST` | Nakama server hostname | `localhost` |
| `VITE_NAKAMA_PORT` | Nakama server port | `7350` |
| `VITE_NAKAMA_KEY` | Nakama server key | `defaultkey` |
| `VITE_NAKAMA_USE_SSL` | Enable SSL/TLS | `false` |

### Example Configuration
```bash
VITE_NAKAMA_HOST=your-nakama-server.com
VITE_NAKAMA_PORT=7350
VITE_NAKAMA_KEY=your-server-key
VITE_NAKAMA_USE_SSL=true
```

## Nakama Server Requirements

Your Nakama server needs to implement:

### Match Handler (Lua/Go/TypeScript)
- OpCode 1: Player move (receives position 0-8)
- OpCode 2: Rematch request
- Server validates moves and broadcasts state to all players

### Match State Format
```typescript
interface MatchState {
  board: (string | null)[];      // 9-cell array: null, "X", or "O"
  currentTurn: string;           // User ID of current player
  players: {
    odNakamaId: string;
    odNakamaUserId: string;
    username: string;
    symbol: "X" | "O";
  }[];
  winner: string | null;         // User ID of winner
  isDraw: boolean;
  gameOver: boolean;
  winningLine: number[] | null;  // Array of 3 winning positions
}
```

### Leaderboard
- Create leaderboard with ID: `tictactoe_wins`
- Order: descending (highest wins first)
- Operator: best (track highest score)

### Storage Collections
- `player_stats`: Stores wins, losses, draws, streaks
- `match_history`: Stores recent match results

## Development

### Running Locally
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

## Features

- **Real-time Multiplayer**: WebSocket-based game state synchronization
- **Matchmaking**: Automatic 2-player matchmaking queue
- **Leaderboards**: Global rankings with win tracking
- **Player Stats**: Wins, losses, draws, win streaks
- **Achievements**: Milestone-based unlock system
- **Dark Mode**: System-aware theme toggle
- **Mobile-First**: Responsive design with touch-friendly UI

## Recent Changes

- November 2024: Initial implementation with full Nakama integration
- Implemented device-based authentication for anonymous play
- Created NakamaProvider context for global state management
- All pages connected to Nakama APIs (removed mock data)
- Added graceful error handling for connection failures
