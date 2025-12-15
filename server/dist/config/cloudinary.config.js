"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const secret_1 = require("../libs/secret");
cloudinary_1.v2.config({
    cloud_name: secret_1.CLOUDINARY_NAME,
    api_key: secret_1.CLOUDINARY_API_KEY,
    api_secret: secret_1.CLOUDINARY_API_SECRET,
});
exports.default = cloudinary_1.v2;
