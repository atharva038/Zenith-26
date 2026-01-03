import Media from "../models/media.js";
import cloudinary from "../config/cloudinary.js";
import {
  allowedImageTypes,
  allowedVideoTypes,
  folders,
} from "../config/media.js";

/**
 * Upload media to Cloudinary and save to database
 */
export const uploadMedia = async (file, metadata, uploadedBy) => {
  try {
    // Determine media type and folder
    const isImage = allowedImageTypes.includes(file.mimetype);
    const isVideo = allowedVideoTypes.includes(file.mimetype);

    if (!isImage && !isVideo) {
      throw new Error("Invalid file type");
    }

    const resourceType = isImage ? "image" : "video";
    const folder = isImage ? folders.images : folders.videos;

    // Upload to Cloudinary with optimization - NO CROPPING, PRESERVE QUALITY
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          folder: folder,
          // Optimized transformations for BEST quality without cropping
          transformation: isImage
            ? [
                { quality: "auto:best", fetch_format: "auto" },
                { flags: "preserve_transparency" },
                // No crop or resize - preserve original dimensions
              ]
            : [
                { quality: "auto:best" },
                { video_codec: "auto" },
                // No resize - preserve original video quality
              ],
          // Additional settings for quality preservation
          ...(isImage && {
            invalidate: true,
            use_filename: true,
            unique_filename: true,
          }),
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(file.buffer);
    });

    // Get the highest order value and increment
    const highestOrderMedia = await Media.findOne()
      .sort({ order: -1 })
      .select("order");
    const newOrder = highestOrderMedia ? highestOrderMedia.order + 1 : 0;

    // Create media document
    const media = await Media.create({
      title: metadata.title,
      description: metadata.description,
      type: resourceType,
      cloudinaryId: uploadResult.public_id,
      url: uploadResult.url,
      secureUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      format: uploadResult.format,
      resourceType: uploadResult.resource_type,
      size: uploadResult.bytes,
      width: uploadResult.width,
      height: uploadResult.height,
      duration: uploadResult.duration,
      thumbnail: isVideo
        ? uploadResult.url.replace(/\.[^.]+$/, ".jpg")
        : undefined,
      tags: metadata.tags
        ? metadata.tags.split(",").map((tag) => tag.trim())
        : [],
      category: metadata.category || "other",
      uploadedBy,
      order: newOrder,
    });

    return media;
  } catch (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }
};

/**
 * Get all media with filters and pagination
 */
export const getAllMedia = async (filters, options) => {
  try {
    const query = { isActive: true };

    // Apply filters
    if (filters.type) query.type = filters.type;
    if (filters.category) query.category = filters.category;
    if (filters.isActive !== undefined)
      query.isActive = filters.isActive === "true";
    if (filters.tags) query.tags = { $in: filters.tags.split(",") };
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: "i" } },
        { description: { $regex: filters.search, $options: "i" } },
      ];
    }

    // Pagination
    const page = parseInt(options.page) || 1;
    const limit = parseInt(options.limit) || 10;
    const skip = (page - 1) * limit;

    // Sorting
    const sortBy = options.sortBy || "order";
    const sortOrder = options.sortOrder === "desc" ? -1 : 1;
    const sort = { [sortBy]: sortOrder };

    // Execute query
    const media = await Media.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("uploadedBy", "name email");

    const total = await Media.countDocuments(query);

    return {
      media,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    };
  } catch (error) {
    throw new Error(`Failed to retrieve media: ${error.message}`);
  }
};

/**
 * Get media by ID
 */
export const getMediaById = async (id) => {
  try {
    const media = await Media.findById(id).populate("uploadedBy", "name email");

    if (!media) {
      throw new Error("Media not found");
    }

    return media;
  } catch (error) {
    throw new Error(`Failed to retrieve media: ${error.message}`);
  }
};

/**
 * Update media metadata
 */
export const updateMedia = async (id, updateData) => {
  try {
    // Process tags if provided
    if (updateData.tags && typeof updateData.tags === "string") {
      updateData.tags = updateData.tags.split(",").map((tag) => tag.trim());
    }

    const media = await Media.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!media) {
      throw new Error("Media not found");
    }

    return media;
  } catch (error) {
    throw new Error(`Failed to update media: ${error.message}`);
  }
};

/**
 * Delete media from database and Cloudinary
 */
export const deleteMedia = async (id) => {
  try {
    const media = await Media.findById(id);

    if (!media) {
      throw new Error("Media not found");
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(media.publicId, {
      resource_type: media.resourceType,
    });

    // Delete from database
    await Media.findByIdAndDelete(id);

    return { message: "Media deleted successfully" };
  } catch (error) {
    throw new Error(`Failed to delete media: ${error.message}`);
  }
};

/**
 * Get media statistics
 */
export const getMediaStats = async () => {
  try {
    const totalMedia = await Media.countDocuments();
    const totalImages = await Media.countDocuments({ type: "image" });
    const totalVideos = await Media.countDocuments({ type: "video" });
    const activeMedia = await Media.countDocuments({ isActive: true });
    const inactiveMedia = await Media.countDocuments({ isActive: false });

    // Category breakdown
    const categoryStats = await Media.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    // Total storage used
    const storageStats = await Media.aggregate([
      { $group: { _id: null, totalSize: { $sum: "$size" } } },
    ]);

    return {
      total: totalMedia,
      images: totalImages,
      videos: totalVideos,
      active: activeMedia,
      inactive: inactiveMedia,
      byCategory: categoryStats,
      totalStorage: storageStats[0]?.totalSize || 0,
    };
  } catch (error) {
    throw new Error(`Failed to get statistics: ${error.message}`);
  }
};

/**
 * Reorder media items (for drag and drop)
 */
export const reorderMedia = async (mediaOrder) => {
  try {
    const bulkOperations = mediaOrder.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { order: item.order } },
      },
    }));

    const result = await Media.bulkWrite(bulkOperations);

    return {
      updatedCount: result.modifiedCount,
      mediaOrder: mediaOrder,
    };
  } catch (error) {
    throw new Error(`Failed to reorder media: ${error.message}`);
  }
};
