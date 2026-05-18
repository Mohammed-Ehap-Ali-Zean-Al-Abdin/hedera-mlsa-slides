import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";

export default function Slide18VirtualVoting() {
  const nodes = [
    { pos: [-3, 0, 0], symbol: "Σ" },
    { pos: [-1, 0, 1], symbol: "+" },
    { pos: [1, 0, -1], symbol: "f(x)" },
    { pos: [3, 0, 0], symbol: "=" },
    { pos: [0, 2, 0], symbol: "π" },
  ];

  return (
    <group>
      {nodes.map((node, i) => (
        <group key={i} position={node.pos as [number, number, number]}>
          <mesh>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color="#203A5F" />
          </mesh>
          <Html position={[0, 1, 0]} center>
            <div className="animate-bounce bg-black/50 text-[#165D9E] font-mono text-2xl px-2 py-1 rounded-full border border-[#165D9E]/50">
              {node.symbol}
            </div>
          </Html>
        </group>
      ))}

      {/* Center Checkmark (Result of virtual voting) */}
      <Html position={[0, -2, 0]} center>
        <div className="bg-[#165D9E] text-black font-bold text-4xl w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_20px_#165D9E]">
          ✓
        </div>
      </Html>
      
      {/* Subtext explaining the lack of lines */}
      <Html position={[0, -3.5, 0]} center>
        <div className="text-white/70 font-mono text-sm whitespace-nowrap bg-black/80 px-4 py-2 rounded">
          Notice: No communication lines between nodes. <br/>
          Consensus is calculated locally by each node using the DAG history.
        </div>
      </Html>
    </group>
  );
}
