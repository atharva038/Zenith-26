import {useRef, useState, useEffect} from "react";
import {useFrame} from "@react-three/fiber";
import {useGLTF} from "@react-three/drei";
import * as THREE from "three";
import {useBallTracking} from "./BallTrackingContext";

// ==================== FOOTBALL PLAYER WITH REALISTIC BALL ====================
export default function FootballPlayer() {
  const groupRef = useRef();
  const playerMeshRef = useRef();
  const ballGroupRef = useRef();
  const [animationPhase, setAnimationPhase] = useState("idle");
  const [ballFlying, setBallFlying] = useState(false);
  const ballTracking = useBallTracking();

  // Load realistic Ready Player Me avatar
  const {scene: playerScene} = useGLTF(
    "https://models.readyplayer.me/6913f5a7d6582bfdaef64755.glb"
  );

  // Clone and setup player model
  useEffect(() => {
    if (playerScene && playerMeshRef.current) {
      const clonedScene = playerScene.clone();

      clonedScene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.roughness = 0.6;
            child.material.metalness = 0.1;
            child.material.needsUpdate = true;
          }
        }
      });

      while (playerMeshRef.current.children.length > 0) {
        playerMeshRef.current.remove(playerMeshRef.current.children[0]);
      }
      playerMeshRef.current.add(clonedScene);
    }
  }, [playerScene]);

  // Create realistic football with proper texturing
  useEffect(() => {
    if (ballGroupRef.current && ballGroupRef.current.children.length === 0) {
      // Create high-detail sphere for football
      const ballGeometry = new THREE.SphereGeometry(0.6, 64, 64);

      // Create realistic football texture using canvas
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext("2d");

      // Base white color
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 1024, 1024);

      // Create classic black pentagon pattern
      ctx.fillStyle = "#000000";
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#333333";

      // Function to draw pentagon
      const drawPentagon = (x, y, radius, fill = true) => {
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
          const px = x + radius * Math.cos(angle);
          const py = y + radius * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        if (fill) ctx.fill();
        ctx.stroke();
      };

      // Draw pentagon pattern (classic football design)
      const pentSize = 60;
      drawPentagon(512, 120, pentSize);
      drawPentagon(250, 280, pentSize);
      drawPentagon(774, 280, pentSize);
      drawPentagon(180, 520, pentSize);
      drawPentagon(512, 440, pentSize);
      drawPentagon(844, 520, pentSize);
      drawPentagon(250, 744, pentSize);
      drawPentagon(774, 744, pentSize);
      drawPentagon(512, 904, pentSize);

      // Add some stitching detail
      ctx.strokeStyle = "#cccccc";
      ctx.lineWidth = 2;

      // Create texture from canvas
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;

      // Create realistic football material
      const ballMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.4,
        metalness: 0.05,
        bumpScale: 0.02,
      });

      // Create the football mesh
      const football = new THREE.Mesh(ballGeometry, ballMaterial);
      football.castShadow = true;
      football.receiveShadow = true;

      // Add subtle glow effect
      const glowGeometry = new THREE.SphereGeometry(0.65, 32, 32);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide,
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);

      // Add both to the ball group
      ballGroupRef.current.add(football);
      ballGroupRef.current.add(glow);
    }
  }, []);

  // Animation timing
  useEffect(() => {
    const runupTimer = setTimeout(() => setAnimationPhase("runup"), 7000);
    const kickTimer = setTimeout(() => {
      setAnimationPhase("kick");
      setBallFlying(true);
    }, 9000);
    const celebrateTimer = setTimeout(
      () => setAnimationPhase("celebrate"),
      12000
    );
    const resetTimer = setTimeout(() => {
      setAnimationPhase("idle");
      setBallFlying(false);
      if (groupRef.current) {
        groupRef.current.position.set(0, 0, 5);
      }
    }, 18000);

    return () => {
      clearTimeout(runupTimer);
      clearTimeout(kickTimer);
      clearTimeout(celebrateTimer);
      clearTimeout(resetTimer);
    };
  }, []);

  // Animation loop
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    if (groupRef.current) {
      switch (animationPhase) {
        case "idle":
          groupRef.current.position.y = Math.sin(time * 1.5) * 0.05;
          groupRef.current.rotation.y = Math.sin(time * 0.4) * 0.06;
          break;

        case "runup":
          groupRef.current.position.z -= delta * 7.5;
          groupRef.current.position.y =
            0.1 + Math.abs(Math.sin(time * 14)) * 0.2;
          groupRef.current.rotation.x = Math.sin(time * 7) * 0.15;
          groupRef.current.rotation.y = Math.sin(time * 14) * 0.08;

          if (playerMeshRef.current && playerMeshRef.current.children[0]) {
            playerMeshRef.current.children[0].rotation.x =
              Math.sin(time * 7) * 0.1;
          }
          break;

        case "kick":
          const kickProgress = (time * 4) % 1;
          groupRef.current.rotation.y = Math.PI * 0.35;
          groupRef.current.rotation.x =
            -0.3 + Math.sin(kickProgress * Math.PI * 2) * 0.2;

          if (playerMeshRef.current && playerMeshRef.current.children[0]) {
            playerMeshRef.current.children[0].rotation.z =
              Math.sin(kickProgress * Math.PI * 2) * 0.4;
            playerMeshRef.current.children[0].rotation.x = -0.2;
          }
          break;

        case "celebrate":
          groupRef.current.position.y =
            0.25 + Math.abs(Math.sin(time * 6)) * 0.7;
          groupRef.current.rotation.y = time * 2.8;

          const celebScale = 1.05 + Math.sin(time * 10) * 0.1;
          groupRef.current.scale.set(celebScale, celebScale, celebScale);

          if (playerMeshRef.current && playerMeshRef.current.children[0]) {
            playerMeshRef.current.children[0].rotation.x = -0.3;
            playerMeshRef.current.children[0].rotation.z =
              Math.sin(time * 5) * 0.2;
          }
          break;
      }
    }

    if (ballGroupRef.current) {
      if (ballFlying) {
        const kickStartTime = 9.0;
        const flyTime = time - kickStartTime;
        const flyDuration = 3.0;
        const flyProgress = Math.min(flyTime / flyDuration, 1.0);

        if (flyProgress >= 0 && flyProgress <= 1) {
          const curveX = -2 + Math.sin(flyProgress * Math.PI) * 3;
          const straightZ = 2 - flyProgress * 36;
          const heightY = 0.5 + Math.sin(flyProgress * Math.PI) * 6;

          ballGroupRef.current.position.x = curveX;
          ballGroupRef.current.position.z = straightZ;
          ballGroupRef.current.position.y = heightY;

          // Realistic ball spin
          ballGroupRef.current.rotation.x += delta * 15;
          ballGroupRef.current.rotation.z += delta * 10;

          // Update tracking
          if (ballTracking) {
            ballTracking.ballPosition = {
              x: ballGroupRef.current.position.x,
              y: ballGroupRef.current.position.y,
              z: ballGroupRef.current.position.z,
            };
            ballTracking.isBallFlying = true;
            ballTracking.flyProgress = flyProgress;

            if (flyProgress > 0.92 && flyProgress < 0.95) {
              ballTracking.cameraShake = 1.2;
            } else if (flyProgress >= 0.95) {
              ballTracking.cameraShake = 0;
            }
          }
        }
      } else {
        ballGroupRef.current.position.set(-0.3, 0.25, 0.8);
        ballGroupRef.current.rotation.x += delta * 1;
        ballGroupRef.current.rotation.z += delta * 0.7;

        if (ballTracking) {
          ballTracking.isBallFlying = false;
          ballTracking.cameraShake = 0;
          ballTracking.flyProgress = 0;
        }
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 5]}>
      {/* Player model */}
      <group
        ref={playerMeshRef}
        scale={1.85}
        position={[0, 0, 0]}
        rotation={[0, Math.PI * 0.12, 0]}
      />

      {/* Realistic football model */}
      <group ref={ballGroupRef} position={[0, 0.25, 0.8]}>
        {/* Football created via useEffect with canvas texture */}

        {/* Ball glow effect */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.15, 0]}>
          <ringGeometry args={[0.18, 0.28, 32]} />
          <meshBasicMaterial color="#00d4ff" transparent opacity={0.45} />
        </mesh>

        {/* Ball trail when flying */}
        {ballFlying &&
          [...Array(7)].map((_, i) => (
            <mesh key={`trail-${i}`} position={[i * 0.5, i * 0.35, i * 1]}>
              <sphereGeometry args={[0.14 - i * 0.018, 16, 16]} />
              <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={0.5 - i * 0.065}
              />
            </mesh>
          ))}
      </group>

      {/* Player spotlight */}
      <pointLight
        position={[0, 2.5, 0]}
        intensity={10}
        distance={5}
        color="#00d4ff"
        decay={2}
      />

      {/* Enhanced spotlight */}
      <spotLight
        position={[0, 16, 4]}
        target-position={[0, 1, 0]}
        angle={0.55}
        penumbra={0.4}
        intensity={animationPhase === "celebrate" ? 48 : 32}
        distance={35}
        color={animationPhase === "celebrate" ? "#ff6b00" : "#ffffff"}
        castShadow
      />

      {/* Ground energy ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
        <ringGeometry args={[1.4, 2.2, 56]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={
            animationPhase === "kick"
              ? 3
              : animationPhase === "celebrate"
              ? 2
              : 1.2
          }
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Speed lines during runup */}
      {animationPhase === "runup" &&
        [...Array(10)].map((_, i) => (
          <mesh
            key={`speedline-${i}`}
            position={[
              (Math.random() - 0.5) * 3.5,
              0.5 + Math.random() * 2,
              1.5 + i * 0.6,
            ]}
            rotation={[0, Math.PI / 2, 0]}
          >
            <planeGeometry args={[0.12, 2]} />
            <meshBasicMaterial
              color="#00d4ff"
              transparent
              opacity={0.35 - i * 0.03}
            />
          </mesh>
        ))}

      {/* Victory fireworks */}
      {animationPhase === "celebrate" &&
        [...Array(24)].map((_, i) => (
          <mesh
            key={`firework-${i}`}
            position={[
              Math.sin((i * Math.PI) / 12) * 3.2,
              2 + Math.random() * 2.2,
              Math.cos((i * Math.PI) / 12) * 3.2,
            ]}
          >
            <sphereGeometry args={[0.14, 12, 12]} />
            <meshBasicMaterial
              color={
                i % 3 === 0 ? "#ff6b00" : i % 3 === 1 ? "#00d4ff" : "#ffeb3b"
              }
              transparent
              opacity={0.9}
            />
          </mesh>
        ))}
    </group>
  );
}

// Preload player model
useGLTF.preload("https://models.readyplayer.me/6913f5a7d6582bfdaef64755.glb");
