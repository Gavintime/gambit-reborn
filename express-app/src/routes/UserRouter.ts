import { Router } from "express";
import prisma from "../lib/prisma.js";
import { createNewUser, getUser, isValidUserName } from "../lib/UserManager.js";

const router = Router();

// TODO: get by id or by username? (or either?)
// router.get("/", async (req, res) => {
//   const user = await prisma.user.findFirst({
//     where: { id: req.body.id },
//   });

//   res.json(user);
// });

router.post("/", async (req, res) => {
  const { userName } = req.body;

  if (typeof userName !== "string" || !isValidUserName(userName)) {
    res.status(400).json("Invalid userName");
    return;
  }

  if (await getUser(userName)) {
    res.status(409).json("Username already taken");
    return;
  }

  const newUser = await createNewUser(userName);

  res.json(newUser);
});

export default router;
