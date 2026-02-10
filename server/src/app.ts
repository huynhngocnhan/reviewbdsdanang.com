import express from "express";
import cors from "cors"; 
import morgan from "morgan";
import authRoutes from "./modules/auth/routes/auth.route";
import uploadRoutes from "./modules/upload/routes/upload.route";
import assetRoutes from "./modules/asset/routes/asset.route";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/assets", assetRoutes);

export default app;
