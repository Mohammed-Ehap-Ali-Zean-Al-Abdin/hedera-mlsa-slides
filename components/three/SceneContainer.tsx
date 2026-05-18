"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import { useStore } from "@/lib/store";
import * as Slides from "../slides";

export function SceneContainer() {
  const currentSlide = useStore((state) => state.currentSlide);

  return (
    <div className="absolute inset-0 w-full h-full z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 2]} // Support retina displays
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#0b0d17"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <Suspense fallback={null}>
          <Environment preset="night" />
          
          {/* Render the active slide */}
          {(() => {
            const slideKey = `Slide${currentSlide.toString().padStart(2, '0')}` as keyof typeof Slides;
            const ActiveSlide = Slides[slideKey] || Slides.PlaceholderSlide;
            return <ActiveSlide />;
          })()}
        </Suspense>
        
        {/* Disable OrbitControls globally, enable per-slide if needed */}
        {/* <OrbitControls enablePan={false} enableZoom={false} /> */}
      </Canvas>
    </div>
  );
}
