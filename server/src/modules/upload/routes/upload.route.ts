import { Router } from "express";
import { UploadController } from "../controllers/upload.controller";

const router = Router();

router.post("/presign", UploadController.getPresignedUrl);

export default router;
