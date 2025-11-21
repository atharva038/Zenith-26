import {useRef, useMemo} from "react";
import {useFrame} from "@react-three/fiber";
import * as THREE from "three";

// ==================== STADIUM STANDS WITH ANIMATED CROWD ====================
export default function StadiumStands() {
  const crowdRef = useRef();

  // Generate crowd positions (8000 spectators)
  const crowdData = useMemo(() => {
    const count = 8000;
    const dummy = new THREE.Object3D();
    const colors = new Float32Array(count * 3);

    // Four stands: North, South, East, West
    const stands = [
      {x: [40, 75], z: [-40, 40], y: [3, 25]}, // East stand
      {x: [-75, -40], z: [-40, 40], y: [3, 25]}, // West stand
      {x: [-40, 40], z: [40, 65], y: [3, 20]}, // North stand
      {x: [-40, 40], z: [-65, -40], y: [3, 20]}, // South stand
    ];

    let idx = 0;
    stands.forEach((stand) => {
      const spectatorCount = 2000; // 2000 per stand

      for (let i = 0; i < spectatorCount; i++) {
        const x = THREE.MathUtils.randFloat(stand.x[0], stand.x[1]);
        const z = THREE.MathUtils.randFloat(stand.z[0], stand.z[1]);
        const y = THREE.MathUtils.randFloat(stand.y[0], stand.y[1]);

        dummy.position.set(x, y, z);
        dummy.updateMatrix();

        // Random team colors
        const teamColor =
          Math.random() > 0.5
            ? new THREE.Color("#10b981") // Green (home)
            : new THREE.Color("#3b82f6"); // Blue (away)

        colors[idx * 3] = teamColor.r;
        colors[idx * 3 + 1] = teamColor.g;
        colors[idx * 3 + 2] = teamColor.b;

        idx++;
      }
    });

    return {count, colors};
  }, []);

  // Animated crowd with stadium wave
  useFrame((state) => {
    if (!crowdRef.current) return;

    const time = state.clock.elapsedTime;
    const dummy = new THREE.Object3D();

    for (let i = 0; i < 8000; i++) {
      crowdRef.current.getMatrixAt(i, dummy.matrix);
      dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);

      // Store original Y position
      if (!crowdRef.current.userData[`originalY_${i}`]) {
        crowdRef.current.userData[`originalY_${i}`] = dummy.position.y;
      }
      const originalY = crowdRef.current.userData[`originalY_${i}`];

      // Stadium wave effect
      const wavePhase =
        (dummy.position.x / 10 + dummy.position.z / 10 + time * 2) %
        (Math.PI * 2);
      const jump = Math.max(0, Math.sin(wavePhase)) * 0.3;

      // Individual random bounce
      const individualBounce = Math.sin(time * 3 + i * 0.1) * 0.05;

      // Apply animations
      dummy.position.y = originalY + jump + individualBounce;
      dummy.rotation.y = Math.sin(time + i * 0.05) * 0.1;

      dummy.updateMatrix();
      crowdRef.current.setMatrixAt(i, dummy.matrix);
    }

    crowdRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* Stadium structure - four stands */}
      {[
        {pos: [57.5, 12, 0], args: [15, 24, 80]},
        {pos: [-57.5, 12, 0], args: [15, 24, 80]},
        {pos: [0, 10, 52.5], args: [80, 20, 15]},
        {pos: [0, 10, -52.5], args: [80, 20, 15]},
      ].map((stand, idx) => (
        <mesh key={idx} position={stand.pos}>
          <boxGeometry args={stand.args} />
          <meshStandardMaterial
            color="#1a1a2e"
            roughness={0.7}
            metalness={0.3}
          />
        </mesh>
      ))}

      {/* Animated crowd using instanced mesh */}
      <instancedMesh ref={crowdRef} args={[null, null, 8000]} userData={{}}>
        <boxGeometry args={[0.4, 0.8, 0.4]} />
        <meshStandardMaterial vertexColors />
      </instancedMesh>

      {/* Roof structure */}
      {[
        {pos: [57.5, 26, 0], args: [18, 1, 85]},
        {pos: [-57.5, 26, 0], args: [18, 1, 85]},
        {pos: [0, 22, 52.5], args: [85, 1, 18]},
        {pos: [0, 22, -52.5], args: [85, 1, 18]},
      ].map((roof, idx) => (
        <mesh key={`roof-${idx}`} position={roof.pos}>
          <boxGeometry args={roof.args} />
          <meshStandardMaterial
            color="#0a0a0a"
            roughness={0.5}
            metalness={0.8}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}

      {/* Support pillars */}
      {[
        [60, 13, 35],
        [60, 13, -35],
        [-60, 13, 35],
        [-60, 13, -35],
        [35, 11, 55],
        [-35, 11, 55],
        [35, 11, -55],
        [-35, 11, -55],
      ].map((pos, idx) => (
        <mesh key={`pillar-${idx}`} position={pos}>
          <cylinderGeometry args={[0.8, 1.2, 26, 8]} />
          <meshStandardMaterial
            color="#2a2a2a"
            roughness={0.4}
            metalness={0.9}
          />
        </mesh>
      ))}
    </group>
  );
}
