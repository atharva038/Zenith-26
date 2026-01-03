import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {getAllMedia} from "../services/mediaService";
import {motion, AnimatePresence} from "framer-motion";

const Gallery = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Separate state for videos and images
  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState([]);

  // Fetch media from API
  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const filters = {
        limit: 100, // Get all media items
        sortBy: "createdAt",
        sortOrder: "desc",
      };

      const response = await getAllMedia(filters);
      const allMedia = response.data.media;

      // Separate videos and images
      const videoItems = allMedia.filter((item) => item.type === "video");
      const imageItems = allMedia.filter((item) => item.type === "image");

      setVideos(videoItems);
      setImages(imageItems);
      setMedia(allMedia);
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

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-[#0a0604] to-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 px-9 py-5 flex justify-between items-center z-[600] bg-black/40 backdrop-blur-md border-b border-[#3a2416]">
        <Link
          to="/home"
          className="text-[#ffb77a] font-bold text-xl tracking-wide"
          style={{textShadow: "0 2px 12px rgba(255,140,40,0.18)"}}
        >
          Zenith 2026
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6">
          <Link
            to="/home"
            className="text-[#ffb77a] font-semibold hover:text-[#ffd4a8] transition-colors"
          >
            Home
          </Link>
          <a
            href="/home#about"
            className="text-[#ffb77a] font-semibold hover:text-[#ffd4a8] transition-colors"
          >
            About
          </a>
          <a
            href="/home#events"
            className="text-[#ffb77a] font-semibold hover:text-[#ffd4a8] transition-colors"
          >
            Events
          </a>
          <a
            href="/home#vip-guests"
            className="text-[#ffb77a] font-semibold hover:text-[#ffd4a8] transition-colors"
          >
            VIP Guests
          </a>
          <Link
            to="/gallery"
            className="text-[#ffd4a8] font-semibold underline decoration-2 underline-offset-4"
          >
            Gallery
          </Link>
          <Link
            to="/register"
            className="text-[#ffb77a] font-semibold hover:text-[#ffd4a8] transition-colors"
          >
            Register
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-[#ffb77a] z-[700]"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* BACKDROP */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/70 z-[650] md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="fixed top-16 left-0 right-0 bg-black/90 backdrop-blur-xl p-6 z-[700] border-b border-[#3a2416] animate-slideDown md:hidden">
            <div className="flex flex-col gap-4">
              <Link
                to="/home"
                className="text-[#ffb77a] font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <a
                href="/home#about"
                className="text-[#ffb77a] font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
              <a
                href="/home#events"
                className="text-[#ffb77a] font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Events
              </a>
              <a
                href="/home#vip-guests"
                className="text-[#ffb77a] font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                VIP Guests
              </a>
              <Link
                to="/gallery"
                className="text-[#ffd4a8] font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Gallery
              </Link>
              <Link
                to="/register"
                className="text-[#ffb77a] font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </nav>

      <div className="container mx-auto px-4 pt-32 pb-20">
        {/* Header */}
        <motion.div
          initial={{opacity: 0, y: -20}}
          animate={{opacity: 1, y: 0}}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] bg-clip-text text-transparent">
            Zenith 2026 Gallery
          </h1>
          <p className="text-gray-300 text-lg">
            Relive the moments from our spectacular event
          </p>
        </motion.div>

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
          <div className="space-y-16">
            {/* Video Section */}
            {videos.length > 0 && (
              <motion.section
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.6}}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">🎬</span>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-[#ffb36a] via-[#ff8b1f] to-[#ff6b3d] bg-clip-text text-transparent">
                      Cinematic Moments
                    </h2>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-[#ffb36a]/50 to-transparent"></div>
                  <span className="text-sm text-gray-400 font-medium px-3 py-1 rounded-full bg-[#2a1a11] border border-[#3a2416]">
                    {videos.length} {videos.length === 1 ? "Video" : "Videos"}
                  </span>
                </div>

                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  initial={{opacity: 0}}
                  animate={{opacity: 1}}
                >
                  {videos.map((item, index) => (
                    <motion.div
                      key={item._id}
                      initial={{opacity: 0, y: 20}}
                      animate={{opacity: 1, y: 0}}
                      transition={{delay: index * 0.05}}
                      className="relative bg-black rounded-lg overflow-hidden border border-gray-700 hover:border-[#ff8b1f] hover:shadow-lg hover:shadow-[#ff8b1f]/20 transition-all duration-300 cursor-pointer group"
                      onClick={() => handleMediaClick(item)}
                    >
                      {/* Video Container */}
                      <div className="relative w-full aspect-video">
                        <video
                          src={item.secureUrl}
                          className="w-full h-full object-cover"
                          preload="metadata"
                        />
                        {/* Play Icon Overlay */}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-16 h-16 rounded-full bg-[#ff8b1f] flex items-center justify-center">
                            <span className="text-white text-2xl ml-1">▶</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.section>
            )}

            {/* Image Section */}
            {images.length > 0 && (
              <motion.section
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.6, delay: 0.2}}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">📸</span>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-[#6bcfff] via-[#4a9eff] to-[#3d7fff] bg-clip-text text-transparent">
                      Captured Memories
                    </h2>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-[#4a9eff]/50 to-transparent"></div>
                  <span className="text-sm text-gray-400 font-medium px-3 py-1 rounded-full bg-[#0a1a2a] border border-[#163a54]">
                    {images.length} {images.length === 1 ? "Image" : "Images"}
                  </span>
                </div>

                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  initial={{opacity: 0}}
                  animate={{opacity: 1}}
                >
                  {images.map((item, index) => (
                    <motion.div
                      key={item._id}
                      initial={{opacity: 0, y: 20}}
                      animate={{opacity: 1, y: 0}}
                      transition={{delay: index * 0.05}}
                      className="relative bg-black rounded-lg overflow-hidden border border-gray-700 hover:border-[#4a9eff] hover:shadow-lg hover:shadow-[#4a9eff]/20 transition-all duration-300 cursor-pointer group"
                      onClick={() => handleMediaClick(item)}
                    >
                      {/* Image Container */}
                      <div className="relative w-full aspect-video">
                        <img
                          src={item.secureUrl}
                          alt="Gallery image"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        {/* Zoom Overlay */}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-16 h-16 rounded-full bg-[#4a9eff] flex items-center justify-center">
                            <span className="text-white text-3xl">🔍</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.section>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
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
              initial={{scale: 0.8, y: 50}}
              animate={{scale: 1, y: 0}}
              exit={{scale: 0.8, y: 50}}
              className="max-w-6xl w-full max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Media Display */}
              <div className="bg-black rounded-2xl overflow-hidden border border-[#ffb36a]/30">
                {selectedMedia.type === "image" ? (
                  <img
                    src={selectedMedia.secureUrl}
                    alt="Gallery image"
                    className="max-w-full max-h-[85vh] object-contain"
                  />
                ) : (
                  <video
                    src={selectedMedia.secureUrl}
                    controls
                    autoPlay
                    className="max-w-full max-h-[85vh] object-contain"
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="relative py-12 px-6 bg-black border-t border-[#3a2416]">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h3
            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] mb-6"
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.6, ease: "easeOut"}}
          >
            ZENITH 2026
          </motion.h3>
          <div className="flex gap-6 justify-center mb-8">
            {["📘", "📷", "🐦", "▶️", "💼"].map((icon, i) => (
              <motion.a
                key={i}
                href="#"
                className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#3a2416] bg-[#1a0f08] hover:border-[#ffb36a] hover:scale-110 transition-all duration-300"
                initial={{opacity: 0, y: 20}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.4, delay: i * 0.08, ease: "easeOut"}}
              >
                <span className="text-2xl">{icon}</span>
              </motion.a>
            ))}
          </div>
          <p className="text-gray-500 mb-2">
            © 2026 SGGSIE&T Zenith. All rights reserved.
          </p>
          <p className="text-sm text-gray-600">Where Champions Rise 🏆</p>
        </div>
      </footer>
    </div>
  );
};

export default Gallery;
