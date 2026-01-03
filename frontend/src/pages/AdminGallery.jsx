import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "../components/AdminLayout";
import {
  uploadMedia,
  getAllMedia,
  deleteMedia,
  updateMedia,
} from "../services/mediaService";
import { toast } from "react-toastify";

const AdminGallery = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "other",
    tags: "",
  });

  useEffect(() => {
    fetchMedia();
  }, [filter, page]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const filters = {
        page,
        limit: 12,
        sortBy: "createdAt",
        sortOrder: "desc",
      };

      if (filter !== "all") filters.type = filter;

      const response = await getAllMedia(filters);
      setMedia(response.data.media || []);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error) {
      toast.error("Failed to load media");
      console.error("Error fetching media:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    // Create preview URLs
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Please provide a title");
      return;
    }

    setUploading(true);

    try {
      for (const file of selectedFiles) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        uploadFormData.append("title", formData.title);
        uploadFormData.append("description", formData.description);
        uploadFormData.append("category", formData.category);
        uploadFormData.append("tags", formData.tags);

        await uploadMedia(uploadFormData);
      }

      toast.success(`Successfully uploaded ${selectedFiles.length} file(s)!`);

      // Reset form
      setSelectedFiles([]);
      setPreviewUrls([]);
      setFormData({
        title: "",
        description: "",
        category: "other",
        tags: "",
      });

      // Clear file input
      const fileInput = document.getElementById("file-upload");
      if (fileInput) fileInput.value = "";

      // Refresh media list
      fetchMedia();
    } catch (error) {
      toast.error(error.message || "Upload failed");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this media?")) {
      return;
    }

    try {
      await deleteMedia(id);
      toast.success("Media deleted successfully");
      fetchMedia();
    } catch (error) {
      toast.error("Failed to delete media");
      console.error("Delete error:", error);
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await updateMedia(id, { isActive: !currentStatus });
      toast.success(
        `Media ${!currentStatus ? "activated" : "deactivated"} successfully`
      );
      fetchMedia();
    } catch (error) {
      toast.error("Failed to update media");
      console.error("Update error:", error);
    }
  };

  const clearPreviews = () => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    setSelectedFiles([]);
  };

  return (
    <AdminLayout title="Gallery Management">
      <div className="space-y-6">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-xl p-6 border border-neon-orange/20"
        >
          <h2 className="text-2xl font-bold mb-6 text-neon-orange font-rajdhani">
            Upload Media
          </h2>

          <form onSubmit={handleUpload} className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Images/Videos
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-neon-orange transition-colors"
              />
            </div>

            {/* Preview */}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {previewUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative bg-black rounded-lg overflow-hidden aspect-video"
                  >
                    {selectedFiles[index].type.startsWith("image") ? (
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <video
                        src={url}
                        className="w-full h-full object-contain"
                        controls
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-neon-orange transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-neon-orange transition-colors"
                >
                  <option value="event">Event</option>
                  <option value="sports">Sports</option>
                  <option value="ceremony">Ceremony</option>
                  <option value="participants">Participants</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-neon-orange transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder="zenith2026, sports, event"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-neon-orange transition-colors"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={uploading || selectedFiles.length === 0}
                className="flex-1 bg-gradient-to-r from-neon-orange to-orange-600 text-white py-3 px-6 rounded-lg font-bold hover:shadow-lg hover:shadow-neon-orange/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? "Uploading..." : "Upload to Cloudinary"}
              </button>

              {selectedFiles.length > 0 && (
                <button
                  type="button"
                  onClick={clearPreviews}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Filter Section */}
        <div className="flex gap-4">
          {["all", "image", "video"].map((type) => (
            <button
              key={type}
              onClick={() => {
                setFilter(type);
                setPage(1);
              }}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                filter === type
                  ? "bg-gradient-to-r from-neon-orange to-orange-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
              {type === "all" ? " Media" : "s"}
            </button>
          ))}
        </div>

        {/* Media Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-neon-orange"></div>
          </div>
        ) : media.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/50 rounded-xl">
            <p className="text-gray-400 text-xl">No media found</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {media.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-neon-orange/50 transition-all"
              >
                {/* Media Preview */}
                <div className="relative w-full aspect-video bg-black">
                  {item.type === "image" ? (
                    <img
                      src={item.secureUrl}
                      alt={item.title}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <video
                      src={item.secureUrl}
                      className="w-full h-full object-contain"
                      controls
                    />
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.isActive
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Media Info */}
                <div className="p-4">
                  <h3 className="text-white font-bold text-lg mb-1 truncate">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">
                      {item.category}
                    </span>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                      {item.type}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleToggleActive(item._id, item.isActive)
                      }
                      className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-semibold transition-colors"
                    >
                      {item.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-semibold transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-gray-800 rounded">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminGallery;
