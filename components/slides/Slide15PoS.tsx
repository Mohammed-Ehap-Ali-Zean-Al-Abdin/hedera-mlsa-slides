import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";

export default function Slide15PoS() {
  const [leader, setLeader] = useState<number>(0);
  const packetsRef = useRef<THREE.Group>(null);

  useEffect(() => {
    // Leader rotates every 3 seconds based on stake weight (mocked randomly for visual)
    const interval = setInterval(() => {
      setLeader(Math.floor(Math.random() * 3));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (packetsRef.current) {
      packetsRef.current.children.forEach((packet, i) => {
        // Data queues up, then flows ONLY through the leader
        const cycle = 2;
        const phase = (t + i * 0.5) % cycle;
        
        // Starts at bottom (x=-5), moves to leader x,y, then out
        const leaderX = (leader - 1) * 3;
        
        if (phase < 1) {
          // Approach queue
          packet.position.set(-4 + phase * 2, -1.5, 0);
          packet.scale.set(1, 1, 1);
        } else {
          // Through leader
          const progress = phase - 1;
          packet.position.set(
            THREE.MathUtils.lerp(-2, leaderX, progress),
            THREE.MathUtils.lerp(-1.5, 0, progress),
            0
          );
          if (progress > 0.8) packet.scale.set(0,0,0);
        }
      });
    }
  });

  const validators = [
    { id: 0, x: -3, stake: 5 }, // 5 coins
    { id: 1, x: 0, stake: 2 },  // 2 coins
    { id: 2, x: 3, stake: 8 },  // 8 coins
  ];

  return (
    <group>
      {/* Title / Explainer Label */}
      <Html position={[0, 3.5, 0]} center>
        <div className="bg-black/80 px-4 py-2 rounded text-white font-bold border border-[#165D9E] whitespace-nowrap text-center">
          Energy Efficient, but creates a Bottleneck <br/>
          <span className="text-sm font-normal text-[#165D9E]">One leader chosen at a time to process all data</span>
        </div>
      </Html>

      {/* Validators and their Staked Capital */}
      {validators.map((v) => (
        <group key={v.id} position={[v.x, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.6, 0.6, 0.5, 32]} />
            <meshStandardMaterial 
              color={leader === v.id ? "#165D9E" : "#203A5F"} 
              emissive={leader === v.id ? "#165D9E" : "#000000"} 
              emissiveIntensity={0.5} 
            />
          </mesh>
          <Html position={[0, 1, 0]} center>
            <div className={`px-2 py-1 rounded text-sm font-bold whitespace-nowrap transition-colors ${
              leader === v.id ? "bg-[#165D9E] text-black" : "bg-black/50 text-white/50"
            }`}>
              {leader === v.id ? "★ Current Leader" : "Validator"}
            </div>
          </Html>
          
          {/* Staked Coins Visualization */}
          {[...Array(v.stake)].map((_, i) => (
            <mesh key={i} position={[0, -0.5 - i * 0.15, 0]}>
              <cylinderGeometry args={[0.4, 0.4, 0.1, 16]} />
              <meshStandardMaterial color="#EAEAEA" metalness={0.8} />
            </mesh>
          ))}
          <Html position={[0, -0.5 - v.stake * 0.15 - 0.5, 0]} center>
            <div className="text-[#EAEAEA] font-mono text-xs">{v.stake}k Staked</div>
          </Html>
        </group>
      ))}

      {/* Data Transactions Queueing */}
      <group ref={packetsRef}>
        {[...Array(5)].map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#737373" emissive="#737373" emissiveIntensity={0.5} />
          </mesh>
        ))}
      </group>
      
      <Html position={[-4, -2.5, 0]} center>
        <div className="text-[#165D9E] font-mono text-sm whitespace-nowrap">
          User Transactions
        </div>
      </Html>
    </group>
  );
}
