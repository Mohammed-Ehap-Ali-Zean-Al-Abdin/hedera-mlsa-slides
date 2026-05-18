import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Slide12Session2() {
  const pointsRef = useRef<THREE.InstancedMesh>(null);
  
  // Create an H shape from points
  const count = 1000;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const targetPositions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < count; i++) {
      // Randomly pick one of the three bars of the H
      const part = Math.floor(Math.random() * 3);
      let x = 0, y = 0, z = (Math.random() - 0.5) * 0.5; // slight thickness
      
      if (part === 0) { // Left vertical bar
        x = -1.5 + (Math.random() - 0.5) * 0.4;
        y = (Math.random() - 0.5) * 4;
      } else if (part === 1) { // Right vertical bar
        x = 1.5 + (Math.random() - 0.5) * 0.4;
        y = (Math.random() - 0.5) * 4;
      } else { // Middle horizontal bar
        x = (Math.random() - 0.5) * 3;
        y = (Math.random() - 0.5) * 0.4;
      }
      pos.push(new THREE.Vector3(x, y, z));
    }
    return pos;
  }, [count]);

  const startPositions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < count; i++) {
      pos.push(new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      ));
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    
    // Animation progress (0 to 1 over first 3 seconds)
    const progress = Math.min(t / 3, 1);
    // Easing out cubic
    const ease = 1 - Math.pow(1 - progress, 3);
    
    for (let i = 0; i < count; i++) {
      const start = startPositions[i];
      const target = targetPositions[i];
      
      dummy.position.lerpVectors(start, target, ease);
      
      // Add slight floating effect after formation
      if (progress === 1) {
        dummy.position.y += Math.sin(t * 2 + i) * 0.05;
        dummy.position.x += Math.cos(t * 1.5 + i) * 0.05;
      }
      
      dummy.scale.setScalar(0.05 + Math.sin(t * 5 + i) * 0.02);
      dummy.updateMatrix();
      pointsRef.current.setMatrixAt(i, dummy.matrix);
    }
    pointsRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={pointsRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#737373" emissive="#165D9E" emissiveIntensity={0.8} />
      </instancedMesh>
    </group>
  );
}
