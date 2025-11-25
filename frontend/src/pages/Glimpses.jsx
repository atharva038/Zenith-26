import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import axios from "axios";

export default function Glimpses() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/media");
      if (response.data.success) {
        const mediaData = response.data.data.media || response.data.data || [];
        setMedia(mediaData);
      }
    } catch (err) {
      console.error("Failed to fetch media:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMedia = media.filter((item) => {
    if (filter === "all") return true;
    return item.type === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#ffb36a] text-2xl">Loading glimpses...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0604] to-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 px-9 py-5 flex justify-between items-center z-[600] bg-black/10 backdrop-blur-md">
        <Link
          to="/home"
          className="text-[#ffb77a] font-bold text-xl tracking-wide"
          style={{ textShadow: "0 2px 12px rgba(255,140,40,0.18)" }}
        >
          Zenith 2026
        </Link>
        <Link
          to="/home"
          className="text-[#ffb77a] font-semibold hover:text-[#ffd4a8] transition-colors"
        >
          ← Back to Home
        </Link>
      </nav>

      {/* Header */}
      <Motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="pt-32 pb-12 px-6 text-center"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f]">
          📸 Glimpses of Zenith
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Relive the moments, celebrate the memories
        </p>
      </Motion.div>

      {/* Filter Tabs */}
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex justify-center gap-4 px-6 mb-12"
      >
        {[
          { label: "All", value: "all", icon: "🎯" },
          { label: "Images", value: "image", icon: "📷" },
          { label: "Videos", value: "video", icon: "🎥" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              filter === tab.value
                ? "bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] text-[#2c1506] scale-105"
                : "bg-[#2a1a11] border border-[#3a2416] text-gray-300 hover:border-[#ffb36a]"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </Motion.div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-[#2a1a11] to-[#1a0f08] border border-[#3a2416] rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-[#ffb36a]">
              {media.length}
            </div>
            <div className="text-sm text-gray-400">Total</div>
          </div>
          <div className="bg-gradient-to-br from-[#2a1a11] to-[#1a0f08] border border-[#3a2416] rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-blue-400">
              {media.filter((m) => m.type === "image").length}
            </div>
            <div className="text-sm text-gray-400">Images</div>
          </div>
          <div className="bg-gradient-to-br from-[#2a1a11] to-[#1a0f08] border border-[#3a2416] rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-purple-400">
              {media.filter((m) => m.type === "video").length}
            </div>
            <div className="text-sm text-gray-400">Videos</div>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        {filteredMedia.length === 0 ? (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📁</div>
            <p className="text-gray-400 text-xl">No media found</p>
            <p className="text-gray-500 text-sm mt-2">
              Check back later for more glimpses!
            </p>
          </Motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedia.map((item, index) => (
              <Motion.div
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                onClick={() => setSelectedMedia(item)}
                className="bg-gradient-to-br from-[#2a1a11] to-[#1a0f08] rounded-xl border-2 border-[#3a2416] hover:border-[#ffb36a] overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 group"
              >
                {/* Media Preview */}
                <div className="aspect-square bg-black relative overflow-hidden">
                  {item.type === "image" ? (
                    <img
                      src={item.secureUrl || item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <video
                        src={item.secureUrl || item.url}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        playsInline
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-all">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <span className="text-3xl">▶️</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Type Badge */}
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                    {item.type === "image" ? "📷" : "🎥"}
                  </div>
                </div>
                {/* Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-1 truncate">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedMedia && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedMedia(null)}
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[1000] flex items-center justify-center p-4"
        >
          <button
            onClick={() => setSelectedMedia(null)}
            className="absolute top-6 right-6 text-white text-4xl hover:text-[#ffb36a] transition-colors z-[1001]"
          >
            ×
          </button>
          <Motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl max-h-[90vh] w-full"
          >
            {selectedMedia.type === "image" ? (
              <img
                src={selectedMedia.secureUrl || selectedMedia.url}
                alt={selectedMedia.title}
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <video
                src={selectedMedia.secureUrl || selectedMedia.url}
                controls
                autoPlay
                className="w-full h-full object-contain rounded-lg"
              />
            )}
            <div className="mt-4 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">
                {selectedMedia.title}
              </h3>
              {selectedMedia.description && (
                <p className="text-gray-400">{selectedMedia.description}</p>
              )}
            </div>
          </Motion.div>
        </Motion.div>
      )}
    </div>
  );
}
