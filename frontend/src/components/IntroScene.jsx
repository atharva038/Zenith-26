import {useRef, useEffect, useState} from "react";
import {Canvas, useFrame} from "@react-three/fiber";
import {
  PerspectiveCamera,
  Environment,
  Text,
  Sky,
  Stars,
} from "@react-three/drei";
import {gsap} from "gsap";
import {useNavigate} from "react-router-dom";
import * as THREE from "three";

// Player component (simplified cricket player with bat)
function Player({animationRef}) {
  const groupRef = useRef();
  const batRef = useRef();

  useEffect(() => {
    if (animationRef) {
      animationRef.current = {
        group: groupRef.current,
        bat: batRef.current,
      };
    }
  }, [animationRef]);

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Player body */}
      <mesh position={[0, 1.5, 0]}>
        <capsuleGeometry args={[0.3, 1, 4, 8]} />
        <meshStandardMaterial color="#2563eb" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Player head */}
      <mesh position={[0, 2.5, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.4} />
      </mesh>

      {/* Cricket bat */}
      <group ref={batRef} position={[0.5, 1.5, 0]} rotation={[0, 0, -0.5]}>
        <mesh>
          <boxGeometry args={[0.15, 1.2, 0.05]} />
          <meshStandardMaterial color="#8b4513" roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
}

// Cricket ball component
function Ball({animationRef}) {
  const meshRef = useRef();
  const trailRef = useRef();

  useEffect(() => {
    if (animationRef) {
      animationRef.current = meshRef.current;
    }
  }, [animationRef]);

  return (
    <group>
      <mesh ref={meshRef} position={[0, 1, 0]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial
          color="#ff0000"
          emissive="#ff6b35"
          emissiveIntensity={0.5}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
    </group>
  );
}

// Stadium environment
function Stadium() {
  return (
    <group>
      {/* Ground/pitch */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.5, 0]}
        receiveShadow
      >
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#1a472a" roughness={0.8} />
      </mesh>

      {/* Stadium lights (simplified) */}
      {[
        [-10, 8, -10],
        [10, 8, -10],
        [-10, 8, 10],
        [10, 8, 10],
      ].map((pos, i) => (
        <group key={i} position={pos}>
          <mesh>
            <cylinderGeometry args={[0.1, 0.1, 8]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          <pointLight
            position={[0, 0, 0]}
            intensity={0.3}
            distance={15}
            color="#ffffff"
          />
        </group>
      ))}

      {/* Boundary markers */}
      {Array.from({length: 20}).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 12;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * radius, -1, Math.sin(angle) * radius]}
          >
            <cylinderGeometry args={[0.05, 0.05, 0.5]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Particle system for impact effect
function Particles({trigger}) {
  const particlesRef = useRef();
  const [particlePositions, setParticlePositions] = useState([]);

  useEffect(() => {
    if (trigger) {
      const positions = [];
      for (let i = 0; i < 100; i++) {
        positions.push({
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2,
          z: (Math.random() - 0.5) * 2,
        });
      }
      setParticlePositions(positions);
    }
  }, [trigger]);

  useFrame(() => {
    if (particlesRef.current && trigger) {
      particlesRef.current.children.forEach((particle, i) => {
        particle.position.x += particlePositions[i]?.x * 0.05 || 0;
        particle.position.y += particlePositions[i]?.y * 0.05 || 0;
        particle.position.z += particlePositions[i]?.z * 0.05 || 0;
        particle.material.opacity -= 0.01;
      });
    }
  });

  if (!trigger) return null;

  return (
    <group ref={particlesRef} position={[0, 0, 5]}>
      {particlePositions.map((_, i) => (
        <mesh key={i} position={[0, 0, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial
            color="#00d4ff"
            emissive="#00ffff"
            emissiveIntensity={2}
            transparent
            opacity={1}
          />
        </mesh>
      ))}
    </group>
  );
}

// Main 3D Scene
function Scene({onAnimationComplete, cameraRef}) {
  const playerAnimationRef = useRef();
  const ballRef = useRef();
  const [showParticles, setShowParticles] = useState(false);
  const [mousePosition, setMousePosition] = useState({x: 0, y: 0});

  useEffect(() => {
    // Mouse parallax effect
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    // Subtle camera parallax
    if (cameraRef.current) {
      cameraRef.current.position.x +=
        (mousePosition.x * 0.5 - cameraRef.current.position.x) * 0.05;
      cameraRef.current.position.y +=
        (mousePosition.y * 0.3 - cameraRef.current.position.y) * 0.05;
    }
  });

  useEffect(() => {
    const timeline = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          onAnimationComplete();
        }, 1000);
      },
    });

    // Wait 1 second, then start animation
    timeline.to({}, {duration: 1});

    // Player swings bat
    if (playerAnimationRef.current?.bat) {
      timeline.to(playerAnimationRef.current.bat.rotation, {
        z: 0.5,
        duration: 0.5,
        ease: "power2.inOut",
      });
    }

    // Ball flies toward camera
    if (ballRef.current) {
      timeline.to(
        ballRef.current.position,
        {
          z: 5,
          y: 2,
          x: 0,
          duration: 1.5,
          ease: "power2.out",
        },
        "-=0.3"
      );

      // Scale ball slightly as it approaches
      timeline.to(
        ballRef.current.scale,
        {
          x: 2,
          y: 2,
          z: 2,
          duration: 1.5,
          ease: "power2.out",
        },
        "-=1.5"
      );
    }

    // Trigger impact effect
    timeline.call(() => {
      setShowParticles(true);
    });

    // Camera shake effect
    if (cameraRef.current) {
      timeline.to(cameraRef.current.position, {
        x: "+=0.1",
        y: "+=0.1",
        duration: 0.1,
        yoyo: true,
        repeat: 3,
      });
    }

    return () => {
      timeline.kill();
    };
  }, [onAnimationComplete, cameraRef]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#00d4ff" />

      <Stadium />
      <Player animationRef={playerAnimationRef} />
      <Ball animationRef={ballRef} />
      <Particles trigger={showParticles} />

      <Environment preset="night" />
    </>
  );
}

// Logo reveal component
function LogoReveal({show}) {
  const logoRef = useRef();

  useEffect(() => {
    if (show && logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        {scale: 0, opacity: 0},
        {scale: 1, opacity: 1, duration: 2, ease: "elastic.out(1, 0.5)"}
      );
    }
  }, [show]);

  if (!show) return null;

  return (
    <div
      ref={logoRef}
      className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none"
    >
      <h1 className="font-orbitron text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-orange via-neon-blue to-electric-cyan animate-pulse">
        ZENITH
      </h1>
      <h2 className="font-orbitron text-6xl md:text-7xl font-bold text-white mt-4 tracking-widest">
        2026
      </h2>
      <p className="font-rajdhani text-2xl md:text-3xl text-white/80 mt-8 tracking-wide">
        Let the Game Begin
      </p>

      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-neon-blue/20 via-transparent to-transparent blur-3xl" />
    </div>
  );
}

// Flash effect
function FlashEffect({show}) {
  if (!show) return null;

  return <div className="absolute inset-0 bg-white z-10 animate-flash" />;
}

// Main IntroScene component
export default function IntroScene() {
  const navigate = useNavigate();
  const [showFlash, setShowFlash] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const cameraRef = useRef();

  const handleAnimationComplete = () => {
    setShowFlash(true);

    setTimeout(() => {
      setShowFlash(false);
      setShowLogo(true);
    }, 300);

    setTimeout(() => {
      setFadeOut(true);
    }, 3500);

    setTimeout(() => {
      localStorage.setItem("introPlayed", "true");
      navigate("/home");
    }, 4500);
  };

  const handleSkip = () => {
    localStorage.setItem("introPlayed", "true");
    navigate("/home");
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* 3D Canvas */}
      <Canvas
        shadows
        className={`transition-opacity duration-1000 ${
          fadeOut ? "opacity-0" : "opacity-100"
        }`}
      >
        <PerspectiveCamera
          ref={cameraRef}
          makeDefault
          position={[0, 2, 8]}
          fov={50}
        />
        <Scene
          onAnimationComplete={handleAnimationComplete}
          cameraRef={cameraRef}
        />
      </Canvas>

      {/* Flash Effect */}
      <FlashEffect show={showFlash} />

      {/* Logo Reveal */}
      <LogoReveal show={showLogo} />

      {/* Skip Button */}
      {!showLogo && (
        <button
          onClick={handleSkip}
          className="absolute bottom-8 right-8 z-30 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white font-rajdhani text-lg hover:bg-white/20 transition-all duration-300"
        >
          Skip Intro →
        </button>
      )}

      {/* Ambient particles overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({length: 20}).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-neon-blue rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
