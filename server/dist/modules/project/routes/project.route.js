"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_controller_1 = require("../controllers/project.controller");
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Public routes
router.get("/", project_controller_1.projectController.getAll.bind(project_controller_1.projectController));
router.get("/slug/:slug", project_controller_1.projectController.getBySlug.bind(project_controller_1.projectController));
router.get("/:id", project_controller_1.projectController.getById.bind(project_controller_1.projectController));
// Protected routes - require authentication
router.post("/", auth_middleware_1.authMiddleware, project_controller_1.projectController.create.bind(project_controller_1.projectController));
router.put("/:id", auth_middleware_1.authMiddleware, project_controller_1.projectController.update.bind(project_controller_1.projectController));
router.delete("/:id", auth_middleware_1.authMiddleware, project_controller_1.projectController.delete.bind(project_controller_1.projectController));
router.post("/:id/publish", auth_middleware_1.authMiddleware, project_controller_1.projectController.publish.bind(project_controller_1.projectController));
router.post("/:id/featured", auth_middleware_1.authMiddleware, project_controller_1.projectController.toggleFeatured.bind(project_controller_1.projectController));
router.post("/:id/archive", auth_middleware_1.authMiddleware, project_controller_1.projectController.archive.bind(project_controller_1.projectController));
exports.default = router;
