import multer from "multer";
import {CloudinaryStorage} from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "zenith26/images",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{width: 1500, crop: "limit"}],
  },
});

const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "zenith26/videos",
    resource_type: "video",
    allowed_formats: ["mp4", "mov", "webm"],
  },
});

// Payment screenshot storage
const paymentScreenshotStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "zenith26/payment-screenshots",
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
    transformation: [{width: 1200, crop: "limit", quality: "auto"}],
  },
});

function fileFilter(req, file, cb) {
  // Basic filter by mimetype
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
}

// Export two multer instances for images and videos
export const uploadImage = multer({storage: imageStorage, fileFilter}).single(
  "file"
);
export const uploadVideo = multer({storage: videoStorage, fileFilter}).single(
  "file"
);
export const uploadPaymentScreenshot = multer({
  storage: paymentScreenshotStorage,
  limits: {fileSize: 10 * 1024 * 1024}, // 10MB limit
}).single("screenshot");

export default {uploadImage, uploadVideo, uploadPaymentScreenshot};
