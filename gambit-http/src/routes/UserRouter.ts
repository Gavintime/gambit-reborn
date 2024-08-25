import { Router } from "express";
import { createNewUser, getUser, isValidUserName } from "../lib/UserManager.js";

const router = Router();

router.get("/", async (req, res) => {
  const { userName } = req.body;

  if (typeof userName !== "string" || !isValidUserName(userName)) {
    res.status(400).json("Invalid userName");
    return;
  }

  const user = await getUser(userName);

  if (!user) {
    res.status(404).json("User not found");
    return;
  }

  res.json(user);
});

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
