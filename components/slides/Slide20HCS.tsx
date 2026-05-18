import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";

export default function Slide20HCS() {
  const busRef = useRef<THREE.Mesh>(null);
  const packetsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (packetsRef.current) {
      packetsRef.current.children.forEach((packet, i) => {
        // Packets travel from x=-6 to x=6
        const cycle = 4;
        const phase = (t + i * 1.5) % cycle;
        const xPos = -6 + (phase / cycle) * 12;
        
        packet.position.x = xPos;
        
        // At center (x=0), stamp is applied
        const stamp = packet.children[1] as THREE.Mesh;
        if (xPos > 0) {
          stamp.scale.lerp(new THREE.Vector3(1, 1, 1), 0.2); // Show stamp
          ((packet.children[0] as THREE.Mesh).material as THREE.MeshStandardMaterial).color.setHex(0x165D9E); // Turn green
        } else {
          stamp.scale.set(0, 0, 0); // Hide stamp
          ((packet.children[0] as THREE.Mesh).material as THREE.MeshStandardMaterial).color.setHex(0x737373); // Purple before timestamp
        }
      });
    }
  });

  return (
    <group>
      {/* High-Speed Bus */}
      <mesh ref={busRef} position={[0, 0, -1]}>
        <boxGeometry args={[12, 1, 3]} />
        <meshStandardMaterial color="#737373" />
        {/* Glow lines on bus */}
        <mesh position={[0, 0.51, 0]}>
          <planeGeometry args={[12, 0.1]} />
          <meshBasicMaterial color="#165D9E" />
        </mesh>
      </mesh>

      {/* Timestamping Node */}
      <group position={[0, 2, 0]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[1, 1, 1, 16]} />
          <meshStandardMaterial color="#165D9E" emissive="#165D9E" emissiveIntensity={0.2} />
        </mesh>
        <Html position={[0, 1.5, 0]} center>
          <div className="bg-black/80 px-2 py-1 rounded text-white font-mono text-sm border border-[#165D9E]">
            Fair Timestamp
          </div>
        </Html>
        {/* Laser hitting the bus */}
        <mesh position={[0, -1, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 2]} />
          <meshBasicMaterial color="#165D9E" transparent opacity={0.5} />
        </mesh>
      </group>

      {/* Data Packets */}
      <group ref={packetsRef}>
        {[0, 1, 2].map((i) => (
          <group key={i} position={[0, 0.5, 0]}>
            {/* Base packet */}
            <mesh>
              <boxGeometry args={[0.8, 0.4, 0.8]} />
              <meshStandardMaterial color="#737373" />
            </mesh>
            {/* Timestamp Stamp */}
            <mesh position={[0, 0.21, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[0, 0, 0]}>
              <ringGeometry args={[0.1, 0.3, 16]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
