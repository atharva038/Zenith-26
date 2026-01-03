import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllMedia } from "../services/mediaService";
import { motion, AnimatePresence } from "framer-motion";

const Gallery = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [filter, setFilter] = useState("all"); // all, image, video
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch media from API
  useEffect(() => {
    fetchMedia();
  }, [filter, categoryFilter, page]);

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
      if (categoryFilter !== "all") filters.category = categoryFilter;

      const response = await getAllMedia(filters);
      setMedia(response.data.media);
      setTotalPages(response.data.pagination.pages);
      setError(null);
    } catch (err) {
      setError("Failed to load gallery. Please try again later.");
      console.error("Gallery error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMediaClick = (item) => {
    setSelectedMedia(item);
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "event", label: "Events" },
    { value: "sports", label: "Sports" },
    { value: "ceremony", label: "Ceremonies" },
    { value: "participants", label: "Participants" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0604] to-black text-white py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] bg-clip-text text-transparent">
            Zenith 2026 Gallery
          </h1>
          <p className="text-gray-300 text-lg">
            Relive the moments from our spectacular event
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {/* Type Filter */}
          <div className="flex gap-2">
            {["all", "image", "video"].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setFilter(type);
                  setPage(1);
                }}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  filter === type
                    ? "bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] text-[#2c1506]"
                    : "bg-[#2a1a11] text-[#ffb36a] border border-[#3a2416] hover:border-[#ffb36a]"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
                {type === "all" ? " Media" : "s"}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="px-6 py-2 rounded-full bg-gray-800 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-6 py-4 rounded-lg mb-8 text-center">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#ffb36a]"></div>
          </div>
        )}

        {/* Gallery Grid */}
        {!loading && media.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">No media found</p>
          </div>
        )}

        {!loading && media.length > 0 && (
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
                className="group relative bg-gradient-to-br from-[#2a1a11] to-[#1a0f08] rounded-2xl overflow-hidden border border-[#3a2416] hover:border-[#ffb36a] shadow-lg hover:shadow-2xl hover:shadow-[#ffb36a]/20 transition-all duration-300 cursor-pointer"
                onClick={() => handleMediaClick(item)}
              >
                {/* Media Container with object-contain */}
                <div className="relative w-full aspect-video bg-black overflow-hidden">
                  {item.type === "image" ? (
                    <img
                      src={item.secureUrl}
                      alt={item.title}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      style={{ imageRendering: "-webkit-optimize-contrast" }}
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <video
                        src={item.secureUrl}
                        className="w-full h-full object-contain"
                        preload="metadata"
                        style={{ imageRendering: "high-quality" }}
                      />
                      {/* Play Icon Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition-all">
                        <div className="w-16 h-16 bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <svg
                            className="w-8 h-8 text-[#2c1506] ml-1"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Media Info */}
                <div className="p-4">
                  <h3 className="text-white font-bold text-lg mb-1 truncate group-hover:text-[#ffb36a] transition-colors">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  {/* Tags and Category */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-1 bg-[#ffb36a]/20 text-[#ffb36a] text-xs rounded-full font-semibold border border-[#3a2416]">
                      {item.type}
                    </span>
                    <span className="px-2 py-1 bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] text-[#2c1506] text-xs rounded-full font-semibold">
                      {item.category}
                    </span>
                    {item.tags?.slice(0, 2).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-[#2a1a11] text-gray-300 text-xs rounded-full border border-[#3a2416]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-[#2a1a11] text-[#ffb36a] border border-[#3a2416] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3a2416]"
            >
              Previous
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-4 py-2 rounded-lg ${
                    page === p
                      ? "bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] text-[#2c1506] font-bold"
                      : "bg-[#2a1a11] text-[#ffb36a] border border-[#3a2416] hover:bg-[#3a2416]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-[#2a1a11] text-[#ffb36a] border border-[#3a2416] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3a2416]"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={closeModal}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl z-10 transition-all"
            >
              ×
            </button>

            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="max-w-6xl w-full max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Media Display with object-contain */}
              <div className="flex-1 flex items-center justify-center mb-6 bg-black rounded-2xl overflow-hidden">
                {selectedMedia.type === "image" ? (
                  <img
                    src={selectedMedia.secureUrl}
                    alt={selectedMedia.title}
                    className="max-w-full max-h-[70vh] object-contain"
                    style={{ imageRendering: "-webkit-optimize-contrast" }}
                  />
                ) : (
                  <video
                    src={selectedMedia.secureUrl}
                    controls
                    autoPlay
                    className="max-w-full max-h-[70vh] object-contain"
                    style={{ imageRendering: "high-quality" }}
                  />
                )}
              </div>

              {/* Media Information */}
              <div className="bg-gradient-to-br from-[#2a1a11] to-[#1a0f08] p-6 rounded-2xl border border-[#ffb36a]/30">
                <h3 className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] bg-clip-text text-transparent">
                  {selectedMedia.title}
                </h3>
                {selectedMedia.description && (
                  <p className="text-gray-300 mb-4">
                    {selectedMedia.description}
                  </p>
                )}
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  <span className="px-3 py-1 bg-[#ffb36a]/20 text-[#ffb36a] text-sm rounded-full font-semibold border border-[#3a2416]">
                    {selectedMedia.type}
                  </span>
                  <span className="px-3 py-1 bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] text-[#2c1506] text-sm rounded-full font-semibold">
                    {selectedMedia.category}
                  </span>
                  {selectedMedia.tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-[#2a1a11] text-gray-300 text-sm rounded-full border border-[#3a2416]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <p className="text-gray-500 text-sm">
                  Uploaded:{" "}
                  {new Date(selectedMedia.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Admin Button */}
      <Link to="/admin/login" className="fixed bottom-6 right-6 z-50 group">
        <motion.div
          className="relative"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#ffb36a] to-[#ff8b1f] flex items-center justify-center shadow-lg shadow-[#ffb36a]/50 group-hover:shadow-xl group-hover:shadow-[#ffb36a]/70 transition-all duration-300">
            <svg
              className="w-7 h-7 text-[#2c1506]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black/90 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Admin Login
          </span>
        </motion.div>
      </Link>
    </div>
  );
};

export default Gallery;
