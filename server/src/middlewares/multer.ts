import { Request } from "express";
import multer, { FileFilterCallback } from "multer";

// max size in bytes
const MAX_FILE_SIZE = 1 * 1024 * 1024;

// allowed mimetypes
const ALLOWED_IMAGE_TYPES = ['image/jpg', 'image/jpeg', 'image/png', 'image/svg+xml', 'application/pdf'];

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    if (file.size > MAX_FILE_SIZE) return cb(new Error("Image size exceeds 1 MB"));
    return cb(null, true);
  };

  return cb(new Error("File type not allowed"));
};

export const mediaProcessByMulter = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter
});
