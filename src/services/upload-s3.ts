import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

export const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT || "http://localhost:9000",
  region: process.env.S3_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "minioadmin",
    secretAccessKey: process.env.S3_SECRET_KEY || "minioadmin123",
  },
  forcePathStyle: true,
});

export async function uploadToS3(file: File, bucket: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop();
  const filename = `${crypto.randomBytes(16).toString("hex")}.${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: filename,
      Body: buffer,
      ContentType: file.type,
    })
  );

  // Formato esperado da URL: http://127.0.0.1:54321/storage/v1/object/public/news-images//ca0f6dbe7c694385e82fe010313c059a.jpg
  const endpoint = process.env.S3_ENDPOINT?.replace("/s3", "/object/public") || "http://localhost:9000/object/public";

  // Retorna a URL pública do arquivo enviado
  return `${endpoint}/${bucket}/${filename}`;
}
