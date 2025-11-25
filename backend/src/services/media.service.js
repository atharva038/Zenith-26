const Media = require("../models/Media");
const cloudinaryService = require("./cloudinary.service");
const { allowedImageTypes, allowedVideoTypes } = require("../config/upload");

class MediaService {
  /**
   * Upload media file
   */
  async uploadMedia(file, metadata, userId) {
    try {
      const { title, description, tags, category } = metadata;

      // Determine media type
      const isImage = allowedImageTypes.includes(file.mimetype);
      const type = isImage ? "image" : "video";

      // Upload to Cloudinary
      const uploadResult = await cloudinaryService.uploadFile(
        file.buffer,
        file.mimetype,
        {
          tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
        }
      );

      // Prepare media data
      const mediaData = {
        title,
        description,
        type,
        cloudinaryId: uploadResult.public_id,
        url: uploadResult.url,
        secureUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        format: uploadResult.format,
        resourceType: uploadResult.resource_type,
        size: uploadResult.bytes,
        width: uploadResult.width,
        height: uploadResult.height,
        tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
        category: category || "other",
        uploadedBy: userId,
      };

      // Add duration and thumbnail for videos
      if (type === "video") {
        mediaData.duration = uploadResult.duration;
        mediaData.thumbnail = cloudinaryService.generateVideoThumbnail(
          uploadResult.public_id
        );
      }

      // Save to database
      const media = await Media.create(mediaData);

      return media;
    } catch (error) {
      throw new Error(`Failed to upload media: ${error.message}`);
    }
  }

  /**
   * Get all media with filtering and pagination
   */
  async getAllMedia(filters = {}, options = {}) {
    try {
      const { type, category, isActive = true, tags, search } = filters;

      const {
        page = 1,
        limit = 20,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = options;

      // Build query
      const query = { isActive };

      if (type) query.type = type;
      if (category) query.category = category;
      if (tags) query.tags = { $in: tags.split(",") };

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      // Calculate pagination
      const skip = (page - 1) * limit;
      const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

      // Execute query
      const [media, total] = await Promise.all([
        Media.find(query)
          .populate("uploadedBy", "username email")
          .sort(sort)
          .skip(skip)
          .limit(parseInt(limit)),
        Media.countDocuments(query),
      ]);

      return {
        media,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          limit: parseInt(limit),
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch media: ${error.message}`);
    }
  }

  /**
   * Get media by ID
   */
  async getMediaById(mediaId) {
    try {
      const media = await Media.findById(mediaId).populate(
        "uploadedBy",
        "username email"
      );

      if (!media) {
        throw new Error("Media not found");
      }

      return media;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update media metadata
   */
  async updateMedia(mediaId, updateData) {
    try {
      const media = await Media.findById(mediaId);

      if (!media) {
        throw new Error("Media not found");
      }

      // Update allowed fields
      if (updateData.title) media.title = updateData.title;
      if (updateData.description) media.description = updateData.description;
      if (updateData.category) media.category = updateData.category;
      if (updateData.tags) {
        media.tags =
          typeof updateData.tags === "string"
            ? updateData.tags.split(",").map((tag) => tag.trim())
            : updateData.tags;
      }
      if (updateData.isActive !== undefined)
        media.isActive = updateData.isActive;

      await media.save();

      return media;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete media
   */
  async deleteMedia(mediaId) {
    try {
      const media = await Media.findById(mediaId);

      if (!media) {
        throw new Error("Media not found");
      }

      // Delete from Cloudinary
      await cloudinaryService.deleteFile(media.publicId, media.resourceType);

      // Delete from database
      await Media.findByIdAndDelete(mediaId);

      return { message: "Media deleted successfully" };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get media statistics
   */
  async getMediaStats() {
    try {
      const [totalImages, totalVideos, totalSize, recentMedia] =
        await Promise.all([
          Media.countDocuments({ type: "image", isActive: true }),
          Media.countDocuments({ type: "video", isActive: true }),
          Media.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: null, totalSize: { $sum: "$size" } } },
          ]),
          Media.find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(5)
            .select("title type createdAt thumbnail secureUrl"),
        ]);

      return {
        totalImages,
        totalVideos,
        totalMedia: totalImages + totalVideos,
        totalSize: totalSize[0]?.totalSize || 0,
        recentMedia,
      };
    } catch (error) {
      throw new Error(`Failed to fetch stats: ${error.message}`);
    }
  }
}

module.exports = new MediaService();
