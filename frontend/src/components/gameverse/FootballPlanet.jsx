import React, {useRef, useMemo} from "react";
import {useFrame} from "@react-three/fiber";
import {Text} from "@react-three/drei";
import * as THREE from "three";

/**
 * ⚽ Premium Football Planet
 * Features:
 * - Grass field texture with vibrant green
 * - Classic football pentagons and hexagons pattern
 * - Mini footballs orbiting the planet
 * - Large football on top
 * - White/green glow atmosphere
 */

// Create classic football texture with pentagons and hexagons
function useFootballTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    const size = 2048;
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d", {willReadFrequently: true});

    // Vibrant grass green base (like a football field)
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    gradient.addColorStop(0, "#2ea043"); // Bright green
    gradient.addColorStop(0.5, "#26843d"); // Medium green
    gradient.addColorStop(1, "#1f6b31"); // Dark green
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // Add grass texture pattern (stripes like a mowed field)
    for (let i = 0; i < 20; i++) {
      const y = (i / 20) * size;
      const height = size / 20;
      ctx.fillStyle =
        i % 2 === 0 ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.03)";
      ctx.fillRect(0, y, size, height);
    }

    // Add white field markings (simplified)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = size * 0.008;

    // Center circle
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size * 0.15, 0, Math.PI * 2);
    ctx.stroke();

    // Center spot
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size * 0.01, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fill();

    // Penalty areas (simplified representation)
    ctx.strokeRect(size * 0.1, size * 0.3, size * 0.8, size * 0.4);

    // Add some goal post positions
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fillRect(size * 0.45, size * 0.05, size * 0.1, size * 0.03);
    ctx.fillRect(size * 0.45, size * 0.92, size * 0.1, size * 0.03);

    // Add subtle noise for texture
    const imageData = ctx.getImageData(0, 0, size, size);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 8;
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

// Classic football (soccer ball) with pentagons
function Football({position, rotation = [0, 0, 0], scale = 1}) {
  const ballRef = useRef();

  useFrame((state) => {
    if (ballRef.current) {
      ballRef.current.rotation.y += 0.02;
      ballRef.current.rotation.x += 0.01;
    }
  });

  // Create football pattern texture
  const ballTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    const size = 512;
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d", {willReadFrequently: true});

    // White base
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);

    // Black pentagons (simplified classic pattern)
    const pentagons = [
      [size * 0.5, size * 0.2],
      [size * 0.3, size * 0.4],
      [size * 0.7, size * 0.4],
      [size * 0.35, size * 0.65],
      [size * 0.65, size * 0.65],
      [size * 0.5, size * 0.85],
    ];

    ctx.fillStyle = "#1a1a1a";
    pentagons.forEach(([cx, cy]) => {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(angle) * size * 0.08;
        const y = cy + Math.sin(angle) * size * 0.08;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();

      // Add border
      ctx.strokeStyle = "#0a0a0a";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  return (
    <mesh ref={ballRef} position={position} rotation={rotation} scale={scale}>
      <sphereGeometry args={[0.15, 32, 32]} />
      <meshStandardMaterial map={ballTexture} roughness={0.6} metalness={0.1} />
    </mesh>
  );
}

function FootballPlanet({position, onClick, hovered, setHovered}) {
  const planetRef = useRef();
  const glowRef = useRef();

  const radius = 2.2;
  const texture = useFootballTexture();

  // Create orbiting footballs
  const orbitingBalls = useMemo(() => {
    return Array.from({length: 18}, (_, i) => ({
      id: i,
      radius: radius * (1.4 + Math.random() * 0.3),
      speed: 0.3 + Math.random() * 0.2,
      offset: (i / 18) * Math.PI * 2,
      y: -0.5 + Math.random() * 1,
      scale: 0.8 + Math.random() * 0.4,
    }));
  }, [radius]);

  useFrame(({clock}) => {
    const t = clock.getElapsedTime();

    // Planet rotation
    if (planetRef.current) {
      planetRef.current.rotation.y = t * 0.15;
    }

    // Glow pulse
    if (glowRef.current) {
      const pulse = 0.25 + Math.sin(t * 1.5) * 0.08;
      glowRef.current.material.opacity = pulse + (hovered ? 0.12 : 0);
      glowRef.current.scale.setScalar(1.08 + Math.sin(t * 0.8) * 0.02);
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
          roughness={0.7}
          metalness={0.1}
          emissive={hovered ? "#2ea043" : "#000000"}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>

      {/* Glow atmosphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[radius * 1.08, 32, 32]} />
        <meshBasicMaterial
          color="#90ee90"
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Orbiting footballs */}
      <group>
        {orbitingBalls.map((ball) => (
          <OrbitingBall key={ball.id} {...ball} />
        ))}
      </group>

      {/* Large football on top */}
      <Football position={[0, radius * 1.3, 0]} scale={2.5} />

      {/* Label */}
      <Text
        position={[0, radius * 1.7, 0]}
        fontSize={0.7}
        color="#ffffff"
        outlineWidth={0.15}
        outlineColor="#000000"
        anchorX="center"
        anchorY="middle"
      >
        FOOTBALL
      </Text>

      {/* Lights */}
      <pointLight
        position={[3, 3, 3]}
        intensity={hovered ? 2.5 : 2.0}
        distance={15}
        color="#90ee90"
      />
      <pointLight
        position={[-3, 3, -3]}
        intensity={1.2}
        distance={12}
        color="#ffffff"
      />
    </group>
  );
}

// Component for orbiting balls
function OrbitingBall({radius, speed, offset, y, scale}) {
  const ref = useRef();

  useFrame(({clock}) => {
    const t = clock.getElapsedTime();
    const angle = t * speed + offset;

    if (ref.current) {
      ref.current.position.x = Math.cos(angle) * radius;
      ref.current.position.z = Math.sin(angle) * radius;
      ref.current.position.y = y + Math.sin(t * 2 + offset) * 0.1;
    }
  });

  return (
    <group ref={ref}>
      <Football position={[0, 0, 0]} scale={scale} />
    </group>
  );
}

export default FootballPlanet;
