import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";

export default function Slide21HCSIoT() {
  const [temps, setTemps] = useState([22.4, 22.5, 22.6, 22.8, 23.1, 23.5, 24.0, 24.5, 25.1, 26.0]);
  const readingsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (readingsRef.current) {
      readingsRef.current.children.forEach((reading, i) => {
        const cycle = 3;
        const phase = (t + i * 0.6) % cycle;
        
        // Fly up from sensor to HCS bus
        reading.position.y = -2 + (phase / cycle) * 4;
        ((reading as THREE.Mesh).material as THREE.Material).opacity = phase < 2.5 ? 1 : 1 - (phase - 2.5) * 2;
      });
    }
  });

  return (
    <group>
      {/* Factory Sensor */}
      <group position={[0, -2.5, 0]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.8, 1, 1]} />
          <meshStandardMaterial color="#555" />
        </mesh>
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 1]} />
          <meshStandardMaterial color="#888" />
        </mesh>
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#ff1744" emissive="#ff1744" emissiveIntensity={0.5} />
        </mesh>
        <Html position={[2, 0, 0]} center>
          <div className="bg-black/50 px-2 py-1 rounded border border-white/20 text-white font-mono text-sm whitespace-nowrap">
            IoT Sensor #A1
          </div>
        </Html>
      </group>

      {/* HCS Bus Cloud */}
      <group position={[0, 2.5, 0]}>
        <mesh>
          <boxGeometry args={[6, 1, 2]} />
          <meshStandardMaterial color="#00bcd4" transparent opacity={0.3} />
        </mesh>
        <Html position={[0, 1.2, 0]} center>
          <div className="text-[#00bcd4] font-bold font-mono">Hedera Consensus Service</div>
        </Html>
      </group>

      {/* Temperature Readings flying up */}
      <group ref={readingsRef}>
        {[...Array(5)].map((_, i) => (
          <mesh key={i} position={[0, -2, 0]}>
            <planeGeometry args={[0.1, 0.1]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0} />
            <Html center>
              <div className="bg-[#00e676]/20 px-2 py-1 rounded text-[#00e676] font-mono text-xs whitespace-nowrap">
                {`Temp: ${temps[i]}°C -> HCS`}
              </div>
            </Html>
          </mesh>
        ))}
      </group>
    </group>
  );
}
