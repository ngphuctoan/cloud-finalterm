import { PutObjectCommand } from "@aws-sdk/client-s3";
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

const filesController = express.Router();

filesController.post(
  "/",
  parseDto(UploadFileDto),
  upload.single("file"),
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
        name: `${normalizedFileName}${ext}`,
        sizeBytes: file.size,
        bucketKey: `${key}${ext}`,
        folderId: folderId ? Number(folderId) : undefined,
      })
      .returning();

    return res.json(resultingFile[0]);
  },
);

export default filesController;
