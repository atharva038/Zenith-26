import React, {useRef, useMemo} from "react";
import {useFrame} from "@react-three/fiber";
import {useTexture} from "@react-three/drei";
import * as THREE from "three";

/**
 * Sculpted chess king using LatheGeometry for the body,
 * stacked cylinders for base, crown + cross, and optional decal on the base.
 */

export default function ChessKing({
  color = "#f5f5f5",
  accent = "#d4af37",
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) {
  const root = useRef();
  const crownRef = useRef();

  // Create a smooth lathe profile for the king body
  const latheGeo = useMemo(() => {
    const points = [];
    // profile points (x, y) in local 2D, will be lathed around Y
    const h = 1.7; // total sculpt height (body only)
    // bottom -> top
    points.push(new THREE.Vector2(0.0, 0)); // center bottom
    points.push(new THREE.Vector2(0.35, 0.02));
    points.push(new THREE.Vector2(0.48, 0.06));
    points.push(new THREE.Vector2(0.55, 0.18));
    points.push(new THREE.Vector2(0.46, 0.32));
    points.push(new THREE.Vector2(0.4, 0.52));
    points.push(new THREE.Vector2(0.32, 0.86));
    points.push(new THREE.Vector2(0.22, 1.08));
    points.push(new THREE.Vector2(0.18, 1.28));
    points.push(new THREE.Vector2(0.14, 1.48));
    points.push(new THREE.Vector2(0.0, 1.7));
    return new THREE.LatheGeometry(points, 64);
  }, []);

  // subtle PBR-like materials
  const bodyMat = useMemo(
    () => ({
      metalness: 0.05,
      roughness: 0.35,
      color,
    }),
    [color]
  );
 
  const goldMat = useMemo(
    () => ({
      metalness: 0.9,
      roughness: 0.18,
      color: accent,
    }),
    [accent]
  );

  // gentle bob + rotate
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (root.current) {
      root.current.rotation.y = Math.sin(t * 0.2) * 0.06;
      root.current.position.y = position[1] + Math.sin(t * 0.9) * 0.02;
    }
    if (crownRef.current) {
      crownRef.current.rotation.y = -t * 0.6;
    }
  });

  return (
    <group
      ref={root}
      position={position}
      rotation={rotation}
      scale={scale}
      dispose={null}
    >
      {/* Base stacks */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, -0.06, 0]}>
          <cylinderGeometry args={[0.6, 0.6, 0.1, 64]} />
          <meshStandardMaterial {...bodyMat} />
        </mesh>

        <mesh position={[0, -0.14, 0]}>
          <cylinderGeometry args={[0.66, 0.66, 0.08, 64]} />
          <meshStandardMaterial
            color="#2b2b2b"
            metalness={0.2}
            roughness={0.45}
          />
        </mesh>

        <mesh position={[0, -0.28, 0]}>
          <cylinderGeometry args={[0.9, 0.9, 0.18, 64]} />
          <meshStandardMaterial {...bodyMat} />
        </mesh>
      </group>

      {/* Decorative band between base and body */}
      <mesh position={[0, -0.04, 0]}>
        <cylinderGeometry args={[0.56, 0.56, 0.04, 64]} />
        <meshStandardMaterial {...goldMat} />
      </mesh>

      {/* Main Body (lathe) */}
      <mesh geometry={latheGeo} position={[0, 0, 0]}>
        <meshStandardMaterial {...bodyMat} />
      </mesh>

      {/* Neck collar */}
      <mesh position={[0, 0.68, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.28, 0.06, 16, 64]} />
        <meshStandardMaterial {...goldMat} />
      </mesh>

      {/* Crown: combination of torus and small crowned spheres */}
      <group ref={crownRef} position={[0, 1.05, 0]}>
        {/* crown base */}
        <mesh>
          <cylinderGeometry args={[0.26, 0.26, 0.08, 48]} />
          <meshStandardMaterial {...goldMat} />
        </mesh>

        {/* Crown rim with spikes (use small cones) */}
        {[...Array(8)].map((_, i) => {
          const ang = (i / 8) * Math.PI * 2;
          const x = Math.cos(ang) * 0.32;
          const z = Math.sin(ang) * 0.32;
          return (
            <mesh key={i} position={[x, 0.12, z]}>
              <coneGeometry args={[0.05, 0.12, 12]} />
              <meshStandardMaterial {...goldMat} />
            </mesh>
          );
        })}

        {/* crown top ring */}
        <mesh position={[0, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.06, 0.12, 32]} />
          <meshStandardMaterial {...goldMat} />
        </mesh>

        {/* Cross on top */}
        <group position={[0, 0.26, 0]}>
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[0.14, 0.02, 0.02]} />
            <meshStandardMaterial {...goldMat} />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[0.02, 0.14, 0.02]} />
            <meshStandardMaterial {...goldMat} />
          </mesh>
        </group>
      </group>

      {/* thin highlight rim under crown */}
      <mesh position={[0, 0.94, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.32, 0.02, 8, 64]} />
        <meshStandardMaterial color="#e0c070" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* small accent: subtle engraved line near chest */}
      <mesh position={[0, 0.42, 0]}>
        <torusGeometry args={[0.18, 0.01, 6, 64]} />
        <meshStandardMaterial
          color="#d1c7b5"
          metalness={0.15}
          roughness={0.35}
        />
      </mesh>
    </group>
  );
}
