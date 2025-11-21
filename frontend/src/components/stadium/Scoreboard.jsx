import {useRef} from "react";
import {useFrame} from "@react-three/fiber";
import * as THREE from "three";

// ==================== SCOREBOARD ====================
export default function Scoreboard() {
  const screenRef = useRef();

  // Animated LED effect
  useFrame((state) => {
    if (screenRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 1.5) * 0.05 + 0.95;
      screenRef.current.material.emissiveIntensity = pulse * 0.4;
    }
  });

  return (
    <group position={[0, 35, -50]}>
      {/* Main LED screen */}
      <mesh ref={screenRef} position={[0, 0, 0]}>
        <boxGeometry args={[38, 10, 0.5]} />
        <meshStandardMaterial
          color="#001a33"
          emissive="#0066ff"
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ZENITH 2026 text area */}
      <mesh position={[0, 2.5, 0.3]}>
        <planeGeometry args={[30, 4]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#10b981"
          emissiveIntensity={0.8}
          toneMapped={false}
        />
      </mesh>

      {/* SGGS IET branding */}
      <mesh position={[0, -2, 0.3]}>
        <planeGeometry args={[25, 3]} />
        <meshStandardMaterial
          color="#ff6b00"
          emissive="#ff6b00"
          emissiveIntensity={0.7}
          toneMapped={false}
        />
      </mesh>

      {/* LED border strips */}
      {[
        {pos: [0, 5.25, 0.26], args: [38.2, 0.2, 0.1]},
        {pos: [0, -5.25, 0.26], args: [38.2, 0.2, 0.1]},
        {pos: [19.1, 0, 0.26], args: [0.2, 10.2, 0.1]},
        {pos: [-19.1, 0, 0.26], args: [0.2, 10.2, 0.1]},
      ].map((border, idx) => (
        <mesh key={idx} position={border.pos}>
          <boxGeometry args={border.args} />
          <meshStandardMaterial
            color="#fff"
            emissive="#fff"
            emissiveIntensity={1.0}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Support beams */}
      {[-15, 15].map((xPos, idx) => (
        <group key={idx}>
          <mesh position={[xPos, -5, 0]}>
            <cylinderGeometry args={[0.4, 0.6, 10, 12]} />
            <meshStandardMaterial
              color="#2a2a2a"
              roughness={0.4}
              metalness={0.8}
            />
          </mesh>
          {/* Spotlights on beams */}
          <spotLight
            position={[xPos, 0, 2]}
            angle={0.3}
            penumbra={0.5}
            intensity={50}
            color="#ffffff"
            target-position={[0, 0, 0]}
          />
        </group>
      ))}

      {/* Main scoreboard light */}
      <pointLight
        position={[0, 0, 5]}
        intensity={100}
        distance={50}
        color="#0066ff"
      />
    </group>
  );
}
