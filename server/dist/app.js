"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const auth_route_1 = __importDefault(require("./modules/auth/routes/auth.route"));
const upload_route_1 = __importDefault(require("./modules/upload/routes/upload.route"));
const asset_route_1 = __importDefault(require("./modules/asset/routes/asset.route"));
const admin_route_1 = __importDefault(require("./modules/admin/routes/admin.route"));
const project_route_1 = __importDefault(require("./modules/project/routes/project.route"));
const registration_route_1 = __importDefault(require("./modules/registration/routes/registration.route"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "https://reviewbdsdanang.com",
        "https://www.reviewbdsdanang.com"
    ],
    credentials: true,
}));
app.use((0, compression_1.default)());
app.use(express_1.default.json({ limit: "10mb" }));
app.use((0, morgan_1.default)("dev"));
app.use("/api/auth", auth_route_1.default);
app.use("/api/admin", admin_route_1.default);
app.use("/api/projects", project_route_1.default);
app.use("/api/registrations", registration_route_1.default);
app.use("/api/uploads", upload_route_1.default);
app.use("/api/assets", asset_route_1.default);
exports.default = app;
