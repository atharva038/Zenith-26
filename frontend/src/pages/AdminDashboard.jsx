import { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { authAPI, mediaAPI } from "../services/api";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [loading, setLoading] = useState(true);
  const [media, setMedia] = useState([]);
  const [filterType, setFilterType] = useState("");
  const navigate = useNavigate();

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    file: null,
    title: "",
    description: "",
    category: "event",
    tags: "",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    checkAuth();
    loadStats();
    if (activeTab === "gallery") {
      loadMedia();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeTab === "gallery") {
      loadMedia();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, filterType]);

  const checkAuth = async () => {
    try {
      const response = await authAPI.getProfile();
      if (response.success) {
        setUser(response.data.user);
      }
    } catch {
      navigate("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await mediaAPI.getStats();
      if (response.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const loadMedia = async () => {
    try {
      const filters = filterType ? { type: filterType } : {};
      const response = await mediaAPI.getAll(filters);
      if (response.success) {
        setMedia(response.data.media);
      }
    } catch (error) {
      console.error("Failed to load media:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/admin/login");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadForm({ ...uploadForm, file });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    setUploadSuccess("");
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", uploadForm.file);
      formData.append("title", uploadForm.title);
      formData.append("description", uploadForm.description);
      formData.append("category", uploadForm.category);
      formData.append("tags", uploadForm.tags);

      const response = await mediaAPI.upload(formData);

      if (response.success) {
        setUploadSuccess("Media uploaded successfully! 🎉");
        setUploadForm({
          file: null,
          title: "",
          description: "",
          category: "event",
          tags: "",
        });
        // Reset file input
        document.getElementById("fileInput").value = "";
        loadStats();
        setTimeout(() => setUploadSuccess(""), 5000);
      }
    } catch (error) {
      setUploadError(error.message || "Upload failed");
      setTimeout(() => setUploadError(""), 5000);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this media?")) return;

    try {
      await mediaAPI.delete(id);
      loadMedia();
      loadStats();
    } catch {
      alert("Failed to delete media");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-white font-rajdhani text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-orbitron text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-blue-500">
                ZENITH 2026 Admin
              </h1>
              <p className="text-gray-300 font-rajdhani mt-1">
                Welcome, {user?.username} 👋
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/"
                className="text-gray-300 hover:text-white font-rajdhani transition-colors"
              >
                View Site
              </a>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-rajdhani font-semibold px-6 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white"
            >
              <div className="text-4xl font-bold font-orbitron mb-2">
                {stats.totalImages}
              </div>
              <div className="font-rajdhani text-lg">Total Images</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white"
            >
              <div className="text-4xl font-bold font-orbitron mb-2">
                {stats.totalVideos}
              </div>
              <div className="font-rajdhani text-lg">Total Videos</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-6 text-white"
            >
              <div className="text-4xl font-bold font-orbitron mb-2">
                {stats.totalMedia}
              </div>
              <div className="font-rajdhani text-lg">Total Media</div>
            </motion.div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
          <div className="border-b border-white/20">
            <div className="flex">
              <button
                onClick={() => setActiveTab("upload")}
                className={`flex-1 py-4 px-6 font-rajdhani font-semibold transition-colors ${
                  activeTab === "upload"
                    ? "bg-blue-500 text-white"
                    : "text-gray-300 hover:bg-white/5"
                }`}
              >
                📤 Upload Media
              </button>
              <button
                onClick={() => setActiveTab("gallery")}
                className={`flex-1 py-4 px-6 font-rajdhani font-semibold transition-colors ${
                  activeTab === "gallery"
                    ? "bg-blue-500 text-white"
                    : "text-gray-300 hover:bg-white/5"
                }`}
              >
                🖼️ Gallery
              </button>
            </div>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === "upload" && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {uploadSuccess && (
                    <div className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded-lg mb-6">
                      {uploadSuccess}
                    </div>
                  )}

                  {uploadError && (
                    <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
                      {uploadError}
                    </div>
                  )}

                  <form onSubmit={handleUpload} className="space-y-6">
                    <div>
                      <label className="block text-gray-300 font-rajdhani text-sm font-semibold mb-2">
                        Select File (Image or Video)
                      </label>
                      <input
                        id="fileInput"
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600 file:cursor-pointer"
                      />
                      {uploadForm.file && (
                        <p className="text-gray-400 text-sm mt-2">
                          Selected: {uploadForm.file.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-300 font-rajdhani text-sm font-semibold mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={uploadForm.title}
                        onChange={(e) =>
                          setUploadForm({
                            ...uploadForm,
                            title: e.target.value,
                          })
                        }
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Enter media title"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-rajdhani text-sm font-semibold mb-2">
                        Description
                      </label>
                      <textarea
                        value={uploadForm.description}
                        onChange={(e) =>
                          setUploadForm({
                            ...uploadForm,
                            description: e.target.value,
                          })
                        }
                        rows="3"
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Enter description (optional)"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 font-rajdhani text-sm font-semibold mb-2">
                          Category
                        </label>
                        <select
                          value={uploadForm.category}
                          onChange={(e) =>
                            setUploadForm({
                              ...uploadForm,
                              category: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                        >
                          <option value="event">Event</option>
                          <option value="sports">Sports</option>
                          <option value="ceremony">Ceremony</option>
                          <option value="participants">Participants</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-300 font-rajdhani text-sm font-semibold mb-2">
                          Tags
                        </label>
                        <input
                          type="text"
                          value={uploadForm.tags}
                          onChange={(e) =>
                            setUploadForm({
                              ...uploadForm,
                              tags: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                          placeholder="cricket, final, 2026"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={uploading}
                      className="w-full bg-gradient-to-r from-orange-500 to-blue-600 text-white font-rajdhani font-bold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading ? "Uploading..." : "Upload Media"}
                    </button>
                  </form>
                </motion.div>
              )}

              {activeTab === "gallery" && (
                <motion.div
                  key="gallery"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="mb-6">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="">All Media</option>
                      <option value="image">Images Only</option>
                      <option value="video">Videos Only</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {media.map((item) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/5 border border-white/20 rounded-xl overflow-hidden hover:border-blue-500 transition-colors"
                      >
                        {item.type === "video" ? (
                          <video
                            src={item.secureUrl}
                            controls
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <img
                            src={item.secureUrl}
                            alt={item.title}
                            className="w-full h-48 object-cover"
                          />
                        )}
                        <div className="p-4">
                          <h3 className="text-white font-rajdhani font-bold text-lg mb-2">
                            {item.title}
                          </h3>
                          <p className="text-gray-400 text-sm mb-2">
                            {item.description || "No description"}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                            <span>{item.category}</span>
                            <span>
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="w-full bg-red-500 hover:bg-red-600 text-white font-rajdhani font-semibold py-2 rounded-lg transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {media.length === 0 && (
                    <div className="text-center text-gray-400 font-rajdhani text-lg py-12">
                      No media found. Start by uploading some content! 📤
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
