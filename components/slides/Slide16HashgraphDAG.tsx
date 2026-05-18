import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";

// Distinct colors for the 4 members (Alice, Bob, Carol, Dave)
const MEMBER_COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Green
  "#f59e0b", // Orange
  "#ec4899", // Pink
];

export default function Slide16HashgraphDAG() {
  const dagRef = useRef<THREE.Group>(null);
  const [running, setRunning] = useState(false);
  const [visibleRows, setVisibleRows] = useState(0);
  const totalRows = 12;
  
  // Generate a clearer, simpler DAG
  const { events, lines } = useMemo(() => {
    const evts = [];
    const lns: { start: THREE.Vector3, end: THREE.Vector3, isSelfParent: boolean, row: number }[] = [];
    const columns = 4;
    
    // Track the last event for each column
    const lastEvents: any[] = new Array(columns).fill(null);
    
    let eventId = 0;
    
    for (let r = 0; r < totalRows; r++) {
      // 1 or 2 events per row to keep the graph readable
      const numEventsThisRow = Math.random() > 0.4 ? 2 : 1;
      
      const cols = [];
      const availableCols = [0, 1, 2, 3];
      for (let i = 0; i < numEventsThisRow; i++) {
        const idx = Math.floor(Math.random() * availableCols.length);
        cols.push(availableCols[idx]);
        availableCols.splice(idx, 1);
      }
      
      for (const c of cols) {
        const x = (c - (columns - 1) / 2) * 2; // Spread columns by 2 units
        const y = r * 1.5 - 6; // Start below center, spread vertically
        const z = 0; // Flat DAG looks clearer
        
        const currentEvent = {
          id: `e-${eventId++}`,
          col: c,
          row: r,
          x, y, z,
          color: MEMBER_COLORS[c]
        };
        evts.push(currentEvent);
        
        const pos = new THREE.Vector3(x, y, z);
        
        // Self-parent (connecting to the previous event in the same column)
        if (lastEvents[c]) {
          lns.push({
            start: pos,
            end: new THREE.Vector3(lastEvents[c].x, lastEvents[c].y, lastEvents[c].z),
            isSelfParent: true,
            row: r
          });
        }
        
        // Other-parent (gossip sync - connecting to a recent event in another column)
        const otherCols = evts.filter(e => e.col !== c && e.row < r);
        if (otherCols.length > 0) {
          // Prefer more recent events for realistic gossip
          const target = otherCols[otherCols.length - 1]; 
          lns.push({
            start: pos,
            end: new THREE.Vector3(target.x, target.y, target.z),
            isSelfParent: false,
            row: r
          });
        }
        
        lastEvents[c] = currentEvent;
      }
    }
    
    return { events: evts, lines: lns };
  }, []);

  // Filter out geometry that hasn't "happened" yet
  const selfParentGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    lines.filter(l => l.isSelfParent && l.row < visibleRows).forEach(l => {
      points.push(l.start, l.end);
    });
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [lines, visibleRows]);

  const otherParentGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    lines.filter(l => !l.isSelfParent && l.row < visibleRows).forEach(l => {
      points.push(l.start, l.end);
    });
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [lines, visibleRows]);

  // Faint vertical lines indicating the "swimlanes" of each member
  const swimlanesGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const columns = 4;
    for (let c = 0; c < columns; c++) {
      const x = (c - (columns - 1) / 2) * 2;
      points.push(new THREE.Vector3(x, -10, 0));
      points.push(new THREE.Vector3(x, 10, 0));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (dagRef.current && visibleRows === totalRows) {
      // Once fully built, slowly move the whole DAG up to simulate continuous flow
      dagRef.current.position.y = (t * 0.4) % 4;
    } else if (dagRef.current) {
      // Lock position while building
      dagRef.current.position.y = 0;
    }
    
    if (dagRef.current) {
      // Animate opacity based on row position to fade in/out smoothly
      dagRef.current.children.forEach((child) => {
        if (child.type === "Mesh") {
          const material = (child as THREE.Mesh).material as THREE.Material;
          if (material) {
            const worldY = child.position.y + dagRef.current!.position.y;
            // Only fade if we are at max rows (flowing animation), otherwise keep solid
            const opacity = visibleRows === totalRows 
              ? Math.max(0, Math.min(1, 1 - Math.abs(worldY) / 6))
              : 1;
            material.opacity = opacity;
          }
        }
      });
    }
  });

  const handleStart = () => {
    setRunning(true);
    setVisibleRows(1); // Start with 1 row
    
    let currentRow = 1;
    const interval = setInterval(() => {
      currentRow++;
      setVisibleRows(currentRow);
      
      if (currentRow >= totalRows) {
        clearInterval(interval);
        setRunning(false);
      }
    }, 600); // 600ms per row
  };

  const handleReset = () => {
    setRunning(false);
    setVisibleRows(0);
  };

  return (
    <group>
      {/* Background Swimlanes */}
      <lineSegments geometry={swimlanesGeometry}>
        <lineBasicMaterial color="#1f2937" transparent opacity={0.4} />
      </lineSegments>

      <group ref={dagRef}>
        {/* Render Events that are visible */}
        {events.filter(e => e.row < visibleRows).map((e) => (
          <mesh key={e.id} position={[e.x, e.y, e.z]}>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshStandardMaterial 
              color={e.color} 
              transparent 
              emissive={e.color} 
              emissiveIntensity={0.6} 
            />
          </mesh>
        ))}
        
        {/* Render Self-Parent Edges (Solid white) */}
        {visibleRows > 0 && (
          <lineSegments geometry={selfParentGeometry}>
            <lineBasicMaterial color="#ffffff" transparent opacity={0.5} />
          </lineSegments>
        )}

        {/* Render Other-Parent Edges (Fainter, dashed look) */}
        {visibleRows > 0 && (
          <lineSegments geometry={otherParentGeometry}>
            <lineBasicMaterial color="#a0a0a0" transparent opacity={0.3} />
          </lineSegments>
        )}
      </group>

      <Html position={[0, -5.5, 0]} center zIndexRange={[100, 0]}>
        <div className="glass-panel p-4 flex gap-4 items-center">
          <button 
            onClick={handleStart} 
            disabled={running || visibleRows === totalRows}
            className="bg-[#10b981] hover:bg-[#059669] text-black px-6 py-2 rounded-lg font-bold disabled:opacity-50 min-w-[220px] transition-colors shadow-lg"
          >
            {visibleRows === totalRows ? "DAG Synced" : "Start Gossip About Gossip"}
          </button>
          <button 
            onClick={handleReset}
            disabled={running}
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-bold disabled:opacity-50 transition-colors"
          >
            Reset
          </button>
        </div>
      </Html>
    </group>
  );
}
