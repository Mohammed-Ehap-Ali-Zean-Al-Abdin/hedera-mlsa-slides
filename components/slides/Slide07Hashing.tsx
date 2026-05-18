import { useState, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";

// Simple hash function for visual purposes
const simpleHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, "0") + 
         Math.abs(hash * 31).toString(16).padStart(8, "0") + 
         Math.abs(hash * 17).toString(16).padStart(8, "0") + 
         Math.abs(hash * 7).toString(16).padStart(8, "0");
};

export default function Slide07Hashing() {
  const [inputText, setInputText] = useState("Hello Web3");
  const tunnelRef = useRef<THREE.Group>(null);
  
  const hashValue = useMemo(() => simpleHash(inputText), [inputText]);

  // Generate color based on hash
  const hashColor = useMemo(() => {
    return `#${hashValue.substring(0, 6)}`;
  }, [hashValue]);

  useFrame((state) => {
    if (tunnelRef.current) {
      tunnelRef.current.children.forEach((ring, i) => {
        ring.rotation.z = state.clock.elapsedTime * (1 + i * 0.2);
      });
    }
  });

  return (
    <group>
      {/* Input Document (Left) */}
      <mesh position={[-4, 0, 0]}>
        <boxGeometry args={[1.5, 2, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
        <Html position={[0, 0, 0.1]} center transform>
          <div className="w-32 h-40 bg-white p-2 text-black text-[10px] font-mono break-words overflow-hidden border-2 border-gray-300">
            {inputText || "Empty Document"}
          </div>
        </Html>
      </mesh>

      {/* SHA-256 Tunnel (Center) */}
      <group ref={tunnelRef} position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        {[...Array(8)].map((_, i) => (
          <mesh key={i} position={[0, 0, (i - 3.5) * 0.4]}>
            <torusGeometry args={[1.2, 0.1, 16, 32]} />
            <meshStandardMaterial color="#6a1b9a" emissive="#6a1b9a" emissiveIntensity={0.5} />
          </mesh>
        ))}
        <Html position={[0, 1.8, 0]} center>
          <div className="text-purple-400 font-bold font-mono bg-black/50 px-2 py-1 rounded border border-purple-500">
            SHA-256
          </div>
        </Html>
      </group>

      {/* Output Hash (Right) */}
      <mesh position={[4, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        {/* The sphere changes color based on the hash */}
        <meshStandardMaterial color={hashColor} emissive={hashColor} emissiveIntensity={0.6} />
        <Html position={[0, -1.8, 0]} center>
          <div className="text-white font-mono text-sm break-all w-48 text-center bg-black/80 p-2 rounded border" style={{ borderColor: hashColor }}>
            {hashValue}
          </div>
        </Html>
      </mesh>

      {/* Interactive UI Form */}
      <Html position={[0, -4, 0]} center zIndexRange={[100, 0]}>
        <div className="glass-panel p-4 w-[500px]">
          <p className="text-white/70 text-sm mb-2 font-mono">Edit document to see avalanche effect:</p>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full bg-black/50 text-white px-3 py-2 rounded border border-white/20 focus:outline-none focus:border-[#00e676] font-mono"
          />
        </div>
      </Html>
    </group>
  );
}
