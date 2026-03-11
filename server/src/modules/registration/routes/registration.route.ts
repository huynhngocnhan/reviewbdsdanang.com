import { Router } from "express";
import { RegistrationController } from "../controllers/registration.controller";
import { authenticate } from "../../../middleware/auth.middleware";

const router = Router();

// Route công khai: Khách hàng đăng ký tư vấn
router.post("/", RegistrationController.register);

// Routes cho admin (cần xác thực)
router.get("/stats", authenticate, RegistrationController.getReportStats);
router.get("/", authenticate, RegistrationController.getAllReports);
router.get("/:id", authenticate, RegistrationController.getReportById);
router.patch("/:id/status", authenticate, RegistrationController.updateReportStatus);
router.delete("/:id", authenticate, RegistrationController.deleteReport);

export default router;
