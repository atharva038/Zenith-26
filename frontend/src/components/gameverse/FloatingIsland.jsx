import {useRef, useState, useMemo} from "react";
import {useFrame} from "@react-three/fiber";
import {
  Text,
  RoundedBox,
  Sphere,
  Box,
  Cylinder,
  Torus,
} from "@react-three/drei";
import * as THREE from "three";
import ChessKing from "./ChessKing";
import PowerliftingPlanet from "./PowerliftingPlanet";
import TableTennisPlanet from "./TableTennisPlanet";
import AthleticsPlanet from "./AthleticsPlanet";
import CarromPlanet from "./CarromPlanet";
import KhoKhoPlanet from "./KhoKhoPlanet";
import FootballPlanet from "./FootballPlanet";

/* ---------------------------------------------------------
   ⚽ Enhanced Football Model
--------------------------------------------------------- */
function FootballModel() {
  const ballRef = useRef();
  const glowRef = useRef();
  const sparkRef = useRef();

  const radius = 0.55;
  const ballTex = useFootballTexture();

  // spark orbit data
  const sparkData = useMemo(
    () =>
      [...Array(10)].map(() => ({
        angle: Math.random() * Math.PI * 2,
        radius: radius * (1.6 + Math.random() * 0.3),
        speed: 0.15 + Math.random() * 0.2,
        y: -0.2 + Math.random() * 0.5,
        size: 0.05 + Math.random() * 0.03,
      })),
    []
  );

  useFrame(({clock}, delta) => {
    const t = clock.getElapsedTime();

    // smooth rotation
    if (ballRef.current) {
      ballRef.current.rotation.y = t * 0.4;
      ballRef.current.position.y = 0.55 + Math.sin(t * 1.4) * 0.06;
    }

    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(t * 0.9) * 0.05);
      glowRef.current.material.opacity = 0.25 + Math.sin(t * 1.1) * 0.08;
    }

    // sparks
    if (sparkRef.current) {
      sparkRef.current.children.forEach((mesh, i) => {
        const s = sparkData[i];
        s.angle += delta * s.speed;
        mesh.position.set(
          Math.cos(s.angle) * s.radius,
          0.55 + s.y + Math.sin(t * 2 + i) * 0.04,
          Math.sin(s.angle) * s.radius
        );
      });
    }
  });

  return (
    <group>
      {/* ⚽ Main ball */}
      <mesh ref={ballRef}>
        <sphereGeometry args={[radius, 128, 128]} />
        <meshStandardMaterial map={ballTex} roughness={0.4} metalness={0.15} />
      </mesh>

      {/* 🌌 Soft glow shell */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[radius * 1.22, 64, 64]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ✨ Floating sparkles */}
      <group ref={sparkRef}>
        {sparkData.map((s, i) => (
          <mesh key={i}>
            <sphereGeometry args={[s.size, 12, 12]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
          </mesh>
        ))}
      </group>

      {/* 💡 Light */}
      <pointLight
        position={[1, 1.4, 1]}
        intensity={0.9}
        distance={5}
        color="#ffffff"
      />
    </group>
  );
}

// Simple 3D models for each sport
function SportModel({sportName}) {
  switch (sportName) {
    case "FOOTBALL":
      // Enhanced Football/Soccer ball
      return <FootballModel />;

    case "CRICKET":
      // Cricket bat and ball
      return (
        <group position={[0, 0.6, 0]}>
          {/* Bat */}
          <Box args={[0.15, 0.6, 0.05]} position={[-0.2, 0, 0]}>
            <meshStandardMaterial color="#d4a574" roughness={0.6} />
          </Box>
          {/* Ball */}
          <Sphere args={[0.12, 16, 16]} position={[0.2, 0, 0]}>
            <meshStandardMaterial color="#ff3333" metalness={0.4} />
          </Sphere>
        </group>
      );

    case "BADMINTON":
      // Badminton shuttlecock
      return (
        <group position={[0, 0.7, 0]} rotation={[0.3, 0, 0]}>
          <Sphere args={[0.1, 16, 16]} position={[0, -0.1, 0]}>
            <meshStandardMaterial color="#ffffff" />
          </Sphere>
          <Cylinder args={[0.15, 0.05, 0.3, 8]} position={[0, 0.1, 0]}>
            <meshStandardMaterial
              color="#ffffff"
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
            />
          </Cylinder>
        </group>
      );

    case "BASKETBALL":
      // Enhanced Basketball Planet
      return <BasketballModel />;

    case "VOLLEYBALL":
      // Volleyball
      return (
        <group position={[0, 0.6, 0]}>
          <Sphere args={[0.32, 32, 32]}>
            <meshStandardMaterial
              color="#ffffff"
              metalness={0.2}
              roughness={0.4}
            />
          </Sphere>
          {/* Color panels */}
          {[0, 1, 2].map((i) => (
            <Sphere
              key={i}
              args={[0.33, 16, 16, 0, Math.PI * 2, 0, Math.PI / 3]}
              rotation={[0, (i * Math.PI * 2) / 3, 0]}
            >
              <meshStandardMaterial color="#4169e1" />
            </Sphere>
          ))}
        </group>
      );

    case "CHESS":
      // Realistic Chess Board with Multiple Pieces
      return (
        <group position={[0, 0.5, 0]}>
          {/* Chess Board Base - Wood texture */}
          <Box args={[1.6, 0.08, 1.6]} position={[0, 0, 0]}>
            <meshStandardMaterial
              color="#8b4513"
              metalness={0.2}
              roughness={0.6}
            />
          </Box>

          {/* Chess Board Squares - Checkered pattern */}
          {[...Array(8)].map((_, row) =>
            [...Array(8)].map((_, col) => {
              const isLight = (row + col) % 2 === 0;
              const x = -0.7 + col * 0.2;
              const z = -0.7 + row * 0.2;
              return (
                <Box
                  key={`${row}-${col}`}
                  args={[0.19, 0.02, 0.19]}
                  position={[x, 0.05, z]}
                >
                  <meshStandardMaterial
                    color={isLight ? "#f0d9b5" : "#b58863"}
                    metalness={0.1}
                    roughness={0.4}
                  />
                </Box>
              );
            })
          )}

          {/* White King - Detailed */}
          <group position={[-0.5, 0.1, -0.5]}>
            {/* Base */}
            <Cylinder args={[0.08, 0.1, 0.05, 16]}>
              <meshStandardMaterial
                color="#f5f5f5"
                metalness={0.7}
                roughness={0.2}
              />
            </Cylinder>
            {/* Body */}
            <Cylinder args={[0.06, 0.08, 0.35, 16]} position={[0, 0.2, 0]}>
              <meshStandardMaterial
                color="#f5f5f5"
                metalness={0.7}
                roughness={0.2}
              />
            </Cylinder>
            {/* Crown top */}
            <Cylinder args={[0.07, 0.06, 0.08, 16]} position={[0, 0.42, 0]}>
              <meshStandardMaterial
                color="#ffd700"
                metalness={0.9}
                roughness={0.1}
              />
            </Cylinder>
            {/* Cross - horizontal */}
            <Box args={[0.12, 0.03, 0.03]} position={[0, 0.5, 0]}>
              <meshStandardMaterial
                color="#ffd700"
                metalness={0.9}
                roughness={0.1}
              />
            </Box>
            {/* Cross - vertical */}
            <Box args={[0.03, 0.12, 0.03]} position={[0, 0.5, 0]}>
              <meshStandardMaterial
                color="#ffd700"
                metalness={0.9}
                roughness={0.1}
              />
            </Box>
          </group>

          {/* Black Queen - Detailed */}
          <group position={[-0.3, 0.1, -0.5]}>
            {/* Base */}
            <Cylinder args={[0.08, 0.1, 0.05, 16]}>
              <meshStandardMaterial
                color="#1a1a1a"
                metalness={0.7}
                roughness={0.2}
              />
            </Cylinder>
            {/* Body */}
            <Cylinder args={[0.06, 0.08, 0.32, 16]} position={[0, 0.18, 0]}>
              <meshStandardMaterial
                color="#1a1a1a"
                metalness={0.7}
                roughness={0.2}
              />
            </Cylinder>
            {/* Crown spheres */}
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <Sphere
                key={i}
                args={[0.04, 12, 12]}
                position={[
                  Math.cos((angle * Math.PI) / 180) * 0.06,
                  0.4,
                  Math.sin((angle * Math.PI) / 180) * 0.06,
                ]}
              >
                <meshStandardMaterial
                  color="#ffd700"
                  metalness={0.9}
                  roughness={0.1}
                />
              </Sphere>
            ))}
          </group>

          {/* White Bishop */}
          <group position={[-0.1, 0.1, -0.5]}>
            <Cylinder args={[0.07, 0.09, 0.05, 16]}>
              <meshStandardMaterial
                color="#f5f5f5"
                metalness={0.7}
                roughness={0.2}
              />
            </Cylinder>
            <Cylinder args={[0.05, 0.07, 0.28, 16]} position={[0, 0.16, 0]}>
              <meshStandardMaterial
                color="#f5f5f5"
                metalness={0.7}
                roughness={0.2}
              />
            </Cylinder>
            <Sphere args={[0.06, 12, 12]} position={[0, 0.35, 0]}>
              <meshStandardMaterial
                color="#f5f5f5"
                metalness={0.7}
                roughness={0.2}
              />
            </Sphere>
          </group>

          {/* Black Knight */}
          <group position={[0.1, 0.1, -0.5]}>
            <Cylinder args={[0.07, 0.09, 0.05, 16]}>
              <meshStandardMaterial
                color="#1a1a1a"
                metalness={0.7}
                roughness={0.2}
              />
            </Cylinder>
            <Box args={[0.08, 0.25, 0.12]} position={[0, 0.15, 0]}>
              <meshStandardMaterial
                color="#1a1a1a"
                metalness={0.7}
                roughness={0.2}
              />
            </Box>
            <Box args={[0.06, 0.08, 0.08]} position={[0, 0.3, 0.06]}>
              <meshStandardMaterial
                color="#1a1a1a"
                metalness={0.7}
                roughness={0.2}
              />
            </Box>
          </group>

          {/* White Rook */}
          <group position={[0.3, 0.1, -0.5]}>
            <Cylinder args={[0.07, 0.09, 0.05, 8]}>
              <meshStandardMaterial
                color="#f5f5f5"
                metalness={0.7}
                roughness={0.2}
              />
            </Cylinder>
            <Cylinder args={[0.06, 0.07, 0.25, 8]} position={[0, 0.15, 0]}>
              <meshStandardMaterial
                color="#f5f5f5"
                metalness={0.7}
                roughness={0.2}
              />
            </Cylinder>
            <Cylinder args={[0.08, 0.08, 0.06, 8]} position={[0, 0.32, 0]}>
              <meshStandardMaterial
                color="#f5f5f5"
                metalness={0.7}
                roughness={0.2}
              />
            </Cylinder>
          </group>

          {/* Black Pawn */}
          <group position={[0.5, 0.1, -0.5]}>
            <Cylinder args={[0.06, 0.08, 0.05, 12]}>
              <meshStandardMaterial
                color="#1a1a1a"
                metalness={0.7}
                roughness={0.2}
              />
            </Cylinder>
            <Cylinder args={[0.04, 0.06, 0.18, 12]} position={[0, 0.12, 0]}>
              <meshStandardMaterial
                color="#1a1a1a"
                metalness={0.7}
                roughness={0.2}
              />
            </Cylinder>
            <Sphere args={[0.05, 12, 12]} position={[0, 0.25, 0]}>
              <meshStandardMaterial
                color="#1a1a1a"
                metalness={0.7}
                roughness={0.2}
              />
            </Sphere>
          </group>

          {/* White Pawns on front row */}
          {[-0.7, -0.5, -0.3, -0.1, 0.1, 0.3, 0.5, 0.7].map((x, i) => (
            <group key={`pawn-${i}`} position={[x, 0.1, -0.1]}>
              <Cylinder args={[0.05, 0.07, 0.04, 12]}>
                <meshStandardMaterial
                  color="#f5f5f5"
                  metalness={0.7}
                  roughness={0.2}
                />
              </Cylinder>
              <Cylinder args={[0.03, 0.05, 0.14, 12]} position={[0, 0.1, 0]}>
                <meshStandardMaterial
                  color="#f5f5f5"
                  metalness={0.7}
                  roughness={0.2}
                />
              </Cylinder>
              <Sphere args={[0.04, 12, 12]} position={[0, 0.2, 0]}>
                <meshStandardMaterial
                  color="#f5f5f5"
                  metalness={0.7}
                  roughness={0.2}
                />
              </Sphere>
            </group>
          ))}
        </group>
      );

    case "TABLE TENNIS":
      // Table tennis paddle and ball
      return (
        <group position={[0, 0.6, 0]}>
          {/* Paddle */}
          <Cylinder
            args={[0.25, 0.25, 0.05, 32]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <meshStandardMaterial color="#cc0000" metalness={0.3} />
          </Cylinder>
          <Cylinder args={[0.03, 0.03, 0.3, 8]} position={[0, -0.2, 0]}>
            <meshStandardMaterial color="#8b4513" />
          </Cylinder>
          {/* Ball */}
          <Sphere args={[0.08, 16, 16]} position={[0.3, 0.1, 0]}>
            <meshStandardMaterial color="#ffffff" metalness={0.5} />
          </Sphere>
        </group>
      );

    case "TENNIS":
      // Tennis racket and ball
      return (
        <group position={[0, 0.6, 0]}>
          {/* Racket frame */}
          <Torus args={[0.3, 0.04, 16, 32]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#1a5f7a" metalness={0.6} />
          </Torus>
          {/* Handle */}
          <Cylinder args={[0.03, 0.04, 0.4, 8]} position={[0, -0.3, 0]}>
            <meshStandardMaterial color="#8b4513" />
          </Cylinder>
          {/* Ball */}
          <Sphere args={[0.1, 16, 16]} position={[0.35, 0, 0]}>
            <meshStandardMaterial color="#ccff00" metalness={0.3} />
          </Sphere>
        </group>
      );

    case "SWIMMING":
      // Swimming goggles and waves
      return (
        <group position={[0, 0.6, 0]}>
          {/* Goggles */}
          <group>
            <Torus
              args={[0.15, 0.05, 16, 32]}
              position={[-0.15, 0, 0]}
              rotation={[0, Math.PI / 2, 0]}
            >
              <meshStandardMaterial
                color="#0099cc"
                metalness={0.7}
                transparent
                opacity={0.6}
              />
            </Torus>
            <Torus
              args={[0.15, 0.05, 16, 32]}
              position={[0.15, 0, 0]}
              rotation={[0, Math.PI / 2, 0]}
            >
              <meshStandardMaterial
                color="#0099cc"
                metalness={0.7}
                transparent
                opacity={0.6}
              />
            </Torus>
          </group>
          {/* Water waves */}
          {[0, 1, 2].map((i) => (
            <Torus
              key={i}
              args={[0.3 + i * 0.15, 0.02, 8, 32]}
              position={[0, -0.3 - i * 0.1, 0]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <meshStandardMaterial
                color="#00bfff"
                transparent
                opacity={0.5 - i * 0.15}
              />
            </Torus>
          ))}
        </group>
      );

    case "ATHLETICS":
      // Running shoe
      return (
        <group position={[0, 0.5, 0]} rotation={[0, 0.3, 0]}>
          {/* Shoe body */}
          <Box args={[0.5, 0.2, 0.3]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#ff4444" metalness={0.4} />
          </Box>
          {/* Sole */}
          <Box args={[0.52, 0.08, 0.32]} position={[0, -0.14, 0]}>
            <meshStandardMaterial color="#ffffff" />
          </Box>
          {/* Laces */}
          {[0, 1, 2].map((i) => (
            <Cylinder
              key={i}
              args={[0.02, 0.02, 0.15, 8]}
              position={[-0.1 + i * 0.1, 0.12, 0]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <meshStandardMaterial color="#333333" />
            </Cylinder>
          ))}
        </group>
      );

    default:
      return null;
  }
}

/* -----------------------------------------------------------
    🎨 Procedural basketball texture
-------------------------------------------------------------*/
function useBasketballTexture() {
  return useMemo(() => {
    const size = 1024;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d", {willReadFrequently: true});

    // Base orange
    ctx.fillStyle = "#f97316";
    ctx.fillRect(0, 0, size, size);

    // Add light noise dots (basketball rough texture)
    const imgData = ctx.getImageData(0, 0, size, size);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const n = Math.random() * 20; // noise amount
      imgData.data[i] -= n; // R
      imgData.data[i + 1] -= n; // G
      imgData.data[i + 2] -= n; // B
    }
    ctx.putImageData(imgData, 0, 0);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = 16;
    return tex;
  }, []);
}

/* -------------------------------------------------------
    🏏 Cricket Ball Texture (Red Leather with White Seam)
--------------------------------------------------------*/
function useCricketBallTexture({size = 2048}) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d", {willReadFrequently: true});

    // Base dark red leather gradient
    const grd = ctx.createLinearGradient(0, 0, size, size);
    grd.addColorStop(0, "#941a1a");
    grd.addColorStop(0.5, "#a82020");
    grd.addColorStop(1, "#7a0d0d");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, size, size);

    // Add leather grain noise
    const img = ctx.getImageData(0, 0, size, size);
    for (let i = 0; i < img.data.length; i += 4) {
      const grain = Math.random() * 22 - 11;
      img.data[i] += grain;
      img.data[i + 1] += grain * 0.6;
      img.data[i + 2] += grain * 0.4;
    }
    ctx.putImageData(img, 0, 0);

    // White seam - horizontal band across middle (equator)
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 18;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    // Main seam line (horizontal great circle)
    ctx.beginPath();
    ctx.moveTo(0, size / 2);
    ctx.lineTo(size, size / 2);
    ctx.stroke();

    // Double-row stitching pattern
    function drawStitches(offset) {
      ctx.strokeStyle = "#fff7e6";
      ctx.lineWidth = 5;

      const stitches = 80;
      for (let i = 0; i <= stitches; i++) {
        const x = (i / stitches) * size;
        const angle = -25 * (Math.PI / 180); // diagonal stitch angle
        const len = 14;

        ctx.beginPath();
        ctx.moveTo(x, size / 2 + offset);
        ctx.lineTo(
          x + len * Math.cos(angle),
          size / 2 + offset + len * Math.sin(angle)
        );
        ctx.stroke();
      }
    }

    drawStitches(-28);
    drawStitches(28);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = 16;
    tex.needsUpdate = true;

    return tex;
  }, [size]);
}

/* -------------------------------------------------------
    🤾 Handball Texture (Blue with Hexagonal Panel Pattern)
--------------------------------------------------------*/
function useHandballTexture({size = 2048}) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d", {willReadFrequently: true});

    // Base blue handball color
    const grd = ctx.createLinearGradient(0, 0, size, size);
    grd.addColorStop(0, "#2b78ff");
    grd.addColorStop(0.5, "#1e5fd9");
    grd.addColorStop(1, "#1548b8");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, size, size);

    // Add texture grain for handball surface
    const img = ctx.getImageData(0, 0, size, size);
    for (let i = 0; i < img.data.length; i += 4) {
      const grain = Math.random() * 24 - 12;
      img.data[i] += grain;
      img.data[i + 1] += grain * 0.9;
      img.data[i + 2] += grain * 0.7;
    }
    ctx.putImageData(img, 0, 0);

    // Draw hexagonal panel pattern (simplified)
    ctx.strokeStyle = "#0d2b5f";
    ctx.lineWidth = 8;
    ctx.lineJoin = "round";

    // Vertical lines creating panel segments
    const segments = 8;
    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * size;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, size);
      ctx.stroke();
    }

    // Horizontal curved lines
    const hSegments = 6;
    for (let i = 0; i <= hSegments; i++) {
      const y = (i / hSegments) * size;
      ctx.beginPath();
      ctx.moveTo(0, y);

      // Add slight curve
      for (let x = 0; x <= size; x += size / 20) {
        const curve = Math.sin((x / size) * Math.PI * 2) * 15;
        ctx.lineTo(x, y + curve);
      }
      ctx.stroke();
    }

    // Add diagonal seam lines
    ctx.strokeStyle = "#0a1f4a";
    ctx.lineWidth = 6;

    // Diagonal from top-left to bottom-right
    ctx.beginPath();
    ctx.moveTo(0, size * 0.3);
    ctx.quadraticCurveTo(size * 0.5, size * 0.5, size, size * 0.7);
    ctx.stroke();

    // Diagonal from bottom-left to top-right
    ctx.beginPath();
    ctx.moveTo(0, size * 0.7);
    ctx.quadraticCurveTo(size * 0.5, size * 0.5, size, size * 0.3);
    ctx.stroke();

    // Highlight seams with lighter color
    ctx.strokeStyle = "rgba(100, 150, 255, 0.3)";
    ctx.lineWidth = 3;

    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * size;
      ctx.beginPath();
      ctx.moveTo(x + 2, 0);
      ctx.lineTo(x + 2, size);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = 16;
    tex.needsUpdate = true;

    return tex;
  }, [size]);
}

/**
 * Generates a procedural volleyball equirectangular texture + bump map.
 * The pattern approximates classic curved-panel volleyballs:
 *  - three curved stripe groups wrapping the sphere
 *  - clean black seams
 */
function useVolleyballTexture({size = 2048, seamPx = 12}) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d", {
      alpha: false,
      willReadFrequently: true,
    });

    // background (white)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);

    // UV to lat/lon helper
    const uvToDir = (u, v) => {
      const lon = (u - 0.5) * 2 * Math.PI;
      const lat = (0.5 - v) * Math.PI;
      const x = Math.cos(lat) * Math.cos(lon);
      const y = Math.sin(lat);
      const z = Math.cos(lat) * Math.sin(lon);
      return new THREE.Vector3(x, y, z);
    };

    // stripe function: given direction vector, compute stripe strength for a stripe rotated by angleBase
    const stripeStrengthAt = (dir, angleBase) => {
      const m = new THREE.Matrix4().makeRotationY(angleBase);
      const d = dir.clone().applyMatrix4(m);
      const val = Math.exp(-Math.pow(d.z / 0.42, 6));
      return val;
    };

    // Fill stripes (colorful 3-group style)
    const stripeColors = ["#f03f3f", "#ffffff", "#0844ff"];
    const img = ctx.getImageData(0, 0, size, size);
    for (let y = 0; y < size; y++) {
      const v = y / size;
      for (let x = 0; x < size; x++) {
        const u = x / size;
        const dir = uvToDir(u, v);

        // combine stripe influences (three groups 0, 120deg, 240deg)
        const s0 = stripeStrengthAt(dir, 0);
        const s1 = stripeStrengthAt(dir, (2 * Math.PI) / 3);
        const s2 = stripeStrengthAt(dir, (4 * Math.PI) / 3);

        // pick dominant stripe
        let color = [255, 255, 255]; // base white
        const maxS = Math.max(s0, s1, s2);
        if (maxS > 0.12) {
          const blend = Math.min(1, (maxS - 0.12) / 0.6);
          if (maxS === s0) {
            color = [
              Math.round(255 * (1 - blend) + 240 * blend),
              Math.round(255 * (1 - blend) + 63 * blend),
              Math.round(255 * (1 - blend) + 63 * blend),
            ];
          } else if (maxS === s1) {
            color = [255, 255, 255];
          } else {
            color = [
              Math.round(255 * (1 - blend) + 8 * blend),
              Math.round(255 * (1 - blend) + 68 * blend),
              Math.round(255 * (1 - blend) + 255 * blend),
            ];
          }
        }

        const idx = (y * size + x) * 4;
        img.data[idx] = color[0];
        img.data[idx + 1] = color[1];
        img.data[idx + 2] = color[2];
        img.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);

    // Draw seams: detect gradient and stroke
    const gray = new Float32Array(size * size);
    for (let i = 0; i < size * size; i++) {
      const idx = i * 4;
      gray[i] = (img.data[idx] + img.data[idx + 1] + img.data[idx + 2]) / 3;
    }
    const grad = new Float32Array(size * size);
    for (let y = 1; y < size - 1; y++) {
      for (let x = 1; x < size - 1; x++) {
        const i = y * size + x;
        const gx =
          -gray[i - size - 1] -
          2 * gray[i - 1] -
          gray[i + size - 1] +
          gray[i - size + 1] +
          2 * gray[i + 1] +
          gray[i + size + 1];
        const gy =
          -gray[i - size - 1] -
          2 * gray[i - size] -
          gray[i - size + 1] +
          gray[i + size - 1] +
          2 * gray[i + size] +
          gray[i + size + 1];
        grad[i] = Math.sqrt(gx * gx + gy * gy);
      }
    }

    ctx.lineWidth = seamPx;
    ctx.strokeStyle = "#222222";
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    const threshold = 24;
    for (let y = 2; y < size - 2; y += 6) {
      for (let x = 2; x < size - 2; x += 6) {
        const i = y * size + x;
        if (grad[i] > threshold) {
          const gx =
            -gray[i - size - 1] -
            2 * gray[i - 1] -
            gray[i + size - 1] +
            gray[i - size + 1] +
            2 * gray[i + 1] +
            gray[i + size + 1];
          const gy =
            -gray[i - size - 1] -
            2 * gray[i - size] -
            gray[i - size + 1] +
            gray[i + size - 1] +
            2 * gray[i + size] +
            gray[i + size + 1];
          const ang = Math.atan2(gy, gx);
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(ang);
          ctx.beginPath();
          ctx.moveTo(-seamPx * 0.8, 0);
          ctx.lineTo(seamPx * 0.8, 0);
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    // subtle blur
    const off = document.createElement("canvas");
    off.width = off.height = size;
    const offCtx = off.getContext("2d", {willReadFrequently: true});
    offCtx.putImageData(ctx.getImageData(0, 0, size, size), 0, 0);
    offCtx.filter = "blur(0.7px)";
    offCtx.globalAlpha = 0.07;
    offCtx.drawImage(off, 0, 0);
    ctx.globalAlpha = 1.0;

    // add micro-leather grain
    const img2 = ctx.getImageData(0, 0, size, size);
    for (let i = 0; i < img2.data.length; i += 4) {
      const n = (Math.random() - 0.5) * 8;
      img2.data[i] = Math.min(255, Math.max(0, img2.data[i] + n));
      img2.data[i + 1] = Math.min(255, Math.max(0, img2.data[i + 1] + n));
      img2.data[i + 2] = Math.min(255, Math.max(0, img2.data[i + 2] + n));
    }
    ctx.putImageData(img2, 0, 0);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    tex.anisotropy = 16;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;

    // bump map generation
    const bumpCanvas = document.createElement("canvas");
    bumpCanvas.width = bumpCanvas.height = size / 2;
    const bctx = bumpCanvas.getContext("2d", {willReadFrequently: true});
    bctx.fillStyle = "#808080";
    bctx.fillRect(0, 0, bumpCanvas.width, bumpCanvas.height);
    bctx.drawImage(canvas, 0, 0, bumpCanvas.width, bumpCanvas.height);

    const bImg = bctx.getImageData(0, 0, bumpCanvas.width, bumpCanvas.height);
    for (let i = 0; i < bImg.data.length; i += 4) {
      const g = (bImg.data[i] + bImg.data[i + 1] + bImg.data[i + 2]) / 3;
      const val = Math.min(255, Math.max(0, (g - 128) * 1.8 + 128));
      bImg.data[i] = bImg.data[i + 1] = bImg.data[i + 2] = val;
    }
    bctx.putImageData(bImg, 0, 0);

    const bumpTex = new THREE.CanvasTexture(bumpCanvas);
    bumpTex.needsUpdate = true;
    bumpTex.anisotropy = 8;
    bumpTex.wrapS = bumpTex.wrapT = THREE.ClampToEdgeWrapping;

    return {map: tex, bump: bumpTex};
  }, [size, seamPx]);
}

/**
 * Generates a classic chessboard texture with alternating black and white squares
 * Perfect for wrapping around a sphere to create a chess-themed planet
 */
function useChessTexture({size = 2048, squares = 16}) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d", {alpha: false});

    const squareSize = size / squares;

    // Draw checkerboard pattern
    for (let y = 0; y < squares; y++) {
      for (let x = 0; x < squares; x++) {
        // Alternate colors
        const isLight = (x + y) % 2 === 0;
        ctx.fillStyle = isLight ? "#f0d9b5" : "#b58863"; // Classic chess colors
        ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
      }
    }

    // Add subtle border lines between squares
    ctx.strokeStyle = "#8b7355";
    ctx.lineWidth = size * 0.001;
    for (let i = 0; i <= squares; i++) {
      const pos = i * squareSize;
      // Horizontal lines
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(size, pos);
      ctx.stroke();
      // Vertical lines
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, size);
      ctx.stroke();
    }

    // Add subtle texture noise for realism
    const imgData = ctx.getImageData(0, 0, size, size);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 6;
      imgData.data[i] = Math.max(0, Math.min(255, imgData.data[i] + noise));
      imgData.data[i + 1] = Math.max(
        0,
        Math.min(255, imgData.data[i + 1] + noise)
      );
      imgData.data[i + 2] = Math.max(
        0,
        Math.min(255, imgData.data[i + 2] + noise)
      );
    }
    ctx.putImageData(imgData, 0, 0);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    tex.anisotropy = 16;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;

    // Create bump map for subtle depth
    const bumpCanvas = document.createElement("canvas");
    bumpCanvas.width = bumpCanvas.height = size / 2;
    const bctx = bumpCanvas.getContext("2d", {willReadFrequently: true});

    // Draw simplified checkerboard for bump
    const bSquareSize = bumpCanvas.width / squares;
    for (let y = 0; y < squares; y++) {
      for (let x = 0; x < squares; x++) {
        const isLight = (x + y) % 2 === 0;
        bctx.fillStyle = isLight ? "#a0a0a0" : "#606060";
        bctx.fillRect(
          x * bSquareSize,
          y * bSquareSize,
          bSquareSize,
          bSquareSize
        );
      }
    }

    const bumpTex = new THREE.CanvasTexture(bumpCanvas);
    bumpTex.needsUpdate = true;
    bumpTex.anisotropy = 8;
    bumpTex.wrapS = bumpTex.wrapT = THREE.RepeatWrapping;

    return {map: tex, bump: bumpTex};
  }, [size, squares]);
}

/* -----------------------------------------------------------
    🛠️ Generate proper basketball seams
-------------------------------------------------------------*/
function createSeams(radius) {
  return [
    // Horizontal ring around the middle
    {r: 1.0, t: 0.11, rot: [0, 0, 0], pos: [0, 0, 0]},

    // Vertical seam 1
    {r: 1.0, t: 0.11, rot: [Math.PI / 2, 0, 0], pos: [0, 0, 0]},

    // Diagonal seam
    {r: 1.0, t: 0.11, rot: [Math.PI / 2, Math.PI / 4, 0], pos: [0, 0, 0]},

    // Opposite diagonal seam
    {
      r: 1.0,
      t: 0.11,
      rot: [Math.PI / 2, -Math.PI / 4, 0],
      pos: [0, 0, 0],
    },
  ];
}

/* -----------------------------------------------------------
    🏀 Enhanced Basketball Model
-------------------------------------------------------------*/
function BasketballModel() {
  const ballRef = useRef();
  const seamRef = useRef();
  const sparkleRef = useRef();

  const ballTex = useBasketballTexture();
  const radius = 0.5;

  // Sparkle orbit points
  const sparkData = useMemo(() => {
    return new Array(8).fill(0).map(() => {
      return {
        angle: Math.random() * Math.PI * 2,
        radius: radius * (1.8 + Math.random() * 0.4),
        speed: 0.2 + Math.random() * 0.3,
        y: -0.2 + Math.random() * 0.6,
      };
    });
  }, []);

  useFrame(({clock}, delta) => {
    const t = clock.getElapsedTime();

    // Rotate basketball
    if (ballRef.current) {
      ballRef.current.rotation.y = t * 0.3;
      ballRef.current.position.y = 0.6 + Math.sin(t * 1.2) * 0.08;
    }

    // Rotate seams with ball
    if (seamRef.current) {
      seamRef.current.rotation.y = t * 0.3;
      seamRef.current.position.y = 0.6 + Math.sin(t * 1.2) * 0.08;
    }

    // floating sparkles
    if (sparkleRef.current) {
      sparkleRef.current.children.forEach((child, i) => {
        const s = sparkData[i];
        s.angle += delta * s.speed;
        child.position.set(
          Math.cos(s.angle) * s.radius,
          0.6 + s.y + Math.sin(t * 2 + i) * 0.04,
          Math.sin(s.angle) * s.radius
        );
        child.scale.setScalar(0.06 + Math.sin(t * 3 + i) * 0.02);
      });
    }
  });

  return (
    <group>
      {/* 🟠 Base basketball sphere */}
      <mesh ref={ballRef}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial map={ballTex} roughness={0.55} metalness={0.1} />
      </mesh>

      {/* 🟠 Basketball seams */}
      <group ref={seamRef}>
        {createSeams(radius).map((cfg, i) => (
          <mesh key={i} rotation={cfg.rot} position={cfg.pos}>
            <torusGeometry args={[radius * cfg.r, cfg.t * 0.06, 12, 100]} />
            <meshStandardMaterial
              color="#1c1917"
              roughness={0.8}
              metalness={0.3}
            />
          </mesh>
        ))}
      </group>

      {/* ✨ Floating orb sparkles */}
      <group ref={sparkleRef}>
        {sparkData.map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color="#ffb36a" transparent opacity={0.8} />
          </mesh>
        ))}
      </group>

      {/* 💡 Additional point light for basketball */}
      <pointLight
        position={[1, 1.5, 1]}
        intensity={0.8}
        distance={3}
        color="#ff6b35"
      />
    </group>
  );
}

/* -----------------------------------------------------------
    🪐 Premium Basketball Planet (Spherical Design)
-------------------------------------------------------------*/
function BasketballPlanet({position, onClick, hovered, setHovered}) {
  const groupRef = useRef();
  const planetRef = useRef();
  const glowRef = useRef();
  const sparkRef = useRef();
  const textRef = useRef();

  const radius = 2.2;
  const theme = {base: "#f97316", glow: "#ffb36a", tint: "#1c1917"};

  // Sparkle orbit data
  const sparkData = useMemo(() => {
    return [...Array(16)].map(() => ({
      angle: Math.random() * Math.PI * 2,
      radius: radius * (1.4 + Math.random() * 0.4),
      speed: 0.15 + Math.random() * 0.3,
      y: -0.4 + Math.random() * 1.2,
      size: 0.06 + Math.random() * 0.04,
    }));
  }, []);

  useFrame(({clock, camera}, delta) => {
    const t = clock.getElapsedTime();

    // NO floating motion - keep fixed on orbit
    // Planets stay at their orbital position

    // Slow rotation
    if (planetRef.current) {
      planetRef.current.rotation.y = t * 0.15;
    }

    // Atmosphere pulse
    if (glowRef.current) {
      glowRef.current.material.opacity =
        0.18 + Math.sin(t * 1.2) * 0.08 + (hovered ? 0.15 : 0);
      glowRef.current.scale.setScalar(1.07 + Math.sin(t * 0.5) * 0.02);
    }

    // Orbit sparkles
    if (sparkRef.current) {
      sparkRef.current.children.forEach((mesh, i) => {
        const s = sparkData[i];
        s.angle += delta * s.speed;
        mesh.position.set(
          Math.cos(s.angle) * s.radius,
          s.y + Math.sin(t * 2 + i) * 0.05,
          Math.sin(s.angle) * s.radius
        );
      });
    }

    // Billboard text
    if (textRef.current) {
      textRef.current.quaternion.copy(camera.quaternion);
      textRef.current.position.y = radius * 1.4 + Math.sin(t * 1.2) * 0.04;
    }
  });

  const ballTex = useBasketballTexture();

  return (
    <group ref={groupRef} position={position}>
      {/* 🪐 Main Sphere Planet with Basketball Texture */}
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
          map={ballTex}
          roughness={0.45}
          metalness={0.1}
          emissive={hovered ? theme.tint : "#000000"}
          emissiveIntensity={hovered ? 0.6 : 0.15}
        />
      </mesh>

      {/* 🟠 Basketball seams on planet */}
      <group ref={planetRef}>
        {createSeams(radius).map((cfg, i) => (
          <mesh key={`seam-${i}`} rotation={cfg.rot} position={cfg.pos}>
            <torusGeometry args={[radius * cfg.r, cfg.t * 0.15, 16, 120]} />
            <meshStandardMaterial
              color="#1c1917"
              roughness={0.8}
              metalness={0.3}
            />
          </mesh>
        ))}
      </group>

      {/* 🌌 Atmosphere Glow (Fresnel-style) */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[radius * 1.07, 128, 128]} />
        <meshBasicMaterial
          color={theme.glow}
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* ✨ Sparkle Orbiters */}
      <group ref={sparkRef}>
        {sparkData.map((s, i) => (
          <mesh key={i}>
            <sphereGeometry args={[s.size, 12, 12]} />
            <meshBasicMaterial color={theme.glow} transparent opacity={0.85} />
          </mesh>
        ))}
      </group>

      {/* 🏷 Billboard Text */}
      <Text
        ref={textRef}
        fontSize={0.7}
        color={theme.glow}
        outlineWidth={0.12}
        outlineColor="#000000"
        anchorX="center"
        anchorY="middle"
        maxWidth={6}
        renderOrder={999}
      >
        BASKETBALL
      </Text>

      {/* 💡 Lights */}
      <pointLight
        position={[4, 5, 4]}
        intensity={hovered ? 3 : 2}
        distance={20}
        color={theme.glow}
      />
      <ambientLight intensity={0.2} />
    </group>
  );
}

/* -----------------------------------------------------------
    🏏 Premium Cricket Planet (Spherical Design)
-------------------------------------------------------------*/
function CricketPlanet({position, onClick, hovered, setHovered}) {
  const groupRef = useRef();
  const planetRef = useRef();
  const glowRef = useRef();
  const sparkRef = useRef();
  const textRef = useRef();

  const radius = 2.2;
  const theme = {base: "#941a1a", glow: "#dc2626", tint: "#7a0d0d"};

  // Sparkle orbit data - red sparkles for cricket theme
  const sparkData = useMemo(() => {
    return [...Array(18)].map(() => ({
      angle: Math.random() * Math.PI * 2,
      radius: radius * (1.35 + Math.random() * 0.45),
      speed: 0.12 + Math.random() * 0.28,
      y: -0.5 + Math.random() * 1.4,
      size: 0.05 + Math.random() * 0.05,
    }));
  }, []);

  useFrame(({clock, camera}, delta) => {
    const t = clock.getElapsedTime();

    // NO floating motion - keep fixed on orbit
    // Planets stay at their orbital position

    // Slow rotation to show seam
    if (planetRef.current) {
      planetRef.current.rotation.y = t * 0.18;
      planetRef.current.rotation.x = Math.sin(t * 0.3) * 0.05;
    }

    // Atmosphere pulse
    if (glowRef.current) {
      glowRef.current.material.opacity =
        0.2 + Math.sin(t * 1.15) * 0.09 + (hovered ? 0.18 : 0);
      glowRef.current.scale.setScalar(1.08 + Math.sin(t * 0.52) * 0.025);
    }

    // Orbit sparkles
    if (sparkRef.current) {
      sparkRef.current.children.forEach((mesh, i) => {
        const s = sparkData[i];
        s.angle += delta * s.speed;
        mesh.position.set(
          Math.cos(s.angle) * s.radius,
          s.y + Math.sin(t * 2.2 + i) * 0.06,
          Math.sin(s.angle) * s.radius
        );
      });
    }

    // Billboard text
    if (textRef.current) {
      textRef.current.quaternion.copy(camera.quaternion);
      textRef.current.position.y = radius * 1.42 + Math.sin(t * 1.18) * 0.05;
    }
  });

  const cricketTex = useCricketBallTexture({size: 2048});

  return (
    <group ref={groupRef} position={position}>
      {/* 🏏 Main Sphere Planet with Cricket Ball Texture */}
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
          map={cricketTex}
          roughness={0.42}
          metalness={0.12}
          emissive={hovered ? theme.tint : "#000000"}
          emissiveIntensity={hovered ? 0.5 : 0.12}
        />
      </mesh>

      {/* 🌌 Atmosphere Glow (Red Cricket Theme) */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[radius * 1.08, 128, 128]} />
        <meshBasicMaterial
          color={theme.glow}
          transparent
          opacity={0.24}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* ✨ Sparkle Orbiters */}
      <group ref={sparkRef}>
        {sparkData.map((s, i) => (
          <mesh key={i}>
            <sphereGeometry args={[s.size, 12, 12]} />
            <meshBasicMaterial
              color={i % 3 === 0 ? "#ffffff" : theme.glow}
              transparent
              opacity={0.88}
            />
          </mesh>
        ))}
      </group>

      {/* 🏷 Billboard Text */}
      <Text
        ref={textRef}
        fontSize={0.72}
        color="#ffffff"
        outlineWidth={0.14}
        outlineColor={theme.base}
        anchorX="center"
        anchorY="middle"
        maxWidth={6}
        renderOrder={999}
      >
        CRICKET
      </Text>

      {/* 💡 Lights */}
      <pointLight
        position={[4.5, 5.5, 3.5]}
        intensity={hovered ? 3.2 : 2.4}
        distance={22}
        color="#ff4444"
      />
      <pointLight
        position={[-3, 4, -3]}
        intensity={1.6}
        color="#ffffff"
        distance={18}
      />
      <ambientLight intensity={0.22} />
    </group>
  );
}

/* -------------------------------------------------------
    🏸 Badminton Shuttlecock Texture (White with Cork Base)
--------------------------------------------------------*/
function useBadmintonTexture({size = 2048}) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d", {willReadFrequently: true});

    // White base for shuttlecock body
    ctx.fillStyle = "#f8f8f8";
    ctx.fillRect(0, 0, size, size);

    // Add subtle texture noise for feather detail
    const img = ctx.getImageData(0, 0, size, size);
    for (let i = 0; i < img.data.length; i += 4) {
      const grain = Math.random() * 18 - 9;
      img.data[i] += grain;
      img.data[i + 1] += grain;
      img.data[i + 2] += grain;
    }
    ctx.putImageData(img, 0, 0);

    // Cork base band (horizontal stripe in middle representing cork bottom)
    const corkHeight = size * 0.15;
    const grd = ctx.createLinearGradient(
      0,
      size / 2 - corkHeight / 2,
      0,
      size / 2 + corkHeight / 2
    );
    grd.addColorStop(0, "#e8d4b8");
    grd.addColorStop(0.5, "#c79b6a");
    grd.addColorStop(1, "#e8d4b8");
    ctx.fillStyle = grd;
    ctx.fillRect(0, size / 2 - corkHeight / 2, size, corkHeight);

    // Add cork texture spots
    for (let i = 0; i < 600; i++) {
      const x = Math.random() * size;
      const y = size / 2 - corkHeight / 2 + Math.random() * corkHeight;
      const r = Math.random() * 4;
      ctx.fillStyle = `rgba(${100 + Math.random() * 50}, ${
        60 + Math.random() * 40
      }, ${30 + Math.random() * 30}, ${0.15 + Math.random() * 0.15})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Feather lines (vertical stripes to simulate feather pattern)
    ctx.strokeStyle = "rgba(220, 220, 220, 0.4)";
    ctx.lineWidth = 3;
    const featherLines = 32;
    for (let i = 0; i < featherLines; i++) {
      const x = (i / featherLines) * size;

      // Upper feathers
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + size * 0.02, size / 2 - corkHeight / 2);
      ctx.stroke();

      // Lower feathers
      ctx.beginPath();
      ctx.moveTo(x, size);
      ctx.lineTo(x + size * 0.02, size / 2 + corkHeight / 2);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = 16;
    tex.needsUpdate = true;

    return tex;
  }, [size]);
}

/* -----------------------------------------------------------
    🏸 Premium Badminton Planet (Spherical Design)
-------------------------------------------------------------*/
function BadmintonPlanet({position, onClick, hovered, setHovered}) {
  const groupRef = useRef();
  const planetRef = useRef();
  const glowRef = useRef();
  const sparkRef = useRef();
  const textRef = useRef();

  const radius = 2.2;
  const theme = {
    base: "#f8f8f8",
    glow: "#7fe3c8",
    tint: "#0f6f4f",
    cork: "#c79b6a",
  };

  // Sparkle orbit data - cyan/green sparkles for badminton theme
  const sparkData = useMemo(() => {
    return [...Array(20)].map(() => ({
      angle: Math.random() * Math.PI * 2,
      radius: radius * (1.38 + Math.random() * 0.42),
      speed: 0.14 + Math.random() * 0.26,
      y: -0.45 + Math.random() * 1.35,
      size: 0.04 + Math.random() * 0.06,
    }));
  }, []);

  useFrame(({clock, camera}, delta) => {
    const t = clock.getElapsedTime();

    // NO floating motion - keep fixed on orbit
    // Planets stay at their orbital position

    // Slow rotation
    if (planetRef.current) {
      planetRef.current.rotation.y = t * 0.16;
      planetRef.current.rotation.x = Math.sin(t * 0.35) * 0.04;
    }

    // Atmosphere pulse
    if (glowRef.current) {
      glowRef.current.material.opacity =
        0.22 + Math.sin(t * 1.18) * 0.08 + (hovered ? 0.16 : 0);
      glowRef.current.scale.setScalar(1.09 + Math.sin(t * 0.54) * 0.022);
    }

    // Orbit sparkles
    if (sparkRef.current) {
      sparkRef.current.children.forEach((mesh, i) => {
        const s = sparkData[i];
        s.angle += delta * s.speed;
        mesh.position.set(
          Math.cos(s.angle) * s.radius,
          s.y + Math.sin(t * 2.1 + i) * 0.055,
          Math.sin(s.angle) * s.radius
        );
      });
    }

    // Billboard text
    if (textRef.current) {
      textRef.current.quaternion.copy(camera.quaternion);
      textRef.current.position.y = radius * 1.44 + Math.sin(t * 1.2) * 0.045;
    }
  });

  const badmintonTex = useBadmintonTexture({size: 2048});

  return (
    <group ref={groupRef} position={position}>
      {/* 🏸 Main Sphere Planet with Shuttlecock Texture */}
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
          map={badmintonTex}
          roughness={0.38}
          metalness={0.08}
          emissive={hovered ? theme.tint : "#000000"}
          emissiveIntensity={hovered ? 0.45 : 0.1}
        />
      </mesh>

      {/* 🌌 Atmosphere Glow (Cyan/Green Theme) */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[radius * 1.09, 128, 128]} />
        <meshBasicMaterial
          color={theme.glow}
          transparent
          opacity={0.26}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* ✨ Sparkle Orbiters */}
      <group ref={sparkRef}>
        {sparkData.map((s, i) => (
          <mesh key={i}>
            <sphereGeometry args={[s.size, 12, 12]} />
            <meshBasicMaterial
              color={i % 4 === 0 ? "#ffffff" : theme.glow}
              transparent
              opacity={0.9}
            />
          </mesh>
        ))}
      </group>

      {/* 🏷 Billboard Text */}
      <Text
        ref={textRef}
        fontSize={0.68}
        color={theme.glow}
        outlineWidth={0.13}
        outlineColor={theme.tint}
        anchorX="center"
        anchorY="middle"
        maxWidth={6}
        renderOrder={999}
      >
        BADMINTON
      </Text>

      {/* 💡 Lights */}
      <pointLight
        position={[4.2, 5.2, 3.8]}
        intensity={hovered ? 3.0 : 2.5}
        distance={23}
        color="#a8fff0"
      />
      <pointLight
        position={[-3.2, 4.5, -2.8]}
        intensity={1.5}
        color={theme.glow}
        distance={20}
      />
      <ambientLight intensity={0.24} />
    </group>
  );
}

/* -----------------------------------------------------------
    🤾 Premium Handball Planet (Spherical Design)
-------------------------------------------------------------*/
function HandballPlanet({position, onClick, hovered, setHovered}) {
  const groupRef = useRef();
  const planetRef = useRef();
  const glowRef = useRef();
  const sparkRef = useRef();
  const textRef = useRef();

  const radius = 2.2;
  const theme = {base: "#2b78ff", glow: "#85b7ff", tint: "#0b1e3a"};

  // Sparkle orbit data - blue sparkles for handball theme
  const sparkData = useMemo(() => {
    return [...Array(18)].map(() => ({
      angle: Math.random() * Math.PI * 2,
      radius: radius * (1.4 + Math.random() * 0.4),
      speed: 0.15 + Math.random() * 0.3,
      y: -0.3 + Math.random() * 1.3,
      size: 0.05 + Math.random() * 0.06,
    }));
  }, []);

  useFrame(({clock, camera}, delta) => {
    const t = clock.getElapsedTime();

    // NO floating motion - keep fixed on orbit
    // Planets stay at their orbital position

    // Rotation
    if (planetRef.current) {
      planetRef.current.rotation.y = t * 0.13;
      planetRef.current.rotation.x = Math.sin(t * 0.32) * 0.03;
    }

    // Atmosphere pulse
    if (glowRef.current) {
      glowRef.current.material.opacity =
        0.2 + Math.sin(t * 1.2) * 0.07 + (hovered ? 0.14 : 0);
      glowRef.current.scale.setScalar(1.07 + Math.sin(t * 0.52) * 0.02);
    }

    // Orbit sparkles
    if (sparkRef.current) {
      sparkRef.current.children.forEach((mesh, i) => {
        const s = sparkData[i];
        s.angle += delta * s.speed;
        mesh.position.set(
          Math.cos(s.angle) * s.radius,
          s.y + Math.sin(t * 1.8 + i) * 0.04,
          Math.sin(s.angle) * s.radius
        );
      });
    }

    // Billboard text
    if (textRef.current) {
      textRef.current.quaternion.copy(camera.quaternion);
      textRef.current.position.y = radius * 1.4 + Math.sin(t * 1.1) * 0.04;
    }
  });

  const handballTex = useHandballTexture({size: 2048});

  return (
    <group ref={groupRef} position={position}>
      {/* 🤾 Main Sphere Planet with Handball Texture */}
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
          map={handballTex}
          roughness={0.4}
          metalness={0.1}
          emissive={hovered ? theme.tint : "#000000"}
          emissiveIntensity={hovered ? 0.55 : 0.15}
        />
      </mesh>

      {/* 🌌 Atmosphere Glow (Blue Theme) */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[radius * 1.07, 128, 128]} />
        <meshBasicMaterial
          color={theme.glow}
          transparent
          opacity={0.24}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* ✨ Sparkle Orbiters */}
      <group ref={sparkRef}>
        {sparkData.map((s, i) => (
          <mesh key={i}>
            <sphereGeometry args={[s.size, 12, 12]} />
            <meshBasicMaterial
              color={i % 3 === 0 ? "#ffffff" : "#a8cfff"}
              transparent
              opacity={0.9}
            />
          </mesh>
        ))}
      </group>

      {/* 🏷 Billboard Text */}
      <Text
        ref={textRef}
        fontSize={0.7}
        color="#75aaff"
        outlineWidth={0.12}
        outlineColor={theme.tint}
        anchorX="center"
        anchorY="middle"
        maxWidth={6}
        renderOrder={999}
      >
        HANDBALL
      </Text>

      {/* 💡 Lights */}
      <pointLight
        position={[4, 5, 4]}
        intensity={hovered ? 3.2 : 2.6}
        distance={22}
        color="#88b6ff"
      />
      <pointLight
        position={[-3.5, 4.2, -3]}
        intensity={1.6}
        color={theme.glow}
        distance={20}
      />
      <ambientLight intensity={0.22} />
    </group>
  );
}

/* -----------------------------------------------------------
    🏐 Premium Volleyball Planet (Spherical Design)
-------------------------------------------------------------*/
function VolleyballPlanet({position, onClick, hovered, setHovered}) {
  const planetRef = useRef();
  const glowRef = useRef();
  const sparkRef = useRef();
  const textRef = useRef();

  const radius = 2.2;

  // Use volleyball texture with bump map
  const {map: volleyMap, bump: volleyBump} = useVolleyballTexture({
    size: 2048,
    seamPx: Math.max(10, Math.floor(2048 * 0.0055)),
  });

  // orbit sparkles
  const sparkData = useMemo(
    () =>
      [...Array(18)].map(() => ({
        angle: Math.random() * Math.PI * 2,
        radius: radius * (1.45 + Math.random() * 0.5),
        speed: 0.12 + Math.random() * 0.28,
        y: -0.35 + Math.random() * 1.2,
        size: 0.05 + Math.random() * 0.05,
      })),
    []
  );

  useFrame(({clock, camera}, delta) => {
    const t = clock.getElapsedTime();

    // rotation & float
    if (planetRef.current) {
      planetRef.current.rotation.y = t * 0.12;
      planetRef.current.position.y = position[1] + Math.sin(t * 0.45) * 0.22;
    }

    // glow animation
    if (glowRef.current) {
      glowRef.current.material.opacity =
        0.18 + Math.sin(t * 1.2) * 0.05 + (hovered ? 0.08 : 0);
      glowRef.current.scale.setScalar(1.06 + Math.sin(t * 0.5) * 0.015);
    }

    // sparks
    if (sparkRef.current) {
      sparkRef.current.children.forEach((m, i) => {
        const s = sparkData[i];
        s.angle += delta * s.speed;
        m.position.set(
          Math.cos(s.angle) * s.radius,
          s.y + Math.sin(t * 1.9 + i) * 0.04,
          Math.sin(s.angle) * s.radius
        );
      });
    }

    // billboard text
    if (textRef.current) {
      textRef.current.quaternion.copy(camera.quaternion);
      textRef.current.position.y = radius * 1.32 + Math.sin(t * 1.2) * 0.03;
    }
  });

  return (
    <group position={position}>
      {/* 🏐 Volleyball planet with accurate texture */}
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
        <sphereGeometry args={[radius, 256, 256]} />
        <meshStandardMaterial
          map={volleyMap}
          bumpMap={volleyBump}
          bumpScale={0.02}
          roughness={0.45}
          metalness={0.06}
          emissive={hovered ? "#ffffff" : "#000000"}
          emissiveIntensity={hovered ? 0.12 : 0}
        />
      </mesh>

      {/* 🌌 glow atmosphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[radius * 1.07, 128, 128]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* ✨ sparkles */}
      <group ref={sparkRef}>
        {sparkData.map((s, i) => (
          <mesh key={i}>
            <sphereGeometry args={[s.size, 8, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.85} />
          </mesh>
        ))}
      </group>

      {/* 🏷 billboard label */}
      <Text
        ref={textRef}
        fontSize={0.62}
        color="#ffffff"
        outlineWidth={0.1}
        outlineColor="#000000"
        anchorX="center"
        anchorY="middle"
        maxWidth={6}
        renderOrder={999}
      >
        VOLLEYBALL
      </Text>

      {/* 💡 lights */}
      <pointLight
        position={[3.5, 4, 3.5]}
        intensity={hovered ? 1.8 : 1.6}
        distance={20}
        color="#ffffff"
      />
      <ambientLight intensity={0.2} />
    </group>
  );
}

/* -----------------------------------------------------------
    ♟️ Premium Chess Planet (Spherical Design with King Model)
-------------------------------------------------------------*/
function ChessPlanet({position, onClick, hovered, setHovered}) {
  const planetRef = useRef();
  const glowRef = useRef();
  const sparkRef = useRef();
  const textRef = useRef();

  const radius = 2.2;

  // Use chess texture with bump map
  const {map: chessMap, bump: chessBump} = useChessTexture({
    size: 2048,
    squares: 16,
  });

  // orbit sparkles - golden for chess theme
  const sparkData = useMemo(
    () =>
      [...Array(20)].map(() => ({
        angle: Math.random() * Math.PI * 2,
        radius: radius * (1.4 + Math.random() * 0.5),
        speed: 0.1 + Math.random() * 0.25,
        y: -0.4 + Math.random() * 1.3,
        size: 0.04 + Math.random() * 0.04,
      })),
    []
  );

  useFrame(({clock, camera}, delta) => {
    const t = clock.getElapsedTime();

    // rotation & float
    if (planetRef.current) {
      planetRef.current.rotation.y = t * 0.1;
      planetRef.current.position.y = position[1] + Math.sin(t * 0.42) * 0.2;
    }

    // glow animation
    if (glowRef.current) {
      glowRef.current.material.opacity =
        0.16 + Math.sin(t * 1.1) * 0.04 + (hovered ? 0.06 : 0);
      glowRef.current.scale.setScalar(1.06 + Math.sin(t * 0.55) * 0.012);
    }

    // sparks
    if (sparkRef.current) {
      sparkRef.current.children.forEach((m, i) => {
        const s = sparkData[i];
        s.angle += delta * s.speed;
        m.position.set(
          Math.cos(s.angle) * s.radius,
          s.y + Math.sin(t * 1.7 + i) * 0.04,
          Math.sin(s.angle) * s.radius
        );
      });
    }

    // billboard text
    if (textRef.current) {
      textRef.current.quaternion.copy(camera.quaternion);
      textRef.current.position.y = radius * 1.35 + Math.sin(t * 1.15) * 0.03;
    }
  });

  return (
    <group position={position}>
      {/* ♟️ Chess planet with chessboard texture */}
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
        <sphereGeometry args={[radius, 256, 256]} />
        <meshStandardMaterial
          map={chessMap}
          bumpMap={chessBump}
          bumpScale={0.015}
          roughness={0.38}
          metalness={0.12}
          emissive={hovered ? "#d4af37" : "#000000"}
          emissiveIntensity={hovered ? 0.18 : 0}
        />
      </mesh>

      {/* 🌌 golden glow atmosphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[radius * 1.07, 128, 128]} />
        <meshBasicMaterial
          color="#d4af37"
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* ✨ golden sparkles */}
      <group ref={sparkRef}>
        {sparkData.map((s, i) => (
          <mesh key={i}>
            <sphereGeometry args={[s.size, 8, 8]} />
            <meshBasicMaterial color="#d4af37" transparent opacity={0.88} />
          </mesh>
        ))}
      </group>

      {/* ♔ Chess King Model sitting on the planet */}
      <group position={[0, radius * 0.88, 0]} scale={0.6}>
        <ChessKing color="#f5f5f5" accent="#d4af37" position={[0, 0, 0]} />
        {/* Spotlight for the king */}
        <pointLight
          position={[0, 2.5, 0]}
          intensity={1.2}
          color="#ffd700"
          distance={6}
        />
      </group>

      {/* 🏷 billboard label */}
      <Text
        ref={textRef}
        fontSize={0.6}
        color="#d4af37"
        outlineWidth={0.12}
        outlineColor="#000000"
        anchorX="center"
        anchorY="middle"
        maxWidth={6}
        renderOrder={999}
      >
        CHESS
      </Text>

      {/* 💡 lights */}
      <pointLight
        position={[3.5, 4.5, 3]}
        intensity={hovered ? 2.0 : 1.7}
        distance={20}
        color="#ffd700"
      />
      <ambientLight intensity={0.22} />
    </group>
  );
}

export default function FloatingIsland({
  position,
  sportName,
  icon,
  color,
  onClick,
}) {
  const groupRef = useRef();
  const islandRef = useRef();
  const glowRef = useRef();
  const textRef = useRef();
  const textBgRef = useRef();
  const [hovered, setHovered] = useState(false);
  const textZOffset = useRef(0);

  // Special rendering for BASKETBALL - Premium Spherical Planet
  if (sportName === "BASKETBALL") {
    return (
      <BasketballPlanet
        position={position}
        onClick={onClick}
        hovered={hovered}
        setHovered={setHovered}
      />
    );
  }

  // Special rendering for CRICKET - Premium Spherical Planet
  if (sportName === "CRICKET") {
    return (
      <CricketPlanet
        position={position}
        onClick={onClick}
        hovered={hovered}
        setHovered={setHovered}
      />
    );
  }

  // Special rendering for BADMINTON - Premium Spherical Planet
  if (sportName === "BADMINTON") {
    return (
      <BadmintonPlanet
        position={position}
        onClick={onClick}
        hovered={hovered}
        setHovered={setHovered}
      />
    );
  }

  // Special rendering for HANDBALL - Premium Spherical Planet
  if (sportName === "HANDBALL") {
    return (
      <HandballPlanet
        position={position}
        onClick={onClick}
        hovered={hovered}
        setHovered={setHovered}
      />
    );
  }

  // Special rendering for FOOTBALL - Premium Spherical Planet
  if (sportName === "FOOTBALL") {
    return (
      <FootballPlanet
        position={position}
        onClick={onClick}
        hovered={hovered}
        setHovered={setHovered}
      />
    );
  }

  // Special rendering for VOLLEYBALL - Premium Spherical Planet
  if (sportName === "VOLLEYBALL") {
    return (
      <VolleyballPlanet
        position={position}
        onClick={onClick}
        hovered={hovered}
        setHovered={setHovered}
      />
    );
  }

  // Special rendering for CHESS - Premium Spherical Planet with King
  if (sportName === "CHESS") {
    return (
      <ChessPlanet
        position={position}
        onClick={onClick}
        hovered={hovered}
        setHovered={setHovered}
      />
    );
  }

  // Special rendering for POWERLIFTING - Premium Metal Planet with Dumbbells
  if (sportName === "POWERLIFTING") {
    return (
      <PowerliftingPlanet position={position} onClick={onClick} radius={2.3} />
    );
  }

  // Special rendering for TABLE TENNIS - Premium Green Planet with Bats
  if (sportName === "TABLE TENNIS") {
    return (
      <TableTennisPlanet position={position} onClick={onClick} radius={2.3} />
    );
  }

  // Special rendering for ATHLETICS - Premium Track Planet with Runners
  if (sportName === "ATHLETICS") {
    return (
      <AthleticsPlanet position={position} onClick={onClick} radius={2.5} />
    );
  }

  // Special rendering for CARROM - Premium Carrom Board Planet
  if (sportName === "CARROM") {
    return <CarromPlanet position={position} onClick={onClick} radius={2.5} />;
  }

  // Special rendering for KABADDI - Premium Kho-Kho Planet
  if (sportName === "KABADDI") {
    return <KhoKhoPlanet position={position} onClick={onClick} radius={2.5} />;
  }

  // Floating and rotation animation for other sports
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // NO floating motion - keep fixed on orbit
    // Planets stay at their orbital position

    // Slow rotation
    if (islandRef.current) {
      islandRef.current.rotation.y = time * 0.2;
    }

    // Pulsing glow
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.1);
    }

    // Smooth text animation - moves forward when hovered
    const targetZ = hovered ? 3 : 0;
    textZOffset.current += (targetZ - textZOffset.current) * 0.12;

    if (textRef.current) {
      textRef.current.position.z = textZOffset.current;
    }
    if (textBgRef.current) {
      textBgRef.current.position.z = textZOffset.current - 0.1;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Glowing sphere underneath - BIGGER */}
      <Sphere ref={glowRef} args={[3.5, 32, 32]} position={[0, -0.8, 0]}>
        <meshBasicMaterial
          color="#ffb36a"
          transparent
          opacity={hovered ? 0.25 : 0.15}
        />
      </Sphere>

      {/* Main island platform - MUCH BIGGER */}
      <group ref={islandRef}>
        <RoundedBox
          args={[6, 0.8, 6]}
          radius={0.15}
          smoothness={4}
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
          <meshStandardMaterial
            color={color || "#1a1a1a"}
            metalness={0.9}
            roughness={0.1}
            emissive="#ffb36a"
            emissiveIntensity={hovered ? 0.6 : 0.4}
            envMapIntensity={1.5}
          />
        </RoundedBox>

        {/* Sport field/court on top - Enhanced & BIGGER */}
        <RoundedBox
          args={[5.2, 0.2, 5.2]}
          radius={0.08}
          smoothness={4}
          position={[0, 0.5, 0]}
        >
          <meshStandardMaterial
            color={color || "#2d5016"}
            metalness={0.2}
            roughness={0.6}
            emissive={color || "#2d5016"}
            emissiveIntensity={0.2}
          />
        </RoundedBox>

        {/* Text on planet surface - ONLY FOR CHESS */}
        {sportName === "CHESS" && (
          <>
            <Text
              position={[0, 0.62, 1.8]}
              fontSize={0.4}
              color="#ffd700"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.05}
              outlineColor="#000000"
              rotation={[-Math.PI / 2, 0, 0]}
              maxWidth={4}
            >
              CHESS
            </Text>
            <Text
              position={[0, 0.62, -1.8]}
              fontSize={0.35}
              color="#e0e0e0"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.04}
              outlineColor="#000000"
              rotation={[-Math.PI / 2, 0, Math.PI]}
              maxWidth={4}
            >
              STRATEGY GAME
            </Text>
            <Text
              position={[1.8, 0.62, 0]}
              fontSize={0.3}
              color="#b8860b"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.03}
              outlineColor="#000000"
              rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
              maxWidth={4}
            >
              64 SQUARES
            </Text>
            <Text
              position={[-1.8, 0.62, 0]}
              fontSize={0.3}
              color="#b8860b"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.03}
              outlineColor="#000000"
              rotation={[-Math.PI / 2, 0, Math.PI / 2]}
              maxWidth={4}
            >
              MIND SPORT
            </Text>
          </>
        )}

        {/* 3D Sport Model - BIGGER */}
        <group scale={1.8}>
          <SportModel sportName={sportName} />
        </group>

        {/* Golden edge glow - BIGGER */}
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[3.6, 0.08, 16, 100]} />
          <meshBasicMaterial color="#ffb36a" />
        </mesh>

        {/* Floating particles around island - MORE & BIGGER */}
        {[...Array(12)].map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const radius = 3.8;
          return (
            <Sphere
              key={i}
              args={[0.08, 8, 8]}
              position={[
                Math.cos(angle) * radius,
                0.5 + Math.sin(i) * 0.4,
                Math.sin(angle) * radius,
              ]}
            >
              <meshBasicMaterial color="#ffb36a" />
            </Sphere>
          );
        })}
      </group>

      {/* Sport name text - BIGGER - Always faces camera (billboard) */}
      <Text
        ref={textRef}
        position={[0, 2.2, 0]}
        fontSize={0.7}
        color="#ffb36a"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.1}
        outlineColor="#000000"
        fillOpacity={1}
        renderOrder={999}
      >
        {sportName}
      </Text>

      {/* Glowing background for text - billboard */}
      <mesh ref={textBgRef} position={[0, 2.2, -0.1]} renderOrder={998}>
        <planeGeometry args={[sportName.length * 0.55, 1.3]} />
        <meshBasicMaterial
          color="#ffb36a"
          transparent
          opacity={hovered ? 0.3 : 0.15}
          depthWrite={false}
        />
      </mesh>

      {/* Point light for island - STRONGER */}
      <pointLight
        position={[0, 3, 0]}
        intensity={hovered ? 3.5 : 2.5}
        distance={12}
        color="#ffb36a"
      />
    </group>
  );
}
