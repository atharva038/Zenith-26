import * as THREE from "three";

// ==================== STADIUM FLOODLIGHTS ====================
export default function StadiumFloodlights() {
  // Tower positions in all four corners
  const towerPositions = [
    [65, 0, 45],
    [-65, 0, 45],
    [65, 0, -45],
    [-65, 0, -45],
  ];

  return (
    <group>
      {towerPositions.map((pos, towerIdx) => (
        <group key={towerIdx} position={pos}>
          {/* Floodlight tower */}
          <mesh position={[0, 20, 0]}>
            <cylinderGeometry args={[0.8, 1.2, 40, 8]} />
            <meshStandardMaterial
              color="#1a1a1a"
              roughness={0.5}
              metalness={0.7}
            />
          </mesh>

          {/* Crossbar for lights */}
          <mesh position={[0, 40, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.4, 0.4, 8, 8]} />
            <meshStandardMaterial
              color="#2a2a2a"
              roughness={0.4}
              metalness={0.8}
            />
          </mesh>

          {/* Four floodlights per tower */}
          {[-3, -1, 1, 3].map((offset, lightIdx) => (
            <group key={lightIdx} position={[offset, 40, 0]}>
              {/* Light housing */}
              <mesh rotation={[Math.PI / 6, 0, 0]}>
                <coneGeometry args={[0.6, 1.5, 8, 1, true]} />
                <meshStandardMaterial
                  color="#000"
                  roughness={0.3}
                  metalness={0.9}
                  side={THREE.DoubleSide}
                />
              </mesh>

              {/* Actual spotlight */}
              <spotLight
                position={[0, 0, 0]}
                angle={0.5}
                penumbra={0.3}
                intensity={300}
                distance={120}
                decay={2}
                color="#ffffff"
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-near={1}
                shadow-camera-far={100}
                target-position={[0, 0, 0]}
              />

              {/* Bright spot to simulate bulb */}
              <mesh position={[0, -0.3, 0]}>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshStandardMaterial
                  color="#fff"
                  emissive="#ffff00"
                  emissiveIntensity={2.0}
                  toneMapped={false}
                />
              </mesh>

              {/* Additional point light for ambiance */}
              <pointLight
                position={[0, 0, 0]}
                intensity={50}
                distance={30}
                color="#ffff99"
              />
            </group>
          ))}

          {/* Tower base */}
          <mesh position={[0, -1, 0]}>
            <cylinderGeometry args={[2, 3, 2, 8]} />
            <meshStandardMaterial
              color="#0a0a0a"
              roughness={0.8}
              metalness={0.5}
            />
          </mesh>
        </group>
      ))}

      {/* Additional overhead ambient light */}
      <ambientLight intensity={0.3} />

      {/* Hemisphere light for realistic sky/ground lighting */}
      <hemisphereLight
        skyColor="#87CEEB"
        groundColor="#2a4a2a"
        intensity={0.4}
      />
    </group>
  );
}
