import { useMemo } from "react";
import { NetworkGraph } from "../three/effects/NetworkGraph";

export default function Slide00Title() {
  const { nodes, edges } = useMemo(() => {
    const nodes = [];
    const edges = [];
    // Generate a beautiful spherical network
    for (let i = 0; i < 30; i++) {
      const phi = Math.acos(-1 + (2 * i) / 30);
      const theta = Math.sqrt(30 * Math.PI) * phi;
      const r = 3;
      nodes.push({
        id: i,
        position: [
          r * Math.cos(theta) * Math.sin(phi),
          r * Math.sin(theta) * Math.sin(phi),
          r * Math.cos(phi),
        ] as [number, number, number],
      });
    }
    // Connect close nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].position[0] - nodes[j].position[0];
        const dy = nodes[i].position[1] - nodes[j].position[1];
        const dz = nodes[i].position[2] - nodes[j].position[2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 2.5) {
          edges.push({ source: i, target: j });
        }
      }
    }
    return { nodes, edges };
  }, []);

  return (
    <group>
      <NetworkGraph nodes={nodes} edges={edges} />
    </group>
  );
}
