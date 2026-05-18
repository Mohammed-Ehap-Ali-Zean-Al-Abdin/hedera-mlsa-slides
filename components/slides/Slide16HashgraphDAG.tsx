import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Slide16HashgraphDAG() {
  const dagRef = useRef<THREE.Group>(null);
  
  // Generate DAG events
  const events = useMemo(() => {
    const arr = [];
    const columns = 5;
    const rows = 10;
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        // Randomly skip some events to make it look organic
        if (Math.random() > 0.8) continue;
        
        arr.push({
          id: `e-${r}-${c}`,
          col: c,
          row: r,
          x: (c - (columns - 1) / 2) * 1.5 + (Math.random() - 0.5) * 0.5,
          y: r * 1.2 - 5, // Start below center
          z: (Math.random() - 0.5) * 0.5,
        });
      }
    }
    return arr;
  }, []);

  const lineGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    // Connect to previous rows
    for (let i = 0; i < events.length; i++) {
      const e1 = events[i];
      if (e1.row === 0) continue;
      
      // Connect to self previous
      const selfPrev = events.find(e => e.col === e1.col && e.row < e1.row);
      if (selfPrev) {
        points.push(new THREE.Vector3(e1.x, e1.y, e1.z));
        points.push(new THREE.Vector3(selfPrev.x, selfPrev.y, selfPrev.z));
      }
      
      // Connect to other random previous (gossip sync)
      const otherPrev = events.filter(e => e.col !== e1.col && e.row < e1.row);
      if (otherPrev.length > 0) {
        const target = otherPrev[Math.floor(Math.random() * otherPrev.length)];
        points.push(new THREE.Vector3(e1.x, e1.y, e1.z));
        points.push(new THREE.Vector3(target.x, target.y, target.z));
      }
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [events]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (dagRef.current) {
      // Slowly move the whole DAG up
      dagRef.current.position.y = (t * 0.5) % 3;
      
      // Animate opacity based on row
      dagRef.current.children.forEach((child) => {
        if (child.type === "Mesh") {
          const material = (child as THREE.Mesh).material as THREE.Material;
          if (material) {
            // Fade in at bottom, fade out at top
            const worldY = child.position.y + dagRef.current!.position.y;
            const opacity = Math.max(0, Math.min(1, 1 - Math.abs(worldY) / 6));
            material.opacity = opacity;
          }
        }
      });
    }
  });

  return (
    <group>
      <group ref={dagRef}>
        {/* Render Events */}
        {events.map((e) => (
          <mesh key={e.id} position={[e.x, e.y, e.z]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#00e676" transparent emissive="#00e676" emissiveIntensity={0.5} />
          </mesh>
        ))}
        
        {/* Render Edges */}
        <lineSegments geometry={lineGeometry}>
          <lineBasicMaterial color="#6a1b9a" transparent opacity={0.4} />
        </lineSegments>
      </group>
    </group>
  );
}
