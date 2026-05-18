import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ParticleField } from "../three/effects/ParticleField";
import { Html } from "@react-three/drei";

export default function Slide14PoW() {
  const [winner, setWinner] = useState<number | null>(null);
  const gearsRef = useRef<THREE.Group>(null);
  const blockRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    let interval: number;
    const startCycle = () => {
      setWinner(null);
      interval = window.setTimeout(() => {
        // Random miner wins after 3 seconds
        setWinner(Math.floor(Math.random() * 3));
        
        // Reset cycle after 2 more seconds
        window.setTimeout(startCycle, 2000);
      }, 3000);
    };
    
    startCycle();
    return () => clearTimeout(interval);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (gearsRef.current) {
      gearsRef.current.children.forEach((minerGroup, i) => {
        const gear = minerGroup.children[0];
        // Spin fast if competing, spin slow if someone else won
        const speed = winner === null ? 5 : (winner === i ? 2 : 0.5);
        gear.rotation.z += 0.01 * speed;
      });
    }

    if (blockRef.current) {
      const material = blockRef.current.material as THREE.Material;
      if (winner !== null) {
        // Drop block into chain
        blockRef.current.position.y = THREE.MathUtils.lerp(blockRef.current.position.y, -1, 0.1);
        material.opacity = THREE.MathUtils.lerp(material.opacity, 1, 0.1);
      } else {
        // Reset block above miners
        blockRef.current.position.y = 3;
        material.opacity = 0;
      }
    }
  });

  return (
    <group>
      {/* Background Heat/Smoke indicating energy waste */}
      <group position={[0, 0, -3]}>
        <ParticleField count={200} color="#ff5722" speed={3} spread={8} size={0.15} />
      </group>

      {/* Info Label */}
      <Html position={[0, 3.5, 0]} center>
        <div className="bg-black/80 px-4 py-2 rounded text-white font-bold border border-red-500 whitespace-nowrap text-center">
          Massive Energy Consumption <br/>
          <span className="text-sm font-normal text-red-400">All nodes race to solve a useless math puzzle</span>
        </div>
      </Html>

      {/* Miners */}
      <group ref={gearsRef}>
        {[-3, 0, 3].map((x, i) => (
          <group key={i} position={[x, 1, 0]}>
            <mesh>
              <cylinderGeometry args={[0.8, 0.8, 0.2, 12]} />
              <meshStandardMaterial 
                color={winner === i ? "#00e676" : "#555"} 
                metalness={0.8} 
              />
            </mesh>
            <Html position={[0, -1.2, 0]} center>
              <div className={`px-2 py-1 rounded text-sm font-mono whitespace-nowrap transition-colors ${
                winner === i ? "bg-[#00e676] text-black font-bold" : "bg-black/50 text-white/50"
              }`}>
                {winner === i ? "Winner! Found Hash" : "Hashing..."}
              </div>
            </Html>
          </group>
        ))}
      </group>

      {/* New Block dropping */}
      <mesh ref={blockRef} position={[0, 3, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#00e676" emissive="#00e676" emissiveIntensity={0.5} transparent opacity={0} />
      </mesh>

      {/* Existing Blockchain */}
      <group position={[0, -2, 0]}>
        <mesh position={[-1.5, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#0a2540" />
        </mesh>
        <mesh position={[-0.5, 0, 0]} rotation={[0, 0, Math.PI/2]}>
          <cylinderGeometry args={[0.1, 0.1, 1]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
        <mesh position={[1.5, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#0a2540" />
        </mesh>
        <mesh position={[0.5, 0, 0]} rotation={[0, 0, Math.PI/2]}>
          <cylinderGeometry args={[0.1, 0.1, 1]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
        
        <Html position={[0, -1.5, 0]} center>
          <div className="text-white/70 font-mono text-sm">Main Blockchain</div>
        </Html>
      </group>
    </group>
  );
}
