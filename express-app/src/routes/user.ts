import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

router.get("/", async (req, res) => {
  const user = await prisma.user.findFirst({
    where: { id: req.body.id },
  });

  res.json(user);
});

router.post("/", async (req, res) => {
  const user = await prisma.user.create({
    data: { name: req.body.name },
  });

  res.json(user);
});

export default router;
