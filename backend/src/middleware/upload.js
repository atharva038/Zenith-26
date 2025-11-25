const multer = require("multer");
const {
  allowedImageTypes,
  allowedVideoTypes,
  maxFileSize,
} = require("../config/upload");
const { errorResponse } = require("../utils/responseHandler");

// Use memory storage for direct upload to Cloudinary
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  const allowedTypes = [...allowedImageTypes, ...allowedVideoTypes];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only images and videos are allowed."),
      false
    );
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: maxFileSize,
  },
  fileFilter: fileFilter,
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return errorResponse(
        res,
        `File too large. Maximum size is ${maxFileSize / 1024 / 1024}MB`,
        400
      );
    }
    return errorResponse(res, err.message, 400);
  } else if (err) {
    return errorResponse(res, err.message, 400);
  }
  next();
};

module.exports = { upload, handleMulterError };
