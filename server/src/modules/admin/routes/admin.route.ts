import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";

const router = Router();

router.get("/:id", AdminController.getAdminById);

export default router;