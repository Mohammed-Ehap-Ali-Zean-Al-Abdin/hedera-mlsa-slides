import { useState, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";

export default function Slide06DLT() {
  const [inputText, setInputText] = useState("");
  const [dataLogs, setDataLogs] = useState<{ id: number; text: string }[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  const handleSend = () => {
    if (!inputText) return;
    const newEntry = { id: Date.now(), text: inputText };
    setDataLogs((prev) => [...prev, newEntry]);
    setInputText("");
    setSyncing(true);
    setSyncProgress(0);
  };

  useFrame((state, delta) => {
    if (syncing) {
      setSyncProgress((p) => {
        const next = p + delta * 0.5; // 2 seconds to reach 1.0
        if (next >= 1) {
          setSyncing(false);
          return 1;
        }
        return next;
      });
    }
  });

  const nodePositions: [number, number, number][] = [
    [0, 2.5, 0],   // Node 1 (Top)
    [-3, -1.5, 0], // Node 2 (Left)
    [3, -1.5, 0],  // Node 3 (Right)
  ];

  return (
    <group>
      {/* 3 Nodes */}
      {nodePositions.map((pos, i) => (
        <group key={`node-${i}`} position={pos}>
          <mesh>
            <sphereGeometry args={[0.6, 32, 32]} />
            <meshStandardMaterial 
              color={i === 0 || syncProgress >= 1 ? "#165D9E" : "#203A5F"} 
              emissive={i === 0 || syncProgress >= 1 ? "#165D9E" : "#000000"} 
              emissiveIntensity={0.5} 
            />
          </mesh>
          <Html position={[0, -1, 0]} center>
            <div className="text-white font-mono text-sm px-2 py-1 bg-black/50 rounded">
              Node {i + 1}
            </div>
            {/* Show data logs on nodes (Nodes 2 & 3 show it only after sync) */}
            <div className="flex flex-col gap-1 mt-2 w-32">
              {dataLogs.map((log) => {
                if (i > 0 && syncing && syncProgress < 1) return null;
                return (
                  <div key={log.id} className="text-xs text-[#165D9E] bg-black/80 px-2 py-1 rounded truncate border border-[#165D9E]/30">
                    {log.text}
                  </div>
                );
              })}
            </div>
          </Html>
        </group>
      ))}

      {/* Syncing Laser Beams (Animated Lines) */}
      {syncing && (
        <>
          {/* Node 1 to Node 2 */}
          <mesh position={[-1.5, 0.5, 0]} rotation={[0, 0, Math.PI / 4 + 0.1]}>
            <cylinderGeometry args={[0.05, 0.05, 4 * syncProgress, 8]} />
            <meshBasicMaterial color="#737373" transparent opacity={0.8} />
          </mesh>
          {/* Node 1 to Node 3 */}
          <mesh position={[1.5, 0.5, 0]} rotation={[0, 0, -Math.PI / 4 - 0.1]}>
            <cylinderGeometry args={[0.05, 0.05, 4 * syncProgress, 8]} />
            <meshBasicMaterial color="#737373" transparent opacity={0.8} />
          </mesh>
        </>
      )}

      {/* Interactive UI Form */}
      <Html position={[0, -4, 0]} center zIndexRange={[100, 0]}>
        <div className="glass-panel p-4 flex gap-2 w-80 items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Enter data to ledger..."
            className="flex-1 bg-black/50 text-white px-3 py-2 rounded border border-white/20 focus:outline-none focus:border-[#165D9E]"
          />
          <button
            onClick={handleSend}
            disabled={!inputText || syncing}
            className="bg-[#165D9E] text-black px-4 py-2 rounded font-bold disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </Html>
    </group>
  );
}
