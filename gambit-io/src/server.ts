import Debug from "debug";
import { Server } from "socket.io";
import { type Square } from "chess.js";

interface ServerToClientEvents {
  // noArg: () => void;
  // basicEmit: (a: number, b: string, c: Buffer) => void;
  // withAck: (d: string, callback: (e: number) => void) => void;
  // TODO: send game code, other info
  "game-started": () => void;
  "game-state": (pgn: string) => void;
}

interface ClientToServerEvents {
  "join-game": (
    gameCode: string,
    userId: number,
    /** "w" or "b" if join successful, error string otherwise */
    callback: (response: string) => void,
  ) => void;

  "make-move": (
    gameCode: string,
    userId: number,
    from: Square,
    to: Square,
    promotion: "b" | "q" | "n" | "r" | undefined,
    /** null if accepted, error string otherwise */
    callback: (response: null | string) => void,
  ) => void;
  // TODO: forfeit game, request draw, request undo, etc
}

const GAME_CODE_LENGTH = 6;

const debug = Debug("gambit:main");

debug("Starting...");

const io = new Server<ClientToServerEvents, ServerToClientEvents>({
  cors: {
    // TODO: env var
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  debug("A user has connected");

  // TODO: sub to game redis topic
  // TODO: spectate join game
  socket.on("join-game", (gameCode, userId, callback) => {
    if (typeof gameCode !== "string" || gameCode.length !== GAME_CODE_LENGTH) {
      callback("Invalid gameCode");
      return;
    }

    if (typeof userId !== "number") {
      callback("Invalid userName");
      return;
    }

    // TODO: query redis for game
    // TODO: compare game users to given userId
    // TODO: add user to room corresponding to gameCode
    // TODO: callback with color the user is
    // TODO: eventually handle reconnects (not for now)
  });

  socket.on("make-move", (gameCode, userId, from, to, promotion, callback) => {
    // TODO: validate user belongs to game, game is ongoing, and it's the user's turn
    // TODO: validate move against current game state
    // update game state, then emit "game-state" event
  });
});

// TODO: env var
io.listen(3002);

debug("Started, accepting connections");
