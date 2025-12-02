# TicTacToe — Socket.io + Express Multiplayer

###Repo: [https://github.com/sohanhegde1/tictactoe-nakama](https://github.com/sohanhegde1/tictactoe-nakama)
 
###Live demo (deployed on Render): [https://tictactoe-nakama-1.onrender.com/](https://tictactoe-nakama-1.onrender.com/)
**Note:*My render deployment may take upto 1-2 minutes to star as i am using Render free tier.

**Implementation note:** The project was originally planned to use **Nakama** for realtime/match functionality. I attempted to deploy a Nakama cloud instance but was unable to complete the free-tier signup because the payment card was not accepted. To keep the timeline and demo working, I pivoted to a backend implemented with **Express + Socket.io** while preserving the required server-authoritative multiplayer functionality and UX. The README below describes the current, deployed implementation.

---



## Project overview

This project is a server-authoritative, real-time multiplayer Tic-Tac-Toe game implemented with **Express** (Node.js) on the backend and **Socket.io** for realtime communication. The frontend is a web client (React or similar) that connects to the Express/Socket.io server. The live demo is available at the URL above.


## Gameflow
---
1. User enters lobby
2. Clicks "Find Match"
3. Join matchmaking queue
4. Wait for opponent (real-time via Socket.io)
5. Game starts, sync moves in real-time
6. Server validates each move
7. Display result, save to leaderboard
8. Option: rematch or return to lobby

## Repository structure

This README now reflects the actual repository layout and the files used in this project. Key folders and files in the repo:

```
/ (repo root)
├─ client/            # Frontend (Vite + React/TS) and UI code
├─ server/            # Backend (Express + Socket.io) and server-side logic
├─ shared/            # Shared utilities/types used by client & server
├─ script/            # miscellaneous scripts (build/deploy helpers)
├─ README.md
├─ package.json
├─ vite.config.ts
└─ tsconfig.json
```


## Setup & installation

> NOTE: adapt folder names below if your repo uses different layout (for example `client/` and `server/`).

1. Clone repository

```bash
git clone https://github.com/sohanhegde1/tictactoe-nakama.git
cd tictactoe-nakama
```

2. Install dependencies

run `npm install` at the repo root.

## Design Approach
**System-Based with Gaming Polish**: Material Design principles adapted for casual gaming, prioritizing clarity and real-time feedback while maintaining a playful, engaging aesthetic.

## Core Design Principles
1. **Gameplay First**: All UI elements support immediate game comprehension and action
2. **Mobile-Optimized**: Touch-friendly, thumb-zone aware layouts
3. **Real-time Clarity**: Visual feedback for all state changes (player moves, turn switches, matchmaking)
4. **Minimal Cognitive Load**: Simple, focused screens with clear CTAs

---

## Typography

**Primary Font**: Inter (via Google Fonts CDN)
- Headings: 600-700 weight, used for game status, screen titles
- Body: 400-500 weight for player names, stats, leaderboard entries
- Monospace variant for timer countdowns if implemented

**Scale**:
- Large: 32-40px (screen titles, game result)
- Medium: 20-24px (player names, current turn indicator)
- Small: 14-16px (stats, timestamps, secondary info)
- Micro: 12px (metadata, footer text)

---

## Layout System

**Spacing Primitives**: Tailwind units of **4, 6, 8, 12, 16** (p-4, m-6, gap-8, etc.)

**Container Strategy**:
- Max width: `max-w-md` (448px) for game screens - keeps board proportional on desktop
- Full width on mobile with `px-4` padding
- Centered layouts: `mx-auto` for all game containers

**Vertical Rhythm**:
- Screen padding: `py-8` (mobile), `py-12` (desktop)
- Section spacing: `space-y-6` between major UI blocks
- Component internal spacing: `p-4` to `p-6`

---

## Component Library

### Game Board
- 3x3 grid with equal square cells
- Responsive sizing: `aspect-square` for each cell
- Grid gap: `gap-2` (8px between cells)
- Cell dimensions: Calculate to fit mobile viewport (~100-120px per cell on phones)
- Border treatment: Rounded corners `rounded-lg` on cells, subtle borders

### Player Cards
- Horizontal layout showing: avatar placeholder, name, score indicator
- Fixed height: `h-16` to `h-20`
- Display both players side-by-side or stacked depending on screen state
- Active player gets visual emphasis (border glow, subtle scale)

### Match Status Banner
- Fixed position at top: shows "Your Turn" / "Opponent's Turn" / "Searching for opponent..."
- Height: `h-12` to `h-16`
- Icon + text combination using Heroicons (clock, user-group, trophy icons)

### Leaderboard Entries
- List items with rank badge, player name, W/L/Streak stats
- Row height: `h-14` to `h-16`
- Alternating subtle background for readability
- Current player row highlighted distinctly

### Modal Overlays
- Match result screen (Win/Lose/Draw) as full-screen overlay
- Backdrop blur: `backdrop-blur-sm`
- Content card: `rounded-2xl`, centered with `max-w-sm`
- Action buttons: Primary "Play Again", Secondary "Back to Lobby"

### Navigation
- Bottom tab bar on mobile: Home, Leaderboard, Profile (3-4 tabs max)
- Icon-first with small labels
- Height: `h-16`, safe area padding on notched devices

---

## Icons
**Library**: Heroicons via CDN (outline style for most UI, solid for active states)

**Key Icons**:
- Users/user-group: Multiplayer/matchmaking
- Trophy: Wins, leaderboard
- Clock: Timer mode
- X-mark, Check: Game symbols
- Arrow-path: Rematch
- Bars-3: Menu

---

## Images

### Avatar Placeholders
- **Location**: Player cards, leaderboard entries
- **Style**: Circular, 40-48px diameter, placeholder initials or simple geometric patterns
- **Description**: Generated colored circles with player initials in white text

### Game State Illustrations
- **Location**: Empty states (waiting for match, no leaderboard data yet)
- **Style**: Simple line art or minimal illustrations, 120-200px size
- **Description**: 
  - Matchmaking: Two user silhouettes with connecting line
  - Empty leaderboard: Trophy with dashed outline
  - Connection lost: Broken chain link icon

### Result Screen Icons
- **Location**: Game over modal
- **Style**: Large icon (80-100px) above result text
- **Description**:
  - Win: Trophy or star burst (celebratory)
  - Loss: Neutral game-over icon
  - Draw: Handshake or equal symbol

**No Hero Image**: This is an application interface, not a landing page

---

## Screen Structure

### Main Screens (4-5 primary views)

1. **Lobby/Home**
   - "Find Match" large button (primary CTA)
   - Player stats card (compact: name, recent W/L)
   - Recent matches list (last 3-5 games)

2. **Matchmaking**
   - Centered spinner/animation
   - "Searching for opponent..." text
   - Cancel button below

3. **Active Game**
   - Top: Match status banner
   - Upper: Opponent card
   - Center: Game board (dominant focus)
   - Lower: Your player card
   - Bottom: Safe padding above nav bar

4. **Leaderboard**
   - Filter tabs: Global / Friends (if applicable)
   - Scrollable ranked list
   - Your rank highlighted/pinned at top if not in view

5. **Profile/Stats**
   - Win/Loss/Draw percentages
   - Win streak tracker
   - Match history

---

## Animations
**Minimal, Purposeful Only**:
- Cell selection: Quick scale bounce (0.2s)
- Turn switch: Gentle fade transition on status banner
- Matchmaking: Subtle pulse on search indicator
- Victory: Confetti or particle burst (brief, 1-2s)

**No**: Excessive page transitions, decorative animations, background effects

---

## State Indicators

**Visual Feedback Patterns**:
- Active turn: Glowing border on player card
- Opponent thinking: Subtle pulse on their avatar
- Move made: Brief flash on board cell
- Connection issues: Banner notification with retry button
- Loading states: Skeleton screens, not blank white

---

## Accessibility
- Touch targets: Minimum 48x48px for all interactive elements
- Contrast ratios: WCAG AA compliance for all text
- Focus indicators: Visible keyboard focus rings
- Screen reader: Proper ARIA labels for game state, turn order
- Reduced motion: Respect `prefers-reduced-motion` for all animations

---

## Key Differentiators
- **Not** a traditional three-column card layout - game board is the hero
- Compact, game-focused UI without marketing fluff
- Real-time status always visible, never hidden
- Mobile-first proportions that scale up gracefully
- Playful without being childish - appeal to all ages
## Architecture & design decisions

### Overview

* **Client (frontend)** — Thin UI layer: renders board, accepts player input and forwards events to server via Socket.io. Client displays updates from server and keeps local UI state for responsiveness.

* **Server (Express + Socket.io)** — Authoritative game logic: maintains match state (in-memory or persistent store), validates moves, enforces turn order, and broadcasts match updates to connected clients.

### Key design decisions

* **Server-authoritative model**: The backend validates every move to prevent cheating and maintain a single source of truth.

* **Event-driven realtime updates**: Socket.io events (`create_match`, `join_match`, `make_move`, `match_update`) are small and minimize bandwidth.

* **Simple in-memory match store**: For Tic-Tac-Toe this is sufficient. For production or persistence, replace with Redis or a database and add TTL/cleanup.

* **Reconnection & resync**: Clients re-request or receive the latest match state when reconnecting. The server emits full match state after every validated change.

* **Extensibility**: The architecture allows adding features such as matchmaking, leaderboards, auth, or persistent game history.

---

## Deployment process

**Render deployment note:** The live demo is deployed on **Render** at `https://tictactoe-nakama-1.onrender.com/`. The README below includes Render-specific tips for both frontend (Static Site / Web Service) and backend (Web Service) deployments.

You’ll deploy two pieces: the backend (Express + Socket.io) and the frontend (static site). They can be deployed separately or together (server can serve built frontend files).

### Backend deployment options

* **Render / Railway / Fly / Heroku** — These platforms support Node + WebSockets. Ensure the chosen provider supports long-lived WebSocket connections.
* **Self-hosted VPS** (DigitalOcean, AWS EC2) — Use PM2 / systemd and optionally a reverse proxy (Nginx) to handle TLS and HTTP->WS upgrades.
* **Kubernetes** — Use a Pod/Service setup and ensure your Ingress/load-balancer supports WebSocket upgrades.

Production notes:

* Use HTTPS + WSS. Terminate TLS at your load balancer or use certs on the server.
* If running multiple backend instances, use a shared store or adapter (Redis) for pub/sub so Socket.io can broadcast across nodes (use `socket.io-redis`/`@socket.io/redis-adapter`).
* Configure health checks and process managers (PM2) to keep the server healthy.

---

## API / Server configuration details

Socket.io events and payloads (summary):

* `create_match` — `{ matchId, player }`
* `join_match` — `{ matchId, player }`
* `make_move` — `{ matchId, index, player }`
* `match_update` — server -> `{ matchId, board, players, turn, status }`
* `error` — server -> `{ code, message }`


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

## How to test the multiplayer functionality

### Quick manual test

**Render demo (fastest):** Open the deployed site on Render — `https://tictactoe-nakama-1.onrender.com/` — in **two different browser tabs** (or one normal + one incognito). Create a match from one tab and join from the other; you will immediately see the multiplayer functionality (realtime moves, turn enforcement, and match updates) without running anything locally.

1. Start backend and frontend locally (or use the deployed frontend pointing to your running backend).
2. Open the app in two browser windows (or one normal + one incognito).
3. In Window A: join match as Player X.
4. In Window B: join the same match as Player O.
5. Play moves in alternating turns — both clients should update in realtime.
6. Try edge cases:

   * Attempt a move out of turn and verify the server rejects it.
   * Try making a move to an occupied cell (server should reject).
   * Refresh a client mid-game and verify it receives the current board on reconnect.

### Local multi-device test via `ngrok`

If you need to test from different devices on the same network or over the internet, run `ngrok http 4000` and set your frontend socket URL to the `ngrok` HTTPS address.
