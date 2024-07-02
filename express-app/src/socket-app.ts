import Debug from "debug";
import { Server } from "socket.io";
import { Color, PieceSymbol, Square } from "chess.js";
import GamesManager from "./lib/GamesManager.js";

/** null when client requested action was successfull, otherwise error as string */
type SocketCallback = (response: null | string) => void;

interface ServerToClientEvents {
  // noArg: () => void;
  // basicEmit: (a: number, b: string, c: Buffer) => void;
  // withAck: (d: string, callback: (e: number) => void) => void;
  "game-started": () => void;
  "game-state": (moveNumber: number, color: Color, move: string) => void;
}

interface ClientToServerEvents {
  "new-game": (
    inviteCode: string,
    userName: string,
    color: Color,
    callback: SocketCallback,
  ) => void;
  "join-game": (
    inviteCode: string,
    userName: string,
    callback: SocketCallback,
  ) => void;
  "make-move": (
    gameCode: string,
    userName: string,
    from: Square,
    to: Square,
    promotion: PieceSymbol | undefined,
    callback: SocketCallback,
  ) => void;
}

// TODO: validate against users in db
function isValidUser(userName: string): boolean {
  return userName.length >= 5;
}

const debug = Debug("gambit:io");

const gamesManager = GamesManager.Instance;

const io = new Server<ClientToServerEvents, ServerToClientEvents>({
  cors: {
    // vue app address
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  debug("a user has connected");

  // TODO: see what happens when we pass a number for the invite code
  socket.on("new-game", (inviteCode, userName, color, callback) => {
    if (!isValidUser(userName)) {
      callback("Username is invalid");
      return;
    }

    if (inviteCode.length !== 6) {
      callback("Invite code is invalid");
      return;
    }

    if (!["w", "b"].includes(color)) {
      callback("Color is invalid");
      return;
    }

    const gameAdded = gamesManager.addNewGame(inviteCode, userName, color);

    if (!gameAdded) {
      callback("Game already exists");
      return;
    }

    callback(null);
    const colorPretty = color === "w" ? "white" : "black";
    debug(
      `"${userName}" has created a new game "${inviteCode}" as ${colorPretty}`,
    );
    socket.join(inviteCode);
  });

  socket.on("join-game", (inviteCode, userName, callback) => {
    if (!isValidUser(userName)) {
      callback("Username is invalid");
      return;
    }

    if (inviteCode.length !== 6) {
      callback("Invite code is invalid");
      return;
    }

    const gameStatus = gamesManager.getGameStatus(inviteCode);

    if (!gameStatus || gameStatus !== "WAITING_FOR_SECOND") {
      callback("Game not found or unable to join");
      return;
    }

    const colorAddedAs = gamesManager.addPlayerToGame(inviteCode, userName);

    // This should never happen since we did the above check, just in case
    if (!colorAddedAs) {
      callback("Game not found or unable to join");
      return;
    }

    callback(null);
    socket.join(inviteCode);
    // alerts both players
    io.to(inviteCode).emit("game-started");
  });

  socket.on(
    "make-move",
    (gameCode, userName, from, to, promotion, callback) => {
      if (!isValidUser(userName)) {
        callback("Username is invalid");
        return;
      }

      const turnUser = gamesManager.getUserToPlay(gameCode);

      if (!turnUser) {
        callback("Game not found, or game is not ongoing");
        return;
      }

      if (turnUser !== userName) {
        callback("Not your turn");
        return;
      }

      const result = gamesManager.makeMove(
        gameCode,
        from,
        to,
        promotion,
      );

      if (result === "INVALID_MOVE") {
        callback("Invalid Move");
        return;
      }

      // move was successful
      callback(null);

      const gameStatus = gamesManager.getGameStatus(gameCode);

      if (!gameStatus) {
        throw new Error("Could not find game, after verifying game exists");
      }

      // // TODO:
      // if (gameStatus === "CHECKMATE") {
      //   callback("");
      //   return;
      // }

      // TODO: provide real info
      io.to(gameCode).emit("game-state", 1, "w", "somemove");

      // const game = gameInstances[moveData.code];
      // // does not belong to this game
      // if (![game.whiteUserName, game.blackUserName].includes(moveData.userName)) {
      //   callback(null, "You arn't a player for this game");
      //   console.log("user tried making a move for a game they dont belong to");
      //   return;
      // }
      // // not the users turn
      // if (
      //   (game.chess.turn() === "w" && game.whiteUserName !== moveData.userName) ||
      //   (game.chess.turn() === "b" && game.blackUserName !== moveData.userName)
      // ) {
      //   callback(null, "It's not your turn");
      //   console.log(
      //     `${moveData.userName} tried sending a move when it's not their turn`,
      //   );
      //   return;
      // }
      // try {
      //   game.chess.move(moveData.move);
      // } catch (_) {
      //   callback(null, "Illegal move");
      //   console.log(
      //     `${moveData.userName} attempted to make the illegal move ${moveData.moveNumber}.${moveData.move}`,
      //   );
      //   return;
      // }
      // console.log(
      //   `${moveData.userName} has made the move ${moveData.moveNumber}.${moveData.move} in ${moveData.code}`,
      // );
      // // tell client their move was accepted
      // callback(null);
      // // emit to everyone in same room except sender
      // socket.broadcast.to(moveData.code).emit("server-move", moveData);
      // if (game.chess.isGameOver()) {
      //   socket.emit("game-over", "TODO: OUTCOME");
      // }
    },
  );
});

debug("Socket IO Server Initialized");
export default io;
