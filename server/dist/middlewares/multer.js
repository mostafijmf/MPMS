"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaProcessByMulter = void 0;
const multer_1 = __importDefault(require("multer"));
// max size in bytes
const MAX_FILE_SIZE = 1 * 1024 * 1024;
// allowed mimetypes
const ALLOWED_IMAGE_TYPES = ['image/jpg', 'image/jpeg', 'image/png', 'image/svg+xml', 'application/pdf'];
const storage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
        if (file.size > MAX_FILE_SIZE)
            return cb(new Error("Image size exceeds 1 MB"));
        return cb(null, true);
    }
    ;
    return cb(new Error("File type not allowed"));
};
exports.mediaProcessByMulter = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE,
    },
    fileFilter
});
