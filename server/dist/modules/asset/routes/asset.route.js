"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asset_controller_1 = require("../controllers/asset.controller");
const router = (0, express_1.Router)();
router.post("/", asset_controller_1.AssetController.create);
router.get("/:id", asset_controller_1.AssetController.getById);
exports.default = router;
