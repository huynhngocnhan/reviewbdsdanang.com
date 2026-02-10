import { Router } from "express";
import { AssetController } from "../controllers/asset.controller";

const router = Router();

router.post("/", AssetController.create);
router.get("/:id", AssetController.getById);

export default router;