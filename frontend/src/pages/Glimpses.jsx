import { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { mediaAPI } from "../services/api";

export default function Glimpses() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [category, setCategory] = useState("");
  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    loadMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, category]);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (filter) filters.type = filter;
      if (category) filters.category = category;

      const response = await mediaAPI.getAll(filters);
      if (response.success) {
        setMedia(response.data.media);
      }
    } catch (error) {
      console.error("Failed to load media:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item) => {
    setSelectedMedia(item);
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-orbitron text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-blue-500 mb-4">
              ZENITH 2026 Glimpses
            </h1>
            <p className="font-rajdhani text-xl text-gray-300">
              Relive the moments, celebrate the victories 🏆
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-6 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white font-rajdhani font-semibold focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="">All Media</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-6 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white font-rajdhani font-semibold focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="">All Categories</option>
            <option value="event">Events</option>
            <option value="sports">Sports</option>
            <option value="ceremony">Ceremonies</option>
            <option value="participants">Participants</option>
            <option value="other">Other</option>
          </select>

          <button
            onClick={() => {
              setFilter("");
              setCategory("");
            }}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-blue-600 text-white font-rajdhani font-bold rounded-lg hover:from-orange-600 hover:to-blue-700 transition-all"
          >
            Reset Filters
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center text-white font-rajdhani text-2xl py-20">
            Loading glimpses...
          </div>
        )}

        {/* Gallery Grid */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {media.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => openModal(item)}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden cursor-pointer hover:border-blue-500 transition-all"
              >
                <div className="relative h-64">
                  {item.type === "video" ? (
                    <>
                      <img
                        src={item.thumbnail || item.secureUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        </div>
                      </div>
                    </>
                  ) : (
                    <img
                      src={item.secureUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-white font-rajdhani font-bold text-lg mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                    {item.description || "No description"}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="px-2 py-1 bg-blue-500/20 rounded">
                      {item.category}
                    </span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && media.length === 0 && (
          <div className="text-center text-gray-400 font-rajdhani text-xl py-20">
            No media found. Check back soon for exciting glimpses! 📸
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedMedia && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl max-w-4xl max-h-[90vh] overflow-auto"
          >
            <div className="p-6">
              {selectedMedia.type === "video" ? (
                <video
                  src={selectedMedia.secureUrl}
                  controls
                  autoPlay
                  className="w-full max-h-[60vh] rounded-lg"
                />
              ) : (
                <img
                  src={selectedMedia.secureUrl}
                  alt={selectedMedia.title}
                  className="w-full max-h-[60vh] object-contain rounded-lg"
                />
              )}
              <div className="mt-4">
                <h2 className="text-white font-orbitron text-2xl font-bold mb-2">
                  {selectedMedia.title}
                </h2>
                <p className="text-gray-300 font-rajdhani mb-4">
                  {selectedMedia.description || "No description available"}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedMedia.tags?.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-gray-400 text-sm border-t border-white/20 pt-4">
                  <span>Category: {selectedMedia.category}</span>
                  <span>
                    {new Date(selectedMedia.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="mt-4 w-full bg-gradient-to-r from-orange-500 to-blue-600 text-white font-rajdhani font-bold py-3 rounded-lg hover:from-orange-600 hover:to-blue-700 transition-all"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
