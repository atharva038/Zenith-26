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
export const uploadMedia = async (formData, onProgress) => {
  try {
    const response = await api.post("/media/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 180000, // 3 minutes timeout for large video uploads
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(`Upload progress: ${percentCompleted}%`);

        // Call progress callback if provided
        if (onProgress) {
          onProgress(percentCompleted);
        }
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading media:", error);

    // Provide more specific error messages
    if (error.code === "ECONNABORTED") {
      throw new Error(
        "Upload timeout - file may be too large or connection is slow"
      );
    }
    if (error.response) {
      // Server responded with error
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        `Upload failed (${error.response.status})`;
      throw new Error(message);
    }
    if (error.request) {
      // Request made but no response
      throw new Error("No response from server - check your connection");
    }
    // Other errors
    throw new Error(error.message || "Upload failed");
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
    const response = await api.put("/media/reorder", {mediaOrder});
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
