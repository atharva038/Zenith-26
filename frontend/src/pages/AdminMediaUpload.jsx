import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import api from "../config/api";

const AdminMediaUpload = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedVideos, setUploadedVideos] = useState([]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/upload/asset/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data?.url) {
        toast.success(`Image uploaded successfully!`);
        setUploadedImages([...uploadedImages, { url: response.data.url, name: file.name, type: 'image' }]);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
      e.target.value = ''; // Reset input
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/upload/asset/video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data?.url) {
        toast.success(`Video uploaded successfully!`);
        setUploadedVideos([...uploadedVideos, { url: response.data.url, name: file.name, type: 'video' }]);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Video upload failed');
    } finally {
      setUploadingVideo(false);
      e.target.value = ''; // Reset input
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard!');
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
                <span className="font-semibold">Media Upload</span>
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
      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
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
                📤 Media Upload - Cloudinary
              </h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 max-w-6xl mx-auto">
          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 mb-8"
          >
            <h2 className="text-xl font-bold font-orbitron text-neon-blue mb-3">
              ℹ️ Upload Your Assets to Cloudinary
            </h2>
            <div className="text-gray-300 space-y-2 font-rajdhani">
              <p>• Upload intro videos, background images, and other media assets</p>
              <p>• Files are automatically stored in Cloudinary cloud storage</p>
              <p>• Copy the URL and use it in your frontend components</p>
              <p>• Images: zenith26/images/ | Videos: zenith26/videos/</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Upload */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-neon-blue/20 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold font-orbitron text-electric-cyan mb-4">
                🖼️ Upload Images
              </h3>
              <p className="text-gray-400 text-sm mb-4 font-rajdhani">
                Upload background images, logos, cyclone image, etc.
              </p>

              <div className="mb-6">
                <label className="block w-full">
                  <div className="border-2 border-dashed border-neon-blue/30 rounded-xl p-8 text-center hover:border-neon-blue/60 transition-all cursor-pointer bg-white/5">
                    {uploadingImage ? (
                      <div className="space-y-3">
                        <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-gray-300 font-rajdhani">Uploading image...</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-5xl">📸</div>
                        <p className="text-neon-blue font-semibold font-rajdhani">Click to upload image</p>
                        <p className="text-gray-400 text-sm font-rajdhani">JPG, PNG, WEBP (Max 10MB)</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </div>
                </label>
              </div>

              {/* Uploaded Images */}
              {uploadedImages.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-400 font-rajdhani">✅ Uploaded Images:</h4>
                  {uploadedImages.map((item, index) => (
                    <div key={index} className="bg-black/40 rounded-lg p-4 border border-green-500/30">
                      <img src={item.url} alt={item.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                      <p className="text-xs text-gray-400 mb-2 font-rajdhani truncate">{item.name}</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={item.url}
                          readOnly
                          className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded text-xs text-gray-300 font-mono"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => copyToClipboard(item.url)}
                          className="px-4 py-2 bg-neon-blue/20 text-neon-blue border border-neon-blue/30 rounded hover:bg-neon-blue/30 transition-all font-rajdhani text-xs font-semibold"
                        >
                          📋 Copy
                        </motion.button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Video Upload */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-neon-blue/20 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold font-orbitron text-electric-cyan mb-4">
                🎬 Upload Videos
              </h3>
              <p className="text-gray-400 text-sm mb-4 font-rajdhani">
                Upload intro video, promotional videos, etc.
              </p>

              <div className="mb-6">
                <label className="block w-full">
                  <div className="border-2 border-dashed border-purple-500/30 rounded-xl p-8 text-center hover:border-purple-500/60 transition-all cursor-pointer bg-white/5">
                    {uploadingVideo ? (
                      <div className="space-y-3">
                        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-gray-300 font-rajdhani">Uploading video...</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-5xl">🎥</div>
                        <p className="text-purple-400 font-semibold font-rajdhani">Click to upload video</p>
                        <p className="text-gray-400 text-sm font-rajdhani">MP4, MOV, WEBM (Max 100MB)</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      disabled={uploadingVideo}
                      className="hidden"
                    />
                  </div>
                </label>
              </div>

              {/* Uploaded Videos */}
              {uploadedVideos.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-400 font-rajdhani">✅ Uploaded Videos:</h4>
                  {uploadedVideos.map((item, index) => (
                    <div key={index} className="bg-black/40 rounded-lg p-4 border border-green-500/30">
                      <video src={item.url} controls className="w-full h-32 rounded-lg mb-3 bg-black" />
                      <p className="text-xs text-gray-400 mb-2 font-rajdhani truncate">{item.name}</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={item.url}
                          readOnly
                          className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded text-xs text-gray-300 font-mono"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => copyToClipboard(item.url)}
                          className="px-4 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded hover:bg-purple-500/30 transition-all font-rajdhani text-xs font-semibold"
                        >
                          📋 Copy
                        </motion.button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* How to Use */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold font-orbitron text-yellow-400 mb-4">
              💡 How to Use Uploaded URLs
            </h3>
            <div className="space-y-4 text-sm text-gray-300 font-rajdhani">
              <div>
                <p className="font-semibold text-white mb-2">For Images (in JSX/React):</p>
                <code className="block bg-black/60 p-3 rounded border border-white/10 text-green-400 font-mono text-xs">
                  &lt;img src="PASTE_CLOUDINARY_URL_HERE" alt="Description" /&gt;
                </code>
              </div>
              <div>
                <p className="font-semibold text-white mb-2">For Videos (in JSX/React):</p>
                <code className="block bg-black/60 p-3 rounded border border-white/10 text-green-400 font-mono text-xs">
                  &lt;video src="PASTE_CLOUDINARY_URL_HERE" controls /&gt;
                </code>
              </div>
              <div>
                <p className="font-semibold text-white mb-2">For Background Images (CSS):</p>
                <code className="block bg-black/60 p-3 rounded border border-white/10 text-green-400 font-mono text-xs">
                  backgroundImage: 'url(PASTE_CLOUDINARY_URL_HERE)'
                </code>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminMediaUpload;
