module.exports = {
  // Allowed file types for images
  allowedImageTypes: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ],

  // Allowed file types for videos
  allowedVideoTypes: [
    "video/mp4",
    "video/mpeg",
    "video/quicktime",
    "video/x-msvideo",
    "video/webm",
  ],

  // Maximum file size (10MB)
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "10485760", 10),

  // Cloudinary folders
  folders: {
    images: "zenith2026/glimpses/images",
    videos: "zenith2026/glimpses/videos",
  },

  // Image transformation presets
  imagePresets: {
    thumbnail: { width: 300, height: 300, crop: "fill" },
    medium: { width: 800, height: 600, crop: "limit" },
    large: { width: 1920, height: 1080, crop: "limit" },
  },

  // Video transformation presets
  videoPresets: {
    quality: "auto",
    fetch_format: "auto",
  },
};
