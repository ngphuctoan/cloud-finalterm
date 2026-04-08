import express from "express";
import * as v from "valibot";
import db from "../db";
import CreateFolderDto from "../dtos/create-folder";
import { foldersTable } from "../db/schema";

const foldersController = express.Router();

foldersController.get("/:id", async (req, res) => {
  const { id } = req.params;
  const folders = await db.query.foldersTable.findMany({
    where: { parentId: Number(id) },
  });
  return res.json(folders);
});

foldersController.post("/", async (req, res) => {
  const createFolder = v.parse(CreateFolderDto, req.body);
  const folder = await db.insert(foldersTable).values(createFolder);
  return res.json(folder);
});

export default foldersController;
