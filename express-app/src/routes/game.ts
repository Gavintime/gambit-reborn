import { Router } from "express";
import { Chess } from "chess.js";
import prisma from "../lib/prisma.js";

const router = Router();

router.get("/", async (req, res) => {
  const game = await prisma.game.findMany({
    where: {
      white: { id: 1 },
    },
    take: 2,
  });

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

  const history = chess.history().join(' ');

  res.json({
    "pgnString": history,
    "pgnStringLength": history.length
  });
});

export default router;
