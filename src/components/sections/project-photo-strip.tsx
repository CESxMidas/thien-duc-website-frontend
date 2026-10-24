"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useLoopCarousel } from "@/lib/use-loop-carousel";
import {
  CAROUSEL_TRACK_CLASS,
  CAROUSEL_TRANSITION_MS,
  useCarouselPlayback,
} from "@/lib/use-carousel-playback";
import { CarouselAutoplay } from "@/components/ui/carousel-autoplay";
import { trackTransform } from "./news-slider";

type ProjectPhotoStripProps = {
  images: string[];
  title: string;
};

export function ProjectPhotoStrip({ images, title }: ProjectPhotoStripProps) {
  const count = images.length;
  const [visibleCount, setVisibleCount] = useState(3);
  const isCarousel = count > 3;
  const playback = useCarouselPlayback();
  const loop = useLoopCarousel(isCarousel ? count : 0, CAROUSEL_TRANSITION_MS);
  const trackIndex = visibleCount + loop.position - 1;
  const renderedImages = [
    ...images.slice(-visibleCount),
    ...images,
    ...images.slice(0, visibleCount),
  ];
  useEffect(() => {
    function sync() {
      setVisibleCount(
        window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1,
      );
    }
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);
  function scrollByCards(direction: 1 | -1) {
    if (direction === 1) loop.next();
    else loop.previous();
  }

  if (count === 0) return null;

  if (!isCarousel) {
    const gridClass =
      count >= 3
        ? "sm:grid-cols-2 lg:grid-cols-3"
        : count === 2
          ? "sm:grid-cols-2"
          : "grid-cols-1";

    return (
      <div className={`stagger-sides grid gap-5 ${gridClass}`}>
        {images.map((image, index) => (
          <div
            key={image}
            className="project-image-frame hover-card image-reveal relative overflow-hidden border border-brand/18 bg-surface"
          >
            <Image
              src={image}
              alt={`${title} - hình ${index + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-left-top origin-top-left"
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="group relative" {...playback.handlers}>
      <CarouselAutoplay
        index={loop.activeIndex}
        enabled={isCarousel}
        paused={playback.paused}
        reducedMotion={playback.reducedMotion}
        onNext={loop.next}
        testId="photo-strip-progress"
      />
      <div className="touch-pan-y overflow-hidden" {...loop.swipeHandlers}>
        <div
          data-testid="photo-strip-track"
          className={`flex gap-5 ${CAROUSEL_TRACK_CLASS}`}
          onTransitionEnd={loop.onTransitionEnd}
          style={{
            transform: trackTransform(trackIndex, visibleCount, 20),
            transitionProperty: loop.animate ? "transform" : "none",
          }}
        >
          {renderedImages.map((image, index) => (
            <div
              key={`${index}-${image}`}
              aria-hidden={
                index < trackIndex || index >= trackIndex + visibleCount
              }
              style={{
                width: `calc((100% - ${(visibleCount - 1) * 20}px) / ${visibleCount})`,
              }}
              className="project-image-frame hover-card image-reveal relative shrink-0 overflow-hidden border border-brand/18 bg-surface"
            >
              <Image
                src={image}
                alt={`${title} - hình ${((index - visibleCount + count) % count) + 1}`}
                fill
                sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-left-top origin-top-left"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          aria-label="Ảnh trước"
          onClick={() => scrollByCards(-1)}
          className="button-polish grid size-10 place-items-center border border-brand/25 bg-white text-brand hover:border-brand hover:bg-gold hover:text-ink"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Ảnh tiếp theo"
          onClick={() => scrollByCards(1)}
          className="button-polish grid size-10 place-items-center border border-brand/25 bg-white text-brand hover:border-brand hover:bg-gold hover:text-ink"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
