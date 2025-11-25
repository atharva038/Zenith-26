// TableTennisPlanet.jsx
import React, {useRef, useMemo} from "react";
import {useFrame} from "@react-three/fiber";
import {Text} from "@react-three/drei";
import * as THREE from "three";

/* -----------------------------------------------------
   🏓 Premium Table Tennis Bat (Racket)
------------------------------------------------------ */
function TableTennisBat({scale = 1}) {
  return (
    <group scale={scale}>
      {/* Bat Face */}
      <mesh>
        <cylinderGeometry args={[0.55, 0.55, 0.08, 32]} />
        <meshStandardMaterial color="#db1b1b" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Back Face */}
      <mesh>
        <cylinderGeometry args={[0.55, 0.55, 0.08, 32]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Handle */}
      <mesh position={[0, -0.55, 0]}>
        <boxGeometry args={[0.25, 0.7, 0.25]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.6} metalness={0.2} />
      </mesh>
    </group>
  );
}

/* -----------------------------------------------------
   🏓 Ping Pong Ball
------------------------------------------------------ */
function TableTennisBall({radius = 0.22, color = "#ffffff"}) {
  return (
    <mesh>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial
        color={color}
        roughness={0.3}
        metalness={0.05}
        emissive={color}
        emissiveIntensity={0.08}
      />
    </mesh>
  );
}

/* -----------------------------------------------------
   🌍 Table Tennis Planet (main)
------------------------------------------------------ */
export default function TableTennisPlanet({
  position = [0, 0, 0],
  radius = 2.3,
  onClick,
}) {
  const groupRef = useRef();
  const planetRef = useRef();
  const glowRef = useRef();
  const batOrbitRef = useRef();
  const ballOrbitRef = useRef();
  const topBatRef = useRef();
  const textRef = useRef();

  /* Planet Material */
  const tableGreen = "#1d8c3f";

  /* Orbit Elements */
  const batCount = 12;
  const bats = useMemo(() => {
    return [...Array(batCount)].map((_, i) => ({
      angle: (i / batCount) * Math.PI * 2,
    }));
  }, []);

  const ballCount = 14;
  const balls = useMemo(() => {
    return [...Array(ballCount)].map((_, i) => ({
      angle: (i / ballCount) * Math.PI * 2,
      offset: Math.random() * 0.4 - 0.2,
    }));
  }, []);

  /* Animation */
  useFrame(({clock, camera}) => {
    const t = clock.getElapsedTime();

    // NO floating motion - keep fixed on orbit
    // Removed: groupRef.current.position.y = position[1] + Math.sin(t * 0.7) * 0.22;

    // rotate planet
    if (planetRef.current) planetRef.current.rotation.y = t * 0.15;

    // glowing pulse
    if (glowRef.current)
      glowRef.current.material.opacity = 0.12 + Math.sin(t * 1.8) * 0.05;

    // orbit bats
    if (batOrbitRef.current) batOrbitRef.current.rotation.y = t * 0.45;

    // orbit balls
    if (ballOrbitRef.current) ballOrbitRef.current.rotation.y = -t * 0.35;

    // top floating bat (relative to planet surface)
    if (topBatRef.current) {
      topBatRef.current.position.y = radius * 1.1 + Math.sin(t * 2) * 0.12;
      topBatRef.current.rotation.y = t;
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
          color={tableGreen}
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>

      {/* Glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[radius * 1.1, 128, 128]} />
        <meshBasicMaterial
          color="#32ff84"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Bats Orbiting */}
      <group ref={batOrbitRef}>
        {bats.map((b, i) => (
          <group
            key={i}
            position={[
              Math.cos(b.angle) * (radius + 0.9),
              0,
              Math.sin(b.angle) * (radius + 0.9),
            ]}
            rotation={[0, -b.angle, Math.PI / 2]}
          >
            <TableTennisBat scale={0.6} />
          </group>
        ))}
      </group>

      {/* Balls Orbiting */}
      <group ref={ballOrbitRef}>
        {balls.map((b, i) => (
          <group
            key={i}
            position={[
              Math.cos(b.angle) * (radius + 1.4),
              b.offset,
              Math.sin(b.angle) * (radius + 1.4),
            ]}
          >
            <TableTennisBall />
          </group>
        ))}
      </group>

      {/* Big Floating Bat */}
      <group
        ref={topBatRef}
        position={[0, radius * 1.1, 0]}
        scale={[1.3, 1.3, 1.3]}
      >
        <TableTennisBat />
      </group>

      {/* Label */}
      <Text
        ref={textRef}
        position={[0, radius * 1.6, 0]}
        fontSize={0.7}
        color="#32ff84"
        outlineWidth={0.1}
        outlineColor="#000"
        anchorX="center"
        anchorY="middle"
      >
        TABLE TENNIS
      </Text>

      {/* Lights */}
      <pointLight position={[4, 4, 4]} intensity={1.6} color="#32ff84" />
      <ambientLight intensity={0.25} />
    </group>
  );
}
