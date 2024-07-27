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
  // recursively retry on the low change we get a collision
  if (redisSetResult === null) {
    debug(`collision!!!, duplicate code: ${code}, retrying...`);
    code = await makeNewGameCode(userId, color);
  }

  return code;
}

// create new invite code
router.post("/", async (req, res) => {
  // request body {"userName": STRING, "color": "w" or "b"}

  const { userName, color } = req.body;

  // TODO: better request validation
  if (!userName || typeof userName !== "string") {
    // unauthorized
    res.status(401).json("Invalid userName");
    return;
  }

  if (color !== "w" && color !== "b") {
    // bad request
    res.status(404).json("Missing or invalid color choice");
    return;
  }

  // verify user exists (call mysql db)
  const user = await prisma.user.findUnique({
    where: { name: userName },
  });
  if (user === null) {
    // unauthorized
    res.status(401).json("Invalid userName");
    return;
  }

  const inviteCode = await makeNewGameCode(user.id, color);

  // return the invite code
  res.json({ inviteCode: inviteCode, color: color });
});

// // join using an existing invite code
// router.patch("/", async (req, res) => {
//   // request body {"userName": STRING, "inviteCode": STRING}

//   const { userName, inviteCode } = req.body;

//   // TODO: better request validation
//   if (!userName || typeof userName !== "string") {
//     // unauthorized
//     res.status(401).json("Invalid userName");
//     return;
//   }

//   if (
//     !inviteCode ||
//     typeof inviteCode !== "string" ||
//     inviteCode.length !== INVITE_CODE_LENGTH
//   ) {
//   }
// });

// get game info
// router.get("/:id(\\d+)", async (req, res) => {
//   const { id } = req.params;
//   const idInt = parseInt(id, 10);
//   if (idInt > Number.MAX_SAFE_INTEGER) {
//     res.status(400).json("Invalid Game id");
//     return;
//   }

//   let game;
//   try {
//     game = await prisma.game.findUnique({
//       where: {
//         id: idInt,
//       },
//     });
//   } catch (error) {
//     res.status(500).json("Internal Error");
//     debug(error);
//     return;
//   }

//   if (game === null) {
//     res.status(404).json(`Game: ${id} doesn't exist.`);
//     return;
//   }

//   res.json(game);
// });

// store finished game in db, only called internally by socket io server
// router.post("/", async (req, res) => {
//   // TODO: check all required fields
//   // if (!req.body.whiteId && !req.body.blackId) {
//   //   res.status(400).json("a player id is required to create a new game");
//   //   return;
//   // }

//   const game = await prisma.game.create({
//     data: {
//       white: req.body.whiteId
//         ? { connect: { id: req.body.whiteId } }
//         : undefined,
//       black: req.body.blackId
//         ? { connect: { id: req.body.blackId } }
//         : undefined,
//     },
//   });

//   res.json({ gameId: game.id });
// });

// join game from invite game code
// router.put("/join", async (req, res) => {
//   // check input
//   if (!req.body.userId) {
//     res.status(400).json("a playerId is required to join a game");
//     return;
//   }

//   if (!req.body.gameId) {
//     res.status(400).json("a gameId is required to join a game");
//     return;
//   }

//   // get game info and check if joinable
//   const game = await prisma.game.findUnique({
//     where: { id: req.body.gameId },
//   });

//   if (!game) {
//     res.status(404).json("Game not found");
//     return;
//   }

//   if (game.whiteId === req.body.userId || game.blackId === req.body.userId) {
//     // TODO: what's the correct 4xx here, 409?
//     res.status(400).json("Already in this game");
//     return;
//   }

//   // find side to join, then update game in db with invited player
//   let data;
//   if (!game.whiteId) {
//     data = { whiteId: req.body.userId };
//   } else if (!game.blackId) {
//     data = { blackId: req.body.userId };
//   } else {
//     // 409  = conflict
//     res.status(409).json("Game is full");
//     return;
//   }

//   const joinedGame = await prisma.game.update({
//     where: { id: req.body.gameId },
//     data,
//   });

//   res.json({ game: joinedGame });
// });

export default router;
