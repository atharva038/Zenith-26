import React, {useState, useEffect, Suspense} from "react";
import {Canvas} from "@react-three/fiber";
import {Stars} from "@react-three/drei";
import {EffectComposer, Bloom, Vignette} from "@react-three/postprocessing";
import {useNavigate} from "react-router-dom";
import {motion} from "framer-motion";
import * as THREE from "three";
import {DotLottieReact} from "@lottiefiles/dotlottie-react";

// Import all stadium components
import {BallContext} from "./stadium/BallTrackingContext";
import AnimatedCamera from "./stadium/AnimatedCamera";
import StadiumField from "./stadium/StadiumField";
import StadiumFloodlights from "./stadium/StadiumFloodlights";
import StadiumStands from "./stadium/StadiumStands";
import AdvertisingBoards from "./stadium/AdvertisingBoards";
import Scoreboard from "./stadium/Scoreboard";
import GoalPosts from "./stadium/GoalPosts";
import FootballPlayer from "./stadium/FootballPlayer";
import EnergyParticles from "./stadium/EnergyParticles";
import TitleCard from "./stadium/TitleCard";

// ==================== STADIUM SCENE ====================
function StadiumScene() {
  return (
    <>
      {/* Enhanced Lighting Setup */}
      <ambientLight intensity={0.3} color="#1a1a2e" />

      {/* Main directional light (moonlight) */}
      <directionalLight
        position={[50, 80, 30]}
        intensity={0.8}
        color="#b8c5d6"
        castShadow
      />

      {/* Fill light from opposite side */}
      <directionalLight
        position={[-30, 40, -20]}
        intensity={0.3}
        color="#4a5568"
      />

      {/* Atmospheric rim light */}
      <directionalLight
        position={[0, 20, -80]}
        intensity={0.4}
        color="#1e3a5f"
      />

      {/* Simple gradient sky */}
      <color attach="background" args={["#0a0a1f"]} />
      <fog attach="fog" args={["#0a0a1f", 100, 250]} />

      {/* Enhanced stars */}
      <Stars
        radius={120}
        depth={60}
        count={8000}
        factor={5}
        saturation={0.8}
        fade
        speed={0.3}
      />

      {/* Stadium Components */}
      <StadiumField />
      <StadiumFloodlights />
      <StadiumStands />
      <AdvertisingBoards />
      <Scoreboard />
      <GoalPosts />
      <EnergyParticles />
      <TitleCard />

      {/* Football Player with Suspense for smooth loading */}
      <Suspense fallback={null}>
        <FootballPlayer />
      </Suspense>

      {/* Additional atmospheric lights */}
      <pointLight
        position={[0, 50, 0]}
        intensity={2}
        distance={100}
        color="#3b82f6"
        decay={2}
      />
      <hemisphereLight args={["#1e3a8a", "#1e1e3f", 0.3]} />
    </>
  );
}

// ==================== MAIN COMPONENT ====================
export default function StadiumIntro() {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState(1); // 1, 2, or 3
  const [animationFade, setAnimationFade] = useState(false);
  const [backgroundProgress, setBackgroundProgress] = useState(0); // 0 to 100

  // Story sequence: Zenith Logo (complete) → Football Goal (4s) → Trophy → Big Zenith Animated Logo
  useEffect(() => {
    // Background color transition (0-100% over 14 seconds)
    const bgInterval = setInterval(() => {
      setBackgroundProgress((prev) => {
        if (prev >= 100) {
          clearInterval(bgInterval);
          return 100;
        }
        return prev + 100 / 140; // 14 seconds = 140 intervals of 100ms
      });
    }, 100);

    // Animation 1: Zenith Logo - 5 seconds (white background - complete animation)
    const timer1 = setTimeout(() => {
      setAnimationFade(true);
      setTimeout(() => {
        setCurrentAnimation(2);
        setAnimationFade(false);
      }, 400);
    }, 4600);

    // Animation 2: Football Goal - 4 seconds (2 seconds more)
    const timer2 = setTimeout(() => {
      setAnimationFade(true);
      setTimeout(() => {
        setCurrentAnimation(3);
        setAnimationFade(false);
      }, 400);
    }, 8600);

    // Animation 3: Trophy - 2 seconds
    const timer3 = setTimeout(() => {
      setAnimationFade(true);
      setTimeout(() => {
        setCurrentAnimation(4);
        setAnimationFade(false);
      }, 400);
    }, 10600);

    // Animation 4: Big Zenith Animated Logo - 3 seconds then navigate (total 14 seconds)
    const timer4 = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => navigate("/home"), 800);
    }, 14000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearInterval(bgInterval);
    };
  }, [navigate]);

  const handleSkip = () => {
    setFadeOut(true);
    setTimeout(() => navigate("/home"), 500);
  };

  // Calculate smooth background color based on progress (0-100)
  const getBackgroundStyle = () => {
    const p = backgroundProgress;

    if (p <= 40) {
      // Pure white to light pastel (0-40%) - during first animation
      const factor = p / 40;
      return {
        background: `linear-gradient(135deg, 
          rgb(${255 - factor * 103}, ${255 - factor * 118}, ${
          255 - factor * 21
        }),
          rgb(${255 - factor * 137}, ${255 - factor * 180}, ${
          255 - factor * 93
        }),
          rgb(${255 - factor * 15}, ${255 - factor * 108}, ${255 - factor * 4})
        )`,
      };
    } else if (p <= 65) {
      // Light pastel to vibrant gradient (40-65%) - during football goal
      const factor = (p - 40) / 25;
      return {
        background: `linear-gradient(135deg, 
          rgb(${152 - factor * 50}, ${137 - factor * 19}, ${234}),
          rgb(${118}, ${75}, ${162}),
          rgb(${240}, ${147}, ${251})
        )`,
      };
    } else {
      // Full vibrant gradient with animation (65-100%) - during trophy & final logo
      return {
        background:
          "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #ffd200 100%)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 15s ease infinite",
      };
    }
  };

  return (
    <div
      className={`relative w-full h-screen flex items-center justify-center overflow-hidden transition-opacity duration-800 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
      style={{
        ...getBackgroundStyle(),
        transition: "background 1s ease-in-out",
        willChange: "background",
      }}
    >
      {/* Optimized Floating Particles - Only show after 65% progress */}
      {backgroundProgress > 65 && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${10 + Math.random() * 5}s linear infinite`,
                animationDelay: `${Math.random() * 10}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Mesh Gradient Overlays - Only show after 75% progress */}
      {backgroundProgress > 75 && (
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div
            className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)",
            }}
          />
        </div>
      )}

      {/* Animation Container with Smooth Fade Transitions */}
      <div
        className={`relative z-10 w-full h-full flex items-center justify-center transition-opacity duration-400 ${
          animationFade ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Animation 1: Zenith Logo - COMPLETE (White Background, 0-5s) */}
        {currentAnimation === 1 && (
          <div className="w-[90vw] h-[90vh] max-w-5xl flex flex-col items-center justify-center">
            <DotLottieReact
              src="https://lottie.host/b93026fe-161a-40fa-b32c-1d2de02bb01c/6NXGr6HkMW.lottie"
              loop
              autoplay
              className="w-full h-full"
              style={{willChange: "transform"}}
            />
            <div className="absolute bottom-16 md:bottom-20 text-center px-4">
              <h1 className="font-orbitron text-5xl md:text-7xl lg:text-8xl font-black text-gray-800 mb-3 drop-shadow-lg">
                ZENITH 2026
              </h1>
              <p className="font-rajdhani text-xl md:text-2xl lg:text-3xl text-gray-700 drop-shadow-md">
                Where Champions Rise
              </p>
            </div>
          </div>
        )}

        {/* Animation 2: Football Goal - 4 SECONDS (Gradient Background, 5-9s) */}
        {currentAnimation === 2 && (
          <div className="w-[90vw] h-[90vh] max-w-5xl flex items-center justify-center">
            <DotLottieReact
              src="https://lottie.host/be149a45-a151-4e2b-a14e-1ce2eda46c6f/YiF1kLFlgL.lottie"
              loop
              autoplay
              className="w-full h-full"
              style={{willChange: "transform"}}
            />
          </div>
        )}

        {/* Animation 3: Trophy - 2 SECONDS (Vibrant Gradient, 9-11s) */}
        {currentAnimation === 3 && (
          <div className="w-[80vw] h-[80vh] max-w-4xl flex items-center justify-center">
            <DotLottieReact
              src="https://lottie.host/f8f4b7c2-6d62-4692-8519-1dbdccbd846c/GX4tHIQ160.lottie"
              loop
              autoplay
              className="w-full h-full"
              style={{willChange: "transform"}}
            />
          </div>
        )}

        {/* Animation 4: BIG Zenith Animated Logo (Full Gradient, 11-14s) */}
        {currentAnimation === 4 && (
          <div className="w-full h-full flex items-center justify-center px-4">
            <DotLottieReact
              src="https://lottie.host/778d57c3-a55a-43cd-80af-2268c648ef16/GPgvLBX4u3.lottie"
              loop
              autoplay
              className="w-full h-full max-w-6xl"
              style={{willChange: "transform"}}
            />
          </div>
        )}
      </div>

      {/* Minimalist Progress Indicator - 4 Dots */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        <div
          className={`w-10 h-1 rounded-full transition-all duration-400 ${
            currentAnimation >= 1
              ? backgroundProgress < 20
                ? "bg-gray-700"
                : "bg-white"
              : backgroundProgress < 20
              ? "bg-gray-300"
              : "bg-white/30"
          }`}
        />
        <div
          className={`w-10 h-1 rounded-full transition-all duration-400 ${
            currentAnimation >= 2
              ? backgroundProgress < 20
                ? "bg-gray-700"
                : "bg-white"
              : backgroundProgress < 20
              ? "bg-gray-300"
              : "bg-white/30"
          }`}
        />
        <div
          className={`w-10 h-1 rounded-full transition-all duration-400 ${
            currentAnimation >= 3
              ? backgroundProgress < 20
                ? "bg-gray-700"
                : "bg-white"
              : backgroundProgress < 20
              ? "bg-gray-300"
              : "bg-white/30"
          }`}
        />
        <div
          className={`w-10 h-1 rounded-full transition-all duration-400 ${
            currentAnimation >= 4
              ? backgroundProgress < 20
                ? "bg-gray-700"
                : "bg-white"
              : backgroundProgress < 20
              ? "bg-gray-300"
              : "bg-white/30"
          }`}
        />
      </div>

      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className={`group absolute bottom-8 right-8 z-30 px-6 py-3 backdrop-blur-sm border-2 rounded-xl font-rajdhani text-base font-bold transition-all duration-300 hover:scale-105 ${
          backgroundProgress < 20
            ? "bg-gray-800/10 border-gray-700/40 text-gray-800 hover:bg-gray-800/20"
            : "bg-white/10 border-white/40 text-white hover:bg-white/20"
        }`}
      >
        <span className="relative z-10 flex items-center gap-2">
          Skip
          <span className="text-lg group-hover:translate-x-1 transition-transform">
            →
          </span>
        </span>
      </button>
    </div>
  );
}
