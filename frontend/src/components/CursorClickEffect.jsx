import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CursorClickEffect = ({ style = "ripple" }) => {
  const [clicks, setClicks] = useState([]);

  useEffect(() => {
    const handleClick = (e) => {
      const newClick = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
      };

      setClicks((prevClicks) => [...prevClicks, newClick]);

      // Remove click after animation completes
      setTimeout(() => {
        setClicks((prevClicks) => prevClicks.filter((click) => click.id !== newClick.id));
      }, 1000);
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const renderRippleEffect = (click) => (
    <React.Fragment key={click.id}>
      {/* Outer ripple */}
      <motion.div
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 3, opacity: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          position: "absolute",
          left: click.x,
          top: click.y,
          width: "40px",
          height: "40px",
          marginLeft: "-20px",
          marginTop: "-20px",
        }}
        className="rounded-full border-2 border-purple-500"
      />

      {/* Middle ripple */}
      <motion.div
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 2, opacity: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
        style={{
          position: "absolute",
          left: click.x,
          top: click.y,
          width: "30px",
          height: "30px",
          marginLeft: "-15px",
          marginTop: "-15px",
        }}
        className="rounded-full border-2 border-cyan-400"
      />

      {/* Inner glow */}
      <motion.div
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 1.5, opacity: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
        style={{
          position: "absolute",
          left: click.x,
          top: click.y,
          width: "20px",
          height: "20px",
          marginLeft: "-10px",
          marginTop: "-10px",
        }}
        className="rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 blur-sm"
      />

      {/* Center dot */}
      <motion.div
        initial={{ scale: 1, opacity: 1 }}
        animate={{ scale: 0, opacity: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          position: "absolute",
          left: click.x,
          top: click.y,
          width: "8px",
          height: "8px",
          marginLeft: "-4px",
          marginTop: "-4px",
        }}
        className="rounded-full bg-white shadow-lg shadow-purple-500/50"
      />

      {/* Particles */}
      {[...Array(8)].map((_, i) => {
        const angle = (Math.PI * 2 * i) / 8;
        const distance = 40;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        return (
          <motion.div
            key={`particle-${i}`}
            initial={{ scale: 1, opacity: 1, x: 0, y: 0 }}
            animate={{
              scale: 0,
              opacity: 0,
              x: x,
              y: y,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: click.x,
              top: click.y,
              width: "4px",
              height: "4px",
              marginLeft: "-2px",
              marginTop: "-2px",
            }}
            className="rounded-full bg-gradient-to-r from-purple-400 to-cyan-400"
          />
        );
      })}
    </React.Fragment>
  );

  const renderBurstEffect = (click) => (
    <React.Fragment key={click.id}>
      {/* Main burst */}
      <motion.div
        initial={{ scale: 0, opacity: 1, rotate: 0 }}
        animate={{ scale: 4, opacity: 0, rotate: 180 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          position: "absolute",
          left: click.x,
          top: click.y,
          width: "30px",
          height: "30px",
          marginLeft: "-15px",
          marginTop: "-15px",
        }}
        className="rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 blur-md"
      />

      {/* Star particles */}
      {[...Array(12)].map((_, i) => {
        const angle = (Math.PI * 2 * i) / 12;
        const distance = 50 + Math.random() * 20;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        const size = 3 + Math.random() * 3;

        return (
          <motion.div
            key={`star-${i}`}
            initial={{ scale: 1, opacity: 1, x: 0, y: 0, rotate: 0 }}
            animate={{
              scale: 0,
              opacity: 0,
              x: x,
              y: y,
              rotate: 360,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.02 }}
            style={{
              position: "absolute",
              left: click.x,
              top: click.y,
              width: `${size}px`,
              height: `${size}px`,
              marginLeft: `-${size / 2}px`,
              marginTop: `-${size / 2}px`,
            }}
            className="rounded-full bg-yellow-300"
          />
        );
      })}
    </React.Fragment>
  );

  const renderEffect = (click) => {
    switch (style) {
      case "burst":
        return renderBurstEffect(click);
      case "ripple":
      default:
        return renderRippleEffect(click);
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {clicks.map((click) => renderEffect(click))}
      </AnimatePresence>
    </div>
  );
};

export default CursorClickEffect;
