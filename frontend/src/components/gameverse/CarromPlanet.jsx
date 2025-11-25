// CarromPlanet.jsx
import React, {useMemo, useRef} from "react";
import {Text} from "@react-three/drei";
import {useFrame} from "@react-three/fiber";
import * as THREE from "three";

/* -------------------------------------------------------
   🎯 PROCEDURAL CARROM BOARD TEXTURE
-------------------------------------------------------- */
function useCarromTexture(size = 2048) {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d", {willReadFrequently: true});

    // Wooden board background
    ctx.fillStyle = "#d4a574";
    ctx.fillRect(0, 0, size, size);

    const center = size / 2;

    // Border frame (darker wood)
    ctx.strokeStyle = "#8b6239";
    ctx.lineWidth = 40;
    ctx.strokeRect(100, 100, size - 200, size - 200);

    // Playing area border (black)
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 20;
    ctx.strokeRect(200, 200, size - 400, size - 400);

    // Corner pockets (circles)
    const pocketRadius = 60;
    const pocketPositions = [
      [250, 250], // Top-left
      [size - 250, 250], // Top-right
      [250, size - 250], // Bottom-left
      [size - 250, size - 250], // Bottom-right
    ];

    ctx.fillStyle = "#1a1a1a";
    pocketPositions.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, pocketRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Center circle (red)
    ctx.fillStyle = "#cc3333";
    ctx.beginPath();
    ctx.arc(center, center, 80, 0, Math.PI * 2);
    ctx.fill();

    // Inner circle (white ring)
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(center, center, 150, 0, Math.PI * 2);
    ctx.stroke();

    // Diagonal lines from corners
    ctx.strokeStyle = "#333333";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.lineTo(size - 200, size - 200);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(size - 200, 200);
    ctx.lineTo(200, size - 200);
    ctx.stroke();

    // Base lines (4 sides)
    const baseLineOffset = 350;
    ctx.strokeStyle = "#222222";
    ctx.lineWidth = 6;

    // Top
    ctx.beginPath();
    ctx.moveTo(baseLineOffset, 200);
    ctx.lineTo(size - baseLineOffset, 200);
    ctx.stroke();

    // Bottom
    ctx.beginPath();
    ctx.moveTo(baseLineOffset, size - 200);
    ctx.lineTo(size - baseLineOffset, size - 200);
    ctx.stroke();

    // Left
    ctx.beginPath();
    ctx.moveTo(200, baseLineOffset);
    ctx.lineTo(200, size - baseLineOffset);
    ctx.stroke();

    // Right
    ctx.beginPath();
    ctx.moveTo(size - 200, baseLineOffset);
    ctx.lineTo(size - 200, size - baseLineOffset);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 16;
    return tex;
  }, []);
}

/* -------------------------------------------------------
   🪙 Carrom Coin/Striker
-------------------------------------------------------- */
function CarromCoin({type = "black", scale = 1}) {
  const color =
    type === "queen" ? "#cc3333" : type === "white" ? "#f5f5f5" : "#2a2a2a";

  return (
    <mesh scale={scale}>
      <cylinderGeometry args={[0.25, 0.25, 0.08, 32]} />
      <meshStandardMaterial
        color={color}
        roughness={0.3}
        metalness={0.4}
        emissive={color}
        emissiveIntensity={type === "queen" ? 0.3 : 0.1}
      />
    </mesh>
  );
}

/* -------------------------------------------------------
   🪐 Carrom Planet
-------------------------------------------------------- */
export default function CarromPlanet({
  position = [0, 0, 0],
  radius = 2.5,
  onClick,
}) {
  const groupRef = useRef();
  const planetRef = useRef();
  const glowRef = useRef();
  const blackCoinsRef = useRef();
  const whiteCoinsRef = useRef();
  const queenRef = useRef();
  const strikerRef = useRef();
  const textRef = useRef();

  const carromTex = useCarromTexture();

  // Black coins
  const blackCount = 9;
  const blackCoins = useMemo(
    () =>
      [...Array(blackCount)].map((_, i) => ({
        angle: (i / blackCount) * Math.PI * 2,
        lift: Math.random() * 0.3 - 0.15,
      })),
    []
  );

  // White coins
  const whiteCount = 9;
  const whiteCoins = useMemo(
    () =>
      [...Array(whiteCount)].map((_, i) => ({
        angle: (i / whiteCount) * Math.PI * 2,
        offset: Math.random() * 0.4 - 0.2,
      })),
    []
  );

  // Animation
  useFrame(({clock, camera}) => {
    const t = clock.getElapsedTime();

    // NO floating motion - keep fixed on orbit
    // Removed: groupRef.current.position.y = position[1] + Math.sin(t * 0.8) * 0.22;

    // rotate planet
    if (planetRef.current) planetRef.current.rotation.y = t * 0.12;

    // glow
    if (glowRef.current)
      glowRef.current.material.opacity = 0.1 + Math.sin(t * 1.5) * 0.04;

    // orbit black coins
    if (blackCoinsRef.current) blackCoinsRef.current.rotation.y = t * 0.4;

    // orbit white coins in opposite direction
    if (whiteCoinsRef.current) whiteCoinsRef.current.rotation.y = -t * 0.33;

    // floating queen (relative to planet surface)
    if (queenRef.current) {
      queenRef.current.position.y = radius * 1.1 + Math.sin(t * 2.5) * 0.08;
      queenRef.current.rotation.y = t * 1.5;
    }

    // floating striker
    if (strikerRef.current) {
      strikerRef.current.position.y = radius * 1.25 + Math.sin(t * 1.8) * 0.1;
      strikerRef.current.rotation.y = -t * 0.8;
    }

    // billboard text
    if (textRef.current) textRef.current.quaternion.copy(camera.quaternion);
  });

  return (
    <group ref={groupRef} position={position} onClick={onClick}>
      {/* Planet */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[radius, 128, 128]} />
        <meshStandardMaterial
          map={carromTex}
          roughness={0.4}
          metalness={0.2}
          color="#c9995c"
        />
      </mesh>

      {/* Glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[radius * 1.08, 128, 128]} />
        <meshBasicMaterial
          color="#d4a574"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Orbiting Black Coins */}
      <group ref={blackCoinsRef}>
        {blackCoins.map((c, i) => (
          <group
            key={i}
            position={[
              Math.cos(c.angle) * (radius + 1),
              c.lift,
              Math.sin(c.angle) * (radius + 1),
            ]}
            rotation={[0, -c.angle, 0]}
          >
            <CarromCoin type="black" scale={0.7} />
          </group>
        ))}
      </group>

      {/* Orbiting White Coins */}
      <group ref={whiteCoinsRef}>
        {whiteCoins.map((c, i) => (
          <group
            key={i}
            position={[
              Math.cos(c.angle) * (radius + 1.4),
              c.offset,
              Math.sin(c.angle) * (radius + 1.4),
            ]}
            rotation={[0, -c.angle, 0]}
          >
            <CarromCoin type="white" scale={0.7} />
          </group>
        ))}
      </group>

      {/* Floating Red Queen */}
      <group
        ref={queenRef}
        position={[0, radius * 1.1, 0]}
        scale={[1.5, 1.5, 1.5]}
      >
        <CarromCoin type="queen" />
      </group>

      {/* Floating Striker */}
      <group
        ref={strikerRef}
        position={[0, radius * 1.25, 0]}
        scale={[1.8, 1.2, 1.8]}
      >
        <mesh>
          <cylinderGeometry args={[0.35, 0.35, 0.12, 32]} />
          <meshStandardMaterial
            color="#b8860b"
            roughness={0.25}
            metalness={0.6}
          />
        </mesh>
      </group>

      {/* Label */}
      <Text
        ref={textRef}
        position={[0, radius * 1.55, 0]}
        fontSize={0.7}
        color="#d4a574"
        outlineWidth={0.1}
        outlineColor="#000000"
      >
        CARROM
      </Text>

      {/* Lights */}
      <pointLight position={[4, 4, 4]} intensity={1.6} color="#d4a574" />
      <ambientLight intensity={0.25} />
    </group>
  );
}
