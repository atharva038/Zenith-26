import React, { useEffect, useRef, useState } from "react";
import {motion, AnimatePresence} from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function CinematicIntro() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;

    const handleEnded = () => {
      setVideoEnded(true);
      setFadeOut(true);
      setTimeout(() => {
        navigate("/homepage");
      }, 1000);
    };

    if (videoElement) {
      videoElement.addEventListener("ended", handleEnded);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("ended", handleEnded);
      }
    };
  }, [navigate]);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: fadeOut ? 0 : 1 }}
      transition={{ duration: 1 }}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
      >
        <source src="/path-to-your-video.mp4" type="video/mp4" />
      </video>

      {videoEnded && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => navigate("/homepage")}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          Continue
        </motion.button>
      )}
    </motion.div>
  );
}
