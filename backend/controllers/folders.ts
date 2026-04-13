import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { and, eq, isNull, not, sql } from "drizzle-orm";
import express from "express";
import { match } from "ts-pattern";
import db from "../db";
import { filesTable, foldersTable } from "../db/schema";
import CreateFolderDto from "../dtos/create-folder";
import UpdateFolderDto from "../dtos/update-folder";
import parseDto from "../middlewares/parse-dto";
import s3, { BUCKET } from "../utils/s3";
import { DUPLICATE_AFFIX } from "../utils/constants";
import normalizeFileName from "../utils/file-name";
import * as v from "valibot";

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
    )
    .orderBy(foldersTable.name);

  const files = await db
    .select({
      type: sql<string>`'file'`,
      id: filesTable.id,
      name: filesTable.name,
      mimeType: filesTable.mimeType,
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
    )
    .orderBy(filesTable.name);

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
  const { name, parentId } = req.body as v.InferInput<typeof CreateFolderDto>;

  let finalName = name;

  while (true) {
    const existingNames = await db
      .select()
      .from(foldersTable)
      .where(
        and(
          eq(foldersTable.name, finalName),
          match(parentId)
            .when(
              (parentId) => parentId === undefined,
              () => isNull(foldersTable.parentId),
            )
            .otherwise(() => eq(foldersTable.parentId, Number(parentId))),
        ),
      );
    if (existingNames.length === 0) {
      break;
    }
    finalName += DUPLICATE_AFFIX;
  }

  const folder = await db
    .insert(foldersTable)
    .values({
      name: finalName,
      parentId: parentId ? Number(parentId) : undefined,
    })
    .returning({
      type: sql<string>`'folder'`,
      id: foldersTable.id,
      name: foldersTable.name,
      createdAt: foldersTable.createdAt,
    });

  return res.json(folder[0]);
});

foldersController.put("/:id", parseDto(UpdateFolderDto), async (req, res) => {
  const { id } = req.params;
  const { name } = req.body as v.InferInput<typeof UpdateFolderDto>;

  const currentFolder = await db
    .select({
      parentId: foldersTable.parentId,
    })
    .from(foldersTable)
    .where(eq(foldersTable.id, Number(id)));

  const normalizedFolderName = normalizeFileName(name);

  const existingNames = await db
    .select()
    .from(foldersTable)
    .where(
      and(
        not(eq(foldersTable.id, Number(id))),
        eq(foldersTable.name, normalizedFolderName),
        match(currentFolder[0].parentId)
          .when(
            (parentId) => parentId === undefined,
            () => isNull(foldersTable.parentId),
          )
          .otherwise(() =>
            eq(foldersTable.parentId, Number(currentFolder[0].parentId)),
          ),
      ),
    );
  if (existingNames.length > 0) {
    return res.status(400).json({
      nested: {
        name: ["Tên thư mục này đã tồn tại"],
      },
    });
  }

  const folder = await db
    .update(foldersTable)
    .set({
      name: normalizedFolderName,
    })
    .where(eq(foldersTable.id, Number(id)))
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
