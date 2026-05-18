import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ParticleField } from "../three/effects/ParticleField";

export default function Slide27QA() {
  const earthRef = useRef<THREE.Group>(null);

  // Generate nodes on the surface of the sphere
  const nodes = useMemo(() => {
    const arr = [];
    const radius = 2.5;
    for (let i = 0; i < 50; i++) {
      const phi = Math.acos(-1 + (2 * i) / 50);
      const theta = Math.sqrt(50 * Math.PI) * phi;
      arr.push([
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi),
      ]);
    }
    return arr;
  }, []);

  const lineGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i][0] - nodes[j][0];
        const dy = nodes[i][1] - nodes[j][1];
        const dz = nodes[i][2] - nodes[j][2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 1.8) {
          points.push(new THREE.Vector3(...nodes[i]));
          points.push(new THREE.Vector3(...nodes[j]));
        }
      }
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [nodes]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (earthRef.current) {
      earthRef.current.rotation.y = t * 0.1; // Slow rotation
      earthRef.current.rotation.x = Math.sin(t * 0.1) * 0.2; // Slight wobble
    }
  });

  return (
    <group>
      {/* Background stars */}
      <ParticleField count={800} color="#ffffff" speed={0.1} spread={30} />

      {/* Earth / Global Network */}
      <group ref={earthRef}>
        {/* Core Sphere */}
        <mesh>
          <sphereGeometry args={[2.45, 64, 64]} />
          <meshStandardMaterial color="#203A5F" metalness={0.5} roughness={0.8} />
        </mesh>

        {/* Nodes */}
        {nodes.map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#165D9E" emissive="#165D9E" emissiveIntensity={0.8} />
          </mesh>
        ))}

        {/* Edges */}
        <lineSegments geometry={lineGeometry}>
          <lineBasicMaterial color="#165D9E" transparent opacity={0.15} />
        </lineSegments>
      </group>
    </group>
  );
}
