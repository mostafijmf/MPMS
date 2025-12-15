"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const secret_1 = require("./libs/secret");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRouter_1 = __importDefault(require("./routers/userRouter"));
const responseController_1 = require("./controllers/responseController");
const authRouter_1 = __importDefault(require("./routers/authRouter"));
const projectsRouter_1 = __importDefault(require("./routers/projectsRouter"));
const app = (0, express_1.default)();
// <!-- Middlewares -->
app.use((0, cors_1.default)({ origin: secret_1.BASE_URL, credentials: true }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use('/static', express_1.default.static('public'));
// <!-- Routes -->
app.get("/", (req, res) => {
    res.send("Hello world!");
});
app.use("/api/auth", authRouter_1.default);
app.use("/api/users", userRouter_1.default);
app.use("/api/projects", projectsRouter_1.default);
// <!-- Invalid route -->
app.all("{*splat}", (req, res) => {
    res.send('Requested resource not found!');
});
// <!-- Global Error Handling Middleware -->
app.use((err, req, res, next) => {
    // <!-- Media file size error -->
    if (err.code === "LIMIT_FILE_SIZE") {
        return (0, responseController_1.errorResponse)(res, {
            statusCode: 400,
            message: "File too large (max size: image 1MB, video 2MB)",
        });
    }
    // <!-- MongoDB Duplicate field error -->
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return (0, responseController_1.errorResponse)(res, {
            statusCode: 400,
            message: `Duplicate field value: ${field} already exists. Please use another value!`,
        });
    }
    return (0, responseController_1.errorResponse)(res, {
        statusCode: err.status,
        message: err.message,
    });
});
exports.default = app;
