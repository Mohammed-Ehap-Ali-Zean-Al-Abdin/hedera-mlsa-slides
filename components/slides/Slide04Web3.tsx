import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NetworkGraph } from "../three/effects/NetworkGraph";

export default function Slide04Web3() {
  const shardsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (shardsRef.current) {
      shardsRef.current.children.forEach((child, i) => {
        child.position.y += Math.sin(t + i) * 0.005;
        child.rotation.x += 0.01;
        child.rotation.y += 0.01;
      });
    }
  });

  // Create P2P Mesh
  const nodes = [
    { id: 0, position: [-3, 2, 0] as [number, number, number] },
    { id: 1, position: [3, 2, 1] as [number, number, number] },
    { id: 2, position: [-2, -2, 2] as [number, number, number] },
    { id: 3, position: [2, -2, -1] as [number, number, number] },
    { id: 4, position: [0, 3, -2] as [number, number, number] },
    { id: 5, position: [0, -3, 1] as [number, number, number] },
  ];
  
  const edges = [
    { source: 0, target: 1 }, { source: 0, target: 2 }, { source: 0, target: 4 },
    { source: 1, target: 3 }, { source: 1, target: 4 }, { source: 2, target: 5 },
    { source: 3, target: 5 }, { source: 2, target: 3 }, { source: 4, target: 5 }
  ];

  return (
    <group>
      {/* Shattered Central Server */}
      <group ref={shardsRef}>
        {[...Array(10)].map((_, i) => (
          <mesh key={i} position={[(Math.random()-0.5)*4, (Math.random()-0.5)*4, (Math.random()-0.5)*4]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color="#737373" transparent opacity={0.5} />
          </mesh>
        ))}
      </group>

      {/* P2P Network connecting users */}
      <NetworkGraph nodes={nodes} edges={edges} nodeColor="#165D9E" edgeColor="#165D9E" autoRotate={false} />

      {/* Users holding Data Cubes */}
      {nodes.map((node, i) => (
        <group key={`user-${i}`} position={node.position}>
          {/* User representation */}
          <mesh position={[0, -0.5, 0]}>
            <cylinderGeometry args={[0.3, 0.4, 0.8, 16]} />
            <meshStandardMaterial color="#737373" />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="#737373" />
          </mesh>
          {/* Glowing Data Cube */}
          <mesh position={[0.5, 0, 0.5]}>
            <icosahedronGeometry args={[0.2]} />
            <meshStandardMaterial color="#165D9E" emissive="#165D9E" emissiveIntensity={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
