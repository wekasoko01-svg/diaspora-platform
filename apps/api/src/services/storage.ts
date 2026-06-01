import fs from "fs/promises"
import path from "path"
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"

const driver = process.env.UPLOAD_DRIVER ?? "local"
const uploadDir = process.env.UPLOAD_DIR ?? "./uploads"

let s3Client: S3Client | null = null

function getS3() {
  if (!s3Client && process.env.AWS_ACCESS_KEY_ID) {
    s3Client = new S3Client({ region: process.env.AWS_REGION ?? "us-east-1" })
  }
  return s3Client
}

export async function uploadFile(buffer: Buffer, filename: string, mimetype: string): Promise<string> {
  const key = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`

  if (driver === "s3" && getS3()) {
    await getS3()!.send(new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
    }))
    return `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${key}`
  }

  await fs.mkdir(uploadDir, { recursive: true })
  const filePath = path.join(uploadDir, key)
  await fs.writeFile(filePath, buffer)
  return `/uploads/${key}`
}

export async function deleteFile(url: string): Promise<void> {
  if (driver === "s3" && getS3() && process.env.AWS_BUCKET) {
    const key = url.split("/").pop()
    if (key) await getS3()!.send(new DeleteObjectCommand({ Bucket: process.env.AWS_BUCKET, Key: key }))
    return
  }
  const filePath = path.join(uploadDir, path.basename(url))
  await fs.unlink(filePath).catch(() => {})
}
