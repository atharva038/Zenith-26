// AthleticsPlanet.jsx
import React, {useMemo, useRef} from "react";
import {useFrame} from "@react-three/fiber";
import {Text} from "@react-three/drei";
import * as THREE from "three";

/* --------------------------------------------------------
   🏃 Silhouette Runner (simple iconic athletics shape)
--------------------------------------------------------- */
function Runner({scale = 1, color = "#ffffff"}) {
  return (
    <group scale={scale}>
      {/* head */}
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* torso */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.18, 0.5, 0.1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* right leg */}
      <mesh position={[0.11, -0.45, 0]}>
        <boxGeometry args={[0.12, 0.55, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* left leg */}
      <mesh position={[-0.11, -0.45, 0]}>
        <boxGeometry args={[0.12, 0.55, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* arms */}
      <mesh position={[0.2, 0, 0]}>
        <boxGeometry args={[0.3, 0.1, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.2, 0, 0]}>
        <boxGeometry args={[0.3, 0.1, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

/* --------------------------------------------------------
   🟤 Planet Texture - Athletics Track Theme (Enhanced)
--------------------------------------------------------- */
function useAthleticsTexture(size = 2048) {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d", {willReadFrequently: true});

    // Gradient base - professional track red/orange
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    gradient.addColorStop(0, "#d94c3d");
    gradient.addColorStop(0.5, "#c23b2e");
    gradient.addColorStop(1, "#9a2f23");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const center = size / 2;

    // Draw track lanes with depth
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 20;
    for (let i = 0; i < 6; i++) {
      const r = center - 100 - i * 75;
      ctx.globalAlpha = 0.9 - i * 0.1;
      ctx.beginPath();
      ctx.arc(center, center, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Add lane numbers/markers
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 60px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const r = center - 200;
      const x = center + Math.cos(angle) * r;
      const y = center + Math.sin(angle) * r;
      ctx.fillText((i + 1).toString(), x, y);
    }

    // Add finish line pattern
    ctx.fillStyle = "#ffffff";
    const lineWidth = 40;
    const checkSize = 60;
    for (let i = 0; i < 10; i++) {
      if (i % 2 === 0) {
        ctx.fillRect(
          center - lineWidth / 2,
          i * checkSize,
          lineWidth,
          checkSize
        );
      }
    }

    // Add texture noise for realism
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < 3000; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? "#ffffff" : "#000000";
      ctx.fillRect(Math.random() * size, Math.random() * size, 1, 1);
    }

    const texture = new THREE.CanvasTexture(c);
    texture.anisotropy = 16;
    return texture;
  }, []);
}

/* --------------------------------------------------------
   🪐 Athletics Planet
--------------------------------------------------------- */
export default function AthleticsPlanet({
  position = [0, 0, 0],
  radius = 2.5,
  onClick,
}) {
  const groupRef = useRef();
  const glowRef = useRef();
  const planetRef = useRef();
  const runnerOrbitRef = useRef();
  const topRunnerRef = useRef();
  const textRef = useRef();

  const trackTex = useAthleticsTexture();

  // create runner orbit data
  const runnerCount = 10;
  const runners = useMemo(() => {
    return [...Array(runnerCount)].map((_, i) => ({
      angle: (i / runnerCount) * Math.PI * 2,
      offset: Math.random() * 0.3 - 0.15,
    }));
  }, []);

  useFrame(({clock, camera}) => {
    const t = clock.getElapsedTime();

    // NO floating motion - keep fixed on orbit
    // Removed: groupRef.current.position.y = position[1] + Math.sin(t * 0.8) * 0.2;

    // rotate planet
    if (planetRef.current) planetRef.current.rotation.y = t * 0.2;

    // glow pulse
    if (glowRef.current)
      glowRef.current.material.opacity = 0.12 + Math.sin(t * 2) * 0.05;

    // orbit runners
    if (runnerOrbitRef.current) runnerOrbitRef.current.rotation.y = -t * 0.6;

    // floating top runner (relative to planet surface)
    if (topRunnerRef.current) {
      topRunnerRef.current.position.y = radius + Math.sin(t * 2) * 0.1;
      topRunnerRef.current.rotation.y = t * 1.2;
    }

    // billboard text
    if (textRef.current) textRef.current.quaternion.copy(camera.quaternion);
  });

  return (
    <group ref={groupRef} position={position} onClick={onClick}>
      {/* Main Planet */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[radius, 128, 128]} />
        <meshStandardMaterial
          map={trackTex}
          roughness={0.35}
          metalness={0.25}
          color="#d94c3d"
          emissive="#c23b2e"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Outer Glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[radius * 1.12, 64, 64]} />
        <meshBasicMaterial
          color="#ff8866"
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner Glow Layer */}
      <mesh>
        <sphereGeometry args={[radius * 1.05, 64, 64]} />
        <meshBasicMaterial
          color="#ffaa77"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Runner Orbit */}
      <group ref={runnerOrbitRef}>
        {runners.map((r, i) => (
          <group
            key={i}
            position={[
              Math.cos(r.angle) * (radius + 0.9),
              r.offset,
              Math.sin(r.angle) * (radius + 0.9),
            ]}
            rotation={[0, -r.angle, 0]}
          >
            <Runner scale={0.5} color="#ffffff" />
          </group>
        ))}
      </group>

      {/* Top Floating Runner - Gold Medal Winner */}
      <group
        ref={topRunnerRef}
        position={[0, radius * 1.15, 0]}
        scale={[1.4, 1.4, 1.4]}
      >
        <Runner color="#ffd700" />
        {/* Victory sparkle */}
        <pointLight
          position={[0, 0.5, 0]}
          intensity={2}
          color="#ffd700"
          distance={3}
        />
      </group>

      {/* Label with enhanced styling */}
      <Text
        ref={textRef}
        position={[0, radius * 1.55, 0]}
        fontSize={0.75}
        color="#ffd700"
        outlineWidth={0.12}
        outlineColor="#000000"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        ATHLETICS
      </Text>

      {/* Enhanced Lights */}
      <pointLight position={[5, 5, 5]} intensity={2} color="#ff8866" />
      <pointLight position={[-5, 3, -5]} intensity={1.5} color="#ffaa77" />
      <ambientLight intensity={0.3} />
      <hemisphereLight
        skyColor="#ff9977"
        groundColor="#c23b2e"
        intensity={0.5}
      />
    </group>
  );
}
