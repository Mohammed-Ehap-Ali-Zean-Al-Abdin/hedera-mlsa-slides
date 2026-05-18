"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { SceneContainer } from "@/components/three/SceneContainer";
import { SlideOverlay } from "@/components/ui/SlideOverlay";
import { NavigationHUD } from "@/components/ui/NavigationHUD";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default function PresentationPage() {
  const { goNext, goPrev, toggleFullscreen } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore input if typing in an input field (for interactive slides)
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case " ": // Spacebar
          e.preventDefault();
          goNext();
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          goPrev();
          break;
        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev, toggleFullscreen]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#203A5F] text-foreground">
      <ProgressBar />
      <SceneContainer />
      <SlideOverlay />
      <NavigationHUD />
    </main>
  );
}
