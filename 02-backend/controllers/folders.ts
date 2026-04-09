import express from "express";
import * as v from "valibot";
import db from "../db";
import CreateFolderDto from "../dtos/create-folder";
import { filesTable, foldersTable } from "../db/schema";
import { eq, isNull, sql } from "drizzle-orm";

const foldersController = express.Router();

foldersController.get("/{:id}", async (req, res) => {
  const { id } = req.params;
  const folder = id
    ? (
        await db
          .select({
            type: sql<string>`'folder'`,
            id: foldersTable.id,
            name: foldersTable.name,
            createdAt: foldersTable.createdAt,
          })
          .from(foldersTable)
          .where(eq(foldersTable.id, Number(id)))
      )[0]
    : {
        type: "folder",
        id: 0,
        name: "/",
        createdAt: null,
      };
  const folders = await db
    .select({
      type: sql<string>`'folder'`,
      id: foldersTable.id,
      name: foldersTable.name,
      createdAt: foldersTable.createdAt,
    })
    .from(foldersTable)
    .where(
      id
        ? eq(foldersTable.parentId, Number(id))
        : isNull(foldersTable.parentId),
    );
  const files = await db
    .select({
      type: sql<string>`'file'`,
      id: filesTable.id,
      name: filesTable.name,
      sizeBytes: filesTable.sizeBytes,
      bucketKey: filesTable.bucketKey,
      createdAt: filesTable.createdAt,
    })
    .from(filesTable)
    .where(
      id ? eq(filesTable.folderId, Number(id)) : isNull(filesTable.folderId),
    );
  return res.json({
    ...folder,
    contents: [...folders, ...files],
  });
});

foldersController.post("/", async (req, res) => {
  const createFolder = v.parse(CreateFolderDto, req.body);
  const folder = await db.insert(foldersTable).values(createFolder);
  return res.json(folder);
});

foldersController.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const folder = await db
    .delete(foldersTable)
    .where(eq(foldersTable.id, Number(id)));
  return res.json(folder);
});

export default foldersController;
