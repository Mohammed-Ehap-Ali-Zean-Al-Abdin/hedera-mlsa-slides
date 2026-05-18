import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";

export default function Slide13ConsensusProblem() {
  const nodesRef = useRef<THREE.Group>(null);
  const nodes = Array.from({ length: 12 }).map((_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    return {
      id: i,
      position: [Math.cos(angle) * 3, Math.sin(angle) * 3, 0] as [number, number, number],
      initialNumber: Math.floor(Math.random() * 100),
    };
  });

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (nodesRef.current) {
      nodesRef.current.children.forEach((node, i) => {
        const mesh = node.children[0] as THREE.Mesh;
        // Phase 1 (Disagreement): Flash red and yellow randomly
        // Phase 2 (Consensus): All turn green
        const phase = t % 10;
        
        if (phase < 6) {
          // Disagreement
          const flash = Math.sin(t * 10 + i) > 0;
          (mesh.material as THREE.MeshStandardMaterial).color.setHex(flash ? 0xff1744 : 0xffc107); // Red / Yellow
        } else {
          // Consensus
          (mesh.material as THREE.MeshStandardMaterial).color.setHex(0x00e676); // Green
        }
      });
    }
  });

  return (
    <group>
      <group ref={nodesRef}>
        {nodes.map((node, i) => (
          <group key={i} position={node.position}>
            <mesh>
              <sphereGeometry args={[0.4, 32, 32]} />
              <meshStandardMaterial />
            </mesh>
            <Html position={[0, 0.8, 0]} center>
              <div className="bg-black/80 px-2 py-1 rounded text-white font-mono border border-white/20">
                {/* Dynamically change numbers to show disagreement, then agreement */}
                <NumberDisplay id={i} initial={node.initialNumber} />
              </div>
            </Html>
            {/* Connection lines to center */}
            <mesh position={[-node.position[0]/2, -node.position[1]/2, 0]} rotation={[0, 0, Math.atan2(node.position[1], node.position[0])]}>
              <cylinderGeometry args={[0.02, 0.02, 3]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
            </mesh>
          </group>
        ))}
      </group>
      {/* Center piece */}
      <mesh>
        <torusGeometry args={[0.5, 0.1, 16, 32]} />
        <meshStandardMaterial color="#6a1b9a" />
      </mesh>
    </group>
  );
}

// Separate component for internal state hook
function NumberDisplay({ id, initial }: { id: number, initial: number }) {
  const [val, setVal] = useState(initial);
  
  useEffect(() => {
    let animationFrameId: number;
    const start = Date.now();
    
    const animate = () => {
      const t = (Date.now() - start) / 1000 % 10;
      if (t < 6) {
        // Scramble numbers
        if (Math.floor(t * 10) % 5 === 0) {
          setVal(Math.floor(Math.random() * 100));
        }
      } else {
        // Settled consensus number
        setVal(42);
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return <span>{val}</span>;
}

import { useState, useEffect } from "react";
