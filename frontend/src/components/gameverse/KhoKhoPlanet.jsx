// KhoKhoPlanet.jsx
import React, {useRef, useMemo} from "react";
import {useFrame} from "@react-three/fiber";
import {Text} from "@react-three/drei";
import * as THREE from "three";

/* ----------------------------------------------------
   🧍 Simple Runner / Chasing Pose (Kho-Kho style)
------------------------------------------------------ */
function KhoKhoPlayer({type = "run", scale = 1, color = "#ffffff"}) {
  return (
    <group scale={scale}>
      {/* Head */}
      <mesh position={[0, 0.33, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.15, 0.4, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Legs based on pose */}
      {type === "run" ? (
        <>
          <mesh position={[0.12, -0.35, 0]}>
            <boxGeometry args={[0.1, 0.45, 0.1]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh position={[-0.12, -0.35, 0]}>
            <boxGeometry args={[0.1, 0.45, 0.1]} />
            <meshStandardMaterial color={color} />
          </mesh>
        </>
      ) : (
        <>
          {/* crouching legs */}
          <mesh position={[0.1, -0.2, 0]} rotation={[0, 0, -0.9]}>
            <boxGeometry args={[0.1, 0.3, 0.1]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh position={[-0.1, -0.2, 0]} rotation={[0, 0, 0.9]}>
            <boxGeometry args={[0.1, 0.3, 0.1]} />
            <meshStandardMaterial color={color} />
          </mesh>
        </>
      )}

      {/* Arms forward/back */}
      <mesh position={[0.2, 0.05, 0]}>
        <boxGeometry args={[0.3, 0.08, 0.08]} />
        <meshStandardMaterial color={color} />
      </mesh>

      <mesh position={[-0.2, 0.05, 0]}>
        <boxGeometry args={[0.3, 0.08, 0.08]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

/* ----------------------------------------------------
   🟤 Procedural Kho-Kho Court Texture
------------------------------------------------------ */
function useKhoKhoTexture(size = 2048) {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d", {willReadFrequently: true});

    // Synthetic court background (green/blue)
    ctx.fillStyle = "#2d6b4f"; // forest green
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 18;

    const center = size / 2;

    // Center lane
    ctx.beginPath();
    ctx.moveTo(center, 200);
    ctx.lineTo(center, size - 200);
    ctx.stroke();

    // Side boundaries
    ctx.strokeRect(200, 200, size - 400, size - 400);

    // Pole positions (small circles in yellow)
    ctx.fillStyle = "#ffd700";
    for (let i = 0; i < 12; i++) {
      const y = 260 + i * ((size - 520) / 11);
      ctx.beginPath();
      ctx.arc(center, y, 22, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 16;
    return tex;
  }, []);
}

/* ----------------------------------------------------
   🪐 Kho-Kho Planet
------------------------------------------------------ */
export default function KhoKhoPlanet({
  position = [0, 0, 0],
  radius = 2.5,
  onClick,
}) {
  const groupRef = useRef();
  const planetRef = useRef();
  const glowRef = useRef();
  const runnerOrbitRef = useRef();
  const crouchOrbitRef = useRef();
  const poleRef = useRef();
  const textRef = useRef();

  const tex = useKhoKhoTexture();

  // Runners
  const runCount = 10;
  const runners = useMemo(
    () =>
      [...Array(runCount)].map((_, i) => ({
        angle: (i / runCount) * Math.PI * 2,
        lift: Math.random() * 0.3 - 0.15,
      })),
    []
  );

  // Sitting/crouching players
  const crouchCount = 8;
  const crouchers = useMemo(
    () =>
      [...Array(crouchCount)].map((_, i) => ({
        angle: (i / crouchCount) * Math.PI * 2,
        offset: Math.random() * 0.4 - 0.2,
      })),
    []
  );

  useFrame(({clock, camera}) => {
    const t = clock.getElapsedTime();

    // NO floating motion - keep fixed on orbit
    // Removed: groupRef.current.position.y = position[1] + Math.sin(t * 0.8) * 0.2;

    // rotate planet
    if (planetRef.current) planetRef.current.rotation.y = t * 0.15;

    // glow pulse
    if (glowRef.current)
      glowRef.current.material.opacity = 0.12 + Math.sin(t * 1.5) * 0.05;

    // orbit runners
    if (runnerOrbitRef.current) runnerOrbitRef.current.rotation.y = t * 0.45;

    // orbit crouchers in opposite direction
    if (crouchOrbitRef.current) crouchOrbitRef.current.rotation.y = -t * 0.35;

    // floating pole (relative to planet surface)
    if (poleRef.current) {
      poleRef.current.rotation.y = t * 1.4;
      poleRef.current.position.y = radius + Math.sin(t * 2) * 0.1;
    }

    // billboard text
    if (textRef.current) textRef.current.quaternion.copy(camera.quaternion);
  });

  return (
    <group position={position} ref={groupRef} onClick={onClick}>
      {/* Planet */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[radius, 128, 128]} />
        <meshStandardMaterial
          map={tex}
          roughness={0.55}
          metalness={0.25}
          color="#3a8566"
        />
      </mesh>

      {/* Glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[radius * 1.12, 128, 128]} />
        <meshBasicMaterial
          color="#5dffaa"
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Running Players Orbit */}
      <group ref={runnerOrbitRef}>
        {runners.map((r, i) => (
          <group
            key={i}
            position={[
              Math.cos(r.angle) * (radius + 1),
              r.lift,
              Math.sin(r.angle) * (radius + 1),
            ]}
            rotation={[0, -r.angle, 0]}
          >
            <KhoKhoPlayer type="run" scale={0.45} />
          </group>
        ))}
      </group>

      {/* Crouching Players Orbit */}
      <group ref={crouchOrbitRef}>
        {crouchers.map((c, i) => (
          <group
            key={i}
            position={[
              Math.cos(c.angle) * (radius + 1.4),
              c.offset,
              Math.sin(c.angle) * (radius + 1.4),
            ]}
            rotation={[0, -c.angle, 0]}
          >
            <KhoKhoPlayer type="crouch" scale={0.4} />
          </group>
        ))}
      </group>

      {/* Floating Kho-Kho Pole */}
      <group ref={poleRef} position={[0, radius + 0.3, 0]}>
        <mesh>
          <cylinderGeometry args={[0.15, 0.15, 1.8, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.3}
            metalness={0.2}
          />
        </mesh>
      </group>

      {/* Label */}
      <Text
        ref={textRef}
        position={[0, radius * 1.5, 0]}
        fontSize={0.7}
        color="#5dffaa"
        outlineWidth={0.1}
        outlineColor="#000"
      >
        KHO KHO
      </Text>

      {/* Lights */}
      <pointLight position={[4, 4, 4]} intensity={1.5} color="#5dffaa" />
      <ambientLight intensity={0.25} />
    </group>
  );
}
