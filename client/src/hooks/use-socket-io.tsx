import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import io, { Socket } from "socket.io-client";

export interface GameState {
  id: string;
  board: (string | null)[];
  currentTurn: string;
  players: {
    id: string;
    username: string;
    symbol: "X" | "O";
  }[];
  winner: string | null;
  isDraw: boolean;
  gameOver: boolean;
  winningLine: number[] | null;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  userId: string | null;
  username: string | null;
  gameState: GameState | null;
  isSearching: boolean;
  error: string | null;
  joinLobby: (userId: string, username: string) => void;
  findMatch: () => void;
  makeMove: (gameId: string, position: number) => Promise<void>;
  requestRematch: (gameId: string) => Promise<void>;
  leaveGame: (gameId: string) => void;
  clearError: () => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const newSocket = io("", {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsConnected(false);
      setGameState(null);
    });

    newSocket.on("game_start", (state: GameState) => {
      console.log("Game started", state);
      setGameState(state);
      setIsSearching(false);
    });

    newSocket.on("game_update", (state: GameState) => {
      console.log("Game updated", state);
      setGameState(state);
    });

    newSocket.on("opponent_left", () => {
      setError("Opponent left the game");
      setGameState(null);
      setIsSearching(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const joinLobby = useCallback(
    (uid: string, uname: string) => {
      if (!socket) return;

      socket.emit("join_lobby", { userId: uid, username: uname }, (response: { success?: boolean; playerId?: string }) => {
        if (response?.success) {
          setUserId(uid);
          setUsername(uname);
        }
      });
    },
    [socket]
  );

  const findMatch = useCallback(() => {
    if (!socket || !userId) return;
    setIsSearching(true);
    socket.emit(
      "find_match",
      { userId },
      (response: { status?: string; queuePosition?: number }) => {
        console.log("Matchmaking response:", response);
      }
    );
  }, [socket, userId]);

  const makeMove = useCallback(
    async (gameId: string, position: number): Promise<void> => {
      if (!socket || !userId) throw new Error("Not connected");

      return new Promise<void>((resolve, reject) => {
        socket.emit(
          "make_move",
          { gameId, userId, position },
          (response: { success?: boolean; error?: string; gameState?: GameState }) => {
            if (response?.success) {
              resolve();
            } else {
              reject(new Error(response?.error || "Move failed"));
            }
          }
        );
      });
    },
    [socket, userId]
  );

  const requestRematch = useCallback(
    async (gameId: string): Promise<void> => {
      if (!socket || !userId) throw new Error("Not connected");

      return new Promise<void>((resolve, reject) => {
        socket.emit(
          "request_rematch",
          { gameId, userId },
          (response: { success?: boolean; error?: string; gameState?: GameState }) => {
            if (response?.success) {
              resolve();
            } else {
              reject(new Error(response?.error || "Rematch failed"));
            }
          }
        );
      });
    },
    [socket, userId]
  );

  const leaveGame = useCallback(
    (gameId: string) => {
      if (!socket || !userId) return;
      socket.emit("leave_game", { gameId, userId });
      setGameState(null);
      setIsSearching(false);
    },
    [socket, userId]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        userId,
        username,
        gameState,
        isSearching,
        error,
        joinLobby,
        findMatch,
        makeMove,
        requestRematch,
        leaveGame,
        clearError,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketIO() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketIO must be used within a SocketProvider");
  }
  return context;
}
