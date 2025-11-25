// PowerliftingPlanet.jsx
import React, {useRef, useMemo} from "react";
import {useFrame} from "@react-three/fiber";
import {Text} from "@react-three/drei";
import * as THREE from "three";

/* -----------------------------------------
   🏋️‍♂️ IMPROVED DUMBBELL MODEL
   - Better proportions
   - Multiple weight plates
   - Textured grip
------------------------------------------ */
function Dumbbell({scale = 1, rotation = [0, 0, 0]}) {
  return (
    <group scale={scale} rotation={rotation}>
      {/* Left weight plates (stacked) */}
      <group position={[-0.4, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry
            args={[0.25, 0.25, 0.08, 32]}
            rotation={[0, 0, Math.PI / 2]}
          />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[-0.06, 0, 0]}>
          <cylinderGeometry
            args={[0.22, 0.22, 0.08, 32]}
            rotation={[0, 0, Math.PI / 2]}
          />
          <meshStandardMaterial
            color="#2a2a2a"
            metalness={0.85}
            roughness={0.25}
          />
        </mesh>
        <mesh position={[-0.12, 0, 0]}>
          <cylinderGeometry
            args={[0.19, 0.19, 0.08, 32]}
            rotation={[0, 0, Math.PI / 2]}
          />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Right weight plates (stacked) */}
      <group position={[0.4, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry
            args={[0.25, 0.25, 0.08, 32]}
            rotation={[0, 0, Math.PI / 2]}
          />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0.06, 0, 0]}>
          <cylinderGeometry
            args={[0.22, 0.22, 0.08, 32]}
            rotation={[0, 0, Math.PI / 2]}
          />
          <meshStandardMaterial
            color="#2a2a2a"
            metalness={0.85}
            roughness={0.25}
          />
        </mesh>
        <mesh position={[0.12, 0, 0]}>
          <cylinderGeometry
            args={[0.19, 0.19, 0.08, 32]}
            rotation={[0, 0, Math.PI / 2]}
          />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Center bar (grip) with knurling texture */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.8, 16]} />
        <meshStandardMaterial
          color="#606060"
          metalness={0.95}
          roughness={0.4}
        />
      </mesh>

      {/* Collar clips (safety locks) */}
      <mesh position={[-0.28, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
        <meshStandardMaterial color="#ff3333" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.28, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
        <meshStandardMaterial color="#ff3333" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

/* -----------------------------------------
   🪐 Enhanced Metal Gym Texture
   - Diamond plate pattern
   - Metallic scratches
   - Industrial look
------------------------------------------ */
function useGymPlanetTexture(size = 2048) {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d", {willReadFrequently: true});

    // Base metallic gray
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    gradient.addColorStop(0, "#5a5a5a");
    gradient.addColorStop(0.5, "#4a4a4a");
    gradient.addColorStop(1, "#3a3a3a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // Diamond plate pattern
    const diamondSize = 40;
    ctx.fillStyle = "#555555";
    for (let y = 0; y < size; y += diamondSize) {
      for (let x = 0; x < size; x += diamondSize) {
        const offset = (y / diamondSize) % 2 === 0 ? 0 : diamondSize / 2;
        ctx.beginPath();
        ctx.moveTo(x + offset + diamondSize / 2, y);
        ctx.lineTo(x + offset + diamondSize, y + diamondSize / 2);
        ctx.lineTo(x + offset + diamondSize / 2, y + diamondSize);
        ctx.lineTo(x + offset, y + diamondSize / 2);
        ctx.closePath();
        ctx.fill();

        // Highlight
        ctx.strokeStyle = "#6a6a6a";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Add weight markings (like on gym equipment)
    ctx.strokeStyle = "#ff4444";
    ctx.lineWidth = 4;
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const x1 = size / 2 + Math.cos(angle) * size * 0.35;
      const y1 = size / 2 + Math.sin(angle) * size * 0.35;
      const x2 = size / 2 + Math.cos(angle) * size * 0.4;
      const y2 = size / 2 + Math.sin(angle) * size * 0.4;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Add metallic noise and scratches
    const img = ctx.getImageData(0, 0, size, size);
    for (let i = 0; i < img.data.length; i += 4) {
      const n = Math.random() * 30 - 15;
      img.data[i] += n;
      img.data[i + 1] += n;
      img.data[i + 2] += n;
    }
    ctx.putImageData(img, 0, 0);

    // Random scratches
    ctx.strokeStyle = "rgba(100, 100, 100, 0.3)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const length = 20 + Math.random() * 60;
      const angle = Math.random() * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = 16;
    return tex;
  }, []);
}

/* -----------------------------------------
   �️ Individual Orbiting Dumbbell
   - Each dumbbell rotates independently
   - Realistic tumbling animation
------------------------------------------ */
function OrbitingDumbbell({angle, radius, index}) {
  const ref = useRef();

  useFrame(({clock}) => {
    const t = clock.getElapsedTime();

    if (ref.current) {
      // Orbit around planet
      const orbitSpeed = 0.3;
      const currentAngle = angle + t * orbitSpeed;

      ref.current.position.x = Math.cos(currentAngle) * radius;
      ref.current.position.z = Math.sin(currentAngle) * radius;
      ref.current.position.y = Math.sin(t * 0.8 + index) * 0.15;

      // Independent realistic rotation (tumbling)
      ref.current.rotation.x = t * 0.5 + index;
      ref.current.rotation.y = t * 0.7 + index * 0.5;
      ref.current.rotation.z = Math.sin(t * 0.3 + index) * 0.3;
    }
  });

  return (
    <group ref={ref}>
      <Dumbbell scale={0.6} />
    </group>
  );
}

/* -----------------------------------------
   �🌌 Powerlifting Planet Component
------------------------------------------ */
export default function PowerliftingPlanet({
  position = [0, 0, 0],
  radius = 2.3,
  onClick,
}) {
  const groupRef = useRef();
  const planetRef = useRef();
  const glowRef = useRef();
  const topDumbbellRef = useRef();
  const textRef = useRef();

  const gymTex = useGymPlanetTexture();

  /* Generate orbital dumbbells with variety */
  const dumbbellData = useMemo(() => {
    const count = 16;
    return [...Array(count)].map((_, i) => ({
      angle: (i / count) * Math.PI * 2,
      radius: radius + 0.9 + Math.random() * 0.3,
      index: i,
    }));
  }, [radius]);

  /* Motion / Animation */
  useFrame(({clock, camera}) => {
    const t = clock.getElapsedTime();

    // rotate planet
    if (planetRef.current) {
      planetRef.current.rotation.y = t * 0.15;
    }

    // glow pulse
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.2 + Math.sin(t * 1.5) * 0.08;
      glowRef.current.scale.setScalar(1.08 + Math.sin(t * 0.8) * 0.03);
    }

    // billboard text
    if (textRef.current) {
      textRef.current.quaternion.copy(camera.quaternion);
    }

    // top dumbbell - realistic lifting motion
    if (topDumbbellRef.current) {
      const liftCycle = Math.sin(t * 1.2);
      topDumbbellRef.current.position.y = radius * 1.15 + liftCycle * 0.25;
      topDumbbellRef.current.rotation.x = liftCycle * 0.2;
      topDumbbellRef.current.rotation.z = t * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={position} onClick={onClick}>
      {/* Main Planet with gym texture */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[radius, 128, 128]} />
        <meshStandardMaterial
          map={gymTex}
          color="#4a4a4a"
          roughness={0.35}
          metalness={0.85}
          emissive="#ff4433"
          emissiveIntensity={0.18}
        />
      </mesh>

      {/* Atmosphere Glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[radius * 1.09, 128, 128]} />
        <meshBasicMaterial
          color="#ff5544"
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Individual Orbiting Dumbbells */}
      {dumbbellData.map((d, i) => (
        <OrbitingDumbbell
          key={i}
          angle={d.angle}
          radius={d.radius}
          index={d.index}
        />
      ))}

      {/* Top Floating Dumbbell with lifting motion */}
      <group
        ref={topDumbbellRef}
        position={[0, radius * 1.15, 0]}
        scale={[1.6, 1.6, 1.6]}
      >
        <Dumbbell />
      </group>

      {/* Label */}
      <Text
        ref={textRef}
        position={[0, radius * 1.6, 0]}
        fontSize={0.7}
        color="#ff6655"
        outlineWidth={0.12}
        outlineColor="#000000"
        anchorX="center"
        anchorY="middle"
      >
        POWERLIFTING
      </Text>

      {/* Enhanced Lights */}
      <pointLight
        position={[4, 4, 4]}
        intensity={2.2}
        color="#ff6655"
        distance={15}
      />
      <pointLight
        position={[-4, 2, -4]}
        intensity={1.5}
        color="#ffffff"
        distance={12}
      />
      <ambientLight intensity={0.3} />
    </group>
  );
}
