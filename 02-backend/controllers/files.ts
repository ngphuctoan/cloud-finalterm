import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
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
import { and, eq, isNull, not, sql } from "drizzle-orm";
import { DUPLICATE_AFFIX } from "../utils/constants";
import * as v from "valibot";
import { match } from "ts-pattern";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import UpdateFileDto from "../dtos/update-file";

const filesController = express.Router();

filesController.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { download } = req.query;

  const file = await db
    .select({
      name: filesTable.name,
      bucketKey: filesTable.bucketKey,
    })
    .from(filesTable)
    .where(eq(filesTable.id, Number(id)));

  const url = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: BUCKET,
      Key: file[0].bucketKey,
      ResponseContentDisposition:
        download === "true"
          ? `attachment;filename="${file[0].name}"`
          : undefined,
    }),
    { expiresIn: 60 },
  );

  return res.json({ url });
});

filesController.post(
  "/",
  upload.single("file"),
  parseDto(UploadFileDto),
  async (req, res) => {
    const { folderId } = req.body as v.InferInput<typeof UploadFileDto>;

    const file = req.file!;
    const fileName = path.parse(file.originalname);

    const key = randomUUID();
    const ext = fileName.ext.toLowerCase();
    const normalizedFileName = normalizeFileName(fileName.name);

    let finalName = normalizedFileName;

    while (true) {
      const existingNames = await db
        .select()
        .from(filesTable)
        .where(
          and(
            eq(filesTable.name, finalName + ext),
            match(folderId)
              .when(
                (folderId) => folderId === undefined,
                () => isNull(filesTable.folderId),
              )
              .otherwise(() => eq(filesTable.folderId, Number(folderId))),
          ),
        );
      if (existingNames.length === 0) {
        break;
      }
      finalName += DUPLICATE_AFFIX;
    }

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key + ext,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const resultingFile = await db
      .insert(filesTable)
      .values({
        name: finalName + ext,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        bucketKey: key + ext,
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

filesController.put("/:id", parseDto(UpdateFileDto), async (req, res) => {
  const { id } = req.params;
  const { name: originalName } = req.body as v.InferInput<typeof UpdateFileDto>;
  const fileName = path.parse(originalName);

  const currentFile = await db
    .select({
      folderId: filesTable.folderId,
    })
    .from(filesTable)
    .where(eq(filesTable.id, Number(id)));

  const ext = fileName.ext.toLowerCase();
  const normalizedFileName = normalizeFileName(fileName.name);

  const existingNames = await db
    .select()
    .from(filesTable)
    .where(
      and(
        not(eq(filesTable.id, Number(id))),
        eq(filesTable.name, normalizedFileName + ext),
        match(currentFile[0].folderId)
          .when(
            (folderId) => folderId === undefined,
            () => isNull(filesTable.folderId),
          )
          .otherwise(() =>
            eq(filesTable.folderId, Number(currentFile[0].folderId)),
          ),
      ),
    );
  if (existingNames.length > 0) {
    return res.status(400).json({
      nested: {
        name: ["Tên tệp tin này đã tồn tại"],
      },
    });
  }

  const file = await db
    .update(filesTable)
    .set({
      name: normalizedFileName + ext,
    })
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

  return res.json(file[0]);
});

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
