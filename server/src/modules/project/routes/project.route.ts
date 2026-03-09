import { Router } from "express";
import { projectController } from "../controllers/project.controller";
import { authMiddleware } from "../../../middleware/auth.middleware";

const router = Router();

// Public routes
router.get("/", projectController.getAll.bind(projectController));
router.get("/slug/:slug", projectController.getBySlug.bind(projectController));
router.get("/:id", projectController.getById.bind(projectController));

// Protected routes - require authentication
router.post("/", authMiddleware, projectController.create.bind(projectController));
router.put("/:id", authMiddleware, projectController.update.bind(projectController));
router.delete("/:id", authMiddleware, projectController.delete.bind(projectController));
router.post("/:id/publish", authMiddleware, projectController.publish.bind(projectController));
router.post("/:id/archive", authMiddleware, projectController.archive.bind(projectController));

export default router;
