import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ThreeScene from "../components/ThreeScene";
import VIPCarousel from "../components/VIPCarousel";
import WormholePortal from "../components/WormholePortal";
import NextLevelCountdown from "../components/NextLevelCountdown";
import MarathonPreview from "../components/MarathonPreview";
import MentorsSection from "../components/MentorsSection";
import { getAllMedia } from "../services/mediaService";

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Subtle Sparkle component for blink dots - GPU ACCELERATED
const Sparkle = ({ delay = 0, size = 4 }) => (
  <motion.div
    className="absolute rounded-full bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200"
    style={{
      width: size,
      height: size,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      willChange: "transform, opacity", // Browser performance hint
      transform: "translate3d(0,0,0)", // Force GPU layer
    }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 0.6, 0],
      scale: [0, 1, 0],
    }}
    transition={{
      duration: 2,
      delay,
      repeat: Infinity,
      repeatDelay: Math.random() * 3 + 1,
      ease: "easeInOut",
    }}
  />
);

// Gallery Section Component with Optimized Media Display
const GallerySection = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    fetchGalleryMedia();
  }, [filter]);

  const fetchGalleryMedia = async () => {
    try {
      setLoading(true);
      const filters = {
        page: 1,
        limit: 12,
        sortBy: "createdAt",
        sortOrder: "desc",
        isActive: "true",
      };

      if (filter !== "all") filters.type = filter;

      const response = await getAllMedia(filters);
      setMedia(response.data.media || []);
    } catch (error) {
      console.error("Error fetching gallery media:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="gallery"
      className="relative py-20 px-6 bg-gradient-to-b from-black to-[#0a0604] overflow-hidden"
    >
      {/* Background Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <Sparkle key={i} delay={i * 0.6} size={4} />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Title */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f]">
            Gallery
          </h2>
          <p className="text-gray-400 text-xl mb-8">
            Relive the epic moments from Zenith 2026
          </p>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            {["all", "image", "video"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
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
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#ffb36a]"></div>
          </div>
        )}

        {/* No Media State */}
        {!loading && media.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-400 text-xl">No media found</p>
          </motion.div>
        )}

        {/* Media Grid */}
        {!loading && media.length > 0 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {media.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.05,
                  ease: "easeOut",
                }}
                className="group relative bg-gradient-to-br from-[#2a1a11] to-[#1a0f08] rounded-2xl overflow-hidden border border-[#3a2416] hover:border-[#ffb36a] transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedMedia(item)}
              >
                {/* Media Container - No Cropping, Full Visibility */}
                <div className="relative w-full aspect-video bg-black overflow-hidden">
                  {item.type === "image" ? (
                    <img
                      src={item.secureUrl}
                      alt={item.title}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      style={{
                        imageRendering: "-webkit-optimize-contrast",
                      }}
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <video
                        src={item.secureUrl}
                        className="w-full h-full object-contain"
                        preload="metadata"
                        style={{
                          imageRendering: "high-quality",
                        }}
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
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {item.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-[#ffb36a]/10 text-[#ffb36a] text-xs rounded-full border border-[#3a2416]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] text-[#2c1506] text-xs font-bold rounded-full">
                    {item.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* View All Button */}
        {!loading && media.length > 0 && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Link
              to="/gallery"
              className="inline-block px-8 py-3 rounded-full font-bold bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] text-[#2c1506] hover:scale-105 transition-transform"
            >
              View Full Gallery →
            </Link>
          </motion.div>
        )}
      </div>

      {/* Modal for Full View */}
      {selectedMedia && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedMedia(null)}
        >
          <motion.div
            className="relative max-w-6xl w-full max-h-[90vh] bg-gradient-to-br from-[#2a1a11] to-[#1a0f08] rounded-2xl overflow-hidden border border-[#ffb36a]"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Media Display - Full Quality */}
            <div
              className="relative w-full bg-black flex items-center justify-center"
              style={{ maxHeight: "70vh" }}
            >
              {selectedMedia.type === "image" ? (
                <img
                  src={selectedMedia.secureUrl}
                  alt={selectedMedia.title}
                  className="max-w-full max-h-[70vh] object-contain"
                  style={{
                    imageRendering: "-webkit-optimize-contrast",
                  }}
                />
              ) : (
                <video
                  src={selectedMedia.secureUrl}
                  className="max-w-full max-h-[70vh] object-contain"
                  controls
                  autoPlay
                  style={{
                    imageRendering: "high-quality",
                  }}
                />
              )}
            </div>

            {/* Media Info */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-[#ffb36a] mb-2">
                {selectedMedia.title}
              </h2>
              {selectedMedia.description && (
                <p className="text-gray-300 mb-4">
                  {selectedMedia.description}
                </p>
              )}
              {selectedMedia.tags && selectedMedia.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedMedia.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#ffb36a]/10 text-[#ffb36a] text-sm rounded-full border border-[#3a2416]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default function Homepage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const stadiumRef = useRef(null);
  const textRef = useRef(null);
  const aboutCardsRef = useRef(null);
  const eventsRef = useRef(null);

  // Subtle mouse parallax effect for hero (reduced intensity) - PASSIVE LISTENER FOR PERFORMANCE
  useEffect(() => {
    // Disable parallax on mobile for performance
    if (window.innerWidth < 768) return;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      // Calculate mouse position as percentage (-0.5 to 0.5)
      const xPercent = (clientX / innerWidth - 0.5) * 2;
      const yPercent = (clientY / innerHeight - 0.5) * 2;

      // Stadium moves with mouse (very subtle - reduced from 20 to 12)
      gsap.to(stadiumRef.current, {
        x: xPercent * 12,
        y: yPercent * 12,
        duration: 1,
        ease: "power2.out",
      });

      // Text moves opposite direction (subtle - reduced from 30 to 18)
      gsap.to(textRef.current, {
        x: -xPercent * 18,
        y: -yPercent * 18,
        duration: 0.8,
        ease: "power2.out",
      });
    };

    // Use passive listener for better scroll performance
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove, {
        passive: true,
      });
    };
  }, []);

  // GSAP ScrollTrigger for stats cards (subtle animation)
  useEffect(() => {
    if (aboutCardsRef.current) {
      const cards = aboutCardsRef.current.querySelectorAll(".stat-card");

      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 40,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: aboutCardsRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Event cards subtle animation
    if (eventsRef.current) {
      const eventCards = eventsRef.current.querySelectorAll(".event-card");

      eventCards.forEach((card, index) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 30,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 px-9 py-5 flex justify-between items-center z-[600] bg-black/10 backdrop-blur-md">
        <span
          className="text-[#ffb77a] font-bold text-xl tracking-wide"
          style={{ textShadow: "0 2px 12px rgba(255,140,40,0.18)" }}
        >
          Zenith 2026
        </span>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6">
          <a
            href="#about"
            className="text-[#ffb77a] font-semibold hover:text-[#ffd4a8] transition-colors"
          >
            About
          </a>
          <a
            href="#events"
            className="text-[#ffb77a] font-semibold hover:text-[#ffd4a8] transition-colors"
          >
            Events
          </a>
          <a
            href="#wormhole"
            className="text-[#ffb77a] font-semibold hover:text-[#ffd4a8] transition-colors flex items-center gap-1"
          >
            � Portal
          </a>
          <a
            href="#vip-guests"
            className="text-[#ffb77a] font-semibold hover:text-[#ffd4a8] transition-colors"
          >
            VIP Guests
          </a>
          <a
            href="#gallery"
            className="text-[#ffb77a] font-semibold hover:text-[#ffd4a8] transition-colors"
          >
            Gallery
          </a>
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
              <a
                href="#about"
                className="text-[#ffb77a] font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
              <a
                href="#events"
                className="text-[#ffb77a] font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Events
              </a>
              <a
                href="#wormhole"
                className="text-[#ffb77a] font-semibold flex items-center gap-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                � Portal
              </a>
              <a
                href="#vip-guests"
                className="text-[#ffb77a] font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                VIP Guests
              </a>
              <a
                href="#gallery"
                className="text-[#ffb77a] font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Gallery
              </a>
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

      <section id="hero" className="relative w-screen h-screen overflow-hidden">
        {/* Stadium Background Image - GPU ACCELERATED */}
        <div
          ref={stadiumRef}
          className="absolute inset-0 z-[1] will-change-transform"
          style={{
            backgroundImage:
              'url("https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto/v1/zenith-26/img/stadium?_a=BAMAMiB80")',
            backgroundSize: "cover",
            backgroundPosition: "center 55%",
            filter: "brightness(0.45) saturate(0.9) contrast(0.95)",
            transform: "translate3d(0,0,0)", // Force GPU layer
            willChange: "transform", // Performance hint for GSAP animations
          }}
        />
        {/* Subtle blinking dots/sparkles */}
        <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <Sparkle key={i} delay={i * 0.4} size={Math.random() * 4 + 3} />
          ))}
        </div>
        {/* Subtle overlay UNDER the Three.js scene for depth */}
        <div
          className="absolute inset-0 z-[10] pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)",
          }}
        />
        {/* Three.js Scene - COMMENTED OUT FOR NOW */}
        {/* <ThreeScene /> */}
        {/* Very subtle vignette on top to help title readability */}
        <div
          className="absolute inset-0 z-[100] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 120% 80% at 50% 30%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.4) 100%)",
          }}
        />
        <div
          ref={textRef}
          className="absolute top-[20%] left-0 right-0 z-[200] text-center px-5 will-change-transform"
          style={{
            transform: "translate3d(0,0,0)", // GPU layer for GSAP parallax
            willChange: "transform", // Performance hint
          }}
        >
          <motion.h1
            className="m-0 text-[#ffe7c3] tracking-[6px] font-bold"
            style={{
              fontSize: "clamp(2.4rem, 6vw, 5rem)",
              textShadow:
                "0 18px 40px rgba(255,120,40,0.12), 0 0 30px rgba(255,150,50,0.18)",
              willChange: "opacity, transform, filter", // Performance hints
              transform: "translate3d(0,0,0)", // GPU layer
            }}
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            ZENITH 2026
          </motion.h1>
          <motion.p
            className="mt-3 mb-0 text-[#ffdcb3]"
            style={{
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              willChange: "opacity, transform", // Performance hints
              transform: "translate3d(0,0,0)", // GPU layer
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            SGGSIE&T Annual Sports Festival • Where Champions Rise
          </motion.p>

          {/* Registration Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center items-center">
            <Link to="/register">
              <motion.button
                className="inline-block px-8 py-3 rounded-full font-extrabold text-[#2c1506] no-underline transition-transform hover:scale-105"
                style={{
                  background: "linear-gradient(90deg, #ffb36a, #ff8b1f)",
                  boxShadow:
                    "0 12px 28px rgba(255,140,40,0.18), inset 0 -2px 6px rgba(0,0,0,0.12)",
                  willChange: "transform", // Performance hint
                  transform: "translate3d(0,0,0)", // GPU layer
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🏆 Register for Sports
              </motion.button>
            </Link>

            <Link to="/marathon">
              <motion.button
                className="inline-block px-8 py-3 rounded-full font-extrabold text-[#2c1506] no-underline transition-transform hover:scale-105"
                style={{
                  background: "linear-gradient(90deg, #ffd700, #ffa500)",
                  boxShadow:
                    "0 12px 28px rgba(255,165,0,0.25), inset 0 -2px 6px rgba(0,0,0,0.12)",
                  willChange: "transform", // Performance hint
                  transform: "translate3d(0,0,0)", // GPU layer
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🏃 Marathon Registration
              </motion.button>
            </Link>
          </div>

          {/* Next Level Countdown Timer */}
          <div className="mt-10">
            <NextLevelCountdown
              targetDate="2026-02-20T09:00:00"
              eventName="ZENITH 2026"
            />
          </div>
        </div>
        <div
          className="absolute left-0 right-0 bottom-0 h-[22%] z-[210] pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.0) 80%)",
          }}
        />
      </section>

      {/* Marathon Preview Section */}
      <MarathonPreview />

      <section
        id="about"
        className="relative py-20 px-6 bg-gradient-to-b from-black to-[#0a0604]"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-5xl md:text-6xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            About Zenith
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Zenith is not just a sports festival — it's where legends are
                born. Since its inception, Zenith has been the ultimate platform
                for student athletes to showcase their skills, compete at the
                highest level, and forge lifelong memories.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                From the roaring cricket grounds to the intense chess battles,
                from the electrifying e-sports arena to the adrenaline-pumping
                athletics track — Zenith 2026 promises to be the most
                spectacular edition yet.
              </p>
            </motion.div>
            <div ref={aboutCardsRef} className="grid grid-cols-2 gap-6">
              {[
                { icon: "🏆", number: "6+", label: "Sports Events" },
                { icon: "👥", number: "1000+", label: "Participants" },
                { icon: "🎯", number: "50+", label: "Matches" },
                { icon: "⚡", number: "3", label: "Days of Action" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="stat-card relative bg-gradient-to-br from-[#2a1a11] to-[#1a0f08] p-6 rounded-xl border border-[#3a2416] overflow-hidden"
                >
                  {/* Subtle sparkles */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(2)].map((_, i) => (
                      <Sparkle key={i} delay={index * 0.3 + i * 0.8} size={3} />
                    ))}
                  </div>
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold text-[#ffb36a] mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Wormhole Portal Section */}
      <section
        id="wormhole"
        className="relative h-screen w-full bg-black overflow-hidden"
        style={{
          willChange: "transform",
          transform: "translate3d(0,0,0)",
        }}
      >
        {/* Wormhole Portal Component */}
        <WormholePortal />
      </section>

      {/* VIP Spotlight Section */}
      <section
        id="vip-guests"
        className="relative py-20 px-6 bg-gradient-to-b from-[#0a0604] to-black overflow-hidden"
      >
        {/* Background Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <Sparkle key={i} delay={i * 0.5} size={5} />
          ))}
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Title */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f]">
              VIP Spotlight
            </h2>
            <p className="text-gray-400 text-xl">
              Legends who graced Zenith over the years
            </p>
          </motion.div>

          {/* VIP Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <VIPCarousel />
          </motion.div>
        </div>
      </section>

      {/* Mentors Section */}
      <MentorsSection />

      {/* Gallery Section */}
      <GallerySection />

      <footer className="relative py-12 px-6 bg-black border-t border-[#3a2416]">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h3
            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            ZENITH 2026
          </motion.h3>
          <div className="flex gap-6 justify-center mb-8">
            {["📘", "📷", "🐦", "▶️", "💼"].map((icon, i) => (
              <motion.a
                key={i}
                href="#"
                className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#3a2416] bg-[#1a0f08] hover:border-[#ffb36a] hover:scale-110 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
              >
                <span className="text-2xl">{icon}</span>
              </motion.a>
            ))}
          </div>
          <p className="text-gray-500 mb-2">
            © 2026 SGGSIE&T Zenith. All rights reserved.
          </p>
          <p className="text-sm text-gray-600">Where Champions Rise 🏆</p>

          {/* Admin Login Link */}
          <div className="mt-6">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-[#ffb36a] transition-colors text-sm"
            >
              <svg
                className="w-4 h-4"
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
              Admin Access
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
