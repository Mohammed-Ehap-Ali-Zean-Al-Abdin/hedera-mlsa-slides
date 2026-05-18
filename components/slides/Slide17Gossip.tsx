import { useState, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";

export default function Slide17Gossip() {
  const [running, setRunning] = useState(false);
  const [activeNodes, setActiveNodes] = useState<Set<number>>(new Set());
  const [edges, setEdges] = useState<{ s: number; t: number; time: number }[]>([]);
  
  const numNodes = 15;
  const nodes = useMemo(() => {
    return Array.from({ length: numNodes }).map((_, i) => {
      const angle = (i / numNodes) * Math.PI * 2;
      return {
        id: i,
        pos: [Math.cos(angle) * 3, Math.sin(angle) * 3, 0] as [number, number, number],
      };
    });
  }, [numNodes]);

  const handleStart = () => {
    setRunning(true);
    setActiveNodes(new Set([0])); // Start with node 0
    setEdges([]);
    
    // Simulate exponential spread
    let currentInformed = [0];
    let step = 0;
    
    const interval = setInterval(() => {
      step++;
      const nextInformed = [...currentInformed];
      const newEdges: { s: number; t: number; time: number }[] = [];
      
      currentInformed.forEach(informedId => {
        // Each node picks 2 random other nodes to gossip to
        for (let i = 0; i < 2; i++) {
          const targetId = Math.floor(Math.random() * numNodes);
          if (targetId !== informedId) {
            newEdges.push({ s: informedId, t: targetId, time: Date.now() });
            if (!nextInformed.includes(targetId)) {
              nextInformed.push(targetId);
            }
          }
        }
      });
      
      currentInformed = nextInformed;
      setActiveNodes(new Set(currentInformed));
      setEdges((prev) => [...prev, ...newEdges]);
      
      if (currentInformed.length === numNodes) {
        clearInterval(interval);
        setTimeout(() => setRunning(false), 2000);
      }
    }, 500); // 500ms per round
  };

  const handleReset = () => {
    setRunning(false);
    setActiveNodes(new Set());
    setEdges([]);
  };

  return (
    <group>
      {nodes.map((node) => (
        <mesh key={node.id} position={node.pos}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial 
            color={activeNodes.has(node.id) ? "#00e676" : "#0a2540"} 
            emissive={activeNodes.has(node.id) ? "#00e676" : "#000000"}
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}

      {/* Render active edges (laser beams) */}
      {edges.map((e, i) => {
        const source = nodes[e.s].pos;
        const target = nodes[e.t].pos;
        const distance = new THREE.Vector3(...source).distanceTo(new THREE.Vector3(...target));
        const midPoint = [
          (source[0] + target[0]) / 2,
          (source[1] + target[1]) / 2,
          (source[2] + target[2]) / 2,
        ] as [number, number, number];
        
        // Calculate rotation
        const direction = new THREE.Vector3().subVectors(new THREE.Vector3(...target), new THREE.Vector3(...source)).normalize();
        const axis = new THREE.Vector3(0, 1, 0).cross(direction).normalize();
        const angle = Math.acos(new THREE.Vector3(0, 1, 0).dot(direction));
        const quaternion = new THREE.Quaternion().setFromAxisAngle(axis, angle);
        const euler = new THREE.Euler().setFromQuaternion(quaternion);

        // Fade out edges after 1 second
        const age = (Date.now() - e.time) / 1000;
        if (age > 1) return null;

        return (
          <mesh key={i} position={midPoint} rotation={euler}>
            <cylinderGeometry args={[0.02, 0.02, distance, 8]} />
            <meshBasicMaterial color="#6a1b9a" transparent opacity={1 - age} blending={THREE.AdditiveBlending} />
          </mesh>
        );
      })}

      <Html position={[0, -4, 0]} center zIndexRange={[100, 0]}>
        <div className="glass-panel p-4 flex gap-4 items-center">
          <button 
            onClick={handleStart} 
            disabled={running || activeNodes.size === numNodes}
            className="bg-[#00e676] text-black px-4 py-2 rounded font-bold disabled:opacity-50 min-w-[120px]"
          >
            {activeNodes.size === numNodes ? "Network Synced" : "Start Gossip"}
          </button>
          <button 
            onClick={handleReset}
            disabled={running}
            className="bg-white/10 text-white px-4 py-2 rounded font-bold disabled:opacity-50"
          >
            Reset
          </button>
          <div className="text-white font-mono min-w-[100px]">
            Informed: {activeNodes.size} / {numNodes}
          </div>
        </div>
      </Html>
    </group>
  );
}
