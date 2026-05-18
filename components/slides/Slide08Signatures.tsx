import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";

export default function Slide08Signatures() {
  const keyRef = useRef<THREE.Group>(null);
  const lockRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime % 4; // 4 second loop
    
    if (keyRef.current && lockRef.current && glowRef.current) {
      if (t < 2) {
        // Key approaches and rotates
        keyRef.current.position.y = 2 - t; // Moves from y=2 to y=0
        keyRef.current.rotation.y = t * Math.PI;
        (glowRef.current.material as THREE.Material).opacity = 0;
        ((lockRef.current.children[0] as THREE.Mesh).material as THREE.MeshStandardMaterial).color.setHex(0x737373); // Red lock
      } else if (t < 3) {
        // Key turns inside lock
        keyRef.current.position.y = 0;
        keyRef.current.rotation.z = (t - 2) * Math.PI / 2; // Turn 90 degrees
      } else {
        // Unlocked / Verified state
        (glowRef.current.material as THREE.Material).opacity = (t - 3); // Fade in glow
        ((lockRef.current.children[0] as THREE.Mesh).material as THREE.MeshStandardMaterial).color.setHex(0x165D9E); // Green lock
      }
    }
  });

  return (
    <group>
      {/* Data Block */}
      <mesh position={[0, -1, 0]}>
        <boxGeometry args={[3, 1, 2]} />
        <meshStandardMaterial color="#203A5F" />
      </mesh>
      
      {/* Glow Effect */}
      <mesh ref={glowRef} position={[0, -1, 0]}>
        <boxGeometry args={[3.2, 1.2, 2.2]} />
        <meshBasicMaterial color="#165D9E" transparent opacity={0} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Lock */}
      <group ref={lockRef} position={[0, 0, 0.5]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 0.8, 0.4]} />
          <meshStandardMaterial color="#737373" />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <torusGeometry args={[0.3, 0.1, 16, 32, Math.PI]} />
          <meshStandardMaterial color="#EAEAEA" metalness={0.8} />
        </mesh>
      </group>

      {/* Key */}
      <group ref={keyRef} position={[0, 2, 0.5]} rotation={[Math.PI, 0, 0]}>
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 1.2]} />
          <meshStandardMaterial color="#EAEAEA" metalness={0.8} />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <torusGeometry args={[0.2, 0.08, 16, 32]} />
          <meshStandardMaterial color="#EAEAEA" metalness={0.8} />
        </mesh>
        <mesh position={[0.2, 0.2, 0]}>
          <boxGeometry args={[0.4, 0.2, 0.1]} />
          <meshStandardMaterial color="#EAEAEA" metalness={0.8} />
        </mesh>
        <mesh position={[0.2, 0.5, 0]}>
          <boxGeometry args={[0.4, 0.2, 0.1]} />
          <meshStandardMaterial color="#EAEAEA" metalness={0.8} />
        </mesh>
      </group>

      <Html position={[0, -2.5, 0]} center>
        <div className="bg-black/80 px-4 py-2 rounded text-[#165D9E] font-mono border border-[#165D9E]/30 text-center w-64">
          Verified Signature<br/>
          <span className="text-xs text-white/50">0x7F8B...9C2A</span>
        </div>
      </Html>
    </group>
  );
}
