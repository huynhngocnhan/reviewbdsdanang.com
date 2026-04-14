"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const router = (0, express_1.Router)();
router.get("/", admin_controller_1.AdminController.getAdmin);
router.get("/:id", admin_controller_1.AdminController.getAdminById);
router.patch("/:id/profile", admin_controller_1.AdminController.updateProfile);
exports.default = router;
