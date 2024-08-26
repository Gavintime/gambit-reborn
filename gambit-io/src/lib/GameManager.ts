import { Chess } from "chess.js";
import { redisPub } from "./redis.js";

type GameState = {
  whiteUserId: number | null;
  blackUserId: number | null;
  pgn: string | null;
};

// TODO: get game state, then create chess.js instance
export async function getGameState(gameCode: string) {
  const gameStateString = await redisPub.get(`game-${gameCode}`);

  if (gameStateString === null) {
    throw new Error(`Game: ${gameCode} does not exist`);
  }

  // TODO: validate redis data, don't assume it's valid
  const gameStateData = JSON.parse(gameStateString) as GameState;

  // TODO: review how we are sending back data to io "router"
  const temp = {
    whiteUserId: gameStateData.whiteUserId,
    blackUserId: gameStateData.blackUserId,
    chess: new Chess(),
  };

  if (gameStateData.pgn) {
    temp.chess.loadPgn(gameStateData.pgn);
  }

  return temp;
}

// export async function updateGameState(something: any) {}
