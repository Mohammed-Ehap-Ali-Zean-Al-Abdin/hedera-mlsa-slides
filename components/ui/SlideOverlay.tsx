"use client";

import { motion, AnimatePresence } from "framer-motion";
import { slides } from "@/lib/slideData";
import { useStore } from "@/lib/store";
import { CheckCircle2 } from "lucide-react";

export function SlideOverlay() {
  const currentSlide = useStore((state) => state.currentSlide);
  const slide = slides[currentSlide];

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-end p-8 md:p-16 z-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.index}
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-4xl"
        >
          {/* Header section (Glass card) */}
          <div className="glass-panel p-8 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  slide.session === 1
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                }`}
              >
                Session {slide.session}
              </span>
              <span className="text-white/40 text-sm font-mono">
                {String(slide.index).padStart(2, "0")}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-3 tracking-tight">
              {slide.title}
            </h1>
            <p className="text-lg md:text-2xl text-[#00e676] font-light">
              {slide.subtitle}
            </p>
          </div>

          {/* Optional bullets section */}
          {slide.bullets && slide.bullets.length > 0 && (
            <div className="glass-panel p-8 mb-16">
              <ul className="space-y-4">
                {slide.bullets.map((bullet, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                    className="flex items-start gap-4 text-white/90 text-xl leading-relaxed"
                  >
                    <CheckCircle2 className="mt-1 flex-shrink-0 text-[#00e676]" size={24} />
                    <span>{bullet}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
