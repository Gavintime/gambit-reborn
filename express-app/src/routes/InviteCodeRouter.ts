import { Router } from "express";
import Debug from "debug";
import prisma from "../lib/prisma.js";
import { redisPub } from "../lib/redis.js";
import type GameState from "../lib/GameState.js";

const debug = Debug("gambit:invite-code-route");
const router = Router();
const INVITE_CODE_LENGTH = 6;

/**
 * generates a game code, adds it to redis, then returns
 */
async function makeNewGameCode(
  userId: number,
  color: "w" | "b",
): Promise<string> {
  // chars  I, L, O, 0, 1 have been removed to prevent confusion
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

  let code = "";
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < INVITE_CODE_LENGTH; i++) {
    const randomChar = alphabet.charAt(Math.random() * alphabet.length);
    code += randomChar;
  }

  const newGameState: GameState = {
    whiteUserId: color === "w" ? userId : null,
    blackUserId: color === "b" ? userId : null,
    moves: null,
  };

  // TODO: expire time
  const redisSetResult = await redisPub.set(
    `game-${code}`,
    JSON.stringify(newGameState),
    "NX",
  );
  // recursively retry on the low chance we get a collision
  if (redisSetResult === null) {
    debug(`collision!!!, duplicate code: ${code}, retrying...`);
    code = await makeNewGameCode(userId, color);
  }

  return code;
}

/**
 * @returns promise of: color
 */
async function addUserToGameCode(
  userId: number,
  inviteCode: string,
): Promise<"w" | "b"> {
  const gameStateString = await redisPub.get(`game-${inviteCode}`);

  if (gameStateString === null) {
    throw new Error("Game not found");
  }

  const gameInfo: GameState = JSON.parse(gameStateString);

  if (gameInfo.whiteUserId === userId || gameInfo.blackUserId === userId) {
    throw new Error("Already in game");
  }

  let color: "w" | "b";
  if (gameInfo.whiteUserId === null) {
    gameInfo.whiteUserId = userId;
    color = "w";
  } else if (gameInfo.blackUserId === null) {
    gameInfo.blackUserId = userId;
    color = "b";
  } else {
    throw new Error("Game is full");
  }

  await redisPub.set(`game-${inviteCode}`, JSON.stringify(gameInfo));

  return color;
}

// create new invite code
router.post("/", async (req, res) => {
  // request body {"userName": STRING, "color": "w" or "b"}

  const { userName, color } = req.body;

  // TODO: better request validation
  if (typeof userName !== "string") {
    res.status(400).json("Invalid userName");
    return;
  }

  if (color !== "w" && color !== "b") {
    // bad request
    res.status(400).json("Invalid color");
    return;
  }

  // verify user exists (call mysql db)
  const user = await prisma.user.findUnique({
    where: { name: userName },
  });
  if (user === null) {
    // unauthorized
    res.status(401).json("userName not found");
    return;
  }

  const inviteCode = await makeNewGameCode(user.id, color);

  // return the invite code
  res.json({ inviteCode: inviteCode, color: color });
});

// join using an existing invite code
router.patch("/", async (req, res) => {
  // request body {"userName": STRING, "inviteCode": STRING}
  const { userName, inviteCode } = req.body;

  // TODO: better request validation
  if (typeof userName !== "string") {
    res.status(400).json("Invalid UserName");
    return;
  }

  if (
    typeof inviteCode !== "string" ||
    inviteCode.length !== INVITE_CODE_LENGTH
  ) {
    res.status(400).json("Invalid inviteCode");
    return;
  }

  // verify user exists (call mysql db)
  const user = await prisma.user.findUnique({
    where: { name: userName },
  });
  if (user === null) {
    // unauthorized
    res.status(401).json("userName not found");
    return;
  }

  let color;
  try {
    color = await addUserToGameCode(user.id, inviteCode);
    // TODO: filter error types instead of any?
    // game not found, already in game, game is full
  } catch (error: any) {
    res.status(400).json(error.message);
    return;
  }

  res.json({ inviteCode: inviteCode, color: color });
});

export default router;
