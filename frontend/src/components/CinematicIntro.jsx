import {useState, useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {motion} from "framer-motion";

export default function CinematicIntro() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Enhance video quality settings
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");

    // Request high quality playback
    if (video.requestVideoFrameCallback) {
      const callback = () => {
        video.requestVideoFrameCallback(callback);
      };
      video.requestVideoFrameCallback(callback);
    }

    // Auto-play video
    video.play().catch((err) => {
      console.log("Video autoplay failed:", err);
    });

    // Handle video end
    const handleVideoEnd = () => {
      setVideoEnded(true);
      setFadeOut(true);
      setTimeout(() => {
        navigate("/home");
      }, 800);
    };

    video.addEventListener("ended", handleVideoEnd);

    return () => {
      video.removeEventListener("ended", handleVideoEnd);
    };
  }, [navigate]);

  const handleSkip = () => {
    setFadeOut(true);
    setTimeout(() => {
      navigate("/home");
    }, 500);
  };

  return (
    <motion.div
      className="relative w-full h-screen bg-black overflow-hidden"
      style={{
        willChange: "opacity",
        backfaceVisibility: "hidden",
        perspective: 1000,
      }}
      initial={{opacity: 0}}
      animate={{opacity: fadeOut ? 0 : 1}}
      transition={{duration: 0.8}}
    >
      {/* Ultra HD Video Background with Quality Enhancements */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          imageRendering: "high-quality",
          transform: "translateZ(0)", // GPU acceleration
          backfaceVisibility: "hidden",
          perspective: 1000,
          filter: "contrast(1.05) saturate(1.1) brightness(1.02)", // Enhance clarity
          WebkitFilter: "contrast(1.05) saturate(1.1) brightness(1.02)",
        }}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
      >
        {/* Browser will automatically choose the best quality it can handle */}
        <source
          src="https://res.cloudinary.com/dvmsho3pj/video/upload/v1766421249/zenith-26/video/intro_4k.mp4"
          type="video/mp4"
          media="(min-width: 2560px)"
        />
        <source
          src="https://res.cloudinary.com/dvmsho3pj/video/upload/v1766421230/zenith-26/video/intro_hd.mp4"
          type="video/mp4"
          media="(min-width: 1280px)"
        />
        <source
          src="https://res.cloudinary.com/dvmsho3pj/video/upload/v1766421221/zenith-26/video/intro.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Subtle vignette overlay (optional - enhances focus without reducing quality) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, transparent 60%, rgba(0,0,0,0.15) 100%)",
        }}
      />

      {/* Skip Button */}
      <motion.button
        onClick={handleSkip}
        className="absolute top-8 right-8 z-50 px-6 py-3 bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] text-black font-bold rounded-full hover:scale-105 transition-transform duration-300 shadow-lg"
        initial={{opacity: 0, y: -20}}
        animate={{opacity: 1, y: 0}}
        transition={{delay: 1, duration: 0.5}}
      >
        Skip Intro →
      </motion.button>

      {/* Zenith Logo Overlay (appears near end) */}
      {videoEnded && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 0.5}}
        >
          <h1
            className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f]"
            style={{
              textShadow: "0 0 60px rgba(255,179,106,0.5)",
            }}
          >
            ZENITH 2026
          </h1>
        </motion.div>
      )}
    </motion.div>
  );
}
