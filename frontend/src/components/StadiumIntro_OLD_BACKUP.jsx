import React, { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";

// Import all stadium components
import { BallContext } from "./stadium/BallTrackingContext";
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
  const [progress, setProgress] = useState(0);
  const [showGoal, setShowGoal] = useState(false);

  // Ball tracking state for camera-ball coordination
  const [ballTrackingState] = useState({
    ballPosition: null,
    isBallFlying: false,
    cameraShake: 0,
    flyProgress: 0,
  });

  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 100 / 200; // 20 seconds = 200 intervals of 100ms
      });
    }, 100);

    // Show GOAL text at 12 seconds (when ball hits net)
    const goalTimer = setTimeout(() => {
      setShowGoal(true);
      setTimeout(() => setShowGoal(false), 3000);
    }, 12000);

    // Auto-navigate after 20 seconds
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => navigate("/home"), 1500);
    }, 20000);

    return () => {
      clearTimeout(timer);
      clearTimeout(goalTimer);
      clearInterval(progressInterval);
    };
  }, [navigate]);

  const handleSkip = () => {
    setFadeOut(true);
    setTimeout(() => navigate("/home"), 500);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Animated Title Overlay */}
      <div className="absolute top-16 left-0 right-0 z-20 text-center pointer-events-none">
        <h1 className="font-orbitron text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-blue-500 to-orange-500 bg-[length:200%_100%] animate-gradient drop-shadow-[0_0_40px_rgba(59,130,246,0.8)]">
          ZENITH STADIUM
        </h1>
        <p className="font-rajdhani text-2xl md:text-3xl text-white/90 mt-6 tracking-[0.5em] drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
          WELCOME TO THE ARENA
        </p>

        {/* Animated subtitle */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-orange-500"></div>
          <p className="font-rajdhani text-lg text-orange-400 tracking-widest animate-pulse">
            SGGSIE&T 2026
          </p>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-orange-500"></div>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        shadows={false}
        dpr={[1, 1.5]}
        performance={{ min: 0.8 }}
        className={`transition-opacity duration-1500 ${
          fadeOut ? "opacity-0" : "opacity-100"
        }`}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
      >
        <BallContext.Provider value={ballTrackingState}>
          <AnimatedCamera />
          <StadiumScene />

          {/* Post-processing */}
          <EffectComposer multisampling={8}>
            <Bloom
              intensity={1.5}
              luminanceThreshold={0.15}
              luminanceSmoothing={0.9}
              height={300}
              mipmapBlur
            />
            <Vignette eskil={false} offset={0.15} darkness={0.8} />
          </EffectComposer>
        </BallContext.Provider>
      </Canvas>

      {/* Progress Bar */}
      <div className="absolute bottom-52 left-1/2 transform -translate-x-1/2 z-20 w-96 max-w-[90vw]">
        <div className="h-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-blue-500 transition-all duration-100 ease-linear rounded-full"
            style={{ width: `${progress}%` }}
          >
            <div className="h-full w-full bg-white/30 animate-pulse"></div>
          </div>
        </div>
        <p className="text-center text-white/60 font-rajdhani text-sm mt-2">
          {Math.floor(progress)}% • Cinematic tour in progress...
        </p>
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 z-20 text-center">
        <div className="flex items-center gap-4 text-white/40 font-rajdhani">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse animation-delay-200"></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse animation-delay-400"></div>
          </div>
          <p className="text-sm tracking-wider">LIVE CAMERA FEED</p>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse animation-delay-400"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse animation-delay-200"></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className="group absolute bottom-24 right-12 z-30 px-10 py-5 bg-gradient-to-r from-orange-600 to-blue-600 backdrop-blur-md border-2 border-white/50 rounded-2xl text-white font-rajdhani text-xl font-bold hover:from-orange-500 hover:to-blue-500 transition-all duration-300 hover:scale-110 shadow-[0_0_40px_rgba(59,130,246,0.6)] hover:shadow-[0_0_60px_rgba(249,115,22,0.8)] relative overflow-hidden"
      >
        <span className="relative z-10 flex items-center gap-3">
          Enter ZENITH
          <span className="text-2xl group-hover:translate-x-2 transition-transform">
            →
          </span>
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
      </button>

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-orange-500/50 z-10"></div>
      <div className="absolute top-0 right-0 w-32 h-32 border-r-4 border-t-4 border-blue-500/50 z-10"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 border-l-4 border-b-4 border-blue-500/50 z-10"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-4 border-b-4 border-orange-500/50 z-10"></div>

      {/* GOOOAL! Overlay */}
      {showGoal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="text-center animate-bounce">
            <h1 className="font-orbitron text-[15rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-500 drop-shadow-[0_0_80px_rgba(255,165,0,1)] animate-pulse">
              GOOOAL!
            </h1>
            <p className="font-rajdhani text-4xl text-white mt-4 tracking-[0.5em] drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]">
              ⚽ ZENITH STRIKER SCORES! ⚽
            </p>

            {/* Fireworks background */}
            <div className="absolute inset-0 -z-10">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full animate-ping"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    backgroundColor:
                      i % 3 === 0
                        ? "#ff6b00"
                        : i % 3 === 1
                        ? "#00d4ff"
                        : "#ffeb3b",
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${1 + Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
