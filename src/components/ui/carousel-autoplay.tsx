"use client";

import { CAROUSEL_AUTOPLAY_MS } from "@/lib/use-carousel-playback";

type CarouselAutoplayProps = {
  index: number;
  enabled: boolean;
  paused: boolean;
  reducedMotion: boolean;
  onNext: () => void;
  testId?: string;
};

export function CarouselAutoplay({
  index,
  enabled,
  paused,
  reducedMotion,
  onNext,
  testId,
}: CarouselAutoplayProps) {
  if (!enabled || reducedMotion) return null;
  return (
    <div
      className="carousel-autoplay pointer-events-none absolute inset-x-0 top-0 z-30 h-0.5 overflow-hidden bg-brand/10"
      aria-hidden="true"
    >
      <div
        key={index}
        data-testid={testId}
        className="banner-progress h-full bg-gold"
        style={{
          animationDuration: `${CAROUSEL_AUTOPLAY_MS}ms`,
          animationPlayState: paused ? "paused" : "running",
        }}
        onAnimationEnd={(event) => {
          if (event.target === event.currentTarget && !paused) onNext();
        }}
      />
    </div>
  );
}
