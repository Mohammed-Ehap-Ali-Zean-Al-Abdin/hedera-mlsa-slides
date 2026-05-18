import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";

export default function Slide11VCs() {
  const diplomaRef = useRef<THREE.Mesh>(null);
  const checkRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime % 6; // 6 second animation loop
    
    if (diplomaRef.current && checkRef.current) {
      if (t < 2) {
        // University -> User
        diplomaRef.current.position.lerp(new THREE.Vector3(0, -1, 0), 0.1);
        checkRef.current.scale.set(0, 0, 0);
      } else if (t < 4) {
        // User -> Corporate
        diplomaRef.current.position.lerp(new THREE.Vector3(3, 1, 0), 0.1);
      } else {
        // Verified
        checkRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.2);
        // Reset position for next loop
        if (t > 5.9) {
          diplomaRef.current.position.set(-3, 1, 0);
        }
      }
    }
  });

  return (
    <group>
      {/* University (Left) */}
      <group position={[-3, 1, 0]}>
        <mesh>
          <boxGeometry args={[1.5, 2, 1.5]} />
          <meshStandardMaterial color="#737373" />
        </mesh>
        <mesh position={[0, 1.5, 0]}>
          <coneGeometry args={[1, 1, 4]} />
          <meshStandardMaterial color="#737373" />
        </mesh>
        <Html position={[0, -1.5, 0]} center>
          <div className="bg-black/50 px-2 py-1 rounded text-white font-mono text-sm border border-white/20">University</div>
        </Html>
      </group>

      {/* User (Bottom Center) */}
      <group position={[0, -2, 0]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.5, 0.8, 1, 16]} />
          <meshStandardMaterial color="#165D9E" />
        </mesh>
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#165D9E" />
        </mesh>
        <Html position={[0, -1, 0]} center>
          <div className="bg-black/50 px-2 py-1 rounded text-white font-mono text-sm border border-white/20">You (Holder)</div>
        </Html>
      </group>

      {/* Corporate (Right) */}
      <group position={[3, 1, 0]}>
        <mesh>
          <boxGeometry args={[1.5, 3, 1.5]} />
          <meshStandardMaterial color="#203A5F" />
        </mesh>
        <Html position={[0, -2, 0]} center>
          <div className="bg-black/50 px-2 py-1 rounded text-white font-mono text-sm border border-white/20">Employer (Verifier)</div>
        </Html>
      </group>

      {/* Diploma (Verifiable Credential) */}
      <mesh ref={diplomaRef} position={[-3, 1, 0]}>
        <planeGeometry args={[0.8, 0.6]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} side={THREE.DoubleSide} />
        {/* Certificate ribbon */}
        <mesh position={[0.2, -0.1, 0.01]}>
          <circleGeometry args={[0.1, 16]} />
          <meshBasicMaterial color="#EAEAEA" />
        </mesh>
      </mesh>

      {/* Green Checkmark at Corporate */}
      <mesh ref={checkRef} position={[3, 1, 1]} scale={[0, 0, 0]}>
        <ringGeometry args={[0.3, 0.4, 32]} />
        <meshBasicMaterial color="#165D9E" />
        <Html position={[0, 0, 0]} center>
          <div className="text-[#165D9E] font-bold text-xl">✓</div>
        </Html>
      </mesh>
    </group>
  );
}
