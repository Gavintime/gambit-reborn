import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

// TODO: get by id or by username? (or either?)
// router.get("/", async (req, res) => {
//   const user = await prisma.user.findFirst({
//     where: { id: req.body.id },
//   });

//   res.json(user);
// });

router.post("/", async (req, res) => {
  const { name } = req.body;

  // TODO: better request validation
  if (typeof name !== "string") {
    res.status(400).json("Invalid userName");
    return;
  }

  const existingUser = await prisma.user.findFirst({
    where: { name: name },
  });

  if (existingUser !== null) {
    res.status(400).json("Username taken");
    return;
  }

  const newUser = await prisma.user.create({
    data: { name: name },
  });

  res.json(newUser);
});

export default router;
