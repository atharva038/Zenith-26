const { cloudinary } = require("../config/cloudinary");
const {
  folders,
  allowedImageTypes,
  allowedVideoTypes,
} = require("../config/upload");
const streamifier = require("streamifier");

class CloudinaryService {
  /**
   * Upload file to Cloudinary
   */
  async uploadFile(fileBuffer, mimetype, options = {}) {
    try {
      // Determine if it's an image or video
      const isImage = allowedImageTypes.includes(mimetype);
      const isVideo = allowedVideoTypes.includes(mimetype);

      if (!isImage && !isVideo) {
        throw new Error("Invalid file type");
      }

      const resourceType = isImage ? "image" : "video";
      const folder = isImage ? folders.images : folders.videos;

      // Upload options
      const uploadOptions = {
        folder: folder,
        resource_type: resourceType,
        transformation: options.transformation || [],
        ...options,
      };

      // Upload using stream
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
      });
    } catch (error) {
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  }

  /**
   * Delete file from Cloudinary
   */
  async deleteFile(publicId, resourceType = "image") {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });

      if (result.result !== "ok" && result.result !== "not found") {
        throw new Error("Failed to delete file from Cloudinary");
      }

      return result;
    } catch (error) {
      throw new Error(`Cloudinary delete failed: ${error.message}`);
    }
  }

  /**
   * Get file details from Cloudinary
   */
  async getFileDetails(publicId, resourceType = "image") {
    try {
      const result = await cloudinary.api.resource(publicId, {
        resource_type: resourceType,
      });
      return result;
    } catch (error) {
      throw new Error(`Failed to get file details: ${error.message}`);
    }
  }

  /**
   * Generate thumbnail for video
   */
  generateVideoThumbnail(publicId) {
    return cloudinary.url(publicId, {
      resource_type: "video",
      format: "jpg",
      transformation: [
        { width: 400, height: 300, crop: "fill" },
        { quality: "auto" },
      ],
    });
  }

  /**
   * Generate optimized image URL
   */
  generateOptimizedImageUrl(publicId, transformation = {}) {
    return cloudinary.url(publicId, {
      resource_type: "image",
      transformation: [
        { quality: "auto", fetch_format: "auto" },
        transformation,
      ],
    });
  }
}

module.exports = new CloudinaryService();
