import express from "express";
import session from "express-session";
import * as uuid from "uuid";
import { Orm, getOrm } from "./db/db";
import userRouter from "./routes/user.route";

export function getApp({ dbFile }: { dbFile: string }) {
  const app = express();

  const sessionMiddleware = session({
    secret: "some secret",
    name: "session_id",
    resave: false,
    saveUninitialized: true,
    genid: () => uuid.v4(),
  });
  app.use(sessionMiddleware);

  const appMiddleware = (req, _res, next) => {
    const orm = getOrm(dbFile);
    req.orm = orm;

    const user_id = req.session.id;
    req.user_id = user_id;
    next();
  };
  app.use(appMiddleware);

  app.use(express.static("public"));

  app.use("/api/user", userRouter);

  return app;
}

declare global {
  namespace Express {
    interface Request {
      orm: Orm;
      user_id: string;
    }
  }
}
