import { Router } from "express";
import { Chess } from "chess.js";
import Debug from "debug";
import prisma from "../lib/prisma.js";

const debug = Debug("gambit:game-route");
const router = Router();

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

router.post("/", async (req, res) => {
  const game = await prisma.game.create({
    data: {
      plyCount: req.body.plyCount,
      result: req.body.result,
      whiteId: req.body.whiteId,
      blackId: req.body.blackId,
    },
  });

  res.json(game);
});

router.post("/test", async (req, res) => {
  const chess = new Chess();
  while (!chess.isGameOver()) {
    const moves = chess.moves();
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    chess.move(randomMove);
  }

  const history = chess.history().join(" ");

  res.json({
    pgnString: history,
    pgnStringLength: history.length,
  });
});

export default router;
