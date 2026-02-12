import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Cylinder, Sphere } from "@react-three/drei";
import * as THREE from "three";

/**
 * 🏸 Premium Badminton Planet
 * Features:
 * - Badminton court texture with green surface and white lines
 * - Net representation
 * - Orbiting shuttlecocks
 * - Large shuttlecock on top
 * - Cyan/green glow atmosphere
 */

// Create badminton court texture
function useBadmintonCourtTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    const size = 2048;
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    // Court green base (lighter than football)
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );
    gradient.addColorStop(0, "#4db380"); // Light green
    gradient.addColorStop(0.5, "#3d9970"); // Medium green
    gradient.addColorStop(1, "#2d7a5a"); // Dark green
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // Add court texture pattern
    for (let i = 0; i < 15; i++) {
      const y = (i / 15) * size;
      const height = size / 15;
      ctx.fillStyle =
        i % 2 === 0 ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.02)";
      ctx.fillRect(0, y, size, height);
    }

    // White court markings (badminton court)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
    ctx.lineWidth = size * 0.006;

    // Outer boundary
    ctx.strokeRect(size * 0.15, size * 0.1, size * 0.7, size * 0.8);

    // Singles sidelines
    ctx.strokeRect(size * 0.2, size * 0.1, size * 0.6, size * 0.8);

    // Service lines
    ctx.beginPath();
    ctx.moveTo(size * 0.2, size * 0.35);
    ctx.lineTo(size * 0.8, size * 0.35);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(size * 0.2, size * 0.65);
    ctx.lineTo(size * 0.8, size * 0.65);
    ctx.stroke();

    // Center line (net position)
    ctx.beginPath();
    ctx.moveTo(size * 0.15, size * 0.5);
    ctx.lineTo(size * 0.85, size * 0.5);
    ctx.lineWidth = size * 0.008;
    ctx.stroke();

    // Service center lines
    ctx.lineWidth = size * 0.006;
    ctx.beginPath();
    ctx.moveTo(size * 0.5, size * 0.35);
    ctx.lineTo(size * 0.5, size * 0.1);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(size * 0.5, size * 0.65);
    ctx.lineTo(size * 0.5, size * 0.9);
    ctx.stroke();

    // Add subtle noise for texture
    const imageData = ctx.getImageData(0, 0, size, size);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 6;
      imageData.data[i] += noise;
      imageData.data[i + 1] += noise;
      imageData.data[i + 2] += noise;
    }
    ctx.putImageData(imageData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
}

// Shuttlecock component
function Shuttlecock({ position, rotation = [0, 0, 0], scale = 1 }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.03;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Cork base (darker bottom) */}
      <Sphere args={[0.08, 16, 16]} position={[0, -0.05, 0]}>
        <meshStandardMaterial color="#c79b6a" roughness={0.8} metalness={0.1} />
      </Sphere>

      {/* Feather cone (white) */}
      <Cylinder args={[0.12, 0.03, 0.25, 16]} position={[0, 0.1, 0]}>
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.9}
          side={THREE.DoubleSide}
          roughness={0.7}
        />
      </Cylinder>

      {/* Feather details (lines) */}
      {[0, 1, 2, 3].map((i) => (
        <Cylinder
          key={i}
          args={[0.005, 0.005, 0.26, 8]}
          position={[
            Math.cos((i / 4) * Math.PI * 2) * 0.08,
            0.1,
            Math.sin((i / 4) * Math.PI * 2) * 0.08,
          ]}
          rotation={[0, 0, Math.PI * 0.05]}
        >
          <meshStandardMaterial color="#333333" />
        </Cylinder>
      ))}
    </group>
  );
}

function BadmintonPlanet({ position, onClick, hovered, setHovered }) {
  const planetRef = useRef();
  const glowRef = useRef();
  const textRef = useRef();

  const radius = 2.2;
  const texture = useBadmintonCourtTexture();

  // Create orbiting shuttlecocks
  const orbitingShuttles = useMemo(() => {
    return Array.from({ length: 16 }, (_, i) => ({
      id: i,
      radius: radius * (1.4 + Math.random() * 0.3),
      speed: 0.25 + Math.random() * 0.2,
      offset: (i / 16) * Math.PI * 2,
      y: -0.5 + Math.random() * 1,
      scale: 0.7 + Math.random() * 0.35,
    }));
  }, [radius]);

  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime();

    // Planet rotation
    if (planetRef.current) {
      planetRef.current.rotation.y = t * 0.12;
    }

    // Glow pulse
    if (glowRef.current) {
      const pulse = 0.28 + Math.sin(t * 1.3) * 0.09;
      glowRef.current.material.opacity = pulse + (hovered ? 0.14 : 0);
      glowRef.current.scale.setScalar(1.09 + Math.sin(t * 0.7) * 0.02);
    }

    // Billboard text - always face camera
    if (textRef.current) {
      textRef.current.quaternion.copy(camera.quaternion);
    }
  });

  return (
    <group position={position}>
      {/* Main planet */}
      <mesh
        ref={planetRef}
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.6}
          metalness={0.1}
          emissive={hovered ? "#3d9970" : "#000000"}
          emissiveIntensity={hovered ? 0.35 : 0}
        />
      </mesh>

      {/* Glow atmosphere (cyan/green) */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[radius * 1.09, 32, 32]} />
        <meshBasicMaterial
          color="#7fe3c8"
          transparent
          opacity={0.28}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Orbiting shuttlecocks */}
      <group>
        {orbitingShuttles.map((shuttle) => (
          <OrbitingShuttle key={shuttle.id} {...shuttle} />
        ))}
      </group>

      {/* Large shuttlecock on top */}
      <Shuttlecock position={[0, radius * 1.3, 0]} scale={2.5} />

      {/* Net representation on planet surface */}
      <mesh position={[0, radius * 1.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, radius * 1.8]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Label - Billboard text that always faces camera */}
      <Text
        ref={textRef}
        position={[0, radius * 1.75, 0]}
        fontSize={0.7}
        color="#ffffff"
        outlineWidth={0.15}
        outlineColor="#0f6f4f"
        anchorX="center"
        anchorY="middle"
      >
        BADMINTON
      </Text>

      {/* Lights */}
      <pointLight
        position={[3, 3, 3]}
        intensity={hovered ? 2.8 : 2.2}
        distance={15}
        color="#7fe3c8"
      />
      <pointLight
        position={[-3, 3, -3]}
        intensity={1.5}
        distance={12}
        color="#a8fff0"
      />
    </group>
  );
}

// Component for orbiting shuttlecocks
function OrbitingShuttle({ radius, speed, offset, y, scale }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const angle = t * speed + offset;

    if (ref.current) {
      ref.current.position.x = Math.cos(angle) * radius;
      ref.current.position.z = Math.sin(angle) * radius;
      ref.current.position.y = y + Math.sin(t * 2 + offset) * 0.12;
    }
  });

  return (
    <group ref={ref}>
      <Shuttlecock position={[0, 0, 0]} scale={scale} />
    </group>
  );
}

export default BadmintonPlanet;
