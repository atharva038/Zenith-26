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
import { useRegistrationStatus } from "../hooks/useRegistrationStatus";
import PageLikePoll from "../components/PageLikePoll";
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
    color: "#16A34A",
    position: [0, 0, -12], // North
    orbit: 1,
    tier: 1,
    tagline: "The Beautiful Game",
    description:
      "Experience the thrill of competitive football at ZENITH 2026. Join teams from across the nation in an epic battle for glory on the pitch.",
    date: "February 20-22, 2026",
    venue: "Main Stadium Arena",
    teamSize: "Boys only - Maximum 16 players",
    registrationFee: "₹3000 per team",
    rules: [
      "FIFA rules applicable",
      "Standard kit required",
      "20 minutes early reporting",
      "Disqualification if absent",
      "Age limit: 25 years",
    ],
    coordinators: [
      { name: "Rohan Pundkare", contact: "7249886133" },
      { name: "Srujan Pal", contact: "8788766970" },
    ],
    coordinators: [
      { name: "Rohan Pundkare", phone: "7249886133" },
      { name: "Srujan Pal", phone: "8788766970" },
    ],
    registrationStatus: "open",
  },
  {
    id: 2,
    name: "BASKETBALL (5X5)",
    icon: "🏀",
    color: "#F97316",
    position: [12, 0, 0], // East
    orbit: 1,
    tier: 1,
    tagline: "Hoop Dreams",
    description:
      "Dribble, shoot, and slam your way to victory in high-energy basketball matches. Show off your court skills and teamwork.",
    date: "February 20-22, 2026",
    venue: "Outdoor Basketball Courts",
    teamSize: "Both (Men & Women) - 5 vs 5, Maximum 12 players per team",
    registrationFee: "Men: ₹2500 | Women: ₹1500 per team",
    rules: [
      "SPPU rules applicable",
      "20 minutes early reporting compulsory",
      "Disqualification if absent",
      "Player ID verification decision final",
      "Age limit: 25 years",
      "Maximum 12 players per team",
    ],
    coordinators: [
      { name: "Uday Naukarkar", contact: "9322684201" },
      { name: "Krushna Jadhav", contact: "8208422959" },
    ],
    coordinators: [
      { name: "Uday Naukarkar", phone: "9322684201" },
      { name: "Krushna Jadhav", phone: "8208422959" },
    ],
    registrationStatus: "open",
  },
  {
    id: 3,
    name: "CRICKET",
    icon: "🏏",
    color: "#1D4ED8",
    position: [0, 0, 12], // South
    orbit: 1,
    tier: 1,
    tagline: "Gentleman's Game",
    description:
      "Step up to the crease and showcase your batting, bowling, and fielding skills in the most exciting cricket tournament of the year.",
    date: "February 16-19, 2026",
    venue: "Cricket Ground",
    teamSize: "Boys only - 11 playing players",
    registrationFee: "₹6500 per team (Men)",
    rules: [
      "T20 format matches",
      "Each team gets 20 overs",
      "Powerplay rules in effect",
      "Maximum 16 players per squad",
    ],
    coordinators: [
      { name: "Pranav Godle", phone: "9028783635" },
      { name: "Shahaji Bhosle", phone: "8308949481" },
    ],
    registrationStatus: "open",
  },
  {
    id: 4,
    name: "VOLLEYBALL",
    icon: "🏐",
    color: "#2563EB",
    position: [-12, 0, 0], // West
    orbit: 1,
    tier: 1,
    tagline: "Spike It High",
    description:
      "Bump, set, spike! Join the volleyball championship and demonstrate your team coordination and athletic prowess.",
    date: "February 20-22, 2026",
    venue: "Beach Volleyball Arena",
    teamSize: "Both (Men & Women) - 6 playing players, Maximum 12 per team",
    registrationFee: "Men: ₹2200 | Women: ₹1500 per team",
    rules: [
      "Best of 3 sets (25, 25, 15 points)",
      "FIVB rules applicable",
      "20 minutes early reporting",
      "Age limit: 25 years",
      "Maximum 12 players per team",
    ],
    coordinators: [
      { name: "Maitreyi Bhumbar", contact: "8788183714" },
      { name: "Harsh Marodkar", contact: "8208016898" },
    ],
    coordinators: [
      { name: "Maitreyi Bhumbar", phone: "8788183714" },
      { name: "Harsh Marodkar", phone: "8208016898" },
    ],
    registrationStatus: "open",
  },

  // ===== MIDDLE RING (Radius 20) - 4 Popular Sports =====
  {
    id: 5,
    name: "BADMINTON",
    icon: "🏸",
    color: "#22C55E",
    position: [14.14, 0, -14.14], // Northeast
    orbit: 2,
    tier: 2,
    tagline: "Smash & Win",
    description:
      "Fast-paced rallies and powerful smashes await! Compete in singles and doubles categories to claim the championship.",
    date: "February 20-21, 2026",
    venue: "Indoor Sports Complex",
    teamSize: "Boys only - Maximum 5 players per team",
    registrationFee: "₹1000 per team",
    rules: [
      "Best of 3 games (15 points each)",
      "Bring own kit",
      "SPPU rules applicable",
      "20 minutes early reporting",
      "Age limit: 25 years",
    ],
    coordinators: [
      { name: "Harsh Keshkar", contact: "8010529661" },
      { name: "Aditi Phulare", contact: "8669995909" },
    ],
    coordinators: [
      { name: "Harsh Keshkar", phone: "8010529661" },
      { name: "Aditi Phulare", phone: "8669995909" },
    ],
    registrationStatus: "open",
  },
  {
    id: 6,
    name: "HANDBALL",
    icon: "🤾",
    color: "#DC2626",
    position: [14.14, 0, 14.14], // Southeast
    orbit: 2,
    tier: 2,
    tagline: "Fast & Furious",
    description:
      "High-speed action with quick passes and powerful shots! Showcase your agility and teamwork in this exciting handball tournament.",
    date: "February 20-22, 2026",
    venue: "Indoor Sports Arena",
    teamSize: "Boys only - Minimum 9, Maximum 16 players",
    registrationFee: "₹1500 per team",
    rules: [
      "25-minute match (10+10 minutes halves, 5-minute break)",
      "Rolling substitutions allowed",
      "20 minutes early reporting",
      "Disqualification if absent",
      "Age limit: 25 years",
    ],
    coordinators: [
      { name: "Aditya Joshi", contact: "7820939780" },
      { name: "Amarja Dhepe", contact: "9552110021" },
    ],
    coordinators: [
      { name: "Aditya Joshi", phone: "7820939780" },
      { name: "Amarja Dhepe", phone: "9552110021" },
    ],
    registrationStatus: "open",
  },
  {
    id: 7,
    name: "KABADDI",
    icon: "🤼",
    color: "#DC2626",
    position: [-14.14, 0, 14.14], // Southwest
    orbit: 2,
    tier: 2,
    tagline: "Raid & Defend",
    description:
      "Traditional Indian sport combining strength, strategy, and stamina. Raid the opponent's court while holding your breath!",
    date: "February 20-22, 2026",
    venue: "Kabaddi Arena",
    teamSize: "Both (Men & Women) - Maximum 12 players per team",
    registrationFee: "Men: ₹2200 | Women: ₹1500 per team",
    rules: [
      "Two halves of 15 minutes",
      "Weight limit: Up to 80 kg",
      "Played on mat",
      "Kabaddi Federation rules applicable",
      "20 minutes early reporting",
      "Age limit: 25 years",
    ],
    coordinators: [
      { name: "Shubham Kale", contact: "7378409793" },
      { name: "Sonam Chandel", contact: "8329513257" },
      { name: "Chetan Bante", contact: "8263945881" },
    ],
    coordinators: [
      { name: "Shubham Kale", phone: "7378409793" },
      { name: "Sonam Chandel", phone: "8329513257" },
      { name: "Chetan Bante", phone: "8263945881" },
    ],
    registrationStatus: "open",
  },
  {
    id: 8,
    name: "CHESS",
    icon: "♟️",
    color: "#1F2937",
    position: [-14.14, 0, -14.14], // Northwest
    orbit: 2,
    tier: 2,
    tagline: "Checkmate Mastery",
    description:
      "Battle of minds! Outthink your opponents in intense chess matches. Strategic thinking and tactical brilliance will reign supreme.",
    date: "February 20-22, 2026",
    venue: "Conference Hall A",
    teamSize: "Mixed - Team (4 players) & Solo",
    registrationFee: "Team: ₹500 | Solo: ₹200",
    rules: [
      "Team & Individual events (mixed)",
      "Team: 4 players per team",
      "Solo: Individual competition",
      "FIDE & Swiss system rules",
      "No electronic devices",
      "Bring own chess clock",
      "20 minutes early reporting",
    ],
    coordinators: [
      { name: "Sarthak Rahut", phone: "8788380729" },
      { name: "Akshit Tupkar", phone: "7028455126" },
    ],
    registrationStatus: "open",
  },

  // ===== OUTER RING (Radius 26) - 4 Sports =====
  {
    id: 11,
    name: "ATHLETICS",
    icon: "🏃",
    color: "#B91C1C",
    position: [0, 0, -26], // North
    orbit: 3,
    tier: 3,
    tagline: "Track & Field Glory",
    description:
      "Sprint, jump, throw! Compete in various track and field events. Show your athletic excellence across multiple disciplines.",
    date: "February 20-22, 2026",
    venue: "Athletic Stadium",
    teamSize: "Boys only - Team & Individual Events",
    registrationFee: "Individual: ₹200 | Team: ₹700",
    rules: [
      "Individual Events: 100m, 400m, Shot Put, Discus, Long Jump",
      "Team Events: 4x100m Relay, Mixed Relay (2 Boys + 2 Girls)",
      "20 minutes early reporting",
      "Player identification verification final",
      "Age limit: 25 years",
    ],
    coordinators: [
      { name: "Dipanshu Sahatpute", contact: "7620666188" },
      { name: "Shrujan Pal", contact: "8788766970" },
    ],
    registrationStatus: "open",
  },
  {
    id: 12,
    name: "POWERLIFTING",
    icon: "🏋️",
    color: "#4B5563",
    position: [26, 0, 0], // East
    orbit: 3,
    tier: 3,
    tagline: "Strength Supreme",
    description:
      "Lift heavy, lift strong! Compete in squat, bench press, and deadlift. Show your raw power and technique in this ultimate strength competition.",
    date: "February 21-22, 2026",
    venue: "Fitness Arena",
    teamSize: "Boys only - Individual",
    registrationFee: "₹300 per player",
    rules: [
      "3 attempts each: Squat, Bench Press, Deadlift",
      "Bring own accessories",
      "International weight categories",
      "20 minutes early reporting",
      "Age limit: 25 years",
    ],
    coordinators: [
      { name: "Tejas Borole", contact: "8767386695" },
      { name: "Sakshi Done", contact: "9028684180" },
    ],
    registrationStatus: "open",
  },
  {
    id: 14,
    name: "RINK FOOTBALL",
    icon: "⚽",
    color: "#38BDF8",
    position: [0, 0, 26], // South
    orbit: 3,
    tier: 3,
    tagline: "Fast-Paced Football",
    description:
      "Experience football in an enclosed arena! Fast-paced, high-intensity matches with quick turnarounds and non-stop action.",
    date: "February 20-21, 2026",
    venue: "Indoor Sports Arena",
    teamSize: "Both (Men & Women) - Boys: 6 playing | Girls: 7 playing, Max 10",
    registrationFee: "Men: ₹2200 | Women: ₹1500 per team",
    rules: [
      "No offside rule",
      "Rolling substitutions",
      "Yellow card = 2-minute suspension",
      "20 minutes early reporting",
      "Age limit: 25 years",
      "Maximum squad: 10 players",
    ],
    coordinators: [
      { name: "Onkar Sahane", contact: "8767192671" },
      { name: "Vipakshi Mate", contact: "7972776597" },
    ],
    registrationStatus: "open",
  },
  {
    id: 15,
    name: "KHO-KHO",
    icon: "🏃‍♂️",
    color: "#F59E0B",
    position: [-26, 0, 0], // West
    orbit: 3,
    tier: 3,
    tagline: "Chase & Tag",
    description:
      "Traditional Indian sport of speed and agility. Chase your opponents, tag them out, and showcase lightning-fast reflexes!",
    date: "February 20-21, 2026",
    venue: "Outdoor Kho-Kho Court",
    teamSize: "Both (Men & Women) - Minimum 9, Maximum 12 players",
    registrationFee: "Men: ₹1500 | Women: ₹1200 per team",
    rules: [
      "20-minute match (7+7 minutes halves, 6-minute break)",
      "Federation rules applicable",
      "20 minutes early reporting",
      "Age limit: 25 years",
    ],
    coordinators: [
      { name: "Sairaj Shinde", contact: "8767179744" },
      { name: "Prem Dhande", contact: "8421230555" },
    ],
    registrationStatus: "open",
  },
  // {
  //   id: 16,
  //   name: "BOX CRICKET",
  //   icon: "📦",
  //   color: "#7C3AED",
  //   position: [0, 0, 32], // Far South
  //   orbit: 4,
  //   tier: 3,
  //   tagline: "Boxed Action",
  //   description:
  //     "Cricket in a confined space! Fast-paced, high-scoring matches with modified rules. Perfect for showcasing quick reflexes and shot-making skills.",
  //   date: "February 20-21, 2026",
  //   venue: "Box Cricket Arena",
  //   teamSize: "6 vs 6",
  //   registrationFee: "₹2000 per team",
  //   rules: [
  //     "6 overs per innings",
  //     "Enclosed playing area",
  //     "Modified scoring zones",
  //     "Catches off nets count",
  //     "Maximum 10 players per squad",
  //   ],
  //   registrationStatus: "open",
  // },
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
  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

  // Responsive camera positioning
  const defaultY = isMobile ? 12 : isTablet ? 10 : 8;
  const defaultZ = isMobile ? 45 : isTablet ? 40 : 35;

  const targetPos = useRef(new THREE.Vector3(0, defaultY, defaultZ));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    // Cinematic easing - slower and smoother for a more dramatic effect
    const lerpSpeed = isMobile ? 0.08 : 0.06;

    if (lockedPlanetRef?.current) {
      // Get planet position directly from ref - no state delay!
      const px = lockedPlanetRef.current.position.x;
      const py = lockedPlanetRef.current.position.y;
      const pz = lockedPlanetRef.current.position.z;

      const offset = new THREE.Vector3(px, py, pz);
      const direction = offset.clone().normalize();

      // Responsive camera distance when focused on planet
      const distance = isMobile ? 12 : isTablet ? 10 : 8;
      const heightOffset = isMobile ? 8 : isTablet ? 7 : 6;

      targetPos.current.set(
        px + direction.x * distance,
        py + heightOffset,
        pz + direction.z * distance,
      );
      targetLookAt.current.set(px, py, pz);
    } else {
      // Default overview position - responsive
      targetPos.current.set(0, defaultY, defaultZ);
      targetLookAt.current.set(0, 0, 0);
    }

    camera.position.lerp(targetPos.current, lerpSpeed);

    if (controls) {
      controls.target.lerp(targetLookAt.current, lerpSpeed);
      controls.update();
    }
  });

  // Responsive FOV
  const fov = isMobile ? 85 : isTablet ? 80 : 75;
  return (
    <PerspectiveCamera
      makeDefault
      position={[0, defaultY, defaultZ]}
      fov={fov}
    />
  );
}

// Scene component
function Scene({ onIslandClick, lockedPlanet, onRegisterPlanetRef, availableSports = sportsData }) {
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
      {availableSports
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
      {availableSports
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
      {availableSports
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

// Coming Soon Component
function ComingSoonOverlay({ isOpen, onClose, sportName, icon }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Coming Soon Content */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="text-center max-w-2xl mx-auto">
              {/* Icon */}
              <motion.div
                className="text-8xl sm:text-9xl md:text-[200px] mb-6 sm:mb-8"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {icon}
              </motion.div>

              {/* Sport Name */}
              <motion.h2
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6"
                style={{
                  background:
                    "linear-gradient(135deg, #ffb36a 0%, #ff8b1f 50%, #ffb36a 100%)",
                  backgroundSize: "200% 200%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 40px rgba(255,179,106,0.6))",
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
                {sportName}
              </motion.h2>

              {/* Coming Soon Text */}
              <motion.div
                className="mb-8 sm:mb-12"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-yellow-400 mb-3 sm:mb-4">
                  COMING SOON
                </p>
                <p className="text-lg sm:text-xl md:text-2xl text-gray-300">
                  Registration will open soon!
                </p>
                <p className="text-sm sm:text-base md:text-lg text-gray-400 mt-2 sm:mt-3">
                  Stay tuned for updates
                </p>
              </motion.div>

              {/* Decorative Elements */}
              <motion.div
                className="flex justify-center gap-2 sm:gap-3 mb-6 sm:mb-8"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[#ffb36a]"
                    style={{
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </motion.div>

              {/* Close Button */}
              <motion.button
                onClick={onClose}
                className="px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold
                          bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f]
                          text-black rounded-lg sm:rounded-xl
                          hover:scale-105 transition-transform duration-300
                          shadow-lg shadow-[#ffb36a]/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function GameVerse() {
  const navigate = useNavigate();
  const [selectedSport, setSelectedSport] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [lockedPlanet, setLockedPlanet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const lockedPlanetRef = useRef(null);

  // Check registration status - now with separate toggles
  const { 
    isCricketOpen, 
    isOtherSportsOpen, 
    loading: statusLoading, 
    message: registrationMessage 
  } = useRegistrationStatus();

  // Determine which sports to show based on toggles
  const availableSports = useMemo(() => {
    // Sports to hide from the site (temporarily disabled)
    const HIDDEN_SPORTS = ["ATHLETICS"];
    
    // Filter out hidden sports first
    const visibleSports = sportsData.filter(s => !HIDDEN_SPORTS.includes(s.name));
    
    const cricket = visibleSports.find(s => s.name === "CRICKET");
    const otherSports = visibleSports.filter(s => s.name !== "CRICKET");
    
    // If both are closed, show nothing (coming soon will display)
    if (!isCricketOpen && !isOtherSportsOpen) {
      return [];
    }
    
    // If only cricket is open, show only cricket
    if (isCricketOpen && !isOtherSportsOpen) {
      return cricket ? [cricket] : [];
    }
    
    // If only other sports are open, show other sports
    if (!isCricketOpen && isOtherSportsOpen) {
      return otherSports;
    }
    
    // If both are open, show all sports
    return visibleSports;
  }, [isCricketOpen, isOtherSportsOpen]);

  // Simulate loading time for scene initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // 2.5 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  const handleIslandClick = (sport) => {
    // Always show coming soon overlay when clicking any sport
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
    // Check if registration is open for this specific sport
    const isCricket = sport.name === "CRICKET";
    const isRegistrationOpen = isCricket ? isCricketOpen : isOtherSportsOpen;
    
    if (!isRegistrationOpen) {
      // Don't navigate, registration is closed for this sport
      return;
    }
    
    // Navigate to universal registration page with sport pre-selected
    navigate("/register-sports", { state: { fromGameVerse: true, preselectedSport: sport.name } });
    setModalOpen(false);
  };

  // Split sports into left and right lists - use availableSports instead of all sports
  const leftSports = availableSports.slice(0, 6);
  const rightSports = availableSports.slice(6, 12);

  // Check if both toggles are off (show coming soon)
  const showComingSoon = !isCricketOpen && !isOtherSportsOpen;

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Page Like Poll */}
      <PageLikePoll pageName="gameverse" />

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

      {/* Global Coming Soon Overlay - When both toggles are OFF */}
      <AnimatePresence>
        {showComingSoon && !isLoading && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center bg-black/90 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center max-w-2xl mx-auto px-4">
              <motion.div
                className="text-9xl mb-8"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                🏆
              </motion.div>
              <motion.h1
                className="text-6xl font-black mb-6"
                style={{
                  background:
                    "linear-gradient(135deg, #ffb36a 0%, #ff8b1f 50%, #ffb36a 100%)",
                  backgroundSize: "200% 200%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 40px rgba(255,179,106,0.6))",
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
                ZENITH 2026
              </motion.h1>
              <motion.p
                className="text-4xl font-bold text-yellow-400 mb-4"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                COMING SOON
              </motion.p>
              <p className="text-xl text-gray-300 mb-3">
                {registrationMessage || "Sports registrations will open soon!"}
              </p>
              <p className="text-lg text-gray-400">
                Stay tuned for updates
              </p>
            </div>
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

      {/* Sports Grid Button - Responsive */}
      <Link
        to="/sports"
        className="absolute 
                   top-2 left-24 sm:top-4 sm:left-40 md:top-8 md:left-52 
                   z-10 
                   px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 
                   text-xs sm:text-sm md:text-base
                   bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f]
                   backdrop-blur-md border border-[#ff8b1f]/50 
                   rounded-md md:rounded-lg text-black font-bold
                   hover:scale-105 hover:shadow-lg hover:shadow-[#ffb36a]/50
                   transition-all duration-300"
      >
        <span className="hidden sm:inline">⚡ Experiencing Lag? Try Simple View</span>
        <span className="sm:hidden">⚡ List View</span>
      </Link>

      {/* Unlock/Reset View Button and Locked Planet Indicator (stacked) - GPU ACCELERATED */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 md:top-8 md:right-8 z-30 flex flex-col items-end space-y-2">
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
      </div>

      {/* Left Planet List - Vertical on both mobile and desktop, positioned on left side - GPU ACCELERATED */}
      <motion.div
        className="absolute 
                   left-1 top-14 bottom-14 sm:top-16 sm:bottom-16 md:left-2 md:top-[15%] md:bottom-[15%]
                   z-20 
                   flex flex-col gap-1 md:gap-2 
                   max-w-[100px] sm:max-w-[130px] md:max-w-[160px]
                   overflow-y-auto overflow-x-hidden
                   scrollbar-hide"
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
            <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2.5 backdrop-blur-md">
              <span className="text-base sm:text-lg md:text-xl">
                {sport.icon}
              </span>
              <div className="text-left flex-1">
                <p className="text-[#ffb36a] font-bold text-[8px] sm:text-[9px] md:text-xs leading-tight truncate">
                  {sport.name}
                </p>
                <p className="text-gray-500 text-[7px] sm:text-[8px] md:text-[9px]">
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
                   right-1 top-14 bottom-14 sm:top-16 sm:bottom-16 md:right-2 md:top-[15%] md:bottom-[15%]
                   z-20 
                   flex flex-col gap-1 md:gap-2 
                   max-w-[100px] sm:max-w-[130px] md:max-w-[160px]
                   overflow-y-auto overflow-x-hidden
                   scrollbar-hide"
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
            <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2.5 backdrop-blur-md">
              <div className="text-right flex-1">
                <p className="text-[#ffb36a] font-bold text-[8px] sm:text-[9px] md:text-xs leading-tight truncate">
                  {sport.name}
                </p>
                <p className="text-gray-500 text-[7px] sm:text-[8px] md:text-[9px]">
                  Orbit {sport.orbit}
                </p>
              </div>
              <span className="text-base sm:text-lg md:text-xl">
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
                     pt-2 sm:pt-4 md:pt-6 px-4"
          style={{
            willChange: "transform, opacity",
            transform: "translate3d(0,0,0)", // GPU layer
          }}
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, type: "spring" }}
        >
          <motion.h1
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl 
                       font-black mb-0.5 sm:mb-1 md:mb-2 relative text-center"
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
              EXPLORE 12 SPORTS IN 3 ORBITS
            </span>
            <span className="sm:hidden">12 SPORTS • 3 ORBITS</span>
          </motion.p>
        </motion.div>
      </div>
      {/* Instructions - Responsive - GPU ACCELERATED */}
      {/* <motion.div
        className="absolute bottom-2 sm:bottom-4 md:bottom-6 
                   left-1/2 -translate-x-1/2 z-10 text-center px-2 max-w-full"
        style={{
          willChange: "opacity",
          transform: "translate3d(0,0,0)", // GPU layer
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <p className="text-gray-500 text-[7px] sm:text-[9px] md:text-xs tracking-wide hidden md:block">
          DRAG TO ROTATE • SCROLL TO ZOOM • RIGHT-CLICK & DRAG TO PAN
        </p>
        <p className="text-gray-500 text-[7px] sm:text-[9px] tracking-wide md:hidden">
          DRAG • ZOOM • TAP PLANETS
        </p>
        <p className="text-gray-400 text-[7px] sm:text-[9px] md:text-xs tracking-wide mt-0.5 hidden sm:block">
          <span className="hidden md:inline">
            Click any planet to view details • Use arrows to navigate planets
          </span>
          <span className="md:hidden">Tap planets for details</span>
        </p>
      </motion.div> */}
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
          availableSports={availableSports}
        />
        <OrbitControls
          enablePan={true}
          enableRotate={true}
          enableZoom={true}
          minDistance={
            window.innerWidth < 768 ? 10 : window.innerWidth < 1024 ? 8 : 6
          }
          maxDistance={
            window.innerWidth < 768 ? 70 : window.innerWidth < 1024 ? 60 : 50
          }
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 6}
          autoRotate={false}
          rotateSpeed={
            window.innerWidth < 768 ? 0.6 : window.innerWidth < 1024 ? 0.9 : 1.2
          }
          zoomSpeed={
            window.innerWidth < 768 ? 0.6 : window.innerWidth < 1024 ? 0.8 : 1.0
          }
          panSpeed={
            window.innerWidth < 768 ? 0.4 : window.innerWidth < 1024 ? 0.6 : 0.8
          }
          enableDamping={true}
          dampingFactor={0.05}
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN,
          }}
        />
      </Canvas>
      {/* Sport Registration Modal */}
      <SportModal
        isOpen={modalOpen}
        onClose={closeModal}
        sport={selectedSport}
        onRegister={handleRegisterClick}
        isRegistrationOpen={selectedSport && (selectedSport.name === "CRICKET" ? isCricketOpen : isOtherSportsOpen)}
        registrationMessage={showComingSoon ? registrationMessage : `${selectedSport?.name} registration is ${selectedSport && (selectedSport.name === "CRICKET" ? isCricketOpen : isOtherSportsOpen) ? "open" : "closed"}`}
      />
    </div>
  );
}
