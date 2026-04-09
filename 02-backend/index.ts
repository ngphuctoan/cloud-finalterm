import { RedisStore } from "connect-redis";
import cors from "cors";
import express from "express";
import session from "express-session";
import passport from "passport";
import { createClient } from "redis";
import authController from "./controllers/auth";
import filesController from "./controllers/files";
import foldersController from "./controllers/folders";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const redisClient = createClient();
redisClient.connect().catch(console.error);

const redisStore = new RedisStore({
  client: redisClient,
  prefix: "keepbin:",
});

app.use(
  session({
    store: redisStore,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET!,
  }),
);
app.use(passport.authenticate("session"));

app.use("/auth", authController);
app.use("/folders", foldersController);
app.use("/files", filesController);

const PORT = 3000;
app.listen(PORT, async () => {
  console.log(`Example app listening on port ${PORT}`);
});
