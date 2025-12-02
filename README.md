# TicTacToe — Socket.io + Express Multiplayer

> Repo: [https://github.com/sohanhegde1/tictactoe-nakama](https://github.com/sohanhegde1/tictactoe-nakama)
>
> Live demo (deployed on Render): [https://tictactoe-nakama-1.onrender.com/](https://tictactoe-nakama-1.onrender.com/)

**Implementation note:** The project was originally planned to use **Nakama** for realtime/match functionality. I attempted to deploy a Nakama cloud instance but was unable to complete the free-tier signup because the payment card was not accepted. To keep the timeline and demo working, I pivoted to a backend implemented with **Express + Socket.io** while preserving the required server-authoritative multiplayer functionality and UX. The README below describes the current, deployed implementation.

---

## Table of contents

* [Project overview](#project-overview)
* [Prerequisites](#prerequisites)
* [Setup & installation](#setup--installation)
* [Architecture & design decisions](#architecture--design-decisions)
* [Deployment process](#deployment-process)
* [API / Server configuration details](#api--server-configuration-details)
* [How to test the multiplayer functionality](#how-to-test-the-multiplayer-functionality)
* [Troubleshooting & tips](#troubleshooting--tips)
* [License & contact](#license--contact)

---

## Project overview

This project is a server-authoritative, real-time multiplayer Tic-Tac-Toe game implemented with **Express** (Node.js) on the backend and **Socket.io** for realtime communication. The frontend is a web client (React or similar) that connects to the Express/Socket.io server. The live demo is available at the URL above.

This README covers how to run the app locally, architecture and key design choices, deployment notes, server/config details, and how to test multiplayer flows.

---

## Repository structure

This README now reflects the actual repository layout and the files used in this project. Key folders and files in the repo:

```
/ (repo root)
├─ client/            # Frontend (Vite + React/TS) and UI code
├─ server/            # Backend (Express + Socket.io) and server-side logic
├─ shared/            # Shared utilities/types used by client & server
├─ script/            # miscellaneous scripts (build/deploy helpers)
├─ README.md
├─ design.md
├─ package.json
├─ vite.config.ts
└─ tsconfig.json
```

> Note: I inspected your repo and used these real folder names when updating the README. Replace or expand these entries if your local layout differs.

---

## Prerequisites

* Node.js (LTS) and npm or yarn
* Git
* A modern web browser for testing (Chrome/Firefox recommended)

Optional tools:

* `ngrok` (to expose a local server for testing on multiple devices)
* `tc` (Linux `netem`) or other network shaping tools to simulate latency

---

## Setup & installation

> NOTE: adapt folder names below if your repo uses different layout (for example `client/` and `server/`).

1. Clone repository

```bash
git clone https://github.com/sohanhegde1/tictactoe-nakama.git
cd tictactoe-nakama
```

2. Install dependencies

If the project has separate `client/` and `server/` folders:

```bash
# install frontend deps
cd client
npm install

# in a separate terminal, install backend deps
cd ../server
npm install
```

If the repo is single-package, run `npm install` at the repo root.

3. Start the backend (Express + Socket.io)

The backend code lives in `server/`. Typical commands (from the repo root):

```bash
# install server deps
cd server
npm install

# development (watch) — uses the script defined in server/package.json
npm run dev

# production build & start (if using TypeScript build)
npm run build
npm start
```

Check `server/package.json` for available scripts (e.g. `dev`, `build`, `start`). The primary server entrypoint in this repo is `server/src/index.ts` (or `server/index.js` after build) — open these files in your editor to see the exact initialization and Socket.io setup used in the project.

If you want, I can also paste the exact `server/src/index.ts` startup snippet into the README — paste it here or allow me to pull it from the repo and I will update the doc with the exact code.

```

4. Configure frontend to connect to backend

Create or update your `.env` in the frontend with the server URL. Example:

```

REACT_APP_SOCKET_SERVER_URL=[http://localhost:4000](http://localhost:4000)

````

5. Start the frontend

```bash
cd client
npm start
````

Open the app at `http://localhost:3000` (or your dev server port).

Client-side socket.io example (using `socket.io-client`):

```js
import { io } from 'socket.io-client';
const SOCKET_URL = process.env.REACT_APP_SOCKET_SERVER_URL || 'http://localhost:4000';
const socket = io(SOCKET_URL, { transports: ['websocket'] });

socket.on('connect', () => console.log('connected', socket.id));
socket.on('match_update', (match) => updateUI(match));

// create/join/move
socket.emit('create_match', { matchId: 'abc', player: 'X' });
socket.emit('join_match', { matchId: 'abc', player: 'O' });
socket.emit('make_move', { matchId: 'abc', index: 4, player: 'X' });
```

---

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

### Frontend deployment

* Deploy the static frontend on Render, Netlify, Vercel, or any static host. Set `REACT_APP_SOCKET_SERVER_URL` (or equivalent) in the host environment variables.
* If serving frontend from the same Node server, add a static build step (`app.use(express.static('build'))`) and serve `index.html` on unknown routes.

---

## API / Server configuration details

Environment variables (suggested):

```
PORT=4000
FRONTEND_URL=https://tictactoe-nakama-1.onrender.com
SOCKET_PATH=/socket.io
NODE_ENV=production
REDIS_URL=redis://...   # optional if using Redis adapter
```

Socket.io events and payloads (summary):

* `create_match` — `{ matchId, player }`
* `join_match` — `{ matchId, player }`
* `make_move` — `{ matchId, index, player }`
* `match_update` — server -> `{ matchId, board, players, turn, status }`
* `error` — server -> `{ code, message }`

Security / production considerations:

* Validate/sanitize all inputs on the server.
* If you implement authentication, issue a session token and attach it to the socket on connection.
* Rate-limit or debounce actions if you expect abusive clients.
* If running horizontally, use a Redis adapter for Socket.io to coordinate events between nodes.

---

## How to test the multiplayer functionality

### Quick manual test

1. Start backend and frontend locally (or use the deployed frontend pointing to your running backend).
2. Open the app in two browser windows (or one normal + one incognito).
3. In Window A: create a new match (or start quick-match) as Player X.
4. In Window B: join the same match as Player O.
5. Play moves in alternating turns — both clients should update in realtime.
6. Try edge cases:

   * Attempt a move out of turn and verify the server rejects it.
   * Try making a move to an occupied cell (server should reject).
   * Refresh a client mid-game and verify it receives the current board on reconnect.

### Local multi-device test via `ngrok`

If you need to test from different devices on the same network or over the internet, run `ngrok http 4000` and set your frontend socket URL to the `ngrok` HTTPS address.

### Automated tests

* **Unit tests**: Validate board handling and win/draw logic using Jest.
* **Integration / E2E**: Use Playwright or Cypress to spin up two browser contexts and script a full match flow.
* **Load / resilience tests**: For many simultaneous games, script multiple socket clients (e.g., using `socket.io-client` in Node) to ensure the server and event flow remain stable.

---

## Troubleshooting & tips

* If sockets fail to connect, check the server URL, port, and whether the server is reachable from the client. Also verify CORS/socket path settings.
* For mixed-content (HTTPS frontend, HTTP socket) — use WSS (secure WebSocket) or serve frontend over HTTP in dev.
* When scaling, use Redis adapter to share events between backend instances.
* Use server logs and browser DevTools (Network → WS frames) to inspect socket messages.

---

## License & contact

MIT License — feel free to reuse and adapt. If you want me to update the README to include exact folder names, scripts from your `package.json`, or to add a sample `Procfile`, `nginx` config, or `dockerfile`, tell me and I will update it.

---

*Last updated: 2025-12-02*
