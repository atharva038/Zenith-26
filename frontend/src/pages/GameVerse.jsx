import { useState, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  PerspectiveCamera,
  Text,
} from "@react-three/drei";
import FloatingIsland from "../components/gameverse/FloatingIsland";
import SportModal from "../components/gameverse/SportModal";
import GamerverseLoading from "../components/gameverse/GamerverseLoading";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

// Cinematic Nebula + Galaxy Background
function CinematicSpaceBackground() {
  const meshRef = useRef();

  // Nebula texture (procedural)
  const nebulaTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d", {
      alpha: false,
      willReadFrequently: true,
    });

    // Deep space gradient
    const grad = ctx.createRadialGradient(512, 512, 0, 512, 512, 512);
    grad.addColorStop(0, "#1a1a2a");
    grad.addColorStop(0.5, "#0a0a18");
    grad.addColorStop(1, "#000000");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Nebula clouds
    const nebulaColors = [
      "rgba(120,60,200,0.18)", // purple
      "rgba(60,180,255,0.13)", // blue
      "rgba(255,120,180,0.10)", // pink
      "rgba(255,200,80,0.08)", // gold
    ];

    nebulaColors.forEach((color) => {
      for (let i = 0; i < 10; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        const r = 180 + Math.random() * 220;

        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, color);
        g.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Galaxy spiral (simple overlay)
    ctx.save();
    ctx.translate(512, 512);
    for (let arm = 0; arm < 4; arm++) {
      ctx.rotate((Math.PI * 2 * arm) / 4);
      ctx.beginPath();
      for (let t = 0; t < 360; t += 2) {
        const rad = 180 + t * 1.2;
        const angle = (t * Math.PI) / 180 + (arm * Math.PI) / 2;
        const x = Math.cos(angle) * rad;
        const y = Math.sin(angle) * rad;
        ctx.globalAlpha = 0.08 + 0.12 * Math.sin(t / 40);
        ctx.fillStyle = `rgba(255,255,255,${0.08 + 0.12 * Math.sin(t / 40)})`;
        ctx.fillRect(x, y, 2, 2);
      }
    }
    ctx.restore();

    // Starfield
    for (let i = 0; i < 600; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      ctx.globalAlpha = 0.7 + Math.random() * 0.3;
      ctx.fillStyle = "#fff";
      ctx.fillRect(x, y, 1.5, 1.5);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Animate slow rotation for cinematic effect
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.008;
      meshRef.current.rotation.x =
        Math.sin(state.clock.getElapsedTime() * 0.004) * 0.08;
    }
  });

  return (
    <mesh ref={meshRef} scale={[1, 1, 1]}>
      <sphereGeometry args={[220, 48, 48]} />
      <meshBasicMaterial
        map={nebulaTexture}
        side={THREE.BackSide}
        transparent
        opacity={0.98}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// Nebula Background Component - Resource Efficient
function NebulaBackground() {
  const meshRef = useRef();

  // Create procedural nebula texture using canvas
  const nebulaTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d", {
      alpha: false,
      willReadFrequently: true,
    });

    // Background - deep space black with subtle blue
    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    gradient.addColorStop(0, "#0a0a1a");
    gradient.addColorStop(0.5, "#050510");
    gradient.addColorStop(1, "#000000");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    // Add nebula clouds with multiple colors
    const nebulaColors = [
      { color: "rgba(138, 43, 226, 0.15)", count: 8 }, // Purple
      { color: "rgba(255, 105, 180, 0.12)", count: 6 }, // Pink
      { color: "rgba(65, 105, 225, 0.1)", count: 7 }, // Blue
      { color: "rgba(255, 140, 0, 0.08)", count: 5 }, // Orange
    ];

    nebulaColors.forEach(({ color, count }) => {
      for (let i = 0; i < count; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const radius = 80 + Math.random() * 120;

        const nebGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        nebGradient.addColorStop(0, color);
        nebGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = nebGradient;
        ctx.fillRect(0, 0, 512, 512);
      }
    });

    // Add some bright star clusters
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    for (let i = 0; i < 300; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const size = Math.random() * 1.5;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      // Very slow rotation for subtle movement
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.01;
      meshRef.current.rotation.x =
        Math.sin(state.clock.getElapsedTime() * 0.005) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} scale={[1, 1, 1]}>
      <sphereGeometry args={[200, 32, 32]} />
      <meshBasicMaterial
        map={nebulaTexture}
        side={THREE.BackSide}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

// Optimized Cosmic Dust/Particles
function CosmicDust() {
  const particlesRef = useRef();

  const particles = useMemo(() => {
    const positions = new Float32Array(1500 * 3); // Reduced from 3000
    const colors = new Float32Array(1500 * 3);

    for (let i = 0; i < 1500; i++) {
      const i3 = i * 3;
      // Spread particles in a sphere around the scene
      const radius = 30 + Math.random() * 70;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = (Math.random() - 0.5) * 80;
      positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      // Varied colors - purples, blues, pinks
      const colorChoice = Math.random();
      if (colorChoice < 0.3) {
        colors[i3] = 0.5 + Math.random() * 0.5; // R
        colors[i3 + 1] = 0.3 + Math.random() * 0.3; // G
        colors[i3 + 2] = 1; // B (Blue)
      } else if (colorChoice < 0.6) {
        colors[i3] = 0.8 + Math.random() * 0.2; // R
        colors[i3 + 1] = 0.2 + Math.random() * 0.3; // G
        colors[i3 + 2] = 0.8 + Math.random() * 0.2; // B (Purple)
      } else {
        colors[i3] = 1; // R
        colors[i3 + 1] = 0.4 + Math.random() * 0.3; // G
        colors[i3 + 2] = 0.7 + Math.random() * 0.3; // B (Pink)
      }
    }

    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={1500}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={1500}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Sports data - Organized in SOLAR SYSTEM layout with 3 orbital rings
const sportsData = [
  // ===== INNER RING (Radius 12) - 4 Premium Sports =====
  {
    id: 1,
    name: "FOOTBALL",
    icon: "⚽",
    color: "#2d5016",
    position: [0, 0, -12], // North
    orbit: 1,
    tier: 1,
    tagline: "The Beautiful Game",
    description:
      "Experience the thrill of competitive football at ZENITH 2026. Join teams from across the nation in an epic battle for glory on the pitch.",
    date: "March 15-17, 2026",
    venue: "Main Stadium Arena",
    teamSize: "11 vs 11",
    prize: "₹50,000",
    rules: [
      "Standard FIFA rules apply",
      "Each match is 20 minutes (10 min per half)",
      "Maximum 15 players per squad",
      "Knockout tournament format",
      "Yellow/Red card suspensions in effect",
    ],
  },
  {
    id: 2,
    name: "BASKETBALL",
    icon: "🏀",
    color: "#5a2a0a",
    position: [12, 0, 0], // East
    orbit: 1,
    tier: 1,
    tagline: "Hoop Dreams",
    description:
      "Dribble, shoot, and slam your way to victory in high-energy basketball matches. Show off your court skills and teamwork.",
    date: "March 17-18, 2026",
    venue: "Outdoor Basketball Courts",
    teamSize: "5 vs 5",
    prize: "₹35,000",
    rules: [
      "4 quarters of 10 minutes each",
      "Shot clock: 24 seconds",
      "FIBA rules apply",
      "Maximum 12 players per squad",
      "Substitutions allowed during stoppages",
    ],
  },
  {
    id: 3,
    name: "CRICKET",
    icon: "🏏",
    color: "#1a3a52",
    position: [0, 0, 12], // South
    orbit: 1,
    tier: 1,
    tagline: "Gentleman's Game",
    description:
      "Step up to the crease and showcase your batting, bowling, and fielding skills in the most exciting cricket tournament of the year.",
    date: "March 16-18, 2026",
    venue: "Cricket Ground",
    teamSize: "11 vs 11",
    prize: "₹40,000",
    rules: [
      "T20 format matches",
      "Each team gets 20 overs",
      "Powerplay rules in effect",
      "DRS available for semi-finals onwards",
      "Maximum 16 players per squad",
    ],
  },
  {
    id: 4,
    name: "VOLLEYBALL",
    icon: "�",
    color: "#2a2a5a",
    position: [-12, 0, 0], // West
    orbit: 1,
    tier: 1,
    tagline: "Spike It High",
    description:
      "Bump, set, spike! Join the volleyball championship and demonstrate your team coordination and athletic prowess.",
    date: "March 15-17, 2026",
    venue: "Beach Volleyball Arena",
    teamSize: "6 vs 6",
    prize: "₹30,000",
    rules: [
      "Best of 5 sets (25 points each)",
      "Rally point scoring",
      "Maximum 3 touches per side",
      "Rotation rules enforced",
      "Maximum 14 players per squad",
    ],
  },

  // ===== MIDDLE RING (Radius 20) - 4 Popular Sports =====
  {
    id: 5,
    name: "BADMINTON",
    icon: "🏸",
    color: "#4a1a1a",
    position: [14.14, 0, -14.14], // Northeast
    orbit: 2,
    tier: 2,
    tagline: "Smash & Win",
    description:
      "Fast-paced rallies and powerful smashes await! Compete in singles and doubles categories to claim the championship.",
    date: "March 15-16, 2026",
    venue: "Indoor Sports Complex",
    teamSize: "Singles/Doubles",
    prize: "₹25,000",
    rules: [
      "Best of 3 games (21 points each)",
      "Rally scoring system",
      "Service rules as per BWF",
      "Singles and Doubles categories",
      "Knockout bracket format",
    ],
  },
  {
    id: 6,
    name: "HANDBALL",
    icon: "🤾",
    color: "#0b1e3a",
    position: [14.14, 0, 14.14], // Southeast
    orbit: 2,
    tier: 2,
    tagline: "Fast & Furious",
    description:
      "High-speed action with quick passes and powerful shots! Showcase your agility and teamwork in this exciting handball tournament.",
    date: "March 16-17, 2026",
    venue: "Indoor Sports Arena",
    teamSize: "7 vs 7",
    prize: "₹28,000",
    rules: [
      "IHF rules apply",
      "Two 30-minute halves",
      "No more than 3 steps with ball",
      "Goal area is restricted",
      "Maximum 14 players per squad",
    ],
  },
  {
    id: 7,
    name: "KABADDI",
    icon: "🤼",
    color: "#8b4513",
    position: [-14.14, 0, 14.14], // Southwest
    orbit: 2,
    tier: 2,
    tagline: "Raid & Defend",
    description:
      "Traditional Indian sport combining strength, strategy, and stamina. Raid the opponent's court while holding your breath!",
    date: "March 16-17, 2026",
    venue: "Kabaddi Arena",
    teamSize: "7 vs 7",
    prize: "₹28,000",
    rules: [
      "Pro Kabaddi League format",
      "Each raid: 30 seconds max",
      "Super tackles and super raids",
      "Best of 3 matches",
      "Maximum 12 players per squad",
    ],
  },
  {
    id: 8,
    name: "CHESS",
    icon: "♟️",
    color: "#1a1a1a",
    position: [-14.14, 0, -14.14], // Northwest
    orbit: 2,
    tier: 2,
    tagline: "Checkmate Mastery",
    description:
      "Battle of minds! Outthink your opponents in intense chess matches. Strategic thinking and tactical brilliance will reign supreme.",
    date: "March 16-17, 2026",
    venue: "Conference Hall A",
    teamSize: "1 vs 1",
    prize: "₹20,000",
    rules: [
      "Standard FIDE rules",
      "Time control: 15 min + 10 sec increment",
      "Touch-move rule enforced",
      "Swiss system tournament",
      "Digital boards with live streaming",
    ],
  },

  // ===== OUTER RING (Radius 26) - 4 Indoor Sports =====
  {
    id: 9,
    name: "TABLE TENNIS",
    icon: "�",
    color: "#2a4a2a",
    position: [0, 0, -26], // Far North
    orbit: 3,
    tier: 3,
    tagline: "Ping Pong Power",
    description:
      "Lightning-fast reflexes meet precision control. Compete in the ultimate table tennis showdown with spin, speed, and strategy.",
    date: "March 15-16, 2026",
    venue: "Indoor Sports Hall",
    teamSize: "Singles/Doubles",
    prize: "₹18,000",
    rules: [
      "Best of 5 games (11 points each)",
      "Two-point lead required to win",
      "Service alternates every 2 points",
      "ITTF regulations apply",
      "Singles and doubles events",
    ],
  },
  {
    id: 10,
    name: "CARROM",
    icon: "�",
    color: "#654321",
    position: [26, 0, 0], // East (90°)
    orbit: 3,
    tier: 3,
    tagline: "Strike & Pocket",
    description:
      "Traditional board game of precision and skill. Pocket the carrom men and the queen to claim victory!",
    date: "March 15-16, 2026",
    venue: "Indoor Gaming Hall",
    teamSize: "Singles/Doubles",
    prize: "₹15,000",
    rules: [
      "International Carrom Federation rules",
      "Best of 3 boards",
      "25 points to win each board",
      "Queen must be covered",
      "Singles and doubles categories",
    ],
  },
  {
    id: 11,
    name: "ATHLETICS",
    icon: "🏃",
    color: "#5a1a2a",
    position: [0, 0, 26], // South (180°)
    orbit: 3,
    tier: 3,
    tagline: "Track & Field Glory",
    description:
      "Sprint, jump, throw! Compete in various track and field events. Show your athletic excellence across multiple disciplines.",
    date: "March 15-18, 2026",
    venue: "Athletic Stadium",
    teamSize: "Individual",
    prize: "₹32,000",
    rules: [
      "Multiple event categories",
      "World Athletics rules",
      "Electronic timing and measurement",
      "100m, 200m, relay, long jump, javelin",
      "Qualifying rounds and finals",
    ],
  },
  {
    id: 12,
    name: "POWERLIFTING",
    icon: "🏋️",
    color: "#1a1a1a",
    position: [-26, 0, 0], // West (270°)
    orbit: 3,
    tier: 1,
    tagline: "Strength Supreme",
    description:
      "Lift heavy, lift strong! Compete in squat, bench press, and deadlift. Show your raw power and technique in this ultimate strength competition.",
    date: "March 17-18, 2026",
    venue: "Fitness Arena",
    teamSize: "Individual",
    prize: "₹35,000",
    rules: [
      "IPF (International Powerlifting Federation) rules",
      "Three attempts per lift",
      "Squat, Bench Press, Deadlift",
      "Weight classes enforced",
      "Professional judging panel",
    ],
  },
];

// Orbital Ring Component
function OrbitalRing({ radius, color, opacity = 0.15, segments = 128 }) {
  const ringRef = useRef();

  useFrame((state) => {
    if (ringRef.current) {
      // Rotate around Z-axis (spin in place) - very subtle
      ringRef.current.rotation.z = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.08, 8, segments]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        wireframe={false}
      />
    </mesh>
  );
}

// Orbiting Planet Wrapper - Makes planets orbit around center
function OrbitingPlanet({
  sport,
  orbitRadius,
  orbitSpeed,
  initialAngle,
  onIslandClick,
  isLocked,
  onRegisterRef,
}) {
  const orbitRef = useRef();

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const angle = initialAngle + elapsed * orbitSpeed;

    if (orbitRef.current) {
      const x = Math.cos(angle) * orbitRadius;
      const z = Math.sin(angle) * orbitRadius;

      orbitRef.current.position.x = x;
      orbitRef.current.position.z = z;
      orbitRef.current.position.y = 0;
    }
  });

  // Register ref when locked
  useEffect(() => {
    if (isLocked && onRegisterRef) {
      onRegisterRef(orbitRef);
    }
  }, [isLocked, onRegisterRef]);

  return (
    <group ref={orbitRef}>
      <FloatingIsland
        sportName={sport.name}
        icon={sport.icon}
        color={sport.color}
        onClick={() => onIslandClick(sport)}
        position={[0, 0, 0]} // Position is controlled by orbit group
      />
    </group>
  );
}

// Camera component with planet tracking
function CameraRig({ lockedPlanetRef }) {
  const { camera, controls } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 8, 35));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    // Cinematic easing - slower and smoother for a more dramatic effect
    const isMobile = window.innerWidth < 768;
    const lerpSpeed = isMobile ? 0.08 : 0.06;

    if (lockedPlanetRef?.current) {
      // Get planet position directly from ref - no state delay!
      const px = lockedPlanetRef.current.position.x;
      const py = lockedPlanetRef.current.position.y;
      const pz = lockedPlanetRef.current.position.z;

      const offset = new THREE.Vector3(px, py, pz);
      const direction = offset.clone().normalize();

      // Position camera behind and above the planet
      targetPos.current.set(px + direction.x * 8, py + 6, pz + direction.z * 8);
      targetLookAt.current.set(px, py, pz);
    } else {
      // Default overview position
      targetPos.current.set(0, 8, 35);
      targetLookAt.current.set(0, 0, 0);
    }

    camera.position.lerp(targetPos.current, lerpSpeed);

    if (controls) {
      controls.target.lerp(targetLookAt.current, lerpSpeed);
      controls.update();
    }
  });

  return <PerspectiveCamera makeDefault position={[0, 8, 35]} fov={75} />;
}

// Scene component
function Scene({ onIslandClick, lockedPlanet, onRegisterPlanetRef }) {
  return (
    <>
      <CinematicSpaceBackground />
      {/* Nebula Background */}
      <NebulaBackground />
      {/* Cosmic Dust Particles */}
      <CosmicDust />
      {/* Optimized Lighting - Reduced for better performance */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={0.5}
        color="#ffb36a"
      />
      {/* Central galaxy light */}
      <pointLight
        position={[0, 10, 0]}
        intensity={1.5}
        color="#ff8b1f"
        distance={50}
      />
      {/* Single accent light instead of multiple */}
      <pointLight
        position={[15, 15, 15]}
        intensity={0.8}
        color="#8a2be2"
        distance={40}
      />
      {/* Lighter fog for better visibility */}
      <fog attach="fog" args={["#0a0515", 40, 80]} />
      {/* Optimized starfield - reduced count */}
      <Stars
        radius={120}
        depth={80}
        count={5000}
        factor={5}
        saturation={0.2}
        fade
        speed={0.3}
      />
      {/* Orbital Rings - Solar System Structure */}
      <OrbitalRing radius={12} color="#4169e1" opacity={0.2} />{" "}
      {/* Inner Ring */}
      <OrbitalRing radius={20} color="#9370db" opacity={0.18} />{" "}
      {/* Middle Ring */}
      <OrbitalRing radius={26} color="#ff6b35" opacity={0.15} />{" "}
      {/* Outer Ring */}
      {/* Central Sun/Core - Enhanced with glow */}
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color="#ffdd55"
          emissive="#ffaa00"
          emissiveIntensity={1.5}
          roughness={0.2}
        />
      </mesh>
      {/* Sun glow effect */}
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color="#ff8b1f"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Orbiting Planets - Inner Ring (Orbit 1) */}
      {sportsData
        .filter((s) => s.orbit === 1)
        .map((sport, index) => (
          <OrbitingPlanet
            key={sport.id}
            sport={sport}
            orbitRadius={12}
            orbitSpeed={0.13}
            initialAngle={(index / 4) * Math.PI * 2}
            onIslandClick={onIslandClick}
            isLocked={lockedPlanet?.id === sport.id}
            onRegisterRef={
              lockedPlanet?.id === sport.id ? onRegisterPlanetRef : null
            }
          />
        ))}
      {/* Orbiting Planets - Middle Ring (Orbit 2) */}
      {sportsData
        .filter((s) => s.orbit === 2)
        .map((sport, index) => (
          <OrbitingPlanet
            key={sport.id}
            sport={sport}
            orbitRadius={20}
            orbitSpeed={0.09}
            initialAngle={(index / 4) * Math.PI * 2}
            onIslandClick={onIslandClick}
            isLocked={lockedPlanet?.id === sport.id}
            onRegisterRef={
              lockedPlanet?.id === sport.id ? onRegisterPlanetRef : null
            }
          />
        ))}
      {/* Orbiting Planets - Outer Ring (Orbit 3) */}
      {sportsData
        .filter((s) => s.orbit === 3)
        .map((sport, index) => (
          <OrbitingPlanet
            key={sport.id}
            sport={sport}
            orbitRadius={26}
            orbitSpeed={0.06}
            initialAngle={(index / 4) * Math.PI * 2}
            onIslandClick={onIslandClick}
            isLocked={lockedPlanet?.id === sport.id}
            onRegisterRef={
              lockedPlanet?.id === sport.id ? onRegisterPlanetRef : null
            }
          />
        ))}
    </>
  );
}

export default function GameVerse() {
  const navigate = useNavigate();
  const [selectedSport, setSelectedSport] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [lockedPlanet, setLockedPlanet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const lockedPlanetRef = useRef(null);

  // Simulate loading time for scene initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // 2.5 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  const handleIslandClick = (sport) => {
    setSelectedSport(sport);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedSport(null), 300);
  };

  const handlePlanetSelect = (sport) => {
    setLockedPlanet(sport);
  };

  const handleResetView = () => {
    setLockedPlanet(null);
    lockedPlanetRef.current = null;
  };

  const handleRegisterPlanetRef = (ref) => {
    lockedPlanetRef.current = ref.current;
  };

  const handleRegisterClick = (sport) => {
    // Navigate to universal registration page
    navigate("/register");
    setModalOpen(false);
  };

  const closeRegistration = () => {
    // Not needed anymore - keeping for compatibility
  };

  // Split sports into left and right lists
  const leftSports = sportsData.slice(0, 6);
  const rightSports = sportsData.slice(6, 12);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* 3D Canvas Loading Animation - GPU ACCELERATED */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 z-50"
            style={{
              willChange: "opacity",
              transform: "translate3d(0,0,0)", // GPU layer
            }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <GamerverseLoading />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Button - Responsive */}
      <Link
        to="/home"
        className="absolute 
                   top-2 left-2 sm:top-4 sm:left-4 md:top-8 md:left-8 
                   z-10 
                   px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 
                   text-xs sm:text-sm md:text-base
                   bg-black/50 backdrop-blur-md border border-[#ffb36a]/30 
                   rounded-md md:rounded-lg text-[#ffb36a] 
                   hover:bg-[#ffb36a]/10 transition-all duration-300 font-semibold"
      >
        <span className="hidden sm:inline">← Back to Home</span>
        <span className="sm:hidden">← Home</span>
      </Link>

      {/* Unlock/Reset View Button and Locked Planet Indicator (stacked) - GPU ACCELERATED */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 md:top-8 md:right-8 z-20 flex flex-col items-end space-y-2">
        <motion.button
          onClick={handleResetView}
          className="px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 text-xs sm:text-sm md:text-base bg-black/50 backdrop-blur-md border border-[#ffb36a]/30 rounded-md md:rounded-lg text-[#ffb36a] hover:bg-[#ffb36a]/10 transition-all duration-300 font-semibold"
          style={{
            willChange: "transform, opacity",
            transform: "translate3d(0,0,0)", // GPU layer
          }}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="hidden sm:inline">
            {lockedPlanet ? "🔓 Unlock View" : "🌌 Overview"}
          </span>
          <span className="sm:hidden">{lockedPlanet ? "🔓" : "🌌"}</span>
        </motion.button>
        {/* Locked Planet Indicator - below the button - GPU ACCELERATED */}
        <AnimatePresence mode="wait">
          {lockedPlanet && (
            <motion.div
              key={lockedPlanet.id}
              className="w-full max-w-xs text-center pointer-events-none"
              style={{
                willChange: "transform, opacity",
                transform: "translate3d(0,0,0)", // GPU layer
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-black/80 backdrop-blur-md border-2 border-[#ffb36a] rounded-md md:rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2.5 shadow-lg shadow-[#ffb36a]/20 mx-auto">
                <div className="flex items-center gap-1 sm:gap-2 justify-center">
                  <span className="text-lg sm:text-xl md:text-2xl">
                    {lockedPlanet.icon}
                  </span>
                  <div className="text-left">
                    <p className="text-[#ffb36a] text-[10px] sm:text-xs md:text-sm font-bold leading-tight">
                      🔒 {lockedPlanet.name}
                    </p>
                    <p className="text-gray-400 text-[8px] sm:text-[9px] md:text-[10px]">
                      Following
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Left Planet List - Vertical on both mobile and desktop, positioned on left side - GPU ACCELERATED */}
      <motion.div
        className="absolute 
                   left-1 top-16 md:left-2 md:top-[25%] md:-translate-y-1/2
                   z-20 
                   flex flex-col gap-1 md:gap-2 
                   max-w-[120px] sm:max-w-[150px] md:max-w-[180px]"
        style={{
          willChange: "transform, opacity",
          transform: "translate3d(0,0,0)", // GPU layer
        }}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        {leftSports.map((sport, index) => (
          <motion.button
            key={sport.id}
            onClick={() => handlePlanetSelect(sport)}
            className={`group relative 
                       px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 
                       rounded-md md:rounded-lg transition-all duration-300 
                       ${
                         lockedPlanet?.id === sport.id
                           ? "bg-[#ffb36a]/20 border-2 border-[#ffb36a] scale-105"
                           : "bg-black/60 border border-[#ffb36a]/30 hover:bg-[#ffb36a]/10 hover:border-[#ffb36a]/60"
                       }`}
            style={{
              willChange: "transform, opacity",
              transform: "translate3d(0,0,0)", // GPU layer
            }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 1 + index * 0.05 }}
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center gap-1.5 md:gap-2.5 backdrop-blur-md">
              <span className="text-lg sm:text-xl md:text-2xl">
                {sport.icon}
              </span>
              <div className="text-left flex-1">
                <p className="text-[#ffb36a] font-bold text-[9px] sm:text-xs md:text-sm leading-tight">
                  {sport.name}
                </p>
                <p className="text-gray-500 text-[8px] sm:text-[9px] md:text-xs">
                  Orbit {sport.orbit}
                </p>
              </div>
            </div>
            {lockedPlanet?.id === sport.id && (
              <motion.div
                className="absolute -right-1 top-1/2 -translate-y-1/2"
                style={{
                  willChange: "transform",
                  transform: "translate3d(0,0,0)", // GPU layer
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#ffb36a] animate-pulse"></div>
              </motion.div>
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Right Planet List - Vertical on both mobile and desktop, positioned on right side - GPU ACCELERATED */}
      <motion.div
        className="absolute 
                   right-1 top-16 md:right-2 md:top-[25%] md:-translate-y-1/2
                   z-20 
                   flex flex-col gap-1 md:gap-2 
                   max-w-[120px] sm:max-w-[150px] md:max-w-[180px]"
        style={{
          willChange: "transform, opacity",
          transform: "translate3d(0,0,0)", // GPU layer
        }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        {rightSports.map((sport, index) => (
          <motion.button
            key={sport.id}
            onClick={() => handlePlanetSelect(sport)}
            className={`group relative 
                       px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 
                       rounded-md md:rounded-lg transition-all duration-300 
                       ${
                         lockedPlanet?.id === sport.id
                           ? "bg-[#ffb36a]/20 border-2 border-[#ffb36a] scale-105"
                           : "bg-black/60 border border-[#ffb36a]/30 hover:bg-[#ffb36a]/10 hover:border-[#ffb36a]/60"
                       }`}
            style={{
              willChange: "transform, opacity",
              transform: "translate3d(0,0,0)", // GPU layer
            }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 1 + index * 0.05 }}
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center gap-1.5 md:gap-2.5 backdrop-blur-md">
              <div className="text-right flex-1">
                <p className="text-[#ffb36a] font-bold text-[9px] sm:text-xs md:text-sm leading-tight">
                  {sport.name}
                </p>
                <p className="text-gray-500 text-[8px] sm:text-[9px] md:text-xs">
                  Orbit {sport.orbit}
                </p>
              </div>
              <span className="text-lg sm:text-xl md:text-2xl">
                {sport.icon}
              </span>
            </div>
            {lockedPlanet?.id === sport.id && (
              <motion.div
                className="absolute -left-1 top-1/2 -translate-y-1/2"
                style={{
                  willChange: "transform",
                  transform: "translate3d(0,0,0)", // GPU layer
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#ffb36a] animate-pulse"></div>
              </motion.div>
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* (Removed duplicate locked planet indicator box from center of screen) */}

      {/* Title Overlay - Responsive & Perfectly Centered - GPU ACCELERATED */}
      <div className="absolute top-0 left-0 w-full z-10 pointer-events-none">
        <motion.div
          className="flex flex-col items-center justify-center 
                     pt-3 sm:pt-6 md:pt-8 px-4"
          style={{
            willChange: "transform, opacity",
            transform: "translate3d(0,0,0)", // GPU layer
          }}
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, type: "spring" }}
        >
          <motion.h1
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl 
                       font-black mb-1 md:mb-2 relative text-center"
            style={{
              background:
                "linear-gradient(135deg, #ffb36a 0%, #ff8b1f 50%, #ffb36a 100%)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 40px rgba(255,179,106,0.6))",
              willChange: "background-position", // Performance hint
              transform: "translate3d(0,0,0)", // GPU layer
            }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            GAMEVERSE
          </motion.h1>
          <motion.p
            className="text-gray-400 text-[10px] sm:text-xs md:text-sm 
                       tracking-wider md:tracking-widest font-semibold text-center px-2"
            style={{
              willChange: "opacity",
              transform: "translate3d(0,0,0)", // GPU layer
            }}
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className="hidden sm:inline">
              EXPLORE 12 SPORTS IN A SOLAR SYSTEM
            </span>
            <span className="sm:hidden">12 SPORTS SOLAR SYSTEM</span>
          </motion.p>
        </motion.div>
      </div>
      {/* Instructions - Responsive - GPU ACCELERATED */}
      <motion.div
        className="absolute bottom-4 sm:bottom-6 md:bottom-8 
                   left-1/2 -translate-x-1/2 z-10 text-center px-4 max-w-full"
        style={{
          willChange: "opacity",
          transform: "translate3d(0,0,0)", // GPU layer
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <p className="text-gray-500 text-[8px] sm:text-[10px] md:text-xs tracking-wider hidden md:block">
          DRAG TO ROTATE • SCROLL TO ZOOM • RIGHT-CLICK & DRAG TO PAN
        </p>
        <p className="text-gray-500 text-[8px] sm:text-[10px] tracking-wider md:hidden">
          DRAG TO ROTATE • SCROLL TO ZOOM
        </p>
        <p className="text-gray-400 text-[8px] sm:text-[10px] md:text-xs tracking-wider mt-0.5 md:mt-1">
          <span className="hidden sm:inline">
            Click any planet to view details • Use arrows to navigate planets
          </span>
          <span className="sm:hidden">Tap planets for details</span>
        </p>
      </motion.div>
      {/* 3D Canvas */}
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <CameraRig lockedPlanetRef={lockedPlanetRef} />
        <Scene
          onIslandClick={handleIslandClick}
          lockedPlanet={lockedPlanet}
          onRegisterPlanetRef={handleRegisterPlanetRef}
        />
        <OrbitControls
          enablePan={true}
          enableRotate={true}
          enableZoom={true}
          minDistance={window.innerWidth < 768 ? 8 : 6}
          maxDistance={window.innerWidth < 768 ? 60 : 50}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 6}
          autoRotate={false}
          rotateSpeed={window.innerWidth < 768 ? 0.8 : 1.2}
          zoomSpeed={window.innerWidth < 768 ? 0.8 : 1.0}
          panSpeed={window.innerWidth < 768 ? 0.5 : 0.8}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
      {/* Sport Details Modal */}
      <SportModal
        isOpen={modalOpen}
        onClose={closeModal}
        sport={selectedSport}
        onRegister={handleRegisterClick}
      />

      {/* Floating Admin Button */}
      <Link to="/admin/login" className="fixed bottom-6 right-6 z-50 group">
        <motion.div
          className="relative"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:shadow-xl group-hover:shadow-purple-500/70 transition-all duration-300">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black/90 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Admin Login
          </span>
        </motion.div>
      </Link>
    </div>
  );
}
