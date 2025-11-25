import {useEffect, useRef} from "react";
import * as THREE from "three";

export default function ThreeScene() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    // Make scene background transparent so stadium image shows through
    scene.background = null;
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      300
    );
    camera.position.set(0, 3.2, 20);
    cameraRef.current = camera;

    // Renderer setup with proper alpha transparency
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap for performance
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.setClearColor(0x000000, 0); // Transparent background

    // Add canvas to container
    if (containerRef.current) {
      containerRef.current.appendChild(renderer.domElement);
      console.log("Canvas added to container:", renderer.domElement);
    }
    rendererRef.current = renderer;

    // Lights - Brighter for visibility over stadium background
    const ambient = new THREE.AmbientLight(0xffd6b0, 0.4);
    scene.add(ambient);

    const rim1 = new THREE.DirectionalLight(0xffa86b, 1.5);
    rim1.position.set(10, 8, 8);
    scene.add(rim1);

    const rim2 = new THREE.DirectionalLight(0xff9a50, 1.2);
    rim2.position.set(-10, 8, -8);
    scene.add(rim2);

    // Stadium spotlights - brighter and more visible
    function addStadiumLight(x, z, height = 16, coneOpacity = 0.08) {
      const spot = new THREE.SpotLight(0xffb86b, 8, 120, Math.PI / 5.5, 0.8, 1);
      spot.position.set(x, height, z);
      spot.target.position.set(0, -1.6, 0);
      scene.add(spot.target);
      scene.add(spot);

      const coneGeo = new THREE.ConeGeometry(6.2, height, 24, 1, true);
      const coneMat = new THREE.MeshBasicMaterial({
        color: 0xff9a3a,
        transparent: true,
        opacity: coneOpacity,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.set(x, height / 2 - 1, z);
      cone.lookAt(0, -1.6, 0);
      scene.add(cone);
      return {spot, cone};
    }

    const lights = [
      addStadiumLight(22, 12, 18, 0.09),
      addStadiumLight(-22, 12, 18, 0.09),
      addStadiumLight(20, -14, 18, 0.08),
      addStadiumLight(-20, -14, 18, 0.08),
    ];

    // Ground
    const groundGeo = new THREE.PlaneGeometry(200, 200, 2, 2);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x2a1a11,
      roughness: 0.9,
      metalness: 0.05,
      emissive: 0x2a160c,
      emissiveIntensity: 0.02,
      side: THREE.DoubleSide,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2.45;
    scene.add(ground);

    // Grid - more visible
    const grid = new THREE.GridHelper(80, 40, 0xffb36b, 0x3a2b24);
    grid.position.y = -2.44;
    grid.material.opacity = 0.15;
    grid.material.transparent = true;
    scene.add(grid);

    // Scan line - brighter
    const scanGeo = new THREE.PlaneGeometry(60, 0.06);
    const scanMat = new THREE.MeshBasicMaterial({
      color: 0xffb36b,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });
    const scan = new THREE.Mesh(scanGeo, scanMat);
    scan.rotation.x = -Math.PI / 2;
    scan.position.y = -2.42;
    scene.add(scan);

    // Halo rings - brighter
    const haloGroup = new THREE.Group();
    haloGroup.position.y = -0.8;
    scene.add(haloGroup);

    function makeHalo(radius, thickness, opacity) {
      const geo = new THREE.RingGeometry(radius, radius + thickness, 64);
      const mat = new THREE.MeshBasicMaterial({
        color: 0xffa24a,
        transparent: true,
        opacity,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = -Math.PI / 2;
      return mesh;
    }

    haloGroup.add(makeHalo(2.6, 0.1, 0.7));
    haloGroup.add(makeHalo(4.2, 0.12, 0.5));
    haloGroup.add(makeHalo(6.0, 0.14, 0.3));

    // Ball textures
    function canvasTexture(drawFn, size = 1024) {
      const c = document.createElement("canvas");
      c.width = c.height = size;
      const ctx = c.getContext("2d");
      drawFn(ctx, size);
      const tex = new THREE.CanvasTexture(c);
      tex.encoding = THREE.sRGBEncoding;
      tex.needsUpdate = true;
      return tex;
    }

    // Cricket ball
    const cricketTex = canvasTexture((ctx, s) => {
      const r = s / 2;
      ctx.fillStyle = "#b22222";
      ctx.beginPath();
      ctx.arc(r, r, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = s * 0.03;
      ctx.beginPath();
      ctx.ellipse(r, r, r * 0.88, r * 0.55, 0.25, -2, 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(r, r, r * 0.88, r * 0.55, -0.25, -2, 2);
      ctx.stroke();
    });

    // Basketball
    const basketballTex = canvasTexture((ctx, s) => {
      const r = s / 2;
      ctx.fillStyle = "#ff8b2b";
      ctx.beginPath();
      ctx.arc(r, r, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#241b18";
      ctx.lineWidth = s * 0.04;
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(r, s);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(r, r, r * 0.95, r * 0.4, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(r, r, r * 0.95, r * 0.55, 0.8, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Volleyball
    const volleyballTex = canvasTexture((ctx, s) => {
      const r = s / 2;
      ctx.fillStyle = "#f8f6f2";
      ctx.beginPath();
      ctx.arc(r, r, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ff9a3a";
      ctx.lineWidth = s * 0.03;
      ctx.beginPath();
      ctx.ellipse(r, r, r * 0.9, r * 0.45, 0.5, -2.2, 2.2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(r, r, r * 0.7, r * 0.3, -0.6, -2.4, 2.4);
      ctx.stroke();
    });

    // Create balls - more visible with emissive glow
    const balls = [];

    function createBall(radius, tex, initPos, spin) {
      const mat = new THREE.MeshStandardMaterial({
        map: tex,
        metalness: 0.3,
        roughness: 0.4,
        emissive: 0xff9944,
        emissiveIntensity: 0.15,
      });
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 64, 32),
        mat
      );
      mesh.position.copy(initPos);
      scene.add(mesh);
      // Store initial position for animation
      balls.push({mesh, spin, initialPos: initPos.clone()});
      return mesh;
    }

    createBall(0.75, cricketTex, new THREE.Vector3(-3.2, 0.6, -1.6), 0.06);
    createBall(0.95, basketballTex, new THREE.Vector3(0.8, 0.85, -0.2), 0.035);
    createBall(0.85, volleyballTex, new THREE.Vector3(3.2, 0.65, 1.2), 0.015);

    console.log("Three.js scene initialized with", balls.length, "balls");
    console.log("Starting animation loop...");

    // Mouse interaction
    let mouseX = 0,
      mouseY = 0;
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 1.6;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.9;
    };
    document.addEventListener("mousemove", handleMouseMove);

    // Animation
    let intro = 0;
    let frameCount = 0;
    let startTime = Date.now();

    function animate() {
      animationFrameRef.current = requestAnimationFrame(animate);

      // Get elapsed time in seconds since animation started
      const elapsedTime = (Date.now() - startTime) * 0.001;

      // Debug log every 60 frames
      frameCount++;
      if (frameCount % 60 === 0) {
        console.log(
          "Animation running, frame:",
          frameCount,
          "intro:",
          intro.toFixed(2)
        );
        if (balls.length > 0) {
          console.log(
            "Ball 0 rotation:",
            balls[0].mesh.rotation.y.toFixed(2),
            "position:",
            balls[0].mesh.position.y.toFixed(2)
          );
        }
        console.log("Halo rotation:", haloGroup.rotation.z.toFixed(2));
        console.log("Elapsed time:", elapsedTime.toFixed(2), "seconds");
      }

      if (intro < 1) {
        intro += 0.007;
        camera.position.z = 26 - intro * 6;
        camera.position.y = 5.2 - intro * 2;
      }

      camera.position.x += (mouseX - camera.position.x) * 0.04;
      camera.position.y += (mouseY + 1.6 - camera.position.y) * 0.03;
      camera.lookAt(0, 0.2, 0);

      // Use elapsed time for all animations (not Date.now() directly)

      // Halo rotation - slow and visible
      haloGroup.rotation.z = elapsedTime * 0.3;

      // Scan line movement
      scan.position.x = Math.sin(elapsedTime * 0.9) * 9.2;
      scan.rotation.z = Math.sin(elapsedTime * 0.65) * 0.017;

      // Cone breathing - more visible
      lights.forEach((l, i) => {
        const baseOpacity = i < 2 ? 0.09 : 0.08;
        l.cone.material.opacity =
          baseOpacity + Math.sin(elapsedTime * 0.5 + i) * 0.015;
      });

      // Animate balls with rotation and floating motion
      balls.forEach((b, i) => {
        // Continuous rotation
        b.mesh.rotation.y += b.spin;
        b.mesh.rotation.x += b.spin * 0.35;

        // Floating motion based on initial position
        const floatOffset = Math.sin(elapsedTime * 1.2 + i * 0.9) * 0.15;
        const driftOffset = Math.sin(elapsedTime * 0.7 + i) * 0.08;

        b.mesh.position.y = b.initialPos.y + floatOffset;
        b.mesh.position.x = b.initialPos.x + driftOffset;
      });

      renderer.render(scene, camera);
    }

    console.log("Calling animate() to start animation loop");
    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-[50] pointer-events-none"
    />
  );
}
