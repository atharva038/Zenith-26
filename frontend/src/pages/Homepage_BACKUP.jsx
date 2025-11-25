import {useEffect, useRef, useState} from "react";
import {motion, useReducedMotion} from "framer-motion";
import Tilt from "react-parallax-tilt";
import {gsap} from "gsap";
import {DotLottieReact} from "@lottiefiles/dotlottie-react";
import {useTheme} from "../context/ThemeContext";

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const cursorGlowRef = useRef(null);

  useEffect(() => {
    const moveCursor = (e) => {
      gsap.to(cursorRef.current, {x: e.clientX, y: e.clientY, duration: 0.1});
      gsap.to(cursorGlowRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
      });
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{transform: "translate(-50%, -50%)"}}
      />
      <div
        ref={cursorGlowRef}
        className="fixed w-8 h-8 border-2 border-neon-orange rounded-full pointer-events-none z-[9998] opacity-50"
        style={{transform: "translate(-50%, -50%)"}}
      />
    </>
  );
};

const AnimatedBackground = ({theme}) => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <motion.div
      className={`absolute inset-0 ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900"
          : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
      }`}
      animate={
        theme === "dark"
          ? {
              background: [
                "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)",
                "linear-gradient(135deg, #0f172a 0%, #831843 50%, #0f172a 100%)",
                "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)",
              ],
            }
          : {
              background: [
                "linear-gradient(135deg, #eff6ff 0%, #fae8ff 50%, #fce7f3 100%)",
                "linear-gradient(135deg, #fce7f3 0%, #eff6ff 50%, #fae8ff 100%)",
                "linear-gradient(135deg, #eff6ff 0%, #fae8ff 50%, #fce7f3 100%)",
              ],
            }
      }
      transition={{duration: 10, repeat: Infinity, ease: "linear"}}
    />
    {[...Array(30)].map((_, i) => (
      <motion.div
        key={i}
        className={`absolute w-1 h-1 ${
          theme === "dark" ? "bg-neon-blue" : "bg-blue-400"
        } rounded-full`}
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{y: [0, -30, 0], opacity: [0, 1, 0], scale: [0, 1.5, 0]}}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      />
    ))}
    <div className="absolute inset-0 opacity-20">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute h-full w-1 ${
            theme === "dark"
              ? "bg-gradient-to-b from-transparent via-neon-orange to-transparent"
              : "bg-gradient-to-b from-transparent via-orange-400 to-transparent"
          }`}
          style={{left: `${20 + i * 15}%`}}
          animate={{opacity: [0.2, 0.5, 0.2], scaleY: [0.8, 1, 0.8]}}
          transition={{
            duration: 2 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  </div>
);

export default function Homepage() {
  const shouldReduceMotion = useReducedMotion();
  const {theme, toggleTheme} = useTheme();

  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{duration: 0.8}}
      className={`relative min-h-screen ${
        theme === "dark" ? "bg-slate-950 text-white" : "bg-white text-gray-900"
      } overflow-x-hidden`}
    >
      {!shouldReduceMotion && (
        <div className="hidden md:block">
          <CustomCursor />
        </div>
      )}
      <AnimatedBackground theme={theme} />

      {/* Theme Toggle Button */}
      <motion.button
        initial={{opacity: 0, scale: 0.8}}
        animate={{opacity: 1, scale: 1}}
        transition={{duration: 0.5, delay: 0.3}}
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-4 rounded-full ${
          theme === "dark"
            ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white"
            : "bg-gradient-to-br from-orange-400 to-pink-400 text-white"
        } shadow-lg hover:scale-110 transition-transform duration-300`}
        whileHover={{rotate: 180}}
        whileTap={{scale: 0.9}}
      >
        {theme === "dark" ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </motion.button>

      {/* Zenith Lottie Logo - Top Left Corner */}
      <motion.div
        initial={{opacity: 0, x: -50}}
        animate={{opacity: 1, x: 0}}
        transition={{duration: 1, delay: 0.5}}
        className="fixed left-6 z-50 w-32 h-32 md:w-40 md:h-40"
      >
        <DotLottieReact
          src="https://lottie.host/778d57c3-a55a-43cd-80af-2268c648ef16/GPgvLBX4u3.lottie"
          autoplay
          className="w-full h-full"
        />
      </motion.div>

      <div className="relative z-10">
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{opacity: 0, scale: 3}}
            animate={{opacity: 1, scale: 1}}
            transition={{duration: 1.5, ease: "easeOut"}}
            className="mb-12 text-center"
          >
            <h1
              className={`font-orbitron text-7xl md:text-9xl font-bold text-transparent bg-clip-text ${
                theme === "dark"
                  ? "bg-gradient-to-r from-neon-orange via-neon-blue to-neon-orange"
                  : "bg-gradient-to-r from-orange-500 via-blue-600 to-pink-600"
              } bg-[length:200%_100%] animate-gradient`}
            >
              ZENITH
            </h1>
            <p
              className={`font-orbitron text-4xl md:text-6xl mt-2 ${
                theme === "dark" ? "text-neon-blue" : "text-blue-600"
              }`}
            >
              2026
            </p>
          </motion.div>

          <motion.h2
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 1.2, duration: 0.8}}
            className={`font-orbitron text-4xl md:text-6xl font-bold text-center mb-6 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Let the Game Begin ⚡
          </motion.h2>
          <motion.p
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 1.5, duration: 0.8}}
            className={`font-rajdhani text-xl md:text-2xl text-center max-w-3xl mb-12 ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            SGGSIE&T Annual Sports Festival — Experience the spirit of
            competition and excellence.
          </motion.p>

          <motion.div
            initial={{opacity: 0, scale: 0.8}}
            animate={{opacity: 1, scale: 1}}
            transition={{delay: 1.8, duration: 0.5}}
            className="flex flex-wrap gap-6 justify-center"
          >
            <motion.button
              whileHover={{scale: 1.05, y: -5}}
              whileTap={{scale: 0.95}}
              className={`px-8 py-4 font-rajdhani text-lg font-bold rounded-lg ${
                theme === "dark"
                  ? "bg-gradient-to-r from-neon-orange to-red-600"
                  : "bg-gradient-to-r from-orange-500 to-red-500"
              } text-white relative overflow-hidden group`}
            >
              <span className="relative z-10 flex items-center gap-2">
                🏆 Explore Events
              </span>
            </motion.button>
            <motion.button
              whileHover={{scale: 1.05, y: -5}}
              whileTap={{scale: 0.95}}
              className={`px-8 py-4 font-rajdhani text-lg font-bold rounded-lg bg-transparent ${
                theme === "dark"
                  ? "text-neon-blue border-2 border-neon-blue"
                  : "text-blue-600 border-2 border-blue-600"
              }`}
            >
              <span className="flex items-center gap-2">📸 View Gallery</span>
            </motion.button>
          </motion.div>

          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{delay: 2.5, duration: 1}}
            className="absolute bottom-10"
          >
            <motion.div
              animate={{y: [0, 10, 0]}}
              transition={{duration: 1.5, repeat: Infinity}}
              className={`w-6 h-10 border-2 rounded-full flex items-start justify-center p-2 ${
                theme === "dark" ? "border-neon-blue" : "border-blue-600"
              }`}
            >
              <div
                className={`w-1.5 h-2 rounded-full ${
                  theme === "dark" ? "bg-neon-blue" : "bg-blue-600"
                }`}
              />
            </motion.div>
          </motion.div>
        </section>

        <section className="relative py-20 px-6">
          <motion.div
            initial={{opacity: 0, y: 50}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.8}}
            className="max-w-7xl mx-auto"
          >
            <h2
              className={`font-orbitron text-5xl md:text-6xl font-bold text-center mb-4 text-transparent bg-clip-text ${
                theme === "dark"
                  ? "bg-gradient-to-r from-neon-blue to-neon-orange"
                  : "bg-gradient-to-r from-blue-600 to-orange-500"
              }`}
            >
              Choose Your Arena
            </h2>
            <p
              className={`font-rajdhani text-xl text-center mb-16 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Six disciplines. Infinite glory.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Cricket",
                  icon: "🏏",
                  color: "from-green-600 to-green-800",
                },
                {
                  name: "Volleyball",
                  icon: "🏐",
                  color: "from-yellow-600 to-orange-600",
                },
                {
                  name: "Chess",
                  icon: "♟️",
                  color: "from-gray-700 to-slate-900",
                },
                {
                  name: "E-Games",
                  icon: "🎮",
                  color: "from-purple-600 to-pink-600",
                },
                {
                  name: "Athletics",
                  icon: "🏃",
                  color: "from-red-600 to-orange-600",
                },
                {
                  name: "Badminton",
                  icon: "🏸",
                  color: "from-blue-600 to-cyan-600",
                },
              ].map((sport, index) => (
                <motion.div
                  key={sport.name}
                  initial={{opacity: 0, y: 50}}
                  whileInView={{opacity: 1, y: 0}}
                  viewport={{once: true}}
                  transition={{delay: index * 0.15, duration: 0.8}}
                >
                  <Tilt
                    tiltMaxAngleX={15}
                    tiltMaxAngleY={15}
                    glareEnable={true}
                    glareMaxOpacity={0.3}
                    glareColor={theme === "dark" ? "#00d4ff" : "#3b82f6"}
                    scale={1.05}
                  >
                    <div
                      className={`relative rounded-2xl p-8 border-2 transition-all duration-300 group cursor-pointer ${
                        theme === "dark"
                          ? "bg-slate-900/50 border-slate-700 hover:border-neon-blue"
                          : "bg-white border-gray-200 hover:border-blue-500"
                      } backdrop-blur-sm`}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${sport.color} opacity-0 group-hover:opacity-20 transition-opacity rounded-2xl`}
                      />
                      <div className="relative z-10">
                        <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                          {sport.icon}
                        </div>
                        <h3
                          className={`font-orbitron text-2xl font-bold mb-2 ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {sport.name}
                        </h3>
                        <p
                          className={`font-rajdhani ${
                            theme === "dark"
                              ? "text-gray-400 group-hover:text-gray-300"
                              : "text-gray-600 group-hover:text-gray-700"
                          }`}
                        >
                          Compete for glory →
                        </p>
                      </div>
                    </div>
                  </Tilt>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="relative py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.h2
              initial={{opacity: 0, x: -50}}
              whileInView={{opacity: 1, x: 0}}
              viewport={{once: true}}
              transition={{duration: 0.8}}
              className={`font-orbitron text-5xl md:text-6xl font-bold mb-8 text-transparent bg-clip-text ${
                theme === "dark"
                  ? "bg-gradient-to-r from-neon-orange to-neon-blue"
                  : "bg-gradient-to-r from-orange-500 to-blue-600"
              }`}
            >
              About Zenith
            </motion.h2>
            <motion.div
              initial={{opacity: 0, y: 30}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{delay: 0.3, duration: 0.8}}
              className={`rounded-2xl p-8 md:p-12 border-2 backdrop-blur-sm ${
                theme === "dark"
                  ? "bg-slate-900/30 border-slate-700"
                  : "bg-white/70 border-gray-200"
              }`}
            >
              <p
                className={`font-rajdhani text-xl md:text-2xl leading-relaxed mb-6 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Zenith is not just a sports festival — it's where legends are
                born. Since its inception, Zenith has been the ultimate platform
                for student athletes to showcase their skills, compete at the
                highest level, and forge lifelong memories.
              </p>
              <p
                className={`font-rajdhani text-lg md:text-xl leading-relaxed ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                From the roaring cricket grounds to the intense chess battles,
                from the electrifying e-sports arena to the adrenaline-pumping
                athletics track — Zenith 2026 promises to be the most
                spectacular edition yet.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="relative py-16 overflow-hidden">
          <motion.h3
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            className={`font-orbitron text-3xl font-bold text-center mb-12 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Our Champions
          </motion.h3>
          <motion.div
            animate={{x: ["0%", "-50%"]}}
            transition={{duration: 20, repeat: Infinity, ease: "linear"}}
            className="flex gap-12"
          >
            {[
              "NIKE",
              "ADIDAS",
              "PUMA",
              "REDBULL",
              "MONSTER",
              "GATORADE",
              "NIKE",
              "ADIDAS",
              "PUMA",
              "REDBULL",
            ].map((sponsor, i) => (
              <div
                key={i}
                className={`px-8 py-6 rounded-lg border-2 transition-colors whitespace-nowrap group cursor-pointer ${
                  theme === "dark"
                    ? "bg-slate-900/50 border-slate-700 hover:border-neon-orange"
                    : "bg-white border-gray-200 hover:border-orange-500"
                }`}
              >
                <span
                  className={`font-orbitron text-2xl font-bold transition-colors ${
                    theme === "dark"
                      ? "text-gray-500 group-hover:text-white"
                      : "text-gray-400 group-hover:text-gray-900"
                  }`}
                >
                  {sponsor}
                </span>
              </div>
            ))}
          </motion.div>
        </section>

        <motion.footer
          initial={{opacity: 0, y: 50}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          className={`relative mt-20 border-t py-12 ${
            theme === "dark" ? "border-slate-800" : "border-gray-200"
          }`}
        >
          <div
            className={`absolute top-0 left-0 right-0 h-1 ${
              theme === "dark"
                ? "bg-gradient-to-r from-transparent via-neon-blue to-transparent"
                : "bg-gradient-to-r from-transparent via-blue-500 to-transparent"
            }`}
          />
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h3
              className={`font-orbitron text-4xl font-bold text-transparent bg-clip-text mb-4 ${
                theme === "dark"
                  ? "bg-gradient-to-r from-neon-orange to-neon-blue"
                  : "bg-gradient-to-r from-orange-500 to-blue-600"
              }`}
            >
              ZENITH 2026
            </h3>
            <div className="flex gap-6 justify-center mb-8">
              {["📘", "📷", "🐦", "▶️", "💼"].map((icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{scale: 1.2, rotate: 360}}
                  className={`w-12 h-12 flex items-center justify-center rounded-full border-2 transition-colors ${
                    theme === "dark"
                      ? "bg-slate-900 border-slate-700 hover:border-neon-blue"
                      : "bg-white border-gray-300 hover:border-blue-500"
                  }`}
                >
                  <span className="text-2xl">{icon}</span>
                </motion.a>
              ))}
            </div>
            <p
              className={`font-rajdhani ${
                theme === "dark" ? "text-gray-500" : "text-gray-600"
              }`}
            >
              © 2026 SGGSIE&T Zenith. All rights reserved.
            </p>
            <p className="font-rajdhani text-sm text-gray-600 mt-2">
              Where Champions Rise 🏆
            </p>
          </div>
        </motion.footer>
      </div>
    </motion.div>
  );
}
