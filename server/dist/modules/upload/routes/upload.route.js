"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_controller_1 = require("../controllers/upload.controller");
const router = (0, express_1.Router)();
router.post("/presign", upload_controller_1.UploadController.getPresignedUrl);
exports.default = router;
