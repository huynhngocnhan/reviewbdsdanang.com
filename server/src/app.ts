import express from "express";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import authRoutes from "./modules/auth/routes/auth.route";
import uploadRoutes from "./modules/upload/routes/upload.route";
import assetRoutes from "./modules/asset/routes/asset.route";
import adminRoutes from "./modules/admin/routes/admin.route";
import projectRoutes from "./modules/project/routes/project.route";
import registrationRoutes from "./modules/registration/routes/registration.route";

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://reviewbdsdanang.com",
    "https://www.reviewbdsdanang.com"
  ],
  credentials: true,
}));
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/registrations", registrationRoutes);

app.use("/api/uploads", uploadRoutes);
app.use("/api/assets", assetRoutes);
export default app;
