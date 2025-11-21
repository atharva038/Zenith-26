import {useRef} from "react";
import {useFrame} from "@react-three/fiber";

// ==================== ADVERTISING BOARDS ====================
export default function AdvertisingBoards() {
  const boardRef = useRef();

  // Sponsor names for the boards
  const sponsors = [
    "ZENITH 2026",
    "SGGS IET",
    "NIKE",
    "ADIDAS",
    "PEPSI",
    "COCA-COLA",
    "EMIRATES",
    "VISA",
    "SAMSUNG",
    "SONY",
    "PUMA",
    "RED BULL",
  ];

  // Animated scrolling effect
  useFrame((state) => {
    if (boardRef.current) {
      boardRef.current.children.forEach((board, i) => {
        // Subtle pulsing glow effect
        const pulse =
          Math.sin(state.clock.elapsedTime * 2 + i * 0.5) * 0.1 + 0.9;
        if (board.material && board.material.emissiveIntensity !== undefined) {
          board.material.emissiveIntensity = pulse * 0.3;
        }
      });
    }
  });

  return (
    <group ref={boardRef}>
      {/* Long sideline boards */}
      {sponsors.map((sponsor, idx) => {
        const angle = (idx / sponsors.length) * Math.PI * 2;
        const radius = 58; // Just outside the field
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <mesh
            key={idx}
            position={[x, 1.5, z]}
            rotation={[0, -angle + Math.PI / 2, 0]}
          >
            <boxGeometry args={[12, 3, 0.2]} />
            <meshStandardMaterial
              color="#1a1a2e"
              emissive={idx % 2 === 0 ? "#3b82f6" : "#10b981"}
              emissiveIntensity={0.3}
              roughness={0.3}
              metalness={0.7}
            />
            {/* Text on board */}
            <mesh position={[0, 0, 0.11]}>
              <planeGeometry args={[11, 2]} />
              <meshStandardMaterial
                color={idx % 2 === 0 ? "#3b82f6" : "#10b981"}
                emissive={idx % 2 === 0 ? "#3b82f6" : "#10b981"}
                emissiveIntensity={0.8}
                toneMapped={false}
              />
            </mesh>
          </mesh>
        );
      })}

      {/* Corner LED boards - more prominent */}
      {[
        {pos: [55, 2, 36], rot: [0, -Math.PI / 4, 0]},
        {pos: [-55, 2, 36], rot: [0, Math.PI / 4, 0]},
        {pos: [55, 2, -36], rot: [0, -Math.PI * 0.75, 0]},
        {pos: [-55, 2, -36], rot: [0, Math.PI * 0.75, 0]},
      ].map((board, idx) => (
        <mesh key={`corner-${idx}`} position={board.pos} rotation={board.rot}>
          <boxGeometry args={[8, 4, 0.3]} />
          <meshStandardMaterial
            color="#000"
            emissive="#ff6b00"
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}
