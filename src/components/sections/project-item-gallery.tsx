"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const AUTOPLAY_MS = 4500;

type ProjectItemGalleryProps = {
  images: string[];
  title: string;
};

/**
 * Bộ ảnh của một hạng mục: ảnh đại diện lớn ở trên, danh sách ảnh con chạy
 * ngay bên dưới. Ảnh lớn tự chuyển; bấm ảnh con để chọn. Cột này đứng ngang với
 * khối thông tin và cùng chiều cao (`h-full`).
 */
export function ProjectItemGallery({ images, title }: ProjectItemGalleryProps) {
  const count = images.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = useRef(false);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  useEffect(() => {
    thumbRefs.current[activeIndex]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeIndex]);

  function goToPrevious() {
    setActiveIndex((current) => (current === 0 ? count - 1 : current - 1));
  }

  function goToNext() {
    setActiveIndex((current) => (current + 1) % count);
  }

  function handleProgressEnd() {
    if (count <= 1 || isPaused || prefersReducedMotion.current) {
      return;
    }

    goToNext();
  }

  const multiple = count > 1;

  return (
    <div
      className="project-item-gallery flex h-full flex-col gap-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div className="group hover-card relative flex-1 overflow-hidden border border-brand/18 bg-surface shadow-[0_16px_36px_rgba(127,75,13,0.1)]">
        <div className="project-gallery-stage relative aspect-16/10 h-full min-h-[18rem]">
          {images.map((image, index) => {
            const isActive = index === activeIndex;

            return (
              <div
                key={image}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive ? "z-10 opacity-100" : "z-0 opacity-0"
                }`}
                aria-hidden={!isActive}
              >
                <Image
                  src={image}
                  alt={`${title} - hình ${index + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            );
          })}

          <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(180deg,rgba(25,25,25,0)_62%,rgba(25,25,25,0.32)_100%)]" />

          {multiple ? (
            <>
              <div className="absolute inset-x-0 top-0 z-30 h-1 bg-brand/15">
                {!isPaused ? (
                  <div
                    key={activeIndex}
                    className="banner-progress h-full bg-gold"
                    onAnimationEnd={handleProgressEnd}
                    style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
                  />
                ) : (
                  <div
                    className="h-full bg-gold transition-transform duration-300"
                    style={{
                      transform: `scaleX(${(activeIndex + 1) / count})`,
                      transformOrigin: "left",
                    }}
                  />
                )}
              </div>

              <div className="absolute bottom-3 right-3 z-30 flex items-center gap-2 opacity-0 transition duration-300 group-hover:opacity-100 sm:opacity-100">
                <button
                  type="button"
                  aria-label="Ảnh trước"
                  onClick={goToPrevious}
                  className="button-polish grid size-9 place-items-center border border-white/50 bg-ink/35 text-white backdrop-blur hover:border-gold hover:bg-gold hover:text-ink"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Ảnh tiếp theo"
                  onClick={goToNext}
                  className="button-polish grid size-9 place-items-center border border-white/50 bg-ink/35 text-white backdrop-blur hover:border-gold hover:bg-gold hover:text-ink"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>

              <div className="absolute bottom-3 left-3 z-30 rounded-sm border border-white/25 bg-ink/35 px-2.5 py-1 text-xs font-semibold text-white/90 backdrop-blur">
                {String(activeIndex + 1).padStart(2, "0")}
                <span className="mx-1 text-white/45">/</span>
                {String(count).padStart(2, "0")}
              </div>
            </>
          ) : null}
        </div>
      </div>

      {multiple ? (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={image}
                ref={(node) => {
                  thumbRefs.current[index] = node;
                }}
                type="button"
                aria-label={`Xem hình ${index + 1}`}
                aria-current={isActive}
                onClick={() => setActiveIndex(index)}
                className={`relative aspect-4/3 w-24 shrink-0 overflow-hidden border transition sm:w-28 ${
                  isActive
                    ? "border-brand ring-2 ring-gold"
                    : "border-brand/15 opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
