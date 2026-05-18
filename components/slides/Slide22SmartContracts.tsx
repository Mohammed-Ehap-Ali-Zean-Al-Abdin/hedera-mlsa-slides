import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Slide22SmartContracts() {
  const armBaseRef = useRef<THREE.Group>(null);
  const armJointRef = useRef<THREE.Group>(null);
  const blockRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (armBaseRef.current && armJointRef.current && blockRef.current) {
      // Rotate base back and forth
      armBaseRef.current.rotation.y = Math.sin(t) * Math.PI / 4;
      
      // Move arm joint up and down
      armJointRef.current.rotation.z = Math.sin(t * 2) * 0.5 - 0.5;
      
      // Block moving down to assemble
      const phase = t % 2;
      if (phase < 1) {
        blockRef.current.position.y = 2 - phase * 2;
        (blockRef.current.material as THREE.Material).opacity = 1;
      } else {
        (blockRef.current.material as THREE.Material).opacity = 0; // Hide until next cycle
      }
    }
  });

  return (
    <group>
      {/* Robotic Arm Base */}
      <group ref={armBaseRef} position={[-2, -2, 0]}>
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.6, 0.8, 1]} />
          <meshStandardMaterial color="#737373" metalness={0.8} />
        </mesh>
        
        {/* First Arm Segment */}
        <group position={[0, 1, 0]} rotation={[0, 0, 0.5]}>
          <mesh position={[0, 1, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 2]} />
            <meshStandardMaterial color="#EAEAEA" metalness={0.8} />
          </mesh>
          
          {/* Second Arm Segment (Joint) */}
          <group ref={armJointRef} position={[0, 2, 0]}>
            <mesh position={[0, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 0.6]} />
              <meshStandardMaterial color="#737373" />
            </mesh>
            <mesh position={[1, 0, 0]} rotation={[0, 0, Math.PI/2]}>
              <cylinderGeometry args={[0.15, 0.15, 2]} />
              <meshStandardMaterial color="#EAEAEA" metalness={0.8} />
            </mesh>
            {/* Claws */}
            <mesh position={[2, -0.2, 0.2]}>
              <boxGeometry args={[0.4, 0.1, 0.1]} />
              <meshStandardMaterial color="#737373" />
            </mesh>
            <mesh position={[2, 0.2, 0.2]}>
              <boxGeometry args={[0.4, 0.1, 0.1]} />
              <meshStandardMaterial color="#737373" />
            </mesh>
          </group>
        </group>
      </group>

      {/* Assembly Area (EVM) */}
      <group position={[2, -2, 0]}>
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[3, 0.2, 3]} />
          <meshStandardMaterial color="#203A5F" />
        </mesh>
        {/* Existing Code Blocks */}
        <mesh position={[-0.5, 0.5, -0.5]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#165D9E" emissive="#165D9E" emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[0.5, 0.5, 0.5]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#165D9E" emissive="#165D9E" emissiveIntensity={0.2} />
        </mesh>
        {/* New Block Being Assembled */}
        <mesh ref={blockRef} position={[-0.5, 2, 0.5]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#165D9E" emissive="#165D9E" emissiveIntensity={0.5} transparent opacity={1} />
        </mesh>
      </group>
    </group>
  );
}
