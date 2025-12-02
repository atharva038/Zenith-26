import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {motion, AnimatePresence} from "framer-motion";

// Note: Replace this with your actual wormhole image path
// You can save the provided wormhole images to /public/img/wormhole.png
const WORMHOLE_IMAGE = "/img/image.png";

// Main Wormhole Portal Component
export default function WormholePortal() {
  const [isEntering, setIsEntering] = useState(false);
  const navigate = useNavigate();

  const handleEnter = () => {
    setIsEntering(true);

    // Navigate after transition animation
    setTimeout(() => {
      navigate("/gameverse");
    }, 2500);
  };

  return (
    <>
      {/* Wormhole Container */}
      <div className="relative w-full h-screen flex items-center justify-center">
        {/* Realistic Space Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Deep space gradient with red/purple wormhole colors */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse at center, rgba(139, 0, 0, 0.15) 0%, transparent 40%),
                radial-gradient(ellipse at 20% 30%, rgba(178, 34, 34, 0.12) 0%, transparent 35%),
                radial-gradient(ellipse at 80% 70%, rgba(220, 20, 60, 0.1) 0%, transparent 35%),
                radial-gradient(ellipse at 50% 80%, rgba(138, 43, 226, 0.08) 0%, transparent 40%),
                radial-gradient(ellipse at center, #1a0a0f 0%, #0d0508 40%, #050203 70%, #000000 100%)
              `,
            }}
          />

          {/* Massive star layers for deep space effect - 500 stars */}
          {[...Array(500)].map((_, i) => {
            const size = Math.random() * 2.5 + 0.3;
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const delay = Math.random() * 8;
            const duration = 2 + Math.random() * 6;
            const brightness = Math.random();

            return (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${left}%`,
                  top: `${top}%`,
                  opacity: brightness,
                  boxShadow: `0 0 ${size * 3}px rgba(255, 255, 255, ${
                    brightness * 0.8
                  })`,
                  animation: `twinkle ${duration}s ease-in-out ${delay}s infinite`,
                }}
              />
            );
          })}

          {/* Colorful cosmic dust particles */}
          {[...Array(100)].map((_, i) => {
            const colors = [
              "rgba(139, 0, 0, 0.4)", // Dark Red
              "rgba(220, 20, 60, 0.4)", // Crimson
              "rgba(255, 69, 0, 0.4)", // Red-Orange
              "rgba(138, 43, 226, 0.4)", // Blue-Violet/Purple
            ];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 1.5 + 0.5;
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const delay = Math.random() * 10;
            const duration = 4 + Math.random() * 8;

            return (
              <div
                key={`cosmic-${i}`}
                className="absolute rounded-full"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${left}%`,
                  top: `${top}%`,
                  background: color,
                  boxShadow: `0 0 ${size * 6}px ${color}`,
                  animation: `twinkle ${duration}s ease-in-out ${delay}s infinite`,
                  filter: "blur(0.5px)",
                }}
              />
            );
          })}

          {/* Nebula clouds with red/purple wormhole colors */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `
                radial-gradient(ellipse at 25% 35%, rgba(139, 0, 0, 0.25) 0%, transparent 40%),
                radial-gradient(ellipse at 75% 65%, rgba(220, 20, 60, 0.2) 0%, transparent 45%),
                radial-gradient(ellipse at 50% 50%, rgba(255, 69, 0, 0.15) 0%, transparent 50%),
                radial-gradient(ellipse at 60% 20%, rgba(138, 43, 226, 0.18) 0%, transparent 35%)
              `,
            }}
          />
        </div>

        {/* Rotating Wormhole Image - Even smaller */}
        <div
          className="relative w-48 md:w-56 lg:w-64 xl:w-72 aspect-square z-10 cursor-pointer group"
          onClick={handleEnter}
        >
          {/* Enhanced outer glow aura with red/purple wormhole colors - soft blend */}
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-300"
            style={{
              background: `
                radial-gradient(circle, 
                  rgba(220, 20, 60, 0.6) 0%, 
                  rgba(255, 69, 0, 0.4) 20%,
                  rgba(138, 43, 226, 0.3) 40%,
                  rgba(220, 20, 60, 0.15) 60%,
                  rgba(138, 43, 226, 0.08) 80%,
                  transparent 100%
                )
              `,
              transform: "scale(1.5)",
            }}
          />

          {/* Additional soft outer halo for seamless space integration */}
          <div
            className="absolute inset-0 rounded-full blur-[100px] opacity-30"
            style={{
              background: `
                radial-gradient(circle, 
                  rgba(255, 69, 0, 0.3) 0%,
                  rgba(220, 20, 60, 0.2) 30%,
                  rgba(138, 43, 226, 0.15) 50%,
                  rgba(255, 69, 0, 0.08) 70%,
                  transparent 100%
                )
              `,
              transform: "scale(2)",
            }}
          />

          <motion.div
            className="relative w-full h-full"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            whileHover={{scale: 1.05}}
          >
            {/* Wormhole Image with smooth edge blending */}
            <div
              className="w-full h-full rounded-full relative overflow-hidden"
              style={{
                backgroundImage: `url(${WORMHOLE_IMAGE})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "brightness(1.2) contrast(1.3) saturate(1.2)",
                boxShadow: `
                  0 0 60px rgba(220, 20, 60, 0.6), 
                  0 0 120px rgba(255, 69, 0, 0.4), 
                  0 0 180px rgba(138, 43, 226, 0.3),
                  inset 0 0 60px rgba(220, 20, 60, 0.2)
                `,
              }}
            >
              {/* Smooth edge fade mask - blends into space */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `
                    radial-gradient(circle at center,
                      transparent 0%,
                      transparent 60%,
                      rgba(0, 0, 0, 0.1) 70%,
                      rgba(0, 0, 0, 0.3) 80%,
                      rgba(0, 0, 0, 0.6) 90%,
                      rgba(0, 0, 0, 0.9) 100%
                    )
                  `,
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Overlay glow effect with smooth outer blend */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(220,20,60,0.15) 30%, rgba(255,69,0,0.1) 60%, rgba(138,43,226,0.05) 80%, transparent 100%)",
                animation: "pulse 3s ease-in-out infinite",
              }}
            />
          </motion.div>

          {/* Stranger Things Style Button - No background, flickering red glow */}
          {!isEntering && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                handleEnter();
              }}
              className="absolute -top-16 md:-top-20 left-[25%] md:left-[28%] -translate-x-1/2 
                         px-4 py-2 md:px-5 md:py-2.5
                         z-30
                         cursor-pointer"
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{duration: 0.5}}
              whileTap={{scale: 0.95}}
            >
              <motion.span
                className="relative z-10 text-[#ff0000] font-black text-sm md:text-base uppercase tracking-[0.3em]"
                style={{
                  fontFamily: "'Courier New', monospace",
                  textShadow: `
                    0 0 10px #ff0000,
                    0 0 20px #ff0000,
                    0 0 30px #ff0000,
                    0 0 40px #ff0000,
                    0 0 70px #ff0000
                  `,
                }}
                animate={{
                  opacity: [1, 0.7, 1, 0.8, 1, 0.6, 1],
                  textShadow: [
                    "0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000, 0 0 40px #ff0000, 0 0 70px #ff0000",
                    "0 0 5px #ff0000, 0 0 10px #ff0000, 0 0 15px #ff0000, 0 0 20px #ff0000, 0 0 35px #ff0000",
                    "0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000, 0 0 40px #ff0000, 0 0 70px #ff0000",
                    "0 0 8px #ff0000, 0 0 16px #ff0000, 0 0 24px #ff0000, 0 0 32px #ff0000, 0 0 50px #ff0000",
                    "0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000, 0 0 40px #ff0000, 0 0 70px #ff0000",
                  ],
                }}
                transition={{
                  opacity: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  textShadow: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                whileHover={{
                  scale: 1.1,
                  textShadow:
                    "0 0 15px #ff0000, 0 0 30px #ff0000, 0 0 45px #ff0000, 0 0 60px #ff0000, 0 0 100px #ff0000",
                }}
              >
                CLICK TO ENTER
              </motion.span>
            </motion.button>
          )}
        </div>

        {/* Portal Title - Moved to right corner */}
        <motion.div
          className="absolute top-8 md:top-12 right-8 md:right-16 lg:right-20 text-right z-20"
          initial={{opacity: 0, x: 30}}
          animate={{opacity: 1, x: 0}}
          transition={{duration: 1, delay: 0.3}}
        >
          <h2
            className="text-3xl md:text-5xl lg:text-6xl font-black mb-2"
            style={{
              background:
                "linear-gradient(135deg, #dc143c 0%, #ff4500 50%, #8a2be2 100%)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "gradient 4s ease infinite",
              filter: "drop-shadow(0 0 30px rgba(220, 20, 60, 0.6))",
            }}
          >
            WORMHOLE PORTAL
          </h2>
          <p className="text-gray-200 text-[10px] md:text-xs lg:text-sm tracking-[0.3em] uppercase font-semibold">
            Gateway to GameVerse Dimension
          </p>
        </motion.div>

        {/* Energy particles floating around wormhole */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {[...Array(40)].map((_, i) => {
            const size = Math.random() * 3 + 1;
            const colors = [
              "#dc143c", // Crimson
              "#ff4500", // Red-Orange
              "#8a2be2", // Blue-Violet
              "#ff1493", // Deep Pink
              "#ffffff", // White
            ];
            const color = colors[Math.floor(Math.random() * colors.length)];

            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  background: color,
                  boxShadow: `0 0 ${size * 4}px ${color}`,
                  left: `${40 + Math.random() * 20}%`,
                  top: `${40 + Math.random() * 20}%`,
                  filter: "blur(1px)",
                }}
                animate={{
                  x: [0, (Math.random() - 0.5) * 100],
                  y: [0, (Math.random() - 0.5) * 100],
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Full-screen Tunnel Transition Overlay */}
      <AnimatePresence>
        {isEntering && (
          <motion.div
            className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.3}}
          >
            {/* Zooming wormhole effect */}
            <motion.div
              className="absolute w-[200vw] h-[200vh]"
              initial={{scale: 0.5}}
              animate={{
                scale: 3,
                rotate: 720,
              }}
              transition={{duration: 2.5, ease: "easeIn"}}
              style={{
                backgroundImage: `url(${WORMHOLE_IMAGE})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "brightness(1.3) contrast(1.3)",
              }}
            />

            <motion.div
              className="text-center relative z-10"
              initial={{scale: 0.5, opacity: 0}}
              animate={{scale: 1, opacity: 1}}
              transition={{duration: 0.5, delay: 0.2}}
            >
              <motion.h1
                className="text-5xl md:text-8xl font-black mb-6"
                style={{
                  background:
                    "linear-gradient(135deg, #ff6b9d 0%, #4da6ff 50%, #9d4edd 100%)",
                  backgroundSize: "200% 200%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                ENTERING GAMEVERSE
              </motion.h1>
              <motion.p
                className="text-white text-base md:text-xl tracking-[0.3em] uppercase mb-8 font-bold"
                animate={{opacity: [0.5, 1, 0.5]}}
                transition={{duration: 1.5, repeat: Infinity}}
              >
                Traversing Spacetime Continuum
              </motion.p>

              {/* Loading progress bar */}
              <motion.div className="w-72 md:w-[500px] h-2 bg-gray-900/50 rounded-full mx-auto overflow-hidden backdrop-blur-sm">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, #ff6b9d 0%, #4da6ff 50%, #9d4edd 100%)",
                  }}
                  initial={{width: "0%"}}
                  animate={{width: "100%"}}
                  transition={{duration: 2.5, ease: "easeInOut"}}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gradient animation keyframes */}
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </>
  );
}
