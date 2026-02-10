import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, BUCKET_NAME } from "../../../lib/r2";
import { v4 as uuidv4 } from "uuid";

export class UploadService {
  private readonly publicBaseUrl = process.env.R2_PUBLIC_BASE_URL || "";

  async generatePresignedUrl(fileName: string, contentType: string, folder: string = "uploads") {
    const fileExtension = fileName.split(".").pop();
    const key = `${folder}/${uuidv4()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    // URL này có hiệu lực trong 3600 giây (1 giờ)
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    
    // Sử dụng R2_PUBLIC_BASE_URL từ .env (ví dụ: https://pub-xxx.r2.dev)
    if (!this.publicBaseUrl) {
      throw new Error("R2_PUBLIC_BASE_URL is not defined in environment variables");
    }

    const publicUrl = `${this.publicBaseUrl.replace(/\/$/, "")}/${key}`;

    return {
      key,
      uploadUrl,
      publicUrl,
    };
  }
}
