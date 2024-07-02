import { Chess, Color, Square, PieceSymbol } from "chess.js";

// TODO: rework this to create a single game manager, to prevent having to do game existance checks everywhere

type GameStatus =
  | "WAITING_FOR_SECOND"
  | "WHITE_TO_PLAY"
  | "BLACK_TO_PLAY"
  | "CHECKMATE"
  | "DRAW"
  | "STALEMATE";

type MoveAttemptOutcome = "INVALID_MOVE" | "INVALID_GAME" | "SUCCESS";

/**
 * The data for an ongoing chess game
 */
type GameData = {
  chess: Chess;
  whiteUserName: string | null;
  blackUserName: string | null;
  status: GameStatus;
};

/**
 * A singleton that manages all ongoing games
 */
export default class GamesManager {
  private static instance: GamesManager;

  private games: Map<string, GameData>;

  private constructor() {
    this.games = new Map<string, GameData>();
  }

  public static get Instance(): GamesManager {
    if (!GamesManager.instance) {
      GamesManager.instance = new GamesManager();
    }
    return GamesManager.instance;
  }

  /**
   * Creates a new game, and adds the player to it with their requested color
   * Returns true if successful, false otherwise
   */
  public addNewGame(gameCode: string, userName: string, color: Color): boolean {
    if (this.games.has(gameCode)) {
      return false;
    }

    this.games.set(gameCode, {
      chess: new Chess(),
      whiteUserName: color === "w" ? userName : null,
      blackUserName: color === "b" ? userName : null,
      status: "WAITING_FOR_SECOND",
    });

    return true;
  }

  /**
   * Adds the player to the selected game on the side which is open.
   * Returns the color the player was added as, or false if unable to
   */
  public addPlayerToGame(gameCode: string, userName: string): Color | false {
    const game = this.games.get(gameCode);

    if (!game) {
      return false;
    }

    let sideAdded: Color | undefined;

    if (!game.whiteUserName) {
      game.whiteUserName = userName;
      sideAdded = "w";
    } else if (!game.blackUserName) {
      game.blackUserName = userName;
      sideAdded = "b";
    } else {
      return false;
    }

    game.status = "WHITE_TO_PLAY";
    return sideAdded;
  }

  /**
   * Returns the game status, if the game exists, or false if game not found
   */
  public getGameStatus(gameCode: string): GameStatus | false {
    return this.games.get(gameCode)?.status ?? false;
  }

  /**
   * Helper to update the status of the game, assumes game exists and is already started
   */
  private updateGameStatus(gameCode: string) {
    const game = this.games.get(gameCode);

    if (!game) {
      return;
    }

    if (game.chess.isCheckmate()) {
      game.status = "CHECKMATE";
    } else if (game.chess.isDraw()) {
      game.status = "DRAW";
    } else if (game.chess.isStalemate()) {
      game.status = "STALEMATE";
    } else if (game.chess.turn() === "w") {
      game.status = "WHITE_TO_PLAY";
    } else {
      game.status = "BLACK_TO_PLAY";
    }
  }

  /** Get the username of the user who's turn it is to play */
  public getUserToPlay(gameCode: string): string | false {
    const game = this.games.get(gameCode);

    if (!game) {
      return false;
    }

    if (game.status === "WHITE_TO_PLAY") {
      return game.whiteUserName!;
    }
    if (game.status === "BLACK_TO_PLAY") {
      return game.blackUserName!;
    }
    return false;
  }

  /**
   * Returns true if move was successful, false if game not found, and "INVALID_MOVE" if ...
   */
  public makeMove(
    gameCode: string,
    from: Square,
    to: Square,
    promotion?: PieceSymbol,
  ): MoveAttemptOutcome {
    const game = this.games.get(gameCode);

    if (!game) {
      return "INVALID_GAME";
    }

    try {
      game.chess.move({ from, to, promotion });
    } catch (e) {
      return "INVALID_MOVE";
    }

    this.updateGameStatus(gameCode);

    return "SUCCESS";
  }

  // TODO: what do we want to send back to the client after each turn?
  public getGameInfo(gameCode: string) {
    const game = this.games.get(gameCode);

    if (!game) {
      return null;
    }

    return {
      fen: game.chess.fen(),
      colorToPlay: game.chess.turn(),
      moves: game.chess.history(),
    };
  }
}
