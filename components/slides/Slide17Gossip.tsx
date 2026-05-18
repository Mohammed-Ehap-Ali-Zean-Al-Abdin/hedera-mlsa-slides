import { useState, useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";

export default function Slide17Gossip() {
  const [running, setRunning] = useState(false);
  const [activeNodes, setActiveNodes] = useState<Set<number>>(new Set());
  const [edges, setEdges] = useState<{ s: number; t: number; time: number }[]>([]);
  
  // Simplified from 15 to 6 nodes for a clearer, easy-to-follow visualization
  const numNodes = 6; 
  const nodes = useMemo(() => {
    return Array.from({ length: numNodes }).map((_, i) => {
      const angle = (i / numNodes) * Math.PI * 2;
      return {
        id: i,
        // Slightly larger radius so it's spacious
        pos: [Math.cos(angle) * 3.5, Math.sin(angle) * 3.5, 0] as [number, number, number],
      };
    });
  }, [numNodes]);

  // Use useFrame to force re-renders for the fading laser edges
  const [, setTick] = useState(0);
  useFrame(() => {
    if (edges.length > 0) {
      setTick(t => t + 1);
    }
  });

  const handleStart = () => {
    setRunning(true);
    setActiveNodes(new Set([0])); // Start with node 0
    setEdges([]);
    
    // Simulate gossip protocol (1 sync per round)
    let currentInformed = [0];
    
    const interval = setInterval(() => {
      const nextInformed = [...currentInformed];
      const newEdges: { s: number; t: number; time: number }[] = [];
      
      currentInformed.forEach(informedId => {
        // In real Hashgraph, each member picks ONE random other member to sync with
        const targetId = Math.floor(Math.random() * numNodes);
        if (targetId !== informedId) {
          newEdges.push({ s: informedId, t: targetId, time: Date.now() });
          if (!nextInformed.includes(targetId)) {
            nextInformed.push(targetId);
          }
        }
      });
      
      currentInformed = nextInformed;
      setActiveNodes(new Set(currentInformed));
      setEdges((prev) => [...prev, ...newEdges]);
      
      if (currentInformed.length === numNodes) {
        clearInterval(interval);
        setTimeout(() => setRunning(false), 1500);
      }
    }, 1000); // 1000ms per round for a deliberate, understandable pace
  };

  const handleReset = () => {
    setRunning(false);
    setActiveNodes(new Set());
    setEdges([]);
  };

  return (
    <group>
      {nodes.map((node) => (
        <group key={node.id} position={node.pos}>
          <mesh>
            <sphereGeometry args={[0.4, 32, 32]} />
            <meshStandardMaterial 
              color={activeNodes.has(node.id) ? "#10b981" : "#4b5563"} 
              emissive={activeNodes.has(node.id) ? "#10b981" : "#000000"}
              emissiveIntensity={0.6}
            />
          </mesh>
          <Html position={[0, -0.7, 0]} center zIndexRange={[100, 0]}>
            <div className="text-white/70 font-mono text-sm font-bold">
              Node {node.id}
            </div>
          </Html>
        </group>
      ))}

      {/* Render active edges (syncing connections) */}
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

        // Fade out edges slower so user can see them
        const age = (Date.now() - e.time) / 1000;
        if (age > 1.5) return null;

        return (
          <mesh key={i} position={midPoint} rotation={euler}>
            <cylinderGeometry args={[0.03, 0.03, distance, 8]} />
            <meshBasicMaterial color="#3b82f6" transparent opacity={1 - age/1.5} blending={THREE.AdditiveBlending} />
          </mesh>
        );
      })}

      <Html position={[0, -5.5, 0]} center zIndexRange={[100, 0]}>
        <div className="glass-panel p-4 flex gap-4 items-center">
          <button 
            onClick={handleStart} 
            disabled={running || activeNodes.size === numNodes}
            className="bg-[#10b981] hover:bg-[#059669] text-black px-6 py-2 rounded-lg font-bold disabled:opacity-50 min-w-[140px] transition-colors"
          >
            {activeNodes.size === numNodes ? "Network Synced" : "Start Gossip"}
          </button>
          <button 
            onClick={handleReset}
            disabled={running}
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-bold disabled:opacity-50 transition-colors"
          >
            Reset
          </button>
          <div className="text-white font-mono min-w-[120px] bg-black/30 px-4 py-2 rounded-lg">
            Synced: {activeNodes.size} / {numNodes}
          </div>
        </div>
      </Html>
    </group>
  );
}
