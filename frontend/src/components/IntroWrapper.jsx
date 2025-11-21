import {useState, useEffect} from "react";
import CinematicIntro from "./CinematicIntro";
import SimplifiedIntro from "./SimplifiedIntro";

// Detect if device can handle WebGL and 3D graphics
function canUseWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return !!gl;
  } catch (e) {
    return false;
  }
}

// Detect if device is mobile or low-end
function isLowEndDevice() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isSlowDevice = navigator.hardwareConcurrency
    ? navigator.hardwareConcurrency < 4
    : false;
  return isMobile || isSlowDevice || !canUseWebGL();
}

export default function IntroWrapper() {
  const [useFallback, setUseFallback] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check device capabilities
    const shouldUseFallback = isLowEndDevice();
    setUseFallback(shouldUseFallback);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-rajdhani text-white text-xl">
            Loading Experience...
          </p>
        </div>
      </div>
    );
  }

  return useFallback ? <SimplifiedIntro /> : <CinematicIntro />;
}
