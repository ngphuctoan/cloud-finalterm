import { S3Client } from "@aws-sdk/client-s3";

export const BUCKET = "keepbin";

const s3 = new S3Client({
  endpoint: "http://localhost:8333",
  region: "ap-southeast-1",
  forcePathStyle: true,
  useDualstackEndpoint: false,
  responseChecksumValidation: "WHEN_REQUIRED",
  requestChecksumCalculation: "WHEN_REQUIRED",
  credentials: {
    accessKeyId: "admin",
    secretAccessKey: process.env.S3_SECRET!,
  },
});

export default s3;
