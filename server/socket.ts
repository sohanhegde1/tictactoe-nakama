import { Server as SocketServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import { GameState, checkWinner, checkDraw, validateMove, makeMove } from "./game";
import { randomUUID } from "crypto";

export interface PlayerSession {
  userId: string;
  username: string;
  socketId: string;
  inGame: boolean;
}

export class GameManager {
  private io: SocketServer;
  private waitingPlayers: PlayerSession[] = [];
  private games: Map<string, GameState> = new Map();
  private playerSockets: Map<string, string> = new Map();

  constructor(httpServer: HTTPServer) {
    this.io = new SocketServer(httpServer, {
      cors: { origin: "*" },
      transports: ["websocket", "polling"],
    });

    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    this.io.on("connection", (socket: Socket) => {
      console.log(`Player connected: ${socket.id}`);

      socket.on("join_lobby", (data: { userId: string; username: string }, callback) => {
        const player: PlayerSession = {
          userId: data.userId,
          username: data.username,
          socketId: socket.id,
          inGame: false,
        };

        this.playerSockets.set(data.userId, socket.id);
        callback({ success: true, playerId: data.userId });
      });

      socket.on("find_match", (data: { userId: string }, callback) => {
        const player = this.waitingPlayers.find(p => p.userId === data.userId);
        
        if (!player) {
          const newPlayer: PlayerSession = {
            userId: data.userId,
            username: this.io.sockets.sockets.get(socket.id)?.data?.username || "Player",
            socketId: socket.id,
            inGame: false,
          };

          this.waitingPlayers.push(newPlayer);
          socket.data = newPlayer;
        }

        if (this.waitingPlayers.length >= 2) {
          this.startGame();
        }

        callback({ status: "searching", queuePosition: this.waitingPlayers.length });
      });

      socket.on("make_move", (data: { gameId: string; userId: string; position: number }, callback) => {
        const game = this.games.get(data.gameId);
        if (!game) {
          callback({ success: false, error: "Game not found" });
          return;
        }

        if (game.gameOver) {
          callback({ success: false, error: "Game is over" });
          return;
        }

        if (game.currentTurn !== data.userId) {
          callback({ success: false, error: "Not your turn" });
          return;
        }

        if (!validateMove(game.board, data.position)) {
          callback({ success: false, error: "Invalid move" });
          return;
        }

        const playerIndex = game.players.findIndex(p => p.id === data.userId);
        const symbol = game.players[playerIndex].symbol;

        game.board = makeMove(game.board, data.position, symbol);

        const { winner, line } = checkWinner(game.board);
        if (winner) {
          game.gameOver = true;
          game.winner = data.userId;
          game.winningLine = line;
        } else if (checkDraw(game.board)) {
          game.gameOver = true;
          game.isDraw = true;
        } else {
          const nextPlayerIndex = playerIndex === 0 ? 1 : 0;
          game.currentTurn = game.players[nextPlayerIndex].id;
        }

        this.io.to(data.gameId).emit("game_update", game);
        callback({ success: true, gameState: game });
      });

      socket.on("request_rematch", (data: { gameId: string; userId: string }, callback) => {
        const game = this.games.get(data.gameId);
        if (!game || !game.gameOver) {
          callback({ success: false, error: "Cannot rematch" });
          return;
        }

        game.board = Array(9).fill(null);
        game.gameOver = false;
        game.winner = null;
        game.isDraw = false;
        game.winningLine = null;
        game.currentTurn = game.players[0].id;

        this.io.to(data.gameId).emit("game_update", game);
        callback({ success: true, gameState: game });
      });

      socket.on("leave_game", (data: { gameId: string; userId: string }) => {
        const game = this.games.get(data.gameId);
        if (game) {
          this.io.to(data.gameId).emit("opponent_left");
          this.games.delete(data.gameId);
        }
      });

      socket.on("disconnect", () => {
        this.waitingPlayers = this.waitingPlayers.filter(p => p.socketId !== socket.id);
        console.log(`Player disconnected: ${socket.id}`);
      });
    });
  }

  private startGame() {
    if (this.waitingPlayers.length < 2) return;

    const player1 = this.waitingPlayers.shift()!;
    const player2 = this.waitingPlayers.shift()!;

    const gameId = randomUUID();
    const gameState: GameState = {
      id: gameId,
      board: Array(9).fill(null),
      currentTurn: player1.userId,
      players: [
        { id: player1.userId, username: player1.username, symbol: "X" },
        { id: player2.userId, username: player2.username, symbol: "O" },
      ],
      winner: null,
      isDraw: false,
      gameOver: false,
      winningLine: null,
    };

    this.games.set(gameId, gameState);

    const player1Socket = this.io.sockets.sockets.get(player1.socketId);
    const player2Socket = this.io.sockets.sockets.get(player2.socketId);

    player1Socket?.join(gameId);
    player2Socket?.join(gameId);

    this.io.to(gameId).emit("game_start", gameState);
  }

  getIO() {
    return this.io;
  }
}
