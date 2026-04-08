import express from "express";
import foldersController from "../controllers/folders";

const v1Router = express.Router();

v1Router.use("/folders", foldersController);

export default v1Router;
