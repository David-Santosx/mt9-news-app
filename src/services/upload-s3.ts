import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';

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
  const filename = `${crypto.randomUUID()}.${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: filename,
      Body: buffer,
      ContentType: file.type,
    })
  );

  // Constrói a URL pública base removendo o caminho específico do S3
  const publicUrlBase = (process.env.S3_ENDPOINT || "").replace(
    /\/storage\/v1\/s3$/,
    ""
  );

  // Retorna a URL pública no formato correto
  return `${publicUrlBase}/storage/v1/object/public/${bucket}/${filename}`;
}
