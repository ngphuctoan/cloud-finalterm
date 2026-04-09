import express from "express";
import foldersController from "../controllers/folders";
import filesController from "../controllers/files";

const v1Router = express.Router();

v1Router.use("/folders", foldersController);
v1Router.use("/files", filesController);

export default v1Router;
