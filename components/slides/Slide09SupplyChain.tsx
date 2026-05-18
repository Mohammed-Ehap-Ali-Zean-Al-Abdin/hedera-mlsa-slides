import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Slide09SupplyChain() {
  const packageRef = useRef<THREE.Group>(null);
  const chainRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime % 6; // 6 second loop
    
    // Package moves from x=-4 to x=4
    if (packageRef.current) {
      packageRef.current.position.x = -4 + (t / 6) * 8;
    }

    // Illuminate checkpoints and show blocks being added
    if (chainRef.current) {
      chainRef.current.children.forEach((block, i) => {
        // Block appears when package passes its checkpoint
        const checkpointX = -2 + i * 2;
        if (packageRef.current && packageRef.current.position.x > checkpointX) {
          block.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        } else {
          block.scale.set(0, 0, 0);
        }
      });
    }
  });

  return (
    <group>
      {/* Conveyor Belt */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 2]} />
        <meshStandardMaterial color="#737373" />
      </mesh>

      {/* Moving Package */}
      <group ref={packageRef} position={[-4, 0.5, 0]}>
        <mesh>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial color="#737373" />
        </mesh>
        {/* QR Code representation */}
        <mesh position={[0, 0, 0.41]}>
          <planeGeometry args={[0.4, 0.4]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Checkpoints */}
      {[-2, 0, 2].map((x, i) => (
        <group key={`checkpoint-${i}`} position={[x, 1.5, -1.5]}>
          <mesh>
            <cylinderGeometry args={[0.2, 0.2, 3]} />
            <meshStandardMaterial color="#737373" />
          </mesh>
          <mesh position={[0, 1, 0.5]}>
            <boxGeometry args={[0.6, 0.4, 1]} />
            <meshStandardMaterial color="#737373" emissive="#737373" emissiveIntensity={0.5} />
          </mesh>
        </group>
      ))}

      {/* Blockchain underneath */}
      <group position={[0, -2, 0]}>
        <group ref={chainRef}>
          {[-2, 0, 2].map((x, i) => (
            <group key={`block-${i}`} position={[x, 0, 0]} scale={[0, 0, 0]}>
              <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#165D9E" emissive="#165D9E" emissiveIntensity={0.2} />
              </mesh>
              {i > 0 && (
                <mesh position={[-1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.1, 0.1, 1]} />
                  <meshStandardMaterial color="#165D9E" />
                </mesh>
              )}
            </group>
          ))}
        </group>
      </group>
    </group>
  );
}
