import { NetworkGraph } from "../three/effects/NetworkGraph";

export default function Slide05Architecture() {
  // Hub and Spoke Model
  const hubNodes = [
    { id: 0, position: [0, 0, 0] as [number, number, number] }, // Center
  ];
  const hubEdges = [];
  for (let i = 1; i <= 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    hubNodes.push({
      id: i,
      position: [Math.cos(angle) * 2, Math.sin(angle) * 2, 0] as [number, number, number],
    });
    hubEdges.push({ source: 0, target: i });
  }

  // Distributed Mesh Model
  const meshNodes = [];
  const meshEdges = [];
  for (let i = 0; i < 7; i++) {
    const angle = (i / 7) * Math.PI * 2;
    meshNodes.push({
      id: i + 10, // offset id
      position: [Math.cos(angle) * 2, Math.sin(angle) * 2, 0] as [number, number, number],
    });
  }
  // Connect every node to 3 other nodes
  for (let i = 0; i < 7; i++) {
    meshEdges.push({ source: i + 10, target: ((i + 1) % 7) + 10 });
    meshEdges.push({ source: i + 10, target: ((i + 2) % 7) + 10 });
    meshEdges.push({ source: i + 10, target: ((i + 3) % 7) + 10 });
  }

  return (
    <group>
      {/* Centralized (Left) */}
      <group position={[-3.5, 0, 0]}>
        <NetworkGraph nodes={hubNodes} edges={hubEdges} nodeColor="#737373" edgeColor="#737373" autoRotate={false} />
      </group>

      {/* Distributed (Right) */}
      <group position={[3.5, 0, 0]}>
        <NetworkGraph nodes={meshNodes} edges={meshEdges} nodeColor="#165D9E" edgeColor="#165D9E" autoRotate={false} />
      </group>

      {/* Separator */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[0.05, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}
