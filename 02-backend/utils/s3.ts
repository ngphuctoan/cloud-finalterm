import { S3Client } from "@aws-sdk/client-s3";

export const BUCKET = "keepbin";

const s3 = new S3Client({
  endpoint: process.env.S3_URL!,
  region: process.env.S3_REGION!,
  forcePathStyle: true,
  useDualstackEndpoint: false,
  responseChecksumValidation: "WHEN_REQUIRED",
  requestChecksumCalculation: "WHEN_REQUIRED",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_ACCESS_KEY_SECRET!,
  },
});

export default s3;
