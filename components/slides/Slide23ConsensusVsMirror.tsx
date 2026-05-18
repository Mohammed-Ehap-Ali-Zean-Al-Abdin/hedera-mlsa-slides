import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";

export default function Slide23ConsensusVsMirror() {
  const dataFlowRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (dataFlowRef.current) {
      dataFlowRef.current.children.forEach((packet, i) => {
        // Packets flow from center (Consensus) to outside (Mirror Nodes)
        const angle = (i * Math.PI * 2) / 4; // 4 directions
        const phase = (t + i * 0.5) % 2; // 2 sec loop
        const dist = 1.5 + phase * 2;
        
        packet.position.set(Math.cos(angle) * dist, 0, Math.sin(angle) * dist);
        // Fade out as it reaches the mirror node
        ((packet as THREE.Mesh).material as THREE.Material).opacity = phase < 1.5 ? 1 : 1 - (phase - 1.5) * 2;
      });
    }
  });

  return (
    <group>
      {/* Center: Consensus Network (Write) */}
      <group position={[0, 0, 0]}>
        <mesh rotation={[Math.PI/2, 0, 0]}>
          <torusGeometry args={[1.5, 0.2, 16, 64]} />
          <meshStandardMaterial color="#165D9E" emissive="#165D9E" emissiveIntensity={0.3} />
        </mesh>
        <Html position={[0, 2, 0]} center>
          <div className="bg-black/80 px-4 py-2 rounded text-[#165D9E] font-bold border border-[#165D9E] text-center w-48">
            Consensus Network<br/>
            <span className="text-sm font-normal text-white/70">(Write-only)</span>
          </div>
        </Html>
      </group>

      {/* Data Packets Flowing Out */}
      <group ref={dataFlowRef}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshBasicMaterial color="#165D9E" transparent />
          </mesh>
        ))}
      </group>

      {/* External: Mirror Nodes (Read) */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i * Math.PI * 2) / 4;
        const x = Math.cos(angle) * 4;
        const z = Math.sin(angle) * 4;
        return (
          <group key={`mirror-${i}`} position={[x, 0, z]}>
            <mesh>
              <cylinderGeometry args={[0.8, 0.8, 1.5, 16]} />
              <meshStandardMaterial color="#203A5F" />
            </mesh>
            {/* Database rings */}
            <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.82, 0.82, 0.1, 16]} /><meshStandardMaterial color="#165D9E" /></mesh>
            <mesh position={[0, -0.3, 0]}><cylinderGeometry args={[0.82, 0.82, 0.1, 16]} /><meshStandardMaterial color="#165D9E" /></mesh>
            
            {i === 0 && (
              <Html position={[0, -1.5, 0]} center>
                <div className="bg-black/80 px-4 py-2 rounded text-[#165D9E] font-bold border border-[#165D9E] text-center w-32">
                  Mirror Node<br/>
                  <span className="text-sm font-normal text-white/70">(Read-only)</span>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}
