"use client";

import { CarouselAutoplay } from "@/components/ui/carousel-autoplay";
import {
  CAROUSEL_TRACK_CLASS,
  CAROUSEL_TRANSITION_MS,
  useCarouselPlayback,
} from "@/lib/use-carousel-playback";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { BusinessFieldCard } from "@/components/ui/business-field-card";
import { interpolate, type Dictionary } from "@/lib/i18n/get-dictionary";
import { trackTransform } from "@/components/sections/news-slider";
import { useLoopCarousel } from "@/lib/use-loop-carousel";

const BREAKPOINT_TABLET = 768;
const BREAKPOINT_DESKTOP = 1024;
const GAP_PX = 20;

function visibleCountFor(width: number): number {
  if (width >= BREAKPOINT_DESKTOP) return 3;
  if (width >= BREAKPOINT_TABLET) return 2;
  return 1;
}

type BusinessFieldsCarouselProps = {
  fields: Dictionary["about"]["fields"];
  codeLabel: string;
  labels: Dictionary["about"]["fieldsCarousel"];
};

export function BusinessFieldsCarousel({
  fields,
  codeLabel,
  labels,
}: BusinessFieldsCarouselProps) {
  const count = fields.length;
  const [viewportCount, setVisibleCount] = useState(3);
  const visibleCount = Math.min(viewportCount, Math.max(count, 1));
  const loop = useLoopCarousel(count, CAROUSEL_TRANSITION_MS);
  const playback = useCarouselPlayback();

  useEffect(() => {
    function sync() {
      setVisibleCount(visibleCountFor(window.innerWidth));
    }
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const activeIndex = loop.activeIndex;
  const isInteractive = count > 1;
  const positionCount = count;
  const renderedFields = isInteractive
    ? [
        ...fields.slice(-visibleCount),
        ...fields,
        ...fields.slice(0, visibleCount),
      ]
    : fields;
  const trackIndex = isInteractive ? visibleCount + loop.position - 1 : 0;

  function goToPrevious() {
    loop.previous();
  }

  function goToNext() {
    loop.next();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!isInteractive) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToPrevious();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goToNext();
    }
  }

  const trackGaps = (visibleCount - 1) * GAP_PX;
  const slideWidth = `calc((100% - ${trackGaps}px) / ${visibleCount})`;
  const transform = trackTransform(trackIndex, visibleCount, GAP_PX);

  return (
    <div
      className="relative mt-10"
      role="group"
      aria-roledescription="carousel"
      aria-label={labels.regionLabel}
      onKeyDown={handleKeyDown}
      {...playback.handlers}
    >
      <CarouselAutoplay
        index={activeIndex}
        enabled={isInteractive}
        paused={playback.paused}
        reducedMotion={playback.reducedMotion}
        onNext={goToNext}
        testId="business-fields-progress"
      />
      <div className="overflow-hidden">
        <ul
          data-testid="business-fields-track"
          className={`flex list-none gap-5 p-0 ${CAROUSEL_TRACK_CLASS}`}
          style={{
            transform,
            transitionProperty: loop.animate ? "transform" : "none",
          }}
          onTransitionEnd={loop.onTransitionEnd}
        >
          {renderedFields.map((item, index) => {
            const isVisible =
              index >= trackIndex && index < trackIndex + visibleCount;
            const originalIndex = isInteractive
              ? (index - visibleCount + count) % count
              : index;
            return (
              <li
                key={`${index}-${item.title}`}
                data-testid="business-field-slide"
                data-visible={isVisible ? "true" : "false"}
                aria-hidden={isVisible ? undefined : "true"}
                inert={!isVisible}
                className="shrink-0"
                style={{ width: slideWidth }}
              >
                <div className="h-full [&>article]:h-full">
                  <BusinessFieldCard
                    item={item}
                    index={originalIndex}
                    codeLabel={codeLabel}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {isInteractive ? (
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {Array.from({ length: positionCount }, (_, index) => (
              <button
                key={index}
                type="button"
                aria-label={interpolate(labels.ariaGoTo, {
                  index: String(index + 1),
                })}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => loop.goTo(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-8 bg-brand"
                    : "w-2.5 bg-brand/25 hover:bg-brand/45"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              data-testid="business-fields-previous"
              aria-label={labels.ariaPrevious}
              onClick={goToPrevious}
              className="button-polish grid size-10 place-items-center border border-brand/25 bg-white text-brand transition hover:border-brand hover:bg-gold hover:text-ink"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              data-testid="business-fields-next"
              aria-label={labels.ariaNext}
              onClick={goToNext}
              className="button-polish grid size-10 place-items-center border border-brand/25 bg-white text-brand transition hover:border-brand hover:bg-gold hover:text-ink"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}

      <p aria-live="polite" className="sr-only">
        {interpolate(labels.status, {
          current: String(activeIndex + 1),
          total: String(positionCount),
        })}
      </p>
    </div>
  );
}
