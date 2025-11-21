import {useRef, useEffect, useState, Suspense} from "react";
import {Canvas, useFrame, useThree} from "@react-three/fiber";
import {
  PerspectiveCamera,
  Environment,
  Sky,
  Stars,
  Sphere,
  Box,
  useTexture,
  MeshReflectorMaterial,
  Center,
  Float,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  Vignette,
  ChromaticAberration,
  Noise,
  HueSaturation,
} from "@react-three/postprocessing";
import {gsap} from "gsap";
import {useNavigate} from "react-router-dom";
import * as THREE from "three";
import {BlendFunction} from "postprocessing";

// ==================== REALISTIC STADIUM FIELD ====================
function StadiumField() {
  return (
    <group>
      {/* Main grass field with realistic texture */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 120]} />
        <meshStandardMaterial
          color="#1a5c2e"
          roughness={0.85}
          metalness={0.05}
          envMapIntensity={0.3}
        />
      </mesh>

      {/* Field stripes for photorealism */}
      {[...Array(24)].map((_, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.01, -60 + i * 5]}
          receiveShadow
        >
          <planeGeometry args={[100, 2.5]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#1d6633" : "#1a5c2e"}
            roughness={0.85}
            metalness={0.05}
          />
        </mesh>
      ))}

      {/* Center circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[9, 9.2, 64]} />
        <meshStandardMaterial color="#ffffff" roughness={0.7} />
      </mesh>

      {/* Center line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[100, 0.3]} />
        <meshStandardMaterial color="#ffffff" roughness={0.7} />
      </mesh>

      {/* Sidelines */}
      {[-50, 50].map((x, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.02, 0]}>
          <planeGeometry args={[0.3, 120]} />
          <meshStandardMaterial color="#ffffff" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

// ==================== PROFESSIONAL STADIUM LIGHTS ====================
function StadiumFloodlights() {
  const lightIntensity = 3;
  const positions = [
    [-40, 25, -40],
    [40, 25, -40],
    [-40, 25, 40],
    [40, 25, 40],
  ];

  return (
    <group>
      {positions.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Light tower structure */}
          <mesh castShadow>
            <cylinderGeometry args={[0.5, 0.8, 25]} />
            <meshStandardMaterial
              color="#2c2c2c"
              roughness={0.3}
              metalness={0.9}
            />
          </mesh>

          {/* Floodlight array */}
          {[0, 1, 2, 3].map((j) => (
            <group key={j} position={[Math.cos(j) * 2, 12.5, Math.sin(j) * 2]}>
              <mesh>
                <boxGeometry args={[1.5, 0.8, 0.5]} />
                <meshStandardMaterial
                  color="#1a1a1a"
                  roughness={0.2}
                  metalness={0.8}
                />
              </mesh>
              <pointLight
                intensity={lightIntensity}
                distance={100}
                decay={2}
                color="#fff8e1"
                castShadow
              />
              <mesh position={[0, 0, 0.3]}>
                <circleGeometry args={[0.4, 16]} />
                <meshStandardMaterial
                  color="#ffff00"
                  emissive="#ffff00"
                  emissiveIntensity={3}
                />
              </mesh>
            </group>
          ))}

          {/* Main spotlight */}
          <spotLight
            position={[0, 12.5, 0]}
            angle={0.8}
            penumbra={0.5}
            intensity={lightIntensity * 2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-bias={-0.0001}
          />
        </group>
      ))}
    </group>
  );
}

// ==================== CINEMATIC CRICKET PLAYER ====================
function CricketPlayer({animationRef}) {
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
    <group ref={groupRef} position={[0, 0, 10]} castShadow>
      {/* Realistic body with PBR materials */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <capsuleGeometry args={[0.45, 1.2, 8, 16]} />
        <meshStandardMaterial
          color="#0066cc"
          roughness={0.4}
          metalness={0.3}
          envMapIntensity={0.5}
        />
      </mesh>

      {/* Head with helmet */}
      <mesh position={[0, 2.8, 0]} castShadow>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial
          color="#003d7a"
          roughness={0.2}
          metalness={0.8}
          envMapIntensity={1}
        />
      </mesh>

      {/* Cricket pads */}
      <mesh position={[-0.3, 0.6, 0]} castShadow>
        <boxGeometry args={[0.2, 1.2, 0.3]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.6} />
      </mesh>
      <mesh position={[0.3, 0.6, 0]} castShadow>
        <boxGeometry args={[0.2, 1.2, 0.3]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.6} />
      </mesh>

      {/* Cricket bat with realistic wood texture */}
      <group ref={batRef} position={[0.7, 1.5, 0.2]} rotation={[-0.3, 0, -0.8]}>
        <mesh castShadow>
          <boxGeometry args={[0.12, 1.6, 0.08]} />
          <meshStandardMaterial
            color="#8b4513"
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
        {/* Bat handle */}
        <mesh position={[0, 0.85, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.4]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.3} />
        </mesh>
      </group>

      {/* Gloves */}
      <mesh position={[0.6, 1.6, 0.3]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#cc0000" roughness={0.5} />
      </mesh>
    </group>
  );
}

// ==================== REALISTIC CRICKET BALL ====================
function CricketBall({animationRef}) {
  const ballRef = useRef();

  useEffect(() => {
    if (animationRef) {
      animationRef.current = ballRef.current;
    }
  }, [animationRef]);

  return (
    <mesh ref={ballRef} position={[0, 1, 10]} castShadow>
      <sphereGeometry args={[0.15, 64, 64]} />
      <meshStandardMaterial
        color="#cc1100"
        roughness={0.4}
        metalness={0.6}
        envMapIntensity={1.5}
      />
      {/* Leather seam */}
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[0.15, 0.008, 8, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.3}
          emissive="#ffffff"
          emissiveIntensity={0.1}
        />
      </mesh>
    </mesh>
  );
}

// ==================== ENERGY PARTICLE EXPLOSION ====================
function ParticleExplosion({trigger, position}) {
  const particlesRef = useRef();
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (trigger) {
      const newParticles = [];
      for (let i = 0; i < 500; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const speed = 0.5 + Math.random() * 2;
        newParticles.push({
          velocity: new THREE.Vector3(
            Math.sin(phi) * Math.cos(theta) * speed,
            Math.sin(phi) * Math.sin(theta) * speed,
            Math.cos(phi) * speed
          ),
          position: new THREE.Vector3(...position),
          life: 1.0,
          color: new THREE.Color().setHSL(Math.random(), 1, 0.6),
          size: 0.1 + Math.random() * 0.3,
        });
      }
      setParticles(newParticles);
    }
  }, [trigger, position]);

  useFrame(() => {
    if (particles.length > 0) {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            position: p.position
              .clone()
              .add(p.velocity.clone().multiplyScalar(0.1)),
            velocity: p.velocity.clone().multiplyScalar(0.97),
            life: p.life - 0.02,
            size: p.size * 0.98,
          }))
          .filter((p) => p.life > 0)
      );
    }
  });

  if (!trigger || particles.length === 0) return null;

  return (
    <group ref={particlesRef}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[particle.size, 8, 8]} />
          <meshStandardMaterial
            color={particle.color}
            emissive={particle.color}
            emissiveIntensity={3}
            transparent
            opacity={particle.life}
          />
        </mesh>
      ))}
    </group>
  );
}

// ==================== METALLIC ZENITH 2026 LOGO ====================
function MetallicLogo({show}) {
  const logoRef = useRef();

  useEffect(() => {
    if (show && logoRef.current) {
      gsap.fromTo(
        logoRef.current.scale,
        {x: 0, y: 0, z: 0},
        {
          x: 1,
          y: 1,
          z: 1,
          duration: 2,
          ease: "elastic.out(1, 0.3)",
        }
      );
      gsap.fromTo(
        logoRef.current.rotation,
        {y: Math.PI * 2},
        {
          y: 0,
          duration: 2,
          ease: "power2.out",
        }
      );
    }
  }, [show]);

  if (!show) return null;

  return (
    <group ref={logoRef} position={[0, 0, -5]}>
      {/* Main metallic boxes forming ZENITH */}
      <Center>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[8, 2, 0.5]} />
          <meshStandardMaterial
            color="#c0c0c0"
            roughness={0.1}
            metalness={1}
            envMapIntensity={2}
            emissive="#ff6b35"
            emissiveIntensity={0.3}
          />
        </mesh>
      </Center>

      {/* 2026 metallic block */}
      <Center position={[0, -2.5, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[6, 1.5, 0.4]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.05}
            metalness={1}
            envMapIntensity={2.5}
            emissive="#00d4ff"
            emissiveIntensity={0.4}
          />
        </mesh>
      </Center>

      {/* Glow rings around logo */}
      {[3, 4, 5].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius, 0.02, 8, 64]} />
          <meshStandardMaterial
            color="#00d4ff"
            emissive="#00d4ff"
            emissiveIntensity={2 - i * 0.5}
            transparent
            opacity={0.6 - i * 0.15}
          />
        </mesh>
      ))}

      {/* Energy particles around logo */}
      {[...Array(20)].map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 6;
        return (
          <Float key={i} speed={2 + Math.random()} rotationIntensity={0.5}>
            <mesh
              position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
            >
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial
                color="#00d4ff"
                emissive="#00d4ff"
                emissiveIntensity={3}
              />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

// ==================== MOTION TRAIL FOR BALL ====================
function MotionTrail({ballPosition, active}) {
  const trailRef = useRef([]);
  const meshesRef = useRef([]);

  useFrame(() => {
    if (active && ballPosition) {
      trailRef.current.push(ballPosition.clone());
      if (trailRef.current.length > 30) {
        trailRef.current.shift();
      }
    }
  });

  if (!active || trailRef.current.length === 0) return null;

  return (
    <group>
      {trailRef.current.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.1 * (i / trailRef.current.length), 8, 8]} />
          <meshStandardMaterial
            color="#ff6b35"
            emissive="#ff6b35"
            emissiveIntensity={3}
            transparent
            opacity={i / trailRef.current.length}
          />
        </mesh>
      ))}
    </group>
  );
}

// ==================== MAIN CINEMATIC SCENE ====================
function CinematicScene({onComplete}) {
  const {camera} = useThree();
  const playerRef = useRef();
  const ballRef = useRef();
  const [showExplosion, setShowExplosion] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [explosionPos, setExplosionPos] = useState([0, 0, 0]);
  const [showTrail, setShowTrail] = useState(false);

  useEffect(() => {
    // GSAP Master Timeline - Orchestrates entire cinematic sequence
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(onComplete, 2000);
      },
    });

    // === PHASE 1: OPENING (0-1s) ===
    // Camera starts far back, dollies in
    tl.fromTo(
      camera.position,
      {x: 5, y: 15, z: 35},
      {x: 0, y: 3, z: 20, duration: 1.5, ease: "power2.inOut"}
    );

    // === PHASE 2: PLAYER WIND-UP (1-2s) ===
    // Camera moves to side angle
    tl.to(
      camera.position,
      {
        x: -3,
        y: 2.5,
        z: 12,
        duration: 0.8,
        ease: "power1.inOut",
      },
      "+=0.2"
    );

    // Player bat swing
    if (playerRef.current?.bat) {
      tl.to(
        playerRef.current.bat.rotation,
        {
          z: 1.2,
          x: -0.8,
          duration: 0.4,
          ease: "power4.in",
        },
        "-=0.6"
      );
    }

    // === PHASE 3: BALL LAUNCH (2-3.5s) ===
    tl.call(() => setShowTrail(true), null, "-=0.2");

    if (ballRef.current) {
      // Ball shoots forward with realistic arc
      tl.to(
        ballRef.current.position,
        {
          z: -8,
          y: 3,
          x: 0.5,
          duration: 1.5,
          ease: "power2.out",
        },
        "-=0.2"
      );

      // Ball rotation for realism
      tl.to(
        ballRef.current.rotation,
        {
          x: Math.PI * 8,
          y: Math.PI * 3,
          duration: 1.5,
          ease: "none",
        },
        "-=1.5"
      );
    }

    // Camera follows ball (tracking shot)
    tl.to(
      camera.position,
      {
        x: 0,
        y: 3.5,
        z: 5,
        duration: 1.5,
        ease: "power2.inOut",
      },
      "-=1.5"
    );

    // === PHASE 4: IMPACT EXPLOSION (3.5-4s) ===
    tl.call(
      () => {
        if (ballRef.current) {
          setExplosionPos([
            ballRef.current.position.x,
            ballRef.current.position.y,
            ballRef.current.position.z,
          ]);
          setShowExplosion(true);
          setShowTrail(false);
          // Hide ball
          ballRef.current.visible = false;
        }
      },
      null,
      "+=0.2"
    );

    // Camera shake on impact
    tl.to(camera.position, {
      x: "+=0.2",
      y: "+=0.15",
      duration: 0.05,
      yoyo: true,
      repeat: 5,
      ease: "none",
    });

    // === PHASE 5: LOGO REVEAL (4-6s) ===
    tl.call(() => setShowLogo(true), null, "+=0.5");

    // Camera zooms through explosion to logo
    tl.to(
      camera.position,
      {
        z: -3,
        y: 0,
        duration: 2,
        ease: "power2.inOut",
      },
      "-=0.3"
    );

    // Final camera subtle movement
    tl.to(
      camera.position,
      {
        y: "+=0.3",
        duration: 1.5,
        yoyo: true,
        repeat: 1,
        ease: "sine.inOut",
      },
      "-=1.5"
    );

    return () => tl.kill();
  }, [camera, onComplete]);

  return (
    <>
      {/* HDRI Environment for photorealistic reflections */}
      <Environment preset="night" background={false} blur={0.5} />

      {/* Dramatic Sky */}
      <Sky
        distance={450000}
        sunPosition={[100, 20, 100]}
        inclination={0.6}
        azimuth={0.25}
      />
      <Stars radius={100} depth={50} count={8000} factor={6} fade speed={1} />

      {/* Main Lighting Setup */}
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[20, 40, 20]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-bias={-0.0001}
      />

      {/* Rim lighting for dramatic effect */}
      <spotLight
        position={[-15, 10, 5]}
        angle={0.5}
        penumbra={0.5}
        intensity={2}
        color="#00d4ff"
      />
      <spotLight
        position={[15, 10, 5]}
        angle={0.5}
        penumbra={0.5}
        intensity={2}
        color="#ff6b35"
      />

      {/* Stadium Components */}
      <StadiumField />
      <StadiumFloodlights />
      <CricketPlayer animationRef={playerRef} />
      <CricketBall animationRef={ballRef} />

      {/* Effects */}
      <MotionTrail
        ballPosition={ballRef.current?.position}
        active={showTrail}
      />
      <ParticleExplosion trigger={showExplosion} position={explosionPos} />
      <MetallicLogo show={showLogo} />

      {/* Fog for atmospheric depth */}
      <fog attach="fog" args={["#0a0a1a", 40, 100]} />
    </>
  );
}

// ==================== MAIN COMPONENT ====================
export default function CinematicIntro() {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);
  const [showBlackBars, setShowBlackBars] = useState(true);
  const [showLogoText, setShowLogoText] = useState(false);

  const handleComplete = () => {
    setFadeOut(true);
    setTimeout(() => {
      navigate("/home");
    }, 1500);
  };

  const handleSkip = () => {
    navigate("/home");
  };

  useEffect(() => {
    // Show 2D logo text after 4.5 seconds
    setTimeout(() => {
      setShowLogoText(true);
    }, 4500);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Cinematic Black Bars */}
      {showBlackBars && (
        <>
          <div className="absolute top-0 left-0 right-0 h-16 bg-black z-50 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-black z-50 pointer-events-none" />
        </>
      )}

      {/* 2D Logo Text Overlay */}
      {showLogoText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-40 pointer-events-none animate-fade-in">
          <h1 className="font-orbitron text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-white to-gray-300 drop-shadow-[0_0_50px_rgba(255,107,53,0.8)] animate-pulse">
            ZENITH
          </h1>
          <h2 className="font-orbitron text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 mt-4 tracking-widest drop-shadow-[0_0_40px_rgba(0,212,255,0.9)]">
            2026
          </h2>
          <p className="font-rajdhani text-3xl text-white/90 mt-8 tracking-widest drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
            THE ULTIMATE SPORTS FESTIVAL
          </p>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas
        shadows
        className={`transition-opacity duration-1500 ${
          fadeOut ? "opacity-0" : "opacity-100"
        }`}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 3, 20]} fov={50} />

        <Suspense fallback={null}>
          <CinematicScene onComplete={handleComplete} />
        </Suspense>

        {/* POST-PROCESSING EFFECTS */}
        <EffectComposer multisampling={8}>
          {/* Depth of Field - Cinematic focus */}
          <DepthOfField
            focusDistance={0.01}
            focalLength={0.05}
            bokehScale={3}
            height={480}
          />

          {/* Bloom - Glowing lights and effects */}
          <Bloom
            intensity={1.5}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            height={300}
            opacity={1}
          />

          {/* Chromatic Aberration - Film lens effect */}
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={[0.001, 0.001]}
          />

          {/* Film Grain for cinematic texture */}
          <Noise opacity={0.15} />

          {/* Vignette - Focus viewer attention */}
          <Vignette eskil={false} offset={0.1} darkness={0.5} />
        </EffectComposer>
      </Canvas>

      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className="absolute bottom-24 right-8 z-50 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/30 rounded-lg text-white font-rajdhani text-lg hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-lg"
      >
        Skip Intro →
      </button>

      {/* Loading indicator */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none">
        <Suspense
          fallback={
            <div className="text-white font-orbitron text-xl animate-pulse">
              Loading Cinematic Experience...
            </div>
          }
        />
      </div>
    </div>
  );
}
