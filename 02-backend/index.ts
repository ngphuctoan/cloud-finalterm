import cors from "cors";
import express from "express";
import { auth, ConfigParams } from "express-openid-connect";
import authController from "./controllers/auth";
import filesController from "./controllers/files";
import foldersController from "./controllers/folders";
import checkAuth from "./middlewares/check-auth";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const config: ConfigParams = {
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  secret: process.env.SECRET,
  authRequired: false,
  idpLogout: true,
  routes: {
    login: false,
    postLogoutRedirect: "/auth/check",
    callback: "/auth/callback",
  },
};
app.use(auth(config));

app.use("/auth", authController);
app.use("/folders", checkAuth, foldersController);
app.use("/files", checkAuth, filesController);

const PORT = 3000;
app.listen(PORT, async () => {
  console.log(`Example app listening on port ${PORT}`);
});
