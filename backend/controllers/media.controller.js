import * as mediaService from "../services/media.service.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";

/**
 * @desc    Upload media file
 * @route   POST /api/media/upload
 * @access  Private/Admin
 */
export const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, "Please upload a file", 400);
    }

    const metadata = {
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags,
      category: req.body.category,
    };

    // Support both req.user and req.admin for authentication
    const uploadedBy =
      req.user?.id || req.user?._id || req.admin?.id || req.admin?._id;

    if (!uploadedBy) {
      return errorResponse(res, "Authentication required", 401);
    }

    const media = await mediaService.uploadMedia(
      req.file,
      metadata,
      uploadedBy
    );

    successResponse(res, { media }, "Media uploaded successfully", 201);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

/**
 * @desc    Get all media
 * @route   GET /api/media
 * @access  Public
 */
export const getAllMedia = async (req, res, next) => {
  try {
    const filters = {
      type: req.query.type,
      category: req.query.category,
      isActive: req.query.isActive,
      tags: req.query.tags,
      search: req.query.search,
    };

    const options = {
      page: req.query.page,
      limit: req.query.limit,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
    };

    const result = await mediaService.getAllMedia(filters, options);

    successResponse(res, result, "Media retrieved successfully", 200);
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

/**
 * @desc    Get media by ID
 * @route   GET /api/media/:id
 * @access  Public
 */
export const getMediaById = async (req, res, next) => {
  try {
    const media = await mediaService.getMediaById(req.params.id);

    successResponse(res, { media }, "Media retrieved successfully", 200);
  } catch (error) {
    errorResponse(res, error.message, 404);
  }
};

/**
 * @desc    Update media metadata
 * @route   PUT /api/media/:id
 * @access  Private/Admin
 */
export const updateMedia = async (req, res, next) => {
  try {
    const updateData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      tags: req.body.tags,
      isActive: req.body.isActive,
    };

    const media = await mediaService.updateMedia(req.params.id, updateData);

    successResponse(res, { media }, "Media updated successfully", 200);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

/**
 * @desc    Delete media
 * @route   DELETE /api/media/:id
 * @access  Private/Admin
 */
export const deleteMedia = async (req, res, next) => {
  try {
    await mediaService.deleteMedia(req.params.id);

    successResponse(res, null, "Media deleted successfully", 200);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

/**
 * @desc    Get media statistics
 * @route   GET /api/media/stats
 * @access  Private/Admin
 */
export const getMediaStats = async (req, res, next) => {
  try {
    const stats = await mediaService.getMediaStats();

    successResponse(res, { stats }, "Statistics retrieved successfully", 200);
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

/**
 * @desc    Reorder media items (Drag and Drop)
 * @route   PUT /api/media/reorder
 * @access  Private/Admin
 * @body    { mediaOrder: [{ id: "mediaId", order: 1 }, ...] }
 */
export const reorderMedia = async (req, res, next) => {
  try {
    const { mediaOrder } = req.body;

    // Validate input
    if (!Array.isArray(mediaOrder) || mediaOrder.length === 0) {
      return errorResponse(
        res,
        "Invalid media order data. Expected array of { id, order }",
        400
      );
    }

    // Validate each item in the array
    for (const item of mediaOrder) {
      if (!item.id || typeof item.order !== "number") {
        return errorResponse(
          res,
          "Each item must have 'id' and 'order' properties",
          400
        );
      }
    }

    const result = await mediaService.reorderMedia(mediaOrder);

    successResponse(
      res,
      { updatedCount: result.updatedCount, mediaOrder: result.mediaOrder },
      "Media reordered successfully",
      200
    );
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};
