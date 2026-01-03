import api from "../config/api";

/**
 * Media API Service
 * Handles all media-related API calls
 */

// Get all media with filters and pagination
export const getAllMedia = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.type) params.append("type", filters.type);
    if (filters.category) params.append("category", filters.category);
    if (filters.tags) params.append("tags", filters.tags);
    if (filters.search) params.append("search", filters.search);
    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit);
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

    const response = await api.get(`/media?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching media:", error);
    throw error.response?.data || error;
  }
};

// Get single media by ID
export const getMediaById = async (id) => {
  try {
    const response = await api.get(`/media/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching media by ID:", error);
    throw error.response?.data || error;
  }
};

// Upload media file (Admin only)
export const uploadMedia = async (formData) => {
  try {
    const response = await api.post("/media/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 120000, // 2 minutes timeout for file uploads
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading media:", error);
    throw error.response?.data || error;
  }
};

// Update media metadata (Admin only)
export const updateMedia = async (id, data) => {
  try {
    const response = await api.put(`/media/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating media:", error);
    throw error.response?.data || error;
  }
};

// Delete media (Admin only)
export const deleteMedia = async (id) => {
  try {
    const response = await api.delete(`/media/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting media:", error);
    throw error.response?.data || error;
  }
};

// Reorder media items (Admin only)
export const reorderMedia = async (mediaOrder) => {
  try {
    const response = await api.put("/media/reorder", { mediaOrder });
    return response.data;
  } catch (error) {
    console.error("Error reordering media:", error);
    throw error.response?.data || error;
  }
};

// Get media statistics (Admin only)
export const getMediaStats = async () => {
  try {
    const response = await api.get("/media/admin/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching media stats:", error);
    throw error.response?.data || error;
  }
};

export default {
  getAllMedia,
  getMediaById,
  uploadMedia,
  updateMedia,
  deleteMedia,
  reorderMedia,
  getMediaStats,
};
