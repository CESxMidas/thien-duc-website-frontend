"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const mainImage = gallery[activeIndex] ?? gallery[0];
  const hasControls = gallery.length > 1;

  function selectImage(index: number) {
    setActiveIndex(index);
    thumbRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  function stepImage(direction: 1 | -1) {
    const nextIndex = (activeIndex + direction + gallery.length) % gallery.length;
    selectImage(nextIndex);
  }

  if (!mainImage) return null;

  if (gallery.length === 1) {
    return (
      <div className="relative aspect-video overflow-hidden border border-charcoal/15 bg-surface sm:aspect-[2/1] lg:aspect-[16/9]">
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
      <div className="relative aspect-video overflow-hidden border border-charcoal/15 bg-surface sm:aspect-[2/1] lg:aspect-[16/9]">
        <Image
          key={mainImage}
          src={mainImage}
          alt={title}
          fill
          preload
          sizes="(max-width: 640px) calc(100vw - 2.5rem), (max-width: 1023px) calc(100vw - 4rem), (max-width: 1279px) calc(100vw - 33rem), calc(100vw - 37rem)"
          className="object-cover"
        />
      </div>

      <div className="relative mt-3">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] scrollbar-width:none [&::-webkit-scrollbar]:hidden"
        >
          {gallery.map((image, index) => (
            <button
              key={image}
              ref={(node) => {
                thumbRefs.current[index] = node;
              }}
              type="button"
              aria-current={index === activeIndex ? "true" : undefined}
              aria-label={`${imageLabel} ${index + 1}`}
              onClick={() => selectImage(index)}
              className="button-polish relative aspect-video w-[58%] shrink-0 snap-start overflow-hidden border bg-surface transition sm:w-[calc((100%-1.5rem)/3)] lg:w-[calc((100%-3rem)/5)] xl:w-[calc((100%-3.75rem)/6)] data-[active=true]:border-earth data-[active=true]:ring-2 data-[active=true]:ring-earth/25"
              data-active={index === activeIndex}
            >
              <Image
                src={image}
                alt={`${title}, ${imageLabel} ${index + 1}`}
                fill
                sizes="(max-width: 640px) 58vw, (max-width: 1023px) 33vw, (max-width: 1279px) 16vw, 12vw"
                className="object-cover transition duration-300 data-[active=true]:scale-[1.02]"
                data-active={index === activeIndex}
              />
              <span
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-earth opacity-0 transition data-[active=true]:opacity-100"
                data-active={index === activeIndex}
              />
            </button>
          ))}
        </div>

        {hasControls ? (
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              aria-label={`${imageLabel} truoc`}
              onClick={() => stepImage(-1)}
              className="button-polish grid size-10 place-items-center border border-brand/25 bg-white text-brand transition hover:border-brand hover:bg-gold hover:text-ink"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={`${imageLabel} tiep theo`}
              onClick={() => stepImage(1)}
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
