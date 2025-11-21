import {useRef, useEffect, useState} from "react";
import {Canvas, useFrame, useThree} from "@react-three/fiber";
import {
  PerspectiveCamera,
  Text3D,
  Sky,
  Stars,
  useTexture,
} from "@react-three/drei";
import {gsap} from "gsap";
import {useNavigate} from "react-router-dom";
import * as THREE from "three";

// Realistic Football/Soccer Ball
function SoccerBall({onClick, isKicked, onGoalScored}) {
  const ballRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [velocity, setVelocity] = useState(new THREE.Vector3(0, 0, 0));
  const gravity = -0.015;

  useFrame(() => {
    if (ballRef.current && isKicked) {
      // Apply physics
      velocity.y += gravity;
      ballRef.current.position.add(velocity);

      // Rotation for realistic rolling
      ballRef.current.rotation.x += velocity.z * 0.5;
      ballRef.current.rotation.z -= velocity.x * 0.5;

      // Check if ball reached the goal
      if (
        ballRef.current.position.z < -18 &&
        ballRef.current.position.y > 0.5 &&
        ballRef.current.position.y < 3 &&
        Math.abs(ballRef.current.position.x) < 4
      ) {
        onGoalScored();
      }

      // Ground collision
      if (ballRef.current.position.y < 0.3) {
        ballRef.current.position.y = 0.3;
        velocity.y *= -0.6; // Bounce with energy loss
        velocity.x *= 0.95;
        velocity.z *= 0.95;
      }
    }
  });

  const handleClick = () => {
    if (!isKicked) {
      onClick();
      // Kick the ball toward goal with arc
      setVelocity(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.05, // Slight horizontal randomness
          0.35, // Upward force
          -0.4 // Forward force toward goal
        )
      );
    }
  };

  return (
    <mesh
      ref={ballRef}
      position={[0, 0.3, 8]}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
    >
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial
        color={hovered ? "#ffffff" : "#f0f0f0"}
        roughness={0.3}
        metalness={0.1}
        emissive={hovered ? "#ff6b35" : "#000000"}
        emissiveIntensity={hovered ? 0.3 : 0}
      />
      {/* Black pentagon pattern */}
      {[...Array(12)].map((_, i) => {
        const phi = Math.acos(-1 + (2 * i) / 12);
        const theta = Math.sqrt(12 * Math.PI) * phi;
        return (
          <mesh
            key={i}
            position={[
              0.31 * Math.sin(phi) * Math.cos(theta),
              0.31 * Math.sin(phi) * Math.sin(theta),
              0.31 * Math.cos(phi),
            ]}
            rotation={[phi, theta, 0]}
          >
            <circleGeometry args={[0.08, 5]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        );
      })}
    </mesh>
  );
}

// Realistic Stadium Field
function StadiumField() {
  return (
    <group>
      {/* Main grass field */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 50]} />
        <meshStandardMaterial color="#1a5c2e" roughness={0.9} />
      </mesh>

      {/* Field stripes for realism */}
      {[...Array(10)].map((_, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.01, -20 + i * 5]}
          receiveShadow
        >
          <planeGeometry args={[40, 2.5]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#1d6633" : "#1a5c2e"}
            roughness={0.9}
          />
        </mesh>
      ))}

      {/* Center circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[3, 3.1, 64]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Center line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[40, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Penalty box */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -18]}>
        <ringGeometry args={[5.5, 5.6, 64, 1, 0, Math.PI]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Penalty box lines */}
      {[-5.5, 5.5].map((x, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.02, -15]}>
          <planeGeometry args={[0.1, 6]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -12]}>
        <planeGeometry args={[11, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

// Goal Post
function GoalPost() {
  return (
    <group position={[0, 0, -20]}>
      {/* Left post */}
      <mesh position={[-3.66, 1.22, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 2.44]} />
        <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Right post */}
      <mesh position={[3.66, 1.22, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 2.44]} />
        <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Crossbar */}
      <mesh position={[0, 2.44, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 7.32]} />
        <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Net */}
      <mesh position={[0, 1.22, -0.5]}>
        <boxGeometry args={[7.32, 2.44, 1]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>
    </group>
  );
}

// Stadium Stands (simplified but realistic)
function StadiumStands() {
  return (
    <group>
      {/* Back stand behind goal */}
      <mesh position={[0, 5, -25]} receiveShadow>
        <boxGeometry args={[30, 10, 3]} />
        <meshStandardMaterial color="#2c3e50" roughness={0.8} />
      </mesh>

      {/* Left stand */}
      <mesh
        position={[-20, 4, -10]}
        rotation={[0, Math.PI / 12, 0]}
        receiveShadow
      >
        <boxGeometry args={[3, 8, 40]} />
        <meshStandardMaterial color="#34495e" roughness={0.8} />
      </mesh>

      {/* Right stand */}
      <mesh
        position={[20, 4, -10]}
        rotation={[0, -Math.PI / 12, 0]}
        receiveShadow
      >
        <boxGeometry args={[3, 8, 40]} />
        <meshStandardMaterial color="#34495e" roughness={0.8} />
      </mesh>

      {/* Crowd seats (rows of boxes) */}
      {[...Array(8)].map((_, row) =>
        [...Array(20)].map((_, seat) => (
          <mesh
            key={`${row}-${seat}`}
            position={[-14 + seat * 1.5, 1 + row * 0.5, -24]}
          >
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial
              color={`hsl(${Math.random() * 360}, 70%, 50%)`}
              roughness={0.7}
            />
          </mesh>
        ))
      )}
    </group>
  );
}

// Stadium Floodlights
function StadiumLights() {
  return (
    <group>
      {/* Corner floodlights */}
      {[
        [-15, 15, -15],
        [15, 15, -15],
        [-15, 15, 5],
        [15, 15, 5],
      ].map((pos, i) => (
        <group key={i} position={pos}>
          {/* Light tower */}
          <mesh castShadow>
            <cylinderGeometry args={[0.2, 0.3, 15]} />
            <meshStandardMaterial color="#4a4a4a" metalness={0.7} />
          </mesh>

          {/* Spotlight */}
          <spotLight
            position={[0, 0, 0]}
            angle={0.6}
            penumbra={0.5}
            intensity={2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />

          {/* Light bulb */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.5]} />
            <meshStandardMaterial
              color="#ffeb3b"
              emissive="#ffeb3b"
              emissiveIntensity={2}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Goal Celebration Particles
function CelebrationParticles({active}) {
  const particlesRef = useRef();
  const particleCount = 200;

  useFrame((state) => {
    if (particlesRef.current && active) {
      particlesRef.current.rotation.y += 0.01;
      const positions = particlesRef.current.geometry.attributes.position.array;

      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i + 1] += Math.sin(state.clock.elapsedTime + i) * 0.05;
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  if (!active) return null;

  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 20;
    positions[i + 1] = Math.random() * 15;
    positions[i + 2] = -20 + (Math.random() - 0.5) * 10;

    const color = new THREE.Color();
    color.setHSL(Math.random(), 1, 0.5);
    colors[i] = color.r;
    colors[i + 1] = color.g;
    colors[i + 2] = color.b;
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

// Main Scene Component
function Scene({onGoalScored, goalScored, ballKicked, setBallKicked}) {
  const {camera} = useThree();

  useEffect(() => {
    if (goalScored) {
      // Dramatic camera zoom to goal
      gsap.to(camera.position, {
        z: -15,
        y: 3,
        duration: 2,
        ease: "power2.inOut",
      });
    }
  }, [goalScored, camera]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Sky */}
      <Sky
        distance={450000}
        sunPosition={[0, 1, 0]}
        inclination={0.6}
        azimuth={0.25}
      />
      <Stars radius={100} depth={50} count={5000} factor={4} fade />

      {/* Stadium Elements */}
      <StadiumField />
      <GoalPost />
      <StadiumStands />
      <StadiumLights />

      {/* Interactive Ball */}
      <SoccerBall
        onClick={() => setBallKicked(true)}
        isKicked={ballKicked}
        onGoalScored={onGoalScored}
      />

      {/* Celebration Effects */}
      <CelebrationParticles active={goalScored} />

      {/* Fog for atmosphere */}
      <fog attach="fog" args={["#1a1a2e", 30, 80]} />
    </>
  );
}

// Main IntroScene Component
export default function IntroScene() {
  const navigate = useNavigate();
  const [ballKicked, setBallKicked] = useState(false);
  const [goalScored, setGoalScored] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const cameraRef = useRef();

  const handleGoalScored = () => {
    if (!goalScored) {
      setGoalScored(true);

      // Show celebration
      setTimeout(() => {
        setShowLogo(true);
      }, 1500);

      // Fade out and navigate
      setTimeout(() => {
        setFadeOut(true);
      }, 5000);

      setTimeout(() => {
        localStorage.setItem("introPlayed", "true");
        navigate("/home");
      }, 6000);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("introPlayed", "true");
    navigate("/home");
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-gray-900 via-black to-gray-900">
      {/* Instructions */}
      {!ballKicked && !goalScored && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-center pointer-events-none">
          <h2 className="font-orbitron text-4xl md:text-6xl font-bold text-white mb-4 animate-pulse">
            CLICK THE BALL
          </h2>
          <p className="font-rajdhani text-xl md:text-2xl text-white/70">
            Score a goal to start ZENITH 2026
          </p>
        </div>
      )}

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
          position={[0, 2, 12]}
          fov={60}
        />
        <Scene
          onGoalScored={handleGoalScored}
          goalScored={goalScored}
          ballKicked={ballKicked}
          setBallKicked={setBallKicked}
        />
      </Canvas>

      {/* Goal Celebration Text */}
      {goalScored && !showLogo && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <h1 className="font-orbitron text-9xl font-black text-white animate-bounce">
            GOAL! ⚽
          </h1>
        </div>
      )}

      {/* Logo Reveal */}
      {showLogo && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none animate-fade-in">
          <h1 className="font-orbitron text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-orange via-neon-blue to-electric-cyan drop-shadow-[0_0_30px_rgba(0,212,255,0.8)]">
            ZENITH
          </h1>
          <h2 className="font-orbitron text-6xl md:text-7xl font-bold text-white mt-4 tracking-widest drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
            2026
          </h2>
          <p className="font-rajdhani text-2xl md:text-3xl text-white/90 mt-8 tracking-wide">
            Let the Games Begin
          </p>
        </div>
      )}

      {/* Skip Button */}
      {!showLogo && (
        <button
          onClick={handleSkip}
          className="absolute bottom-8 right-8 z-30 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white font-rajdhani text-lg hover:bg-white/20 transition-all duration-300 hover:scale-105"
        >
          Skip Intro →
        </button>
      )}

      {/* Cursor hint */}
      {!ballKicked && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 text-center">
          <div className="animate-bounce">
            <svg
              className="w-8 h-8 mx-auto text-white/70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
