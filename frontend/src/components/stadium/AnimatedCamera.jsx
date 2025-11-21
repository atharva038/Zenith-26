import {useRef, useState, useEffect} from "react";
import {useFrame} from "@react-three/fiber";
import {PerspectiveCamera} from "@react-three/drei";
import {gsap} from "gsap";
import {useBallTracking} from "./BallTrackingContext";

// ==================== ANIMATED CAMERA WITH BALL TRACKING ====================
export default function AnimatedCamera() {
  const cameraRef = useRef();
  const ballTracking = useBallTracking();
  const [isFollowingBall, setIsFollowingBall] = useState(false);
  const timelineRef = useRef();

  useEffect(() => {
    if (!cameraRef.current) return;

    const camera = cameraRef.current;
    const tl = gsap.timeline({repeat: -1, yoyo: false});
    timelineRef.current = tl;

    // Camera sequence
    tl.to(camera.position, {x: 0, y: 120, z: 0, duration: 0});
    tl.to(camera.position, {
      x: 0,
      y: 60,
      z: 40,
      duration: 4,
      ease: "power2.out",
    });
    tl.to(camera.position, {
      x: -5,
      y: 3,
      z: 10,
      duration: 3,
      ease: "power2.inOut",
    });
    tl.to(camera.position, {x: -5, y: 3, z: 10, duration: 2});
    tl.to(camera.position, {x: -5, y: 3, z: 10, duration: 3});
    tl.to(camera.position, {
      x: 10,
      y: 8,
      z: -34,
      duration: 1,
      ease: "power2.out",
    });
    tl.to(camera.position, {x: -10, y: 8, z: -34, duration: 2, ease: "none"});
    tl.to(camera.position, {
      x: 0,
      y: 50,
      z: 20,
      duration: 2,
      ease: "power2.inOut",
    });
    tl.to(camera.position, {
      x: 0,
      y: 120,
      z: 0,
      duration: 2,
      ease: "power2.in",
    });

    return () => tl.kill();
  }, []);

  useFrame((state) => {
    if (!cameraRef.current) return;

    const camera = cameraRef.current;
    const time = state.clock.elapsedTime;

    if (time >= 9 && time < 12 && ballTracking?.isBallFlying) {
      // Follow ball phase
      if (!isFollowingBall) {
        setIsFollowingBall(true);
        if (timelineRef.current) timelineRef.current.pause();
      }

      const ballPos = ballTracking.ballPosition;
      const progress = ballTracking.flyProgress || 0;

      const offsetDistance = 8 - progress * 3;
      const targetX = ballPos.x - 6;
      const targetY = ballPos.y + 4 + progress * 2;
      const targetZ = ballPos.z + offsetDistance;

      camera.position.x += (targetX - camera.position.x) * 0.1;
      camera.position.y += (targetY - camera.position.y) * 0.1;
      camera.position.z += (targetZ - camera.position.z) * 0.1;

      camera.lookAt(ballPos.x, ballPos.y, ballPos.z);

      if (ballTracking.cameraShake > 0) {
        camera.position.x += (Math.random() - 0.5) * ballTracking.cameraShake;
        camera.position.y += (Math.random() - 0.5) * ballTracking.cameraShake;
        camera.rotation.z += (Math.random() - 0.5) * 0.05;
      }
    } else if (time >= 12 && time < 15) {
      // Celebration phase
      if (isFollowingBall) {
        setIsFollowingBall(false);
        if (timelineRef.current) timelineRef.current.resume();
      }
      camera.lookAt(0, 3, -34);
    } else {
      // Normal timeline
      if (isFollowingBall) {
        setIsFollowingBall(false);
        if (timelineRef.current) timelineRef.current.resume();
      }

      if (time < 9) {
        camera.lookAt(0, 1, 5);
      } else {
        camera.lookAt(0, 0, 0);
      }
    }
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 120, 0]}
      fov={60}
    />
  );
}
