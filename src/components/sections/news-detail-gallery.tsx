"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";

const AUTOPLAY_MS = 4200;

type NewsDetailGalleryProps = {
  images: string[];
  title: string;
  galleryLabel: string;
  imageLabel: string;
};

function uniqueImages(images: string[]) {
  return images.filter(
    (image, index) => image && images.indexOf(image) === index,
  );
}

export function NewsDetailGallery({
  images,
  title,
  galleryLabel,
  imageLabel,
}: NewsDetailGalleryProps) {
  const gallery = uniqueImages(images);
  const mainImage = gallery[0];
  const secondaryImages = gallery.slice(1);
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const hasSecondaryCarousel = secondaryImages.length > 4;

  useEffect(() => {
    if (!hasSecondaryCarousel) return;
    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      scrollByCards(1);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(id);
  }, [hasSecondaryCarousel]);

  function scrollByCards(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;

    const first = track.firstElementChild as HTMLElement | null;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 12;
    const step = (first ? first.clientWidth : track.clientWidth / 4) + gap;
    const atStart = track.scrollLeft <= 4;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;

    if (direction < 0 && atStart) {
      track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
      return;
    }

    if (direction > 0 && atEnd) {
      track.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    track.scrollBy({ left: step * direction, behavior: "smooth" });
  }

  if (!mainImage) return null;

  if (gallery.length === 1) {
    return (
      <div className="image-reveal relative aspect-video overflow-hidden border border-charcoal/15 bg-surface sm:aspect-[2/1] lg:aspect-[16/9]">
        <Image
          src={mainImage}
          alt={title}
          fill
          preload
          sizes="(max-width: 640px) calc(100vw - 2.5rem), (max-width: 1023px) calc(100vw - 4rem), (max-width: 1279px) calc(100vw - 33rem), calc(100vw - 37rem)"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <section className="min-w-0" aria-label={galleryLabel}>
      <div className="image-reveal relative aspect-video overflow-hidden border border-charcoal/15 bg-surface sm:aspect-[2/1] lg:aspect-[16/9]">
        <Image
          src={mainImage}
          alt={title}
          fill
          preload
          sizes="(max-width: 640px) calc(100vw - 2.5rem), (max-width: 1023px) calc(100vw - 4rem), (max-width: 1279px) calc(100vw - 33rem), calc(100vw - 37rem)"
          className="object-cover"
        />
      </div>

      <div
        className="group relative mt-3"
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
        onFocusCapture={() => (pausedRef.current = true)}
        onBlurCapture={() => (pausedRef.current = false)}
      >
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] scrollbar-width:none [&::-webkit-scrollbar]:hidden"
        >
          {secondaryImages.map((image, index) => (
            <div
              key={image}
              className="relative aspect-video w-[78%] shrink-0 snap-start overflow-hidden border border-charcoal/15 bg-surface sm:w-[calc((100%-0.75rem)/2)] lg:w-[calc((100%-1.5rem)/3)] xl:w-[calc((100%-2.25rem)/4)]"
            >
              <Image
                src={image}
                alt={`${title} — ${imageLabel} ${index + 2}`}
                fill
                sizes="(max-width: 640px) 78vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 14vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {hasSecondaryCarousel ? (
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              aria-label={`${imageLabel} truoc`}
              onClick={() => scrollByCards(-1)}
              className="button-polish grid size-10 place-items-center border border-brand/25 bg-white text-brand transition hover:border-brand hover:bg-gold hover:text-ink"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={`${imageLabel} tiep theo`}
              onClick={() => scrollByCards(1)}
              className="button-polish grid size-10 place-items-center border border-brand/25 bg-white text-brand transition hover:border-brand hover:bg-gold hover:text-ink"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
