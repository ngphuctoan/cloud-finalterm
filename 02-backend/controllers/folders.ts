import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { eq, isNull, sql } from "drizzle-orm";
import express from "express";
import { match } from "ts-pattern";
import db from "../db";
import { filesTable, foldersTable } from "../db/schema";
import CreateFolderDto from "../dtos/create-folder";
import parseDto from "../middlewares/parse-dto";
import s3, { BUCKET } from "../utils/s3";

const foldersController = express.Router();

foldersController.get("/{:id}", async (req, res) => {
  const { id } = req.params;

  const rootFolder = await match(id)
    .when(
      (id) => id === undefined,
      () => ({
        type: "folder",
        id: 0,
        name: "/",
        createdAt: null,
      }),
    )
    .otherwise(async () =>
      db
        .select({
          type: sql<string>`'folder'`,
          id: foldersTable.id,
          name: foldersTable.name,
          createdAt: foldersTable.createdAt,
        })
        .from(foldersTable)
        .where(eq(foldersTable.id, Number(id)))
        .then((result) => result[0]),
    );

  const folders = await db
    .select({
      type: sql<string>`'folder'`,
      id: foldersTable.id,
      name: foldersTable.name,
      createdAt: foldersTable.createdAt,
    })
    .from(foldersTable)
    .where(
      match(id)
        .when(
          (id) => id === undefined,
          () => isNull(foldersTable.parentId),
        )
        .otherwise(() => eq(foldersTable.parentId, Number(id))),
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
      match(id)
        .when(
          (id) => id === undefined,
          () => isNull(filesTable.folderId),
        )
        .otherwise(() => eq(filesTable.folderId, Number(id))),
    );

  return res.json({
    ...rootFolder,
    contents: [...folders, ...files],
  });
});

foldersController.get("/:id/breadcrumb", async (req, res) => {
  const { id } = req.params;

  const rawQuery = sql`
    WITH RECURSIVE folders_breadcrumb AS (
      SELECT folders_1.id, folders_1.name, folders_1.parent_id
      FROM folders folders_1
      WHERE folders_1.id = ${id}
      UNION ALL
      SELECT folders_2.id, folders_2.name, folders_2.parent_id
      FROM folders folders_2
      JOIN folders_breadcrumb ON folders_2.id = folders_breadcrumb.parent_id
    )
    SELECT id, name FROM folders_breadcrumb;
  `;

  const { rows: breadcrumb } = await db.execute(rawQuery);

  return res.json(breadcrumb.reverse());
});

foldersController.post("/", parseDto(CreateFolderDto), async (req, res) => {
  const folder = await db
    .insert(foldersTable)
    .values(req.body)
    .returning({
      type: sql<string>`'folder'`,
      id: foldersTable.id,
      name: foldersTable.name,
      createdAt: foldersTable.createdAt,
    });
  return res.json(folder[0]);
});

foldersController.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const filesToDelete = await db
    .select({
      bucketKey: filesTable.bucketKey,
    })
    .from(filesTable)
    .where(eq(filesTable.folderId, Number(id)));

  await s3.send(
    new DeleteObjectsCommand({
      Bucket: BUCKET,
      Delete: {
        Objects: filesToDelete.map((file) => ({
          Key: file.bucketKey,
        })),
      },
    }),
  );

  const folder = await db
    .delete(foldersTable)
    .where(eq(foldersTable.id, Number(id)))
    .returning({
      type: sql<string>`'folder'`,
      id: foldersTable.id,
      name: foldersTable.name,
      createdAt: foldersTable.createdAt,
    });

  return res.json(folder[0]);
});

export default foldersController;
