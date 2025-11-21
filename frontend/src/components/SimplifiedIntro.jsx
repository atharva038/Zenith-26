import {motion} from "framer-motion";
import {useNavigate} from "react-router-dom";
import {useEffect, useRef} from "react";
import {gsap} from "gsap";

// Simplified 2D intro for mobile/low-end devices
export default function SimplifiedIntro() {
  const navigate = useNavigate();
  const ballRef = useRef();
  const logoRef = useRef();

  useEffect(() => {
    const timeline = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          localStorage.setItem("introPlayed", "true");
          navigate("/home");
        }, 2000);
      },
    });

    // Ball animation
    timeline.to(ballRef.current, {
      y: -100,
      scale: 1.5,
      duration: 1,
      ease: "power2.out",
    });

    // Flash and logo reveal
    timeline.to(ballRef.current, {
      opacity: 0,
      duration: 0.3,
    });

    timeline.fromTo(
      logoRef.current,
      {scale: 0, opacity: 0},
      {scale: 1, opacity: 1, duration: 1.5, ease: "elastic.out(1, 0.5)"}
    );

    return () => timeline.kill();
  }, [navigate]);

  const handleSkip = () => {
    localStorage.setItem("introPlayed", "true");
    navigate("/home");
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        {Array.from({length: 30}).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Ball */}
      <motion.div
        ref={ballRef}
        className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-lg shadow-red-500/50"
        initial={{y: 200, scale: 1}}
      />

      {/* Logo */}
      <div
        ref={logoRef}
        className="absolute inset-0 flex flex-col items-center justify-center opacity-0"
      >
        <h1 className="font-orbitron text-6xl sm:text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-orange via-neon-blue to-electric-cyan">
          ZENITH
        </h1>
        <h2 className="font-orbitron text-4xl sm:text-5xl md:text-7xl font-bold text-white mt-4 tracking-widest">
          2026
        </h2>
        <p className="font-rajdhani text-xl sm:text-2xl md:text-3xl text-white/80 mt-8 tracking-wide">
          Let the Game Begin
        </p>
      </div>

      {/* Skip button */}
      <button
        onClick={handleSkip}
        className="absolute bottom-8 right-8 z-30 px-4 py-2 sm:px-6 sm:py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white font-rajdhani text-base sm:text-lg hover:bg-white/20 transition-all duration-300"
      >
        Skip Intro →
      </button>
    </div>
  );
}
