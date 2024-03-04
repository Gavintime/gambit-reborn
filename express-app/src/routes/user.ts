import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

router.get("/", async (req, res) => {
  const user = await prisma.user.findFirst({ where: { id: 1 } });

  res.json(user);
});

export default router;
