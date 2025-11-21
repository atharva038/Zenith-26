import {useRef, useState, useEffect} from "react";
import {useFrame} from "@react-three/fiber";
import * as THREE from "three";

// ==================== GOAL POSTS WITH NET PHYSICS ====================
export default function GoalPosts() {
  const frontNetRef = useRef();
  const backNetRef = useRef();
  const [goalScored, setGoalScored] = useState(false);

  // Trigger goal celebration at 12 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setGoalScored(true);
    }, 12000);

    const resetTimer = setTimeout(() => {
      setGoalScored(false);
    }, 18000);

    return () => {
      clearTimeout(timer);
      clearTimeout(resetTimer);
    };
  }, []);

  // Realistic net physics animation
  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (goalScored && frontNetRef.current && backNetRef.current) {
      const impactTime = time - 12.0;

      if (impactTime >= 0 && impactTime < 2) {
        // Exponential decay with oscillation
        const pushBack = Math.exp(-impactTime * 2) * 2;
        const oscillation =
          Math.sin(impactTime * 15) * 0.5 * (1 - impactTime / 2);

        frontNetRef.current.position.z = 1 + pushBack + oscillation;
        backNetRef.current.position.z = 1 + (pushBack + oscillation) * 0.5;
      } else if (impactTime >= 2) {
        frontNetRef.current.position.z = 1;
        backNetRef.current.position.z = 1;
      }
    } else if (!goalScored && frontNetRef.current && backNetRef.current) {
      frontNetRef.current.position.z = 1;
      backNetRef.current.position.z = 1;
    }
  });

  return (
    <group>
      {/* Front goal (where ball will score) */}
      <group position={[0, 0, -34]}>
        {/* Goal posts */}
        <mesh position={[-3.66, 1.22, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 2.44, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
        <mesh position={[3.66, 1.22, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 2.44, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>

        {/* Crossbar */}
        <mesh position={[0, 2.44, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 7.32, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>

        {/* Realistic Net with rope-like appearance */}
        {/* Front layer (animated) - Fine mesh */}
        <mesh ref={frontNetRef} position={[0, 1.22, 1]}>
          <planeGeometry args={[7.32, 2.44, 36, 24]} />
          <meshStandardMaterial
            color="#e8e8e8"
            wireframe
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>

        {/* Back layer - Denser pattern for depth */}
        <mesh ref={backNetRef} position={[0, 1.22, 0.9]}>
          <planeGeometry args={[7.32, 2.44, 30, 20]} />
          <meshStandardMaterial
            color="#d0d0d0"
            wireframe
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
            roughness={0.9}
          />
        </mesh>

        {/* Additional depth layer */}
        <mesh position={[0, 1.22, 0.8]}>
          <planeGeometry args={[7.32, 2.44, 24, 16]} />
          <meshStandardMaterial
            color="#c0c0c0"
            wireframe
            transparent
            opacity={0.25}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Side nets - Left */}
        <mesh position={[-3.66, 1.22, 0.5]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[2, 2.44, 16, 20]} />
          <meshStandardMaterial
            color="#e0e0e0"
            wireframe
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
            roughness={0.8}
          />
        </mesh>

        {/* Side nets - Right */}
        <mesh position={[3.66, 1.22, 0.5]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[2, 2.44, 16, 20]} />
          <meshStandardMaterial
            color="#e0e0e0"
            wireframe
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
            roughness={0.8}
          />
        </mesh>

        {/* Top net - Horizontal */}
        <mesh position={[0, 2.44, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[7.32, 2, 30, 16]} />
          <meshStandardMaterial
            color="#e0e0e0"
            wireframe
            transparent
            opacity={0.45}
            side={THREE.DoubleSide}
            roughness={0.8}
          />
        </mesh>

        {/* Ground net connection */}
        <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[7.32, 2, 30, 10]} />
          <meshStandardMaterial
            color="#e0e0e0"
            wireframe
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
            roughness={0.9}
          />
        </mesh>

        {/* Goal line */}
        <mesh position={[0, 0.01, -0.1]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[7.32, 0.12]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>

      {/* Back goal (decorative) */}
      <group position={[0, 0, 34]}>
        {/* Goal posts */}
        <mesh position={[-3.66, 1.22, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 2.44, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
        <mesh position={[3.66, 1.22, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 2.44, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>

        {/* Crossbar */}
        <mesh position={[0, 2.44, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 7.32, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>

        {/* Realistic Net - Back goal */}
        {/* Front layer */}
        <mesh position={[0, 1.22, -1]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[7.32, 2.44, 36, 24]} />
          <meshStandardMaterial
            color="#e8e8e8"
            wireframe
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>

        {/* Back layer */}
        <mesh position={[0, 1.22, -0.9]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[7.32, 2.44, 30, 20]} />
          <meshStandardMaterial
            color="#d0d0d0"
            wireframe
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
            roughness={0.9}
          />
        </mesh>

        {/* Side nets */}
        <mesh position={[-3.66, 1.22, -0.5]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[16, 20]} />
          <meshStandardMaterial
            color="#e0e0e0"
            wireframe
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
            roughness={0.8}
          />
        </mesh>
        <mesh position={[3.66, 1.22, -0.5]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[2, 2.44, 16, 20]} />
          <meshStandardMaterial
            color="#e0e0e0"
            wireframe
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
            roughness={0.8}
          />
        </mesh>

        {/* Top net */}
        <mesh position={[0, 2.44, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[7.32, 2, 30, 16]} />
          <meshStandardMaterial
            color="#e0e0e0"
            wireframe
            transparent
            opacity={0.45}
            side={THREE.DoubleSide}
            roughness={0.8}
          />
        </mesh>

        {/* Ground net connection */}
        <mesh position={[0, 0, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[7.32, 2, 30, 10]} />
          <meshStandardMaterial
            color="#e0e0e0"
            wireframe
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
            roughness={0.9}
          />
        </mesh>

        {/* Goal line */}
        <mesh position={[0, 0.01, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[7.32, 0.12]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>
    </group>
  );
}
