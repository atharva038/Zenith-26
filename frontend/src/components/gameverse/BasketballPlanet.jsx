import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

/* -----------------------------------------------------------
    🏀 Basketball Court Texture Generator
    Creates a realistic wooden basketball court with markings
-------------------------------------------------------------*/
function useBasketballCourtTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 2048;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    // Wooden court base with gradient
    const woodGrad = ctx.createLinearGradient(0, 0, 0, 2048);
    woodGrad.addColorStop(0, "#d4a574");
    woodGrad.addColorStop(0.5, "#c89968");
    woodGrad.addColorStop(1, "#b88850");
    ctx.fillStyle = woodGrad;
    ctx.fillRect(0, 0, 2048, 2048);

    // Add wood grain texture
    const imgData = ctx.getImageData(0, 0, 2048, 2048);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const noise = Math.random() * 20 - 10;
      imgData.data[i] += noise;
      imgData.data[i + 1] += noise;
      imgData.data[i + 2] += noise;
    }
    ctx.putImageData(imgData, 0, 0);

    // Add horizontal wood plank lines
    ctx.strokeStyle = "rgba(139, 90, 43, 0.3)";
    ctx.lineWidth = 2;
    for (let y = 0; y < 2048; y += 80) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(2048, y);
      ctx.stroke();
    }

    // Court center circle
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(1024, 1024, 350, 0, Math.PI * 2);
    ctx.stroke();

    // Inner center circle
    ctx.beginPath();
    ctx.arc(1024, 1024, 100, 0, Math.PI * 2);
    ctx.stroke();

    // Half-court line
    ctx.beginPath();
    ctx.moveTo(1024, 200);
    ctx.lineTo(1024, 1848);
    ctx.stroke();

    // Three-point arc (top)
    ctx.beginPath();
    ctx.arc(1024, 400, 500, 0.3, Math.PI - 0.3);
    ctx.stroke();

    // Three-point arc (bottom)
    ctx.beginPath();
    ctx.arc(1024, 1648, 500, Math.PI + 0.3, Math.PI * 2 - 0.3);
    ctx.stroke();

    // Free throw circles (top)
    ctx.beginPath();
    ctx.arc(1024, 600, 180, 0, Math.PI * 2);
    ctx.stroke();

    // Free throw circles (bottom)
    ctx.beginPath();
    ctx.arc(1024, 1448, 180, 0, Math.PI * 2);
    ctx.stroke();

    // Key/paint area rectangles (top)
    ctx.strokeRect(724, 200, 600, 480);

    // Key/paint area rectangles (bottom)
    ctx.strokeRect(724, 1368, 600, 480);

    // Court boundary
    ctx.lineWidth = 12;
    ctx.strokeRect(100, 100, 1848, 1848);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = 16;
    texture.needsUpdate = true;

    return texture;
  }, []);
}

/* -----------------------------------------------------------
    🏀 Basketball Component with Realistic Seams
-------------------------------------------------------------*/
function Basketball({ scale = 1, rotation = [0, 0, 0] }) {
  const ballRef = useRef();

  // Basketball texture with characteristic pattern
  const basketballTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 512;
    const ctx = canvas.getContext("2d");

    // Orange base color with gradient
    const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    grad.addColorStop(0, "#ff8c42");
    grad.addColorStop(0.7, "#e67e22");
    grad.addColorStop(1, "#d35400");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Add leather texture bumps
    for (let i = 0; i < 3000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const size = Math.random() * 2;
      ctx.fillStyle = `rgba(${200 + Math.random() * 55}, ${100 + Math.random() * 40}, ${20 + Math.random() * 30}, 0.3)`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  useFrame((state) => {
    if (ballRef.current) {
      ballRef.current.rotation.y += 0.01;
      ballRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group scale={scale} rotation={rotation}>
      <group ref={ballRef}>
        {/* Main basketball sphere */}
        <mesh>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial
            map={basketballTexture}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>

        {/* Black seam lines */}
        <group>
          {/* Vertical seam 1 */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.151, 0.008, 8, 64]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
          </mesh>

          {/* Vertical seam 2 (perpendicular) */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.151, 0.008, 8, 64]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
          </mesh>

          {/* Curved seam lines */}
          <mesh rotation={[Math.PI / 4, 0, 0]}>
            <torusGeometry args={[0.152, 0.007, 6, 48, Math.PI]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
          </mesh>

          <mesh rotation={[-Math.PI / 4, 0, 0]}>
            <torusGeometry args={[0.152, 0.007, 6, 48, Math.PI]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
          </mesh>

          <mesh rotation={[0, 0, Math.PI / 4]}>
            <torusGeometry args={[0.152, 0.007, 6, 48, Math.PI]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
          </mesh>

          <mesh rotation={[0, 0, -Math.PI / 4]}>
            <torusGeometry args={[0.152, 0.007, 6, 48, Math.PI]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/* -----------------------------------------------------------
    🔄 Orbiting Basketball Component
-------------------------------------------------------------*/
function OrbitingBasketball({ radius, speed, offset, y, scale }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      const angle = state.clock.elapsedTime * speed + offset;
      ref.current.position.x = Math.cos(angle) * radius;
      ref.current.position.z = Math.sin(angle) * radius;
      ref.current.position.y = y + Math.sin(state.clock.elapsedTime * 2 + offset) * 0.1;
    }
  });

  return (
    <group ref={ref}>
      <Basketball scale={scale} />
    </group>
  );
}

/* -----------------------------------------------------------
    🏀 Basketball Hoop Component (Decorative)
-------------------------------------------------------------*/
function BasketballHoop({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* Backboard */}
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[0.6, 0.4, 0.02]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Rim */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.15, 0.01, 16, 32]} />
        <meshStandardMaterial color="#ff6b35" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Net lines (simplified) */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.15, -0.15, Math.sin(angle) * 0.15]}
            rotation={[0, angle, Math.PI / 6]}
          >
            <cylinderGeometry args={[0.005, 0.005, 0.3, 8]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.6} />
          </mesh>
        );
      })}
    </group>
  );
}

/* -----------------------------------------------------------
    🏀 Main Basketball Planet Component
-------------------------------------------------------------*/
export default function BasketballPlanet({ position, onClick, hovered, setHovered }) {
  const groupRef = useRef();
  const planetRef = useRef();
  const glowRef = useRef();
  const textRef = useRef();

  const radius = 2.2;
  const courtTexture = useBasketballCourtTexture();

  // Generate orbiting basketball data
  const orbitingBalls = useMemo(() => {
    return [...Array(14)].map((_, i) => ({
      radius: radius * (1.45 + (i % 3) * 0.15),
      speed: 0.3 + (i % 4) * 0.1,
      offset: (i / 14) * Math.PI * 2,
      y: -0.5 + (i % 5) * 0.25,
      scale: 0.75 + (i % 3) * 0.15,
    }));
  }, [radius]);

  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime();

    // Slow planet rotation
    if (planetRef.current) {
      planetRef.current.rotation.y = t * 0.12;
      planetRef.current.rotation.x = Math.sin(t * 0.3) * 0.05;
    }

    // Glow pulse effect
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.2 + Math.sin(t * 1.1) * 0.08 + (hovered ? 0.15 : 0);
      glowRef.current.scale.setScalar(1.08 + Math.sin(t * 0.6) * 0.02);
    }

    // Billboard text (always face camera)
    if (textRef.current) {
      textRef.current.quaternion.copy(camera.quaternion);
      textRef.current.position.y = radius * 1.44 + Math.sin(t * 1.2) * 0.045;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Main planet sphere with court texture */}
      <mesh
        ref={planetRef}
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[radius, 128, 128]} />
        <meshStandardMaterial
          map={courtTexture}
          roughness={0.7}
          metalness={0.1}
          emissive={hovered ? "#d35400" : "#000000"}
          emissiveIntensity={hovered ? 0.3 : 0.05}
        />
      </mesh>

      {/* Atmosphere glow (orange theme) */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[radius * 1.08, 64, 64]} />
        <meshBasicMaterial
          color="#ff8c42"
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Orbiting basketballs */}
      <group>
        {orbitingBalls.map((ball, i) => (
          <OrbitingBasketball key={i} {...ball} />
        ))}
      </group>

      {/* Large basketball on top of planet */}
      <group position={[0, radius + 0.5, 0]}>
        <Basketball scale={2.5} />
      </group>

      {/* Decorative hoops around planet */}
      <BasketballHoop position={[radius * 0.7, radius * 0.5, 0]} scale={1.2} />
      <BasketballHoop position={[-radius * 0.7, radius * 0.5, 0]} scale={1.2} rotation={[0, Math.PI, 0]} />

      {/* Billboard text label */}
      <Text
        ref={textRef}
        fontSize={0.68}
        color="#ff8c42"
        outlineWidth={0.13}
        outlineColor="#1a1a1a"
        anchorX="center"
        anchorY="middle"
        maxWidth={6}
        renderOrder={999}
      >
        BASKETBALL
      </Text>

      {/* Lighting */}
      <pointLight position={[4, 5, 4]} intensity={hovered ? 2.8 : 2.2} distance={22} color="#ffb380" />
      <pointLight position={[-3, 4, -3]} intensity={1.5} color="#ff8c42" distance={18} />
      <ambientLight intensity={0.25} />
    </group>
  );
}
