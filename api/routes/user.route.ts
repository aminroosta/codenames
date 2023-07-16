import express from "express";
import { userRepo } from "../repo/user-repo";

const router = express.Router();

router.get("/", ({ orm, session }, res) => {
  const user_id = session.id;
  const user = userRepo(orm).get({ user_id });
  res.json(user);
});

router.post("/", ({ orm, session, body }, res) => {
  const user_id = session.id;
  const user = userRepo(orm).upsert({ user_id, nickname: body.nickname });
  res.json(user);
});

export default router;
