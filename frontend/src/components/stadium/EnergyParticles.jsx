import {useRef, useMemo} from "react";
import {useFrame} from "@react-three/fiber";

// ==================== ENERGY PARTICLES ====================
export default function EnergyParticles() {
  const particlesRef = useRef();

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 100; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 100,
          Math.random() * 50,
          (Math.random() - 0.5) * 100,
        ],
        speed: 0.5 + Math.random() * 2,
        offset: Math.random() * Math.PI * 2,
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.children.forEach((child, i) => {
        child.position.y =
          particles[i].position[1] +
          Math.sin(
            state.clock.elapsedTime * particles[i].speed + particles[i].offset
          ) *
            5;
        child.material.opacity =
          0.3 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.3;
      });
    }
  });

  return (
    <group ref={particlesRef}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial
            color={
              i % 3 === 0 ? "#ff6b00" : i % 3 === 1 ? "#00d4ff" : "#ffffff"
            }
            emissive={
              i % 3 === 0 ? "#ff6b00" : i % 3 === 1 ? "#00d4ff" : "#ffffff"
            }
            emissiveIntensity={1.5}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}
