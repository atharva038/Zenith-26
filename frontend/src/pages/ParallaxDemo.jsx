import {useEffect, useRef, useState} from "react";
import gsap from "gsap";
import DemoNavigation from "../components/DemoNavigation";

export default function ParallaxDemo() {
  const containerRef = useRef(null);
  const stadiumRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const layer1Ref = useRef(null);
  const layer2Ref = useRef(null);
  const layer3Ref = useRef(null);
  const cursorRef = useRef(null);

  const [mousePos, setMousePos] = useState({x: 0, y: 0});
  const [intensity, setIntensity] = useState(20);
  const [showGrid, setShowGrid] = useState(true);
  const [activeDemo, setActiveDemo] = useState("all");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Normalize to -1 to 1
      const normalizedX = (x / rect.width - 0.5) * 2;
      const normalizedY = (y / rect.height - 0.5) * 2;

      setMousePos({x: normalizedX, y: normalizedY});

      // Update cursor position
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.3,
          ease: "power2.out",
        });
      }

      // STADIUM - moves WITH mouse (subtle)
      if (
        stadiumRef.current &&
        (activeDemo === "all" || activeDemo === "stadium")
      ) {
        gsap.to(stadiumRef.current, {
          x: normalizedX * intensity * 0.5,
          y: normalizedY * intensity * 0.5,
          duration: 0.8,
          ease: "power2.out",
        });
      }

      // TITLE - moves OPPOSITE to mouse (more pronounced)
      if (titleRef.current && (activeDemo === "all" || activeDemo === "text")) {
        gsap.to(titleRef.current, {
          x: -normalizedX * intensity * 1.5,
          y: -normalizedY * intensity * 1.5,
          duration: 0.6,
          ease: "power2.out",
        });
      }

      // SUBTITLE - moves OPPOSITE with different speed
      if (
        subtitleRef.current &&
        (activeDemo === "all" || activeDemo === "text")
      ) {
        gsap.to(subtitleRef.current, {
          x: -normalizedX * intensity * 1.2,
          y: -normalizedY * intensity * 1.2,
          duration: 0.7,
          ease: "power2.out",
        });
      }

      // MULTI-LAYER PARALLAX
      if (activeDemo === "all" || activeDemo === "layers") {
        if (layer1Ref.current) {
          gsap.to(layer1Ref.current, {
            x: normalizedX * intensity * 0.3,
            y: normalizedY * intensity * 0.3,
            duration: 1,
            ease: "power2.out",
          });
        }

        if (layer2Ref.current) {
          gsap.to(layer2Ref.current, {
            x: -normalizedX * intensity * 0.8,
            y: -normalizedY * intensity * 0.8,
            duration: 0.7,
            ease: "power2.out",
          });
        }

        if (layer3Ref.current) {
          gsap.to(layer3Ref.current, {
            x: normalizedX * intensity * 1.5,
            y: normalizedY * intensity * 1.5,
            duration: 0.5,
            ease: "power2.out",
          });
        }
      }
    };

    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, [intensity, activeDemo]);

  // Reset animation
  const resetPositions = () => {
    const elements = [
      stadiumRef,
      titleRef,
      subtitleRef,
      layer1Ref,
      layer2Ref,
      layer3Ref,
    ];
    elements.forEach((ref) => {
      if (ref.current) {
        gsap.to(ref.current, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      }
    });
    setMousePos({x: 0, y: 0});
  };

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      {/* Navigation */}
      <DemoNavigation />

      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className="fixed w-8 h-8 border-2 border-emerald-400 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{transform: "translate(-50%, -50%)"}}
      />

      {/* Control Panel */}
      <div className="fixed top-4 left-4 z-50 bg-black/80 backdrop-blur-md p-6 rounded-xl border border-emerald-500/30 max-w-sm">
        <h3 className="text-emerald-400 font-bold text-lg mb-4">
          🎮 Parallax Controls
        </h3>

        {/* Intensity Slider */}
        <div className="mb-4">
          <label className="text-white text-sm block mb-2">
            Intensity: <span className="text-emerald-400">{intensity}px</span>
          </label>
          <input
            type="range"
            min="5"
            max="50"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
        </div>

        {/* Demo Mode Selector */}
        <div className="mb-4">
          <label className="text-white text-sm block mb-2">Demo Mode:</label>
          <div className="grid grid-cols-2 gap-2">
            {["all", "stadium", "text", "layers"].map((mode) => (
              <button
                key={mode}
                onClick={() => setActiveDemo(mode)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeDemo === mode
                    ? "bg-emerald-500 text-black"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Toggle */}
        <label className="flex items-center gap-2 mb-4 cursor-pointer">
          <input
            type="checkbox"
            checked={showGrid}
            onChange={(e) => setShowGrid(e.target.checked)}
            className="accent-emerald-500"
          />
          <span className="text-white text-sm">Show Grid</span>
        </label>

        {/* Reset Button */}
        <button
          onClick={resetPositions}
          className="w-full bg-emerald-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-emerald-400 transition-colors"
        >
          Reset Positions
        </button>

        {/* Mouse Position Display */}
        <div className="mt-4 pt-4 border-t border-emerald-500/30">
          <div className="text-xs text-gray-400 space-y-1">
            <p>
              Mouse X:{" "}
              <span className="text-emerald-400">{mousePos.x.toFixed(2)}</span>
            </p>
            <p>
              Mouse Y:{" "}
              <span className="text-emerald-400">{mousePos.y.toFixed(2)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="fixed top-4 right-4 z-50 bg-black/80 backdrop-blur-md p-6 rounded-xl border border-emerald-500/30 max-w-md">
        <h3 className="text-emerald-400 font-bold text-lg mb-3">
          ℹ️ How It Works
        </h3>
        <div className="text-sm text-gray-300 space-y-2">
          <p>
            <span className="text-emerald-400">🏟️ Stadium:</span> Moves WITH
            mouse (subtle)
          </p>
          <p>
            <span className="text-emerald-400">📝 Text:</span> Moves OPPOSITE
            (pronounced)
          </p>
          <p>
            <span className="text-emerald-400">🎨 Layers:</span> Different
            speeds create depth
          </p>
          <p className="text-xs text-gray-500 mt-3">
            Move your mouse around to see the parallax magic!
          </p>
        </div>
      </div>

      {/* Main Demo Container */}
      <div
        ref={containerRef}
        className="relative w-full min-h-screen flex items-center justify-center"
      >
        {/* Grid Overlay (optional) */}
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="w-full h-full grid grid-cols-12 grid-rows-12">
              {[...Array(144)].map((_, i) => (
                <div key={i} className="border border-emerald-500/20" />
              ))}
            </div>
          </div>
        )}

        {/* Stadium Background Layer */}
        <div
          ref={stadiumRef}
          className="absolute inset-0 transition-transform will-change-transform"
          style={{
            backgroundImage: "url(/img/stadium.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.4)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />
        </div>

        {/* Parallax Layer 1 - Slowest (Background particles) */}
        {(activeDemo === "all" || activeDemo === "layers") && (
          <div
            ref={layer1Ref}
            className="absolute inset-0 pointer-events-none transition-transform will-change-transform"
          >
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-emerald-500/20 rounded-full blur-sm"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        )}

        {/* Parallax Layer 2 - Medium Speed */}
        {(activeDemo === "all" || activeDemo === "layers") && (
          <div
            ref={layer2Ref}
            className="absolute inset-0 pointer-events-none transition-transform will-change-transform"
          >
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 bg-emerald-400/30 rounded-full blur-md"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        )}

        {/* Parallax Layer 3 - Fastest (Foreground particles) */}
        {(activeDemo === "all" || activeDemo === "layers") && (
          <div
            ref={layer3Ref}
            className="absolute inset-0 pointer-events-none transition-transform will-change-transform"
          >
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute w-4 h-4 bg-emerald-300/40 rounded-full blur-lg"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        )}

        {/* Text Content Layer - Moves Opposite */}
        <div className="relative z-10 text-center space-y-8 px-4">
          {/* Main Title */}
          <div
            ref={titleRef}
            className="transition-transform will-change-transform"
          >
            <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-500 drop-shadow-[0_0_50px_rgba(16,185,129,0.5)]">
              ZENITH
            </h1>
            <div className="absolute inset-0 flex items-center justify-center opacity-20 blur-2xl">
              <h1 className="text-7xl md:text-9xl font-black text-emerald-400">
                ZENITH
              </h1>
            </div>
          </div>

          {/* Subtitle */}
          <div
            ref={subtitleRef}
            className="transition-transform will-change-transform"
          >
            <p className="text-2xl md:text-4xl font-bold text-white/90 tracking-wider">
              Experience Next-Level Parallax
            </p>
            <p className="text-lg md:text-xl text-emerald-300 mt-4">
              Move your mouse to feel the depth
            </p>
          </div>

          {/* Visual Indicators */}
          <div className="flex gap-4 justify-center mt-12">
            <div className="px-6 py-3 bg-emerald-500/20 border border-emerald-400/50 rounded-full backdrop-blur-sm">
              <p className="text-emerald-300 text-sm font-mono">
                Stadium:{" "}
                {activeDemo === "all" || activeDemo === "stadium" ? "✅" : "⏸️"}
              </p>
            </div>
            <div className="px-6 py-3 bg-emerald-500/20 border border-emerald-400/50 rounded-full backdrop-blur-sm">
              <p className="text-emerald-300 text-sm font-mono">
                Text:{" "}
                {activeDemo === "all" || activeDemo === "text" ? "✅" : "⏸️"}
              </p>
            </div>
            <div className="px-6 py-3 bg-emerald-500/20 border border-emerald-400/50 rounded-full backdrop-blur-sm">
              <p className="text-emerald-300 text-sm font-mono">
                Layers:{" "}
                {activeDemo === "all" || activeDemo === "layers" ? "✅" : "⏸️"}
              </p>
            </div>
          </div>
        </div>

        {/* Center Crosshair */}
        {showGrid && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="relative">
              <div className="absolute w-20 h-0.5 bg-emerald-500/50 -translate-x-1/2" />
              <div className="absolute h-20 w-0.5 bg-emerald-500/50 -translate-y-1/2" />
              <div className="w-4 h-4 border-2 border-emerald-500 rounded-full -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Instructions */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-md px-6 py-3 rounded-full border border-emerald-500/30">
        <p className="text-emerald-300 text-sm font-medium animate-pulse">
          🖱️ Move your mouse to see the parallax effect in action
        </p>
      </div>
    </div>
  );
}
