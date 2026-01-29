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
  params: async (req, file) => {
    // Different handling for PDFs vs images
    const isPdf = file.mimetype === "application/pdf";

    return {
      folder: "zenith26/payment-screenshots",
      allowed_formats: ["jpg", "jpeg", "png", "pdf"],
      resource_type: isPdf ? "raw" : "image", // 'raw' for PDFs, 'image' for images
      access_mode: "public", // CRITICAL: Make files publicly accessible
      // Only apply transformations to images, not PDFs
      transformation: isPdf
        ? undefined
        : [{width: 1200, crop: "limit", quality: "auto"}],
    };
  },
});

// Team member photo storage
const teamMemberPhotoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "zenith26/team-photos",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      {
        width: 400,
        height: 400,
        crop: "fill",
        quality: "auto",
        format: "webp",
      },
    ],
  },
});

// Registration documents storage (supports images and PDFs)
const registrationDocumentsStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isPdf = file.mimetype === "application/pdf";

    return {
      folder: "zenith26/registration-documents",
      allowed_formats: ["jpg", "jpeg", "png", "pdf"],
      resource_type: isPdf ? "raw" : "image",
      access_mode: "public",
      transformation: isPdf
        ? undefined
        : [{width: 1500, crop: "limit", quality: "auto"}],
    };
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

function imageFileFilter(req, file, cb) {
  // Filter only images
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
}

function paymentScreenshotFileFilter(req, file, cb) {
  // Allow images and PDFs for payment screenshots
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG images or PDF files are allowed"), false);
  }
}

function registrationDocumentsFileFilter(req, file, cb) {
  // Allow images and PDFs for registration documents
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG images or PDF files are allowed"), false);
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
  fileFilter: paymentScreenshotFileFilter,
  limits: {fileSize: 10 * 1024 * 1024}, // 10MB limit
}).single("screenshot");

export const uploadTeamMemberPhoto = multer({
  storage: teamMemberPhotoStorage,
  fileFilter: imageFileFilter,
  limits: {fileSize: 5 * 1024 * 1024}, // 5MB limit
}).single("photo");

export const uploadRegistrationDocuments = multer({
  storage: registrationDocumentsStorage,
  fileFilter: registrationDocumentsFileFilter,
  limits: {fileSize: 10 * 1024 * 1024}, // 10MB limit
}).fields([
  {name: "permissionLetter", maxCount: 1},
  {name: "transactionReceipt", maxCount: 1},
  {name: "captainIdCard", maxCount: 1},
]);

export default {
  uploadImage,
  uploadVideo,
  uploadPaymentScreenshot,
  uploadTeamMemberPhoto,
  uploadRegistrationDocuments,
};
