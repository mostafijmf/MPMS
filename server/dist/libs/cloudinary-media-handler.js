"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMediaFromCloudinary = exports.uploadMediaToCloudinary = void 0;
const cloudinary_config_1 = __importDefault(require("../config/cloudinary.config"));
const FOLDER = "MPMS/media";
const uploadMediaToCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const fileBuffer = file.buffer;
    // <!--- Upload to Cloudinary ---> 
    const uploadResult = yield new Promise((resolve, reject) => {
        cloudinary_config_1.default.uploader
            .upload_stream({ folder: FOLDER }, (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        })
            .end(fileBuffer);
    });
    return uploadResult;
});
exports.uploadMediaToCloudinary = uploadMediaToCloudinary;
const removeMediaFromCloudinary = (url, folder) => __awaiter(void 0, void 0, void 0, function* () {
    // <!-- Split publicID from URL -->
    const pathSegments = url.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];
    const publicId = lastSegment.split(".")[0];
    const result = yield cloudinary_config_1.default.uploader.destroy(`${folder || FOLDER}/${publicId}`);
    return result;
});
exports.removeMediaFromCloudinary = removeMediaFromCloudinary;
