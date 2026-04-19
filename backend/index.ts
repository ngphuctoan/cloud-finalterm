import os from "node:os";
import { execSync } from "node:child_process";
import { RedisStore } from "connect-redis";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import passport from "passport";
import { createClient } from "redis";
import authController from "./controllers/auth";
import filesController from "./controllers/files";
import foldersController from "./controllers/folders";
import checkAuth from "./middlewares/check-auth";
import metricsController from "./controllers/metrics";

const app = express();
const port = 3000;

app.use(
  cors({
    origin: (origin, cb) =>
      cb(null, JSON.parse(process.env.CORS_ALLOWED_ORIGINS!).includes(origin)),
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const redisClient = createClient({
  url: process.env.SESSION_REDIS_URL!,
});
redisClient.connect().catch(console.error);

const redisStore = new RedisStore({
  client: redisClient,
  prefix: "keepbin:",
});

app.use(cookieParser());
app.use(
  session({
    store: redisStore,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET!,
  }),
);
app.use(passport.authenticate("session"));

app.get("/", (req, res) => {
  return res.json({
    status: "ok",
    container: os.hostname(),
    ip: execSync("hostname -i").toString().trim(),
  });
});

app.use("/metrics", metricsController);
app.use("/auth", authController);
app.use("/folders", checkAuth, foldersController);
app.use("/files", checkAuth, filesController);

app.listen(port, async () => {
  console.log(`Backend running on "http://localhost:${port}"!`);
});
