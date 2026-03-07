import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";

const router = Router();

router.get("/", AdminController.getAdmin);
router.get("/:id", AdminController.getAdminById);
router.patch("/:id/profile", AdminController.updateProfile);

export default router;
