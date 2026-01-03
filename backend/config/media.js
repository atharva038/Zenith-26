// Allowed file types for images
export const allowedImageTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

// Allowed file types for videos
export const allowedVideoTypes = [
  "video/mp4",
  "video/mpeg",
  "video/quicktime",
  "video/x-msvideo",
  "video/webm",
];

// Maximum file size (50MB for high quality media)
export const maxFileSize = parseInt(
  process.env.MAX_FILE_SIZE || "52428800",
  10
);

// Cloudinary folders
export const folders = {
  images: "zenith2026/glimpses/images",
  videos: "zenith2026/glimpses/videos",
};

// Image transformation presets - Optimized for quality without cropping
export const imagePresets = {
  thumbnail: { width: 400, height: 400, crop: "limit", quality: "auto:best" },
  medium: { width: 1200, height: 900, crop: "limit", quality: "auto:best" },
  large: { width: 2560, height: 1440, crop: "limit", quality: "auto:best" },
  original: { quality: "auto:best", fetch_format: "auto" },
};

// Video transformation presets - Optimized for quality
export const videoPresets = {
  quality: "auto:best",
  fetch_format: "auto",
  video_codec: "auto",
};
