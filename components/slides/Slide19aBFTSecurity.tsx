import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Slide19aBFTSecurity() {
  const shieldRef = useRef<THREE.Mesh>(null);
  const attackersRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (shieldRef.current) {
      shieldRef.current.rotation.y = t * 0.2;
      shieldRef.current.rotation.x = Math.sin(t * 0.5) * 0.1;
      // Pulse emission
      (shieldRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + Math.sin(t * 4) * 0.2;
    }

    if (attackersRef.current) {
      attackersRef.current.children.forEach((attacker, i) => {
        // Attackers fly inwards, hit shield at distance 2.2, then bounce off
        const phase = (t + i * 2) % 4;
        const angle = (i * Math.PI * 2) / 3;
        
        const startDist = 8;
        const shieldDist = 2.2;
        
        let dist = startDist;
        if (phase < 1.5) {
          // Approach
          dist = THREE.MathUtils.lerp(startDist, shieldDist, phase / 1.5);
        } else {
          // Bounce
          dist = THREE.MathUtils.lerp(shieldDist, startDist + 2, (phase - 1.5) / 2.5);
        }
        
        attacker.position.set(
          Math.cos(angle) * dist,
          Math.sin(angle * 2) * 1.5,
          Math.sin(angle) * dist
        );
        
        attacker.rotation.x += 0.1;
        attacker.rotation.y += 0.1;
      });
    }
  });

  return (
    <group>
      {/* Network Core */}
      <group>
        <mesh>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#00e676" />
        </mesh>
        <mesh position={[-1, 0.5, 1]}><sphereGeometry args={[0.5, 16, 16]} /><meshStandardMaterial color="#00e676" /></mesh>
        <mesh position={[1, -0.5, -1]}><sphereGeometry args={[0.5, 16, 16]} /><meshStandardMaterial color="#00e676" /></mesh>
      </group>

      {/* aBFT Shield */}
      <mesh ref={shieldRef}>
        <icosahedronGeometry args={[2.2, 1]} />
        <meshStandardMaterial 
          color="#00bcd4" 
          emissive="#00bcd4" 
          transparent 
          opacity={0.2} 
          wireframe
        />
      </mesh>

      {/* Malicious Attackers */}
      <group ref={attackersRef}>
        {[0, 1, 2].map((i) => (
          <mesh key={i}>
            <octahedronGeometry args={[0.4]} />
            <meshStandardMaterial color="#ff1744" emissive="#ff1744" emissiveIntensity={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
