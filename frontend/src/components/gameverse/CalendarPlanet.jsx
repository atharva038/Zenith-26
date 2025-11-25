// CalendarPlanet.jsx
import React, {useMemo, useRef} from "react";
import {Text} from "@react-three/drei";
import {useFrame} from "@react-three/fiber";
import * as THREE from "three";

/* -------------------------------------------------------
   🗓️ PROCEDURAL CALENDAR TEXTURE (super unique)
-------------------------------------------------------- */
function useCalendarTexture(size = 2048) {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d", {willReadFrequently: true});

    ctx.fillStyle = "#1d1d1d";
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 6;
    ctx.font = "bold 90px Sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Month ring
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    const center = size / 2;

    months.forEach((m, i) => {
      const angle = (i / 12) * Math.PI * 2;
      const x = center + Math.cos(angle) * 600;
      const y = center + Math.sin(angle) * 600;
      ctx.fillStyle = "#eaeaea";
      ctx.fillText(m, x, y);
    });

    // Date ring
    for (let d = 1; d <= 31; d++) {
      const angle = (d / 31) * Math.PI * 2;
      const x = center + Math.cos(angle) * 450;
      const y = center + Math.sin(angle) * 450;
      ctx.fillStyle = d === 16 ? "#ff3d3d" : "#c8c8c8"; // 16th highlighted
      ctx.fillText(String(d), x, y);
    }

    // Lines radiating from center
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    for (let i = 0; i < 90; i++) {
      const angle = (i / 90) * Math.PI * 2;
      const x = center + Math.cos(angle) * 1000;
      const y = center + Math.sin(angle) * 1000;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 16;
    return tex;
  }, []);
}

/* -------------------------------------------------------
   🗓️ Floating Sticky Note
-------------------------------------------------------- */
function StickyNote({color = "#ffd966", scale = 1}) {
  return (
    <mesh scale={scale}>
      <planeGeometry args={[0.45, 0.45]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

/* -------------------------------------------------------
   🕒 Small Clock Icon
-------------------------------------------------------- */
function ClockIcon({scale = 1}) {
  return (
    <mesh scale={scale}>
      <circleGeometry args={[0.3, 32]} />
      <meshStandardMaterial color="#ffffff" />
    </mesh>
  );
}

/* -------------------------------------------------------
   🌍 Calendar Planet
-------------------------------------------------------- */
export default function CalendarPlanet({
  position = [0, 0, 0],
  radius = 2.5,
  onClick,
}) {
  const groupRef = useRef();
  const planetRef = useRef();
  const glowRef = useRef();
  const orbitNotesRef = useRef();
  const orbitClocksRef = useRef();
  const topIconRef = useRef();
  const textRef = useRef();

  const calendarTex = useCalendarTexture();

  // Orbit items
  const noteCount = 10;
  const notes = useMemo(
    () =>
      [...Array(noteCount)].map((_, i) => ({
        angle: (i / noteCount) * Math.PI * 2,
        lift: Math.random() * 0.3 - 0.15,
      })),
    []
  );

  const clockCount = 12;
  const clocks = useMemo(
    () =>
      [...Array(clockCount)].map((_, i) => ({
        angle: (i / clockCount) * Math.PI * 2,
        offset: Math.random() * 0.5 - 0.25,
      })),
    []
  );

  // Animation
  useFrame(({clock, camera}) => {
    const t = clock.getElapsedTime();

    // NO floating motion - keep fixed on orbit
    // Removed: groupRef.current.position.y = position[1] + Math.sin(t * 0.8) * 0.22;

    // rotate planet
    if (planetRef.current) planetRef.current.rotation.y = t * 0.12;

    // glow
    if (glowRef.current)
      glowRef.current.material.opacity = 0.1 + Math.sin(t * 1.5) * 0.04;

    // orbit sticky notes
    if (orbitNotesRef.current) orbitNotesRef.current.rotation.y = t * 0.4;

    // orbit clocks in opposite direction
    if (orbitClocksRef.current) orbitClocksRef.current.rotation.y = -t * 0.33;

    // floating top date icon (relative to planet surface)
    if (topIconRef.current) {
      topIconRef.current.position.y = radius * 1.15 + Math.sin(t * 2) * 0.1;
      topIconRef.current.rotation.y = t * 1.2;
    }

    // billboard text
    if (textRef.current) textRef.current.quaternion.copy(camera.quaternion);
  });

  return (
    <group ref={groupRef} position={position} onClick={onClick}>
      {/* Planet */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[radius, 128, 128]} />
        <meshStandardMaterial
          map={calendarTex}
          roughness={0.45}
          metalness={0.3}
          color="#2a2a2a"
        />
      </mesh>

      {/* Glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[radius * 1.08, 128, 128]} />
        <meshBasicMaterial
          color="#ffdd88"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Orbiting Sticky Notes */}
      <group ref={orbitNotesRef}>
        {notes.map((n, i) => (
          <group
            key={i}
            position={[
              Math.cos(n.angle) * (radius + 1),
              n.lift,
              Math.sin(n.angle) * (radius + 1),
            ]}
            rotation={[0, -n.angle, 0]}
          >
            <StickyNote scale={0.6} />
          </group>
        ))}
      </group>

      {/* Orbiting Clocks */}
      <group ref={orbitClocksRef}>
        {clocks.map((c, i) => (
          <group
            key={i}
            position={[
              Math.cos(c.angle) * (radius + 1.45),
              c.offset,
              Math.sin(c.angle) * (radius + 1.45),
            ]}
            rotation={[0, -c.angle, 0]}
          >
            <ClockIcon scale={0.4} />
          </group>
        ))}
      </group>

      {/* Floating Top Date Icon */}
      <group
        ref={topIconRef}
        position={[0, radius * 1.15, 0]}
        scale={[1.3, 1.3, 1.3]}
      >
        <StickyNote color="#ff4d4d" scale={1.2} />
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.6}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          16
        </Text>
      </group>

      {/* Label */}
      <Text
        ref={textRef}
        position={[0, radius * 1.5, 0]}
        fontSize={0.7}
        color="#ffdd88"
        outlineWidth={0.1}
        outlineColor="#000000"
      >
        CALENDAR
      </Text>

      {/* Lights */}
      <pointLight position={[4, 4, 4]} intensity={1.6} color="#ffdd88" />
      <ambientLight intensity={0.2} />
    </group>
  );
}
