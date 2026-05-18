import { create } from "zustand";

interface PresentationState {
  currentSlide: number;
  totalSlides: number;
  isFullscreen: boolean;
  goNext: () => void;
  goPrev: () => void;
  goTo: (slide: number) => void;
  toggleFullscreen: () => void;
}

export const useStore = create<PresentationState>((set) => ({
  currentSlide: 0,
  totalSlides: 28,
  isFullscreen: false,
  goNext: () =>
    set((state) => ({
      currentSlide: Math.min(state.currentSlide + 1, state.totalSlides - 1),
    })),
  goPrev: () =>
    set((state) => ({
      currentSlide: Math.max(state.currentSlide - 1, 0),
    })),
  goTo: (slide: number) =>
    set((state) => ({
      currentSlide: Math.max(0, Math.min(slide, state.totalSlides - 1)),
    })),
  toggleFullscreen: () =>
    set((state) => {
      const isFull = !state.isFullscreen;
      if (isFull) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
      }
      return { isFullscreen: isFull };
    }),
}));
