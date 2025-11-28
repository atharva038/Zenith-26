import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import axios from "axios";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadType, setUploadType] = useState("image");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("adminToken");
    const userData = localStorage.getItem("adminUser");

    if (!token || !userData) {
      navigate("/admin/login");
      return;
    }

    setUser(JSON.parse(userData));
    fetchMedia();
  }, [navigate]);

  const fetchMedia = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get("http://localhost:5000/api/media", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        // Check if data.media exists (paginated response) or use data directly
        const mediaData = response.data.data.media || response.data.data || [];
        setMedia(mediaData);
        console.log("Fetched media:", mediaData);
      }
    } catch (err) {
      console.error("Failed to fetch media:", err);
      alert("Failed to load media. Please check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("title", uploadTitle);
    formData.append("type", uploadType);

    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.post(
        "http://localhost:5000/api/media/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        alert("✅ Upload successful!");
        setUploadFile(null);
        setUploadTitle("");
        document.querySelector('input[type="file"]').value = "";
        await fetchMedia(); // Wait for fetch to complete
      }
    } catch (err) {
      console.error("Upload error:", err);
      const errorMsg =
        err.response?.data?.message || err.message || "Upload failed";
      alert(`❌ Upload failed: ${errorMsg}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`http://localhost:5000/api/media/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Deleted successfully!");
      fetchMedia();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#ffb36a] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0604] to-black text-white">
      {/* Header */}
      <header className="bg-[#1a0f08] border-b border-[#3a2416] px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f]">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 text-sm">
              Welcome, {user?.username || "Admin"}
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-[#2a1a11] hover:bg-[#3a2416] border border-[#3a2416] rounded-lg transition-colors"
            >
              View Site
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 border border-red-500 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Upload Section */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#2a1a11] to-[#1a0f08] rounded-2xl border-2 border-[#ffb36a] p-8 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-[#ffb36a]">
            Upload Media
          </h2>
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#1a0f08] border border-[#3a2416] rounded-lg text-white focus:outline-none focus:border-[#ffb36a] transition-colors"
                  placeholder="Enter title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Type
                </label>
                <select
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value)}
                  className="w-full px-4 py-3 bg-[#1a0f08] border border-[#3a2416] rounded-lg text-white focus:outline-none focus:border-[#ffb36a] transition-colors"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                File
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                accept={uploadType === "image" ? "image/*" : "video/*"}
                required
                className="w-full px-4 py-3 bg-[#1a0f08] border border-[#3a2416] rounded-lg text-white focus:outline-none focus:border-[#ffb36a] transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#ffb36a] file:text-[#2c1506] file:font-semibold hover:file:bg-[#ffc280]"
              />
            </div>
            <button
              type="submit"
              disabled={uploading}
              className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] hover:from-[#ffc280] hover:to-[#ffa040] text-[#2c1506] font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </form>
        </Motion.div>

        {/* Media Gallery */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#ffb36a]">Media Gallery</h2>
            <div className="flex gap-4">
              <div className="bg-[#2a1a11] border border-[#3a2416] px-4 py-2 rounded-lg">
                <span className="text-gray-400 text-sm">Total: </span>
                <span className="text-[#ffb36a] font-bold text-lg">
                  {media.length}
                </span>
              </div>
              <div className="bg-[#2a1a11] border border-[#3a2416] px-4 py-2 rounded-lg">
                <span className="text-gray-400 text-sm">Images: </span>
                <span className="text-blue-400 font-bold text-lg">
                  {media.filter((m) => m.type === "image").length}
                </span>
              </div>
              <div className="bg-[#2a1a11] border border-[#3a2416] px-4 py-2 rounded-lg">
                <span className="text-gray-400 text-sm">Videos: </span>
                <span className="text-purple-400 font-bold text-lg">
                  {media.filter((m) => m.type === "video").length}
                </span>
              </div>
            </div>
          </div>
          {media.length === 0 ? (
            <div className="text-center py-20 bg-gradient-to-br from-[#2a1a11] to-[#1a0f08] rounded-xl border-2 border-dashed border-[#3a2416]">
              <div className="text-6xl mb-4">📁</div>
              <p className="text-gray-400 text-lg">No media uploaded yet</p>
              <p className="text-gray-500 text-sm mt-2">
                Upload your first image or video above
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {media.map((item) => (
                <div
                  key={item._id}
                  className="bg-gradient-to-br from-[#2a1a11] to-[#1a0f08] rounded-xl border-2 border-[#3a2416] hover:border-[#ffb36a] overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {/* Media Preview */}
                  <div className="aspect-video bg-black relative">
                    {item.type === "image" ? (
                      <img
                        src={item.secureUrl || item.url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error("Image load error:", item);
                          e.target.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23333' width='400' height='300'/%3E%3Ctext fill='%23fff' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImage Error%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    ) : (
                      <video
                        src={item.secureUrl || item.url}
                        controls
                        className="w-full h-full object-cover"
                        onError={() => {
                          console.error("Video load error:", item);
                        }}
                      >
                        Your browser does not support the video tag.
                      </video>
                    )}
                    {/* Type Badge */}
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                      {item.type === "image" ? "📷 IMAGE" : "🎥 VIDEO"}
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-4">
                    <h3
                      className="text-lg font-semibold text-white mb-2 truncate"
                      title={item.title}
                    >
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-col text-xs text-gray-500">
                        <span>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                        {item.size && (
                          <span>{(item.size / 1024 / 1024).toFixed(2)} MB</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 border border-red-500 rounded-lg text-sm font-semibold transition-all hover:scale-105"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Motion.div>
      </main>
    </div>
  );
}
