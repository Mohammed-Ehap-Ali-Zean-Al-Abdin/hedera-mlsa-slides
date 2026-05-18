import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Node {
  id: number;
  position: [number, number, number];
}

interface Edge {
  source: number;
  target: number;
}

interface NetworkGraphProps {
  nodes: Node[];
  edges: Edge[];
  nodeColor?: string;
  edgeColor?: string;
  autoRotate?: boolean;
}

export function NetworkGraph({
  nodes,
  edges,
  nodeColor = "#165D9E",
  edgeColor = "#737373",
  autoRotate = true,
}: NetworkGraphProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
      groupRef.current.rotation.x += delta * 0.05;
    }
  });

  const lineGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    edges.forEach((edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      const targetNode = nodes.find((n) => n.id === edge.target);
      if (sourceNode && targetNode) {
        points.push(new THREE.Vector3(...sourceNode.position));
        points.push(new THREE.Vector3(...targetNode.position));
      }
    });
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [nodes, edges]);

  return (
    <group ref={groupRef}>
      {/* Nodes */}
      {nodes.map((node) => (
        <mesh key={node.id} position={node.position}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color={nodeColor} emissive={nodeColor} emissiveIntensity={0.5} />
        </mesh>
      ))}

      {/* Edges */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color={edgeColor} transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
}
