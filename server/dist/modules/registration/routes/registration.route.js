"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const registration_controller_1 = require("../controllers/registration.controller");
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Route công khai: Khách hàng đăng ký tư vấn
router.post("/", registration_controller_1.RegistrationController.register);
// Routes cho admin (cần xác thực)
router.get("/stats", auth_middleware_1.authenticate, registration_controller_1.RegistrationController.getReportStats);
router.get("/", auth_middleware_1.authenticate, registration_controller_1.RegistrationController.getAllReports);
router.get("/:id", auth_middleware_1.authenticate, registration_controller_1.RegistrationController.getReportById);
router.patch("/:id/status", auth_middleware_1.authenticate, registration_controller_1.RegistrationController.updateReportStatus);
router.delete("/:id", auth_middleware_1.authenticate, registration_controller_1.RegistrationController.deleteReport);
exports.default = router;
