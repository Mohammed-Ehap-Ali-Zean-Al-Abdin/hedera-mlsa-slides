"use client";

import { motion } from "framer-motion";
import { useStore } from "@/lib/store";

export function ProgressBar() {
  const { currentSlide, totalSlides } = useStore();
  
  // Calculate progress percentage
  const progress = (currentSlide / (totalSlides - 1)) * 100;

  return (
    <div className="absolute top-0 left-0 right-0 h-1 z-30 bg-white/5">
      <motion.div
        className="h-full bg-gradient-to-r from-emerald-400 to-purple-500"
        initial={{ width: "0%" }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </div>
  );
}
