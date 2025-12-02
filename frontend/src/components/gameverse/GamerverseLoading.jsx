import {Canvas, useFrame} from "@react-three/fiber";
import * as THREE from "three";
import {OrbitControls} from "@react-three/drei";
import {useRef, useState, useEffect} from "react";

function OrbitingPlanet({radius = 1, size = 0.2, speed = 1}) {
  const ref = useRef();

  useFrame(({clock}) => {
    const t = clock.getElapsedTime() * speed;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.z = Math.sin(t) * radius;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial
        color="#ffb36a"
        emissive="#ffb36a"
        emissiveIntensity={0.8}
      />
    </mesh>
  );
}

function LoadingPlanet() {
  const big = useRef();

  useFrame(({clock}) => {
    big.current.rotation.y = clock.getElapsedTime() * 0.4;
  });

  return (
    <group>
      {/* Main glowing planet */}
      <mesh ref={big}>
        <sphereGeometry args={[0.8, 64, 64]} />
        <meshStandardMaterial
          color="#222"
          emissive="#ff6b1f"
          emissiveIntensity={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Glow */}
      <mesh>
        <sphereGeometry args={[1.05, 64, 64]} />
        <meshBasicMaterial
          color="#ffb36a"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Orbiting planets */}
      <OrbitingPlanet radius={1.6} size={0.18} speed={1.6} />
      <OrbitingPlanet radius={2.0} size={0.22} speed={1.2} />
      <OrbitingPlanet radius={2.4} size={0.14} speed={0.8} />
    </group>
  );
}

export default function GamerverseLoading() {
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    // Show Canvas after a brief delay to ensure it's ready
    const timer = setTimeout(() => setCanvasReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        background: "black",
        position: "relative",
      }}
    >
      {/* Minimal Instant Preloader */}
      {!canvasReady && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "black",
            zIndex: 100,
          }}
        >
          {/* Spinning Loader */}
          <div
            style={{
              width: "60px",
              height: "60px",
              border: "3px solid rgba(255, 179, 106, 0.2)",
              borderTop: "3px solid #ffb36a",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />

          {/* Loading Text */}
          <p
            style={{
              marginTop: "20px",
              color: "#ffb36a",
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "2px",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          >
            INITIALIZING...
          </p>

          {/* Keyframe Animations */}
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              
              @keyframes pulse {
                0%, 100% { opacity: 0.5; }
                50% { opacity: 1; }
              }
            `}
          </style>
        </div>
      )}

      {/* 3D Canvas Loader */}
      <Canvas
        camera={{position: [0, 2, 6]}}
        style={{opacity: canvasReady ? 1 : 0, transition: "opacity 0.5s"}}
      >
        <ambientLight intensity={0.4} />
        <pointLight intensity={2} position={[3, 3, 3]} color="#ffb36a" />
        <LoadingPlanet />
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          autoRotate={false}
          minDistance={3}
          maxDistance={12}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
