"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const r2_1 = require("../../../lib/r2");
const uuid_1 = require("uuid");
const constants_1 = require("../constants");
class UploadService {
    constructor() {
        this.publicBaseUrl = process.env.R2_PUBLIC_BASE_URL || "";
    }
    async generatePresignedUrl(fileName, contentType, folder = "uploads") {
        const fileExtension = fileName.split(".").pop();
        const key = `${folder}/${(0, uuid_1.v4)()}.${fileExtension}`;
        const command = new client_s3_1.PutObjectCommand({
            Bucket: r2_1.BUCKET_NAME,
            Key: key,
            ContentType: contentType,
            CacheControl: constants_1.R2_OBJECT_CACHE_CONTROL,
        });
        // URL này có hiệu lực trong 3600 giây (1 giờ)
        const uploadUrl = await (0, s3_request_presigner_1.getSignedUrl)(r2_1.s3Client, command, { expiresIn: 3600 });
        // Sử dụng R2_PUBLIC_BASE_URL từ .env (ví dụ: https://pub-xxx.r2.dev)
        if (!this.publicBaseUrl) {
            throw new Error("R2_PUBLIC_BASE_URL is not defined in environment variables");
        }
        const publicUrl = `${this.publicBaseUrl.replace(/\/$/, "")}/${key}`;
        return {
            key,
            uploadUrl,
            publicUrl,
            /** Client must send this exact header on the presigned PUT (included in the signature). */
            cacheControl: constants_1.R2_OBJECT_CACHE_CONTROL,
        };
    }
}
exports.UploadService = UploadService;
