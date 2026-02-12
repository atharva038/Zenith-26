import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

// Generate a unique visitor ID and store in localStorage
const getVisitorId = () => {
  let visitorId = localStorage.getItem("zenith_visitor_id");
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("zenith_visitor_id", visitorId);
  }
  return visitorId;
};

// Determine API base URL based on environment
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.includes("local");
  if (isLocalhost) {
    return "http://localhost:5000";
  }
  return "https://zenithapp-5onhx.ondigitalocean.app";
};

const API_BASE_URL = getApiBaseUrl();

const PageLikePoll = ({ pageName, position = "top-right" }) => {
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const visitorId = getVisitorId();

  // Fetch like count on mount
  const fetchLikes = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/page-likes/${pageName}?visitorId=${visitorId}`
      );
      const data = await response.json();
      if (data.success) {
        setLikeCount(data.data.likeCount);
        setHasLiked(data.data.hasLiked);
      }
    } catch (error) {
      console.error("Error fetching likes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [pageName, visitorId]);

  useEffect(() => {
    fetchLikes();
  }, [fetchLikes]);

  // Toggle like
  const handleToggleLike = async () => {
    if (isAnimating) return;

    setIsAnimating(true);

    // Optimistic update
    const newHasLiked = !hasLiked;
    const newCount = newHasLiked ? likeCount + 1 : likeCount - 1;
    setHasLiked(newHasLiked);
    setLikeCount(newCount);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/page-likes/${pageName}/toggle`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ visitorId }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setLikeCount(data.data.likeCount);
        setHasLiked(data.data.hasLiked);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      // Revert on error
      setHasLiked(!newHasLiked);
      setLikeCount(likeCount);
    } finally {
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  // Position classes
  const positionClasses = {
    "top-right": "top-20 right-4 md:top-24 md:right-6",
    "top-left": "top-20 left-4 md:top-24 md:left-6",
    "bottom-right": "bottom-20 right-4 md:bottom-24 md:right-6",
    "bottom-left": "bottom-20 left-4 md:bottom-24 md:left-6",
  };

  if (isLoading) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
      className={`fixed ${positionClasses[position]} z-40`}
    >
      <div
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-black/90 backdrop-blur-sm 
                         rounded-lg border border-white/10 whitespace-nowrap"
            >
              <p className="text-xs text-white/80">
                {hasLiked ? "Thanks for your feedback!" : "Liked this page design?"}
              </p>
              <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 
                            w-2 h-2 bg-black/90 border-r border-b border-white/10" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Like Button */}
        <motion.button
          onClick={handleToggleLike}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            relative flex items-center gap-2 px-3 py-2 rounded-full
            backdrop-blur-md border transition-all duration-300
            ${hasLiked
              ? "bg-gradient-to-r from-pink-500/20 to-red-500/20 border-pink-500/40 shadow-lg shadow-pink-500/20"
              : "bg-black/40 border-white/10 hover:border-white/20"
            }
          `}
        >
          {/* Heart Icon with Animation */}
          <motion.div
            animate={isAnimating ? {
              scale: [1, 1.3, 1],
              rotate: [0, -10, 10, 0],
            } : {}}
            transition={{ duration: 0.3 }}
          >
            <Heart
              size={18}
              className={`transition-all duration-300 ${
                hasLiked
                  ? "fill-pink-500 text-pink-500"
                  : "text-white/60 hover:text-white/80"
              }`}
            />
          </motion.div>

          {/* Like Count */}
          <AnimatePresence mode="wait">
            <motion.span
              key={likeCount}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className={`text-sm font-medium ${
                hasLiked ? "text-pink-400" : "text-white/70"
              }`}
            >
              {likeCount}
            </motion.span>
          </AnimatePresence>

          {/* Sparkle effect when liked */}
          {isAnimating && hasLiked && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    opacity: 1, 
                    scale: 0,
                    x: 0,
                    y: 0,
                  }}
                  animate={{ 
                    opacity: 0, 
                    scale: 1,
                    x: (Math.random() - 0.5) * 40,
                    y: (Math.random() - 0.5) * 40,
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full bg-pink-400"
                />
              ))}
            </>
          )}
        </motion.button>

        {/* Subtle glow effect */}
        {hasLiked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 -z-10 rounded-full bg-pink-500/20 blur-xl"
          />
        )}
      </div>
    </motion.div>
  );
};

export default PageLikePoll;
