import {useMemo} from "react";
import * as THREE from "three";

// ==================== REALISTIC STADIUM FIELD ====================
export default function StadiumField() {
  // More realistic grass colors - darker and richer
  const grassMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#1a5f1a", // Darker realistic green
      roughness: 0.9, // Matte finish like real grass
      metalness: 0.0,
      side: THREE.FrontSide, // Only render top face
      depthWrite: true, // CRITICAL: Prevents flickering
      depthTest: true, // CRITICAL: Prevents z-fighting
    });
  }, []);

  const darkGrassMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#145014", // Even darker for stripes
      roughness: 0.9,
      metalness: 0.0,
      side: THREE.FrontSide,
      depthWrite: true,
      depthTest: true,
    });
  }, []);

  const lineMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#ffffff",
      emissive: "#ffffff",
      emissiveIntensity: 0.3,
      roughness: 0.7,
      metalness: 0.0,
    });
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* Main grass field - FIFA standard 105m x 68m */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[105, 68]} />
        <primitive object={grassMaterial} attach="material" />
      </mesh>

      {/* Grass stripes for realism - with position offset to prevent z-fighting */}
      {[...Array(21)].map((_, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[-52.5 + i * 5, 0.001, 0]} // 0.001 offset prevents flickering
          receiveShadow
        >
          <planeGeometry args={[5, 68]} />
          <primitive
            object={i % 2 === 0 ? grassMaterial : darkGrassMaterial}
            attach="material"
          />
        </mesh>
      ))}

      {/* Field markings - White lines */}
      {/* Sidelines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[52.5, 0.002, 0]}>
        <planeGeometry args={[0.15, 68]} />
        <primitive object={lineMaterial} attach="material" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-52.5, 0.002, 0]}>
        <planeGeometry args={[0.15, 68]} />
        <primitive object={lineMaterial} attach="material" />
      </mesh>

      {/* Goal lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 34]}>
        <planeGeometry args={[105, 0.15]} />
        <primitive object={lineMaterial} attach="material" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, -34]}>
        <planeGeometry args={[105, 0.15]} />
        <primitive object={lineMaterial} attach="material" />
      </mesh>

      {/* Center circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
        <ringGeometry args={[9.15, 9.3, 64]} />
        <primitive object={lineMaterial} attach="material" />
      </mesh>

      {/* Center line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <planeGeometry args={[0.15, 68]} />
        <primitive object={lineMaterial} attach="material" />
      </mesh>

      {/* Center spot */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
        <circleGeometry args={[0.2, 32]} />
        <primitive object={lineMaterial} attach="material" />
      </mesh>

      {/* Penalty areas */}
      {[-1, 1].map((side, idx) => (
        <group key={idx} position={[0, 0, side * 34]}>
          {/* Penalty box */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.002, side * -16.5]}
          >
            <planeGeometry args={[40.32, 0.15]} />
            <primitive object={lineMaterial} attach="material" />
          </mesh>
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[20.16, 0.002, side * -8.25]}
          >
            <planeGeometry args={[0.15, 16.5]} />
            <primitive object={lineMaterial} attach="material" />
          </mesh>
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[-20.16, 0.002, side * -8.25]}
          >
            <planeGeometry args={[0.15, 16.5]} />
            <primitive object={lineMaterial} attach="material" />
          </mesh>

          {/* Goal area */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.002, side * -5.5]}
          >
            <planeGeometry args={[18.32, 0.15]} />
            <primitive object={lineMaterial} attach="material" />
          </mesh>
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[9.16, 0.002, side * -2.75]}
          >
            <planeGeometry args={[0.15, 5.5]} />
            <primitive object={lineMaterial} attach="material" />
          </mesh>
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[-9.16, 0.002, side * -2.75]}
          >
            <planeGeometry args={[0.15, 5.5]} />
            <primitive object={lineMaterial} attach="material" />
          </mesh>

          {/* Penalty spot */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.003, side * -11]}
          >
            <circleGeometry args={[0.2, 32]} />
            <primitive object={lineMaterial} attach="material" />
          </mesh>

          {/* Penalty arc */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.002, side * -11]}
          >
            <ringGeometry
              args={[9.15, 9.3, 64, 1, side > 0 ? Math.PI : 0, Math.PI]}
            />
            <primitive object={lineMaterial} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Corner arcs */}
      {[
        [52.5, 34],
        [-52.5, 34],
        [52.5, -34],
        [-52.5, -34],
      ].map(([x, z], idx) => (
        <mesh
          key={idx}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[x, 0.003, z]}
        >
          <ringGeometry
            args={[
              0.9,
              1.05,
              32,
              1,
              x > 0 && z > 0
                ? Math.PI
                : x < 0 && z > 0
                ? Math.PI / 2
                : x < 0 && z < 0
                ? 0
                : Math.PI * 1.5,
              Math.PI / 2,
            ]}
          />
          <primitive object={lineMaterial} attach="material" />
        </mesh>
      ))}
    </group>
  );
}
