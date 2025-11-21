import {useRef, useState, useEffect} from "react";
import {useFrame} from "@react-three/fiber";

// ==================== EPIC TITLE CARD ====================
export default function TitleCard() {
  const textRef = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 8000);
    const hideTimer = setTimeout(() => setVisible(false), 18000);
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  useFrame((state) => {
    if (textRef.current && visible) {
      textRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  if (!visible) return null;

  return (
    <group ref={textRef} position={[0, 25, -20]}>
      {/* ZENITH 2026 box */}
      <mesh>
        <boxGeometry args={[20, 5, 1]} />
        <meshStandardMaterial
          color="#ff6b00"
          emissive="#ff6b00"
          emissiveIntensity={2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Glowing border */}
      {[...Array(4)].map((_, i) => (
        <mesh
          key={i}
          position={[
            i < 2 ? (i === 0 ? -10 : 10) : 0,
            i >= 2 ? (i === 2 ? -2.5 : 2.5) : 0,
            0.6,
          ]}
        >
          <cylinderGeometry args={[0.3, 0.3, i < 2 ? 5 : 20, 8]} />
          <meshStandardMaterial
            color="#00d4ff"
            emissive="#00d4ff"
            emissiveIntensity={3}
          />
        </mesh>
      ))}

      {/* Particle burst */}
      {[...Array(20)].map((_, i) => (
        <mesh
          key={`particle-${i}`}
          position={[
            Math.cos((i * Math.PI) / 10) *
              (5 + Math.sin(Date.now() * 0.001 + i) * 2),
            Math.sin((i * Math.PI) / 10) *
              (3 + Math.cos(Date.now() * 0.001 + i) * 1.5),
            Math.sin(Date.now() * 0.002 + i) * 3,
          ]}
        >
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#ff6b00" : "#00d4ff"}
            emissive={i % 2 === 0 ? "#ff6b00" : "#00d4ff"}
            emissiveIntensity={2}
          />
        </mesh>
      ))}
    </group>
  );
}
