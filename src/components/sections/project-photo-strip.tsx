"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";

const AUTOPLAY_MS = 4500;

type ProjectPhotoStripProps = {
  images: string[];
  title: string;
};

/**
 * Thư viện ảnh cho dự án **không chia hạng mục**: xếp ảnh thành hàng (tối đa 3
 * ảnh mỗi khung nhìn) và tự trượt khi có nhiều ảnh hơn số cột. Ít ảnh (≤ 3) thì
 * hiện lưới tĩnh gọn gàng thay vì slider trống điều hướng.
 *
 * Dùng scroll-snap thay vì tính translateX: responsive theo `flex-basis`, cuộn
 * mượt trên cả chuột lẫn cảm ứng, không phải đoán số cột đang hiển thị.
 */
export function ProjectPhotoStrip({ images, title }: ProjectPhotoStripProps) {
  const count = images.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  const isCarousel = count > 3;

  useEffect(() => {
    if (!isCarousel) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      scrollByCards(1);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(id);
  }, [isCarousel]);

  function scrollByCards(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;

    const first = track.firstElementChild as HTMLElement | null;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 16;
    const step = (first ? first.clientWidth : track.clientWidth) + gap;
    const atEnd =
      track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;

    if (direction > 0 && atEnd) {
      track.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      track.scrollBy({ left: step * direction, behavior: "smooth" });
    }
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
      <div className={`stagger-sides grid gap-4 ${gridClass}`}>
        {images.map((image, index) => (
          <div
            key={image}
            className="hover-card image-reveal relative aspect-16/10 overflow-hidden border border-brand/18 bg-surface shadow-[0_12px_28px_rgba(127,75,13,0.1)]"
          >
            <Image
              src={image}
              alt={`${title} - hình ${index + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="group relative"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
      onFocusCapture={() => (pausedRef.current = true)}
      onBlurCapture={() => (pausedRef.current = false)}
    >
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((image, index) => (
          <div
            key={image}
            className="hover-card image-reveal relative aspect-16/10 w-[85%] shrink-0 snap-start overflow-hidden border border-brand/18 bg-surface shadow-[0_12px_28px_rgba(127,75,13,0.1)] sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]"
          >
            <Image
              src={image}
              alt={`${title} - hình ${index + 1}`}
              fill
              sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-end gap-2">
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
