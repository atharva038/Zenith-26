import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  uploadMedia,
  getAllMedia,
  deleteMedia,
} from "../services/mediaService";
import AdminSidebar from "../components/AdminSidebar";

const AdminMediaUpload = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "event",
    tags: "",
  });

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const response = await getAllMedia({
        page: 1,
        limit: 50,
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      setUploadedMedia(response.data.media);
    } catch (error) {
      console.error("Error fetching media:", error);
      toast.error("Failed to load media");
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    // Validate file type
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      toast.error("Please upload only images or videos");
      return;
    }

    // Validate file size (max 100MB for videos, 10MB for images)
    const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`File too large. Max size: ${isVideo ? "100MB" : "10MB"}`);
      return;
    }

    // Validate form data
    if (!formData.title.trim()) {
      toast.error("Please enter a title before uploading");
      return;
    }

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("title", formData.title);
      uploadFormData.append("description", formData.description);
      uploadFormData.append("category", formData.category);
      uploadFormData.append("tags", formData.tags);

      const response = await uploadMedia(uploadFormData);

      toast.success(`${isImage ? "Image" : "Video"} uploaded successfully!`);

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "event",
        tags: "",
      });

      // Refresh media list
      fetchMedia();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this media?")) return;

    try {
      await deleteMedia(id);
      toast.success("Media deleted successfully");
      fetchMedia();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete media");
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard!");
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a18] to-black text-white">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl border-r border-neon-blue/20 z-50"
          >
            <div className="p-6 border-b border-gray-700/50">
              <Link to="/admin/dashboard">
                <h2 className="text-2xl font-bold font-orbitron bg-gradient-to-r from-neon-blue to-electric-cyan bg-clip-text text-transparent">
                  ZENITH 2026
                </h2>
              </Link>
              <p className="text-gray-400 text-sm mt-1">Admin Portal</p>
            </div>

            <nav className="p-4 space-y-2">
              <motion.button
                onClick={() => navigate("/admin/dashboard")}
                whileHover={{ x: 5 }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all font-rajdhani text-gray-400 hover:text-white hover:bg-white/5"
              >
                <span className="text-xl">📊</span>
                <span className="font-semibold">Dashboard</span>
              </motion.button>

              <motion.button
                onClick={() => navigate("/admin/events")}
                whileHover={{ x: 5 }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all font-rajdhani text-gray-400 hover:text-white hover:bg-white/5"
              >
                <span className="text-xl">🎮</span>
                <span className="font-semibold">Events</span>
              </motion.button>

              <motion.button
                onClick={() => navigate("/admin/marathon")}
                whileHover={{ x: 5 }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all font-rajdhani text-gray-400 hover:text-white hover:bg-white/5"
              >
                <span className="text-xl">🏃</span>
                <span className="font-semibold">Marathon</span>
              </motion.button>

              <motion.button
                onClick={() => navigate("/admin/media-upload")}
                whileHover={{ x: 5 }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all font-rajdhani bg-gradient-to-r from-neon-blue/20 to-electric-cyan/20 border border-neon-blue/50 text-white"
              >
                <span className="text-xl">📤</span>
                <span className="font-semibold">Gallery Upload</span>
              </motion.button>
            </nav>

            <div className="absolute bottom-6 left-0 right-0 px-4">
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-3 bg-red-600/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-600/30 transition-all font-rajdhani font-semibold"
              >
                🚪 Logout
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Top Bar */}
        <div className="sticky top-0 z-40 bg-black/40 backdrop-blur-xl border-b border-neon-blue/20">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
              >
                <span className="text-2xl">☰</span>
              </motion.button>
              <h1 className="text-2xl font-bold font-orbitron bg-gradient-to-r from-neon-blue to-electric-cyan bg-clip-text text-transparent">
                📤 Gallery Media Management
              </h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 max-w-7xl mx-auto">
          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 mb-8"
          >
            <h2 className="text-xl font-bold font-orbitron text-neon-blue mb-3">
              ℹ️ Media Upload Guidelines
            </h2>
            <div className="text-gray-300 space-y-2 font-rajdhani">
              <p>✨ Upload images and videos for the Gallery page</p>
              <p>📦 Files are stored in Cloudinary with auto-optimization</p>
              <p>🎯 URLs are saved in MongoDB for instant frontend access</p>
              <p>🖼️ Images: Max 10MB | Videos: Max 100MB</p>
              <p>
                🚀 No cropping, full quality preservation with object-fit:
                contain
              </p>
            </div>
          </motion.div>

          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-neon-blue/30 rounded-2xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold font-orbitron text-electric-cyan mb-6">
              Upload New Media
            </h2>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold font-rajdhani text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter media title"
                  className="w-full px-4 py-3 bg-black/50 border border-neon-blue/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold font-rajdhani text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-black/50 border border-neon-blue/30 rounded-lg text-white focus:outline-none focus:border-neon-blue transition-all"
                >
                  <option value="event">Event</option>
                  <option value="sports">Sports</option>
                  <option value="ceremony">Ceremony</option>
                  <option value="participants">Participants</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold font-rajdhani text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter description (optional)"
                  rows="3"
                  className="w-full px-4 py-3 bg-black/50 border border-neon-blue/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold font-rajdhani text-gray-300 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="e.g., gaming, tournament, finals"
                  className="w-full px-4 py-3 bg-black/50 border border-neon-blue/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-all"
                />
              </div>
            </div>

            {/* Drag and Drop Area */}
            <div
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                dragActive
                  ? "border-neon-blue bg-neon-blue/10"
                  : "border-gray-600 hover:border-neon-blue/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept="image/*,video/*"
                className="hidden"
                id="fileInput"
                disabled={uploading}
              />

              {uploading ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xl font-semibold text-neon-blue">
                    Uploading to Cloudinary...
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-6xl mb-4">📁</div>
                  <p className="text-xl font-semibold text-gray-300 mb-2">
                    Drag & Drop your file here
                  </p>
                  <p className="text-gray-500 mb-4">or</p>
                  <label
                    htmlFor="fileInput"
                    className="inline-block px-8 py-3 bg-gradient-to-r from-neon-blue to-electric-cyan rounded-lg font-bold cursor-pointer hover:scale-105 transition-transform"
                  >
                    Browse Files
                  </label>
                  <p className="text-gray-500 text-sm mt-4">
                    Supports: Images (JPG, PNG, WebP) & Videos (MP4, WebM, MOV)
                  </p>
                </>
              )}
            </div>
          </motion.div>

          {/* Uploaded Media Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-neon-blue/30 rounded-2xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold font-orbitron text-electric-cyan">
                Uploaded Media ({uploadedMedia.length})
              </h2>
              <button
                onClick={fetchMedia}
                className="px-4 py-2 bg-neon-blue/20 border border-neon-blue/50 rounded-lg hover:bg-neon-blue/30 transition-all"
              >
                🔄 Refresh
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : uploadedMedia.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <p className="text-xl">No media uploaded yet</p>
                <p className="text-sm mt-2">
                  Start by uploading your first image or video above
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {uploadedMedia.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-black/50 border border-gray-700 rounded-xl overflow-hidden hover:border-neon-blue/50 transition-all group"
                  >
                    {/* Media Preview */}
                    <div className="relative aspect-video bg-black">
                      {item.type === "image" ? (
                        <img
                          src={item.secureUrl}
                          alt={item.title}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <div className="relative w-full h-full">
                          <video
                            src={item.secureUrl}
                            className="w-full h-full object-contain"
                            controls
                          />
                        </div>
                      )}

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="absolute top-2 right-2 p-2 bg-red-600/80 hover:bg-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                      >
                        🗑️
                      </button>
                    </div>

                    {/* Media Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-white mb-1 truncate">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-1 bg-neon-blue/20 text-neon-blue text-xs rounded">
                          {item.type}
                        </span>
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">
                          {item.category}
                        </span>
                      </div>

                      {/* URL Copy */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item.secureUrl}
                          readOnly
                          className="flex-1 px-3 py-2 bg-black/50 border border-gray-600 rounded text-xs text-gray-400 truncate"
                        />
                        <button
                          onClick={() => copyToClipboard(item.secureUrl)}
                          className="px-3 py-2 bg-neon-blue/20 border border-neon-blue/50 rounded hover:bg-neon-blue/30 transition-all text-sm"
                        >
                          📋
                        </button>
                      </div>

                      <p className="text-gray-500 text-xs mt-2">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminMediaUpload;
