import { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary.config";

const FOLDER = "MPMS/media";

export const uploadMediaToCloudinary = async (file: Express.Multer.File) => {
  const fileBuffer = file.buffer;

  // <!--- Upload to Cloudinary ---> 
  const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: FOLDER }, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result as UploadApiResponse);
      })
      .end(fileBuffer);
  });

  return uploadResult
}

export const removeMediaFromCloudinary = async (url: string, folder?: string) => {
  // <!-- Split publicID from URL -->
  const pathSegments = url.split("/");
  const lastSegment = pathSegments[pathSegments.length - 1];
  const publicId = lastSegment.split(".")[0];

  const result = await cloudinary.uploader.destroy(`${folder || FOLDER}/${publicId}`);

  return result;
};