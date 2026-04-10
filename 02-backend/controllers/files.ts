import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import express from "express";
import { randomUUID } from "node:crypto";
import path from "node:path";
import db from "../db";
import { filesTable } from "../db/schema";
import normalizeFileName from "../utils/file-name";
import upload from "../utils/multer";
import s3, { BUCKET } from "../utils/s3";
import parseDto from "../middlewares/parse-dto";
import UploadFileDto from "../dtos/upload-file";
import { eq, sql } from "drizzle-orm";

const filesController = express.Router();

filesController.post(
  "/",
  upload.single("file"),
  parseDto(UploadFileDto),
  async (req, res) => {
    const { folderId } = req.body;

    const file = req.file!;
    const fileName = path.parse(file.originalname);

    const key = randomUUID();
    const ext = fileName.ext.toLowerCase();
    const normalizedFileName = normalizeFileName(fileName.name);

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: `${key}${ext}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const resultingFile = await db
      .insert(filesTable)
      .values({
        name: sql`(
          SELECT ${normalizedFileName} || CASE
            WHEN COUNT(*) = 0 THEN ''
            ELSE ' (' || COUNT(*) || ')'
          END || ${ext}
          FROM files
          WHERE name LIKE ${normalizedFileName} || '%'
          AND folder_id = ${folderId}
        )`,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        bucketKey: `${key}${ext}`,
        folderId: folderId ? Number(folderId) : undefined,
      })
      .returning({
        type: sql<string>`'file'`,
        id: filesTable.id,
        name: filesTable.name,
        mimeType: filesTable.mimeType,
        sizeBytes: filesTable.sizeBytes,
        bucketKey: filesTable.bucketKey,
        createdAt: filesTable.createdAt,
      });

    return res.json(resultingFile[0]);
  },
);

filesController.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const file = await db
    .delete(filesTable)
    .where(eq(filesTable.id, Number(id)))
    .returning({
      type: sql<string>`'file'`,
      id: filesTable.id,
      name: filesTable.name,
      mimeType: filesTable.mimeType,
      sizeBytes: filesTable.sizeBytes,
      bucketKey: filesTable.bucketKey,
      createdAt: filesTable.createdAt,
    });

  await s3.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: file[0].bucketKey,
    }),
  );

  return res.json(file[0]);
});

export default filesController;
