"use client";

import { useStore } from "@/lib/store";
import { ArrowLeft, ArrowRight, Maximize } from "lucide-react";

export function NavigationHUD() {
  const { currentSlide, totalSlides, goNext, goPrev, toggleFullscreen } = useStore();

  return (
    <div className="absolute bottom-6 left-0 right-0 flex justify-between items-center px-8 md:px-16 z-20 pointer-events-none">
      
      {/* Keyboard Hint */}
      <div className="text-white/30 text-xs font-mono hidden md:block">
        USE <span className="text-white/60">← →</span> ARROWS OR <span className="text-white/60">SPACE</span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 glass px-4 py-2 pointer-events-auto">
        <button
          onClick={goPrev}
          disabled={currentSlide === 0}
          className="p-2 text-white/70 hover:text-white disabled:opacity-30 disabled:hover:text-white/70 transition-colors rounded-full hover:bg-white/10"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div className="text-sm font-mono text-white/80 min-w-[3rem] text-center">
          {currentSlide + 1} <span className="text-white/40">/</span> {totalSlides}
        </div>

        <button
          onClick={goNext}
          disabled={currentSlide === totalSlides - 1}
          className="p-2 text-white/70 hover:text-white disabled:opacity-30 disabled:hover:text-white/70 transition-colors rounded-full hover:bg-white/10"
        >
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Fullscreen Toggle */}
      <button
        onClick={toggleFullscreen}
        className="p-3 glass pointer-events-auto text-white/70 hover:text-white transition-colors hover:bg-white/10 hidden sm:block"
        title="Toggle Fullscreen (F)"
      >
        <Maximize size={18} />
      </button>

    </div>
  );
}
