import { Router } from "express";
// import { Chess } from "chess.js";
import Debug from "debug";
import prisma from "../lib/prisma.js";

const debug = Debug("gambit:game-route");
const router = Router();

// get game info
router.get("/:id(\\d+)", async (req, res) => {
  const { id } = req.params;
  const idInt = parseInt(id, 10);
  if (idInt > Number.MAX_SAFE_INTEGER) {
    res.status(400).json("Invalid Game id");
    return;
  }

  let game;
  try {
    game = await prisma.game.findUnique({
      where: {
        id: idInt,
      },
    });
  } catch (error) {
    res.status(500).json("Internal Error");
    debug(error);
    return;
  }

  if (game === null) {
    res.status(404).json(`Game: ${id} doesn't exist.`);
    return;
  }

  res.json(game);
});

// create new game
// TODO: don't store a game in the actual db until both players have join (or maybe first move has been made)
// use redis until then
router.post("/", async (req, res) => {
  if (!req.body.whiteId && !req.body.blackId) {
    res.status(400).json("a player id is required to create a new game");
    return;
  }

  const game = await prisma.game.create({
    data: {
      white: req.body.whiteId
        ? { connect: { id: req.body.whiteId } }
        : undefined,
      black: req.body.blackId
        ? { connect: { id: req.body.blackId } }
        : undefined,
    },
  });

  res.json({ gameId: game.id });
});

// join game from invite game code
router.put("/join", async (req, res) => {
  // check input
  if (!req.body.userId) {
    res.status(400).json("a playerId is required to join a game");
    return;
  }

  if (!req.body.gameId) {
    res.status(400).json("a gameId is required to join a game");
    return;
  }

  // get game info and check if joinable
  const game = await prisma.game.findUnique({
    where: { id: req.body.gameId },
  });

  if (!game) {
    res.status(404).json("Game not found");
    return;
  }

  if (game.whiteId === req.body.userId || game.blackId === req.body.userId) {
    // TODO: what's the correct 4xx here, 409?
    res.status(400).json("Already in this game");
    return;
  }

  // find side to join, then update game in db with invited player
  let data;
  if (!game.whiteId) {
    data = { whiteId: req.body.userId };
  } else if (!game.blackId) {
    data = { blackId: req.body.userId };
  } else {
    // 409  = conflict
    res.status(409).json("Game is full");
    return;
  }

  const joinedGame = await prisma.game.update({
    where: { id: req.body.gameId },
    data,
  });

  res.json({ game: joinedGame });
});

export default router;
