"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { BusinessFieldCard } from "@/components/ui/business-field-card";
import { interpolate, type Dictionary } from "@/lib/i18n/get-dictionary";
import { trackTransform } from "@/components/sections/news-slider";

const BREAKPOINT_TABLET = 768;
const BREAKPOINT_DESKTOP = 1024;
const GAP_PX = 16;

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
  const [rawActiveIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    function sync() {
      setVisibleCount(visibleCountFor(window.innerWidth));
    }
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const maxIndex = Math.max(0, count - visibleCount);
  const activeIndex = Math.min(rawActiveIndex, maxIndex);
  const isInteractive = maxIndex > 0;
  const positionCount = maxIndex + 1;

  function goToPrevious() {
    setActiveIndex(activeIndex === 0 ? maxIndex : activeIndex - 1);
  }

  function goToNext() {
    setActiveIndex(activeIndex === maxIndex ? 0 : activeIndex + 1);
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
  const transform = trackTransform(activeIndex, visibleCount, GAP_PX);

  return (
    <div
      className="relative mt-10"
      role="group"
      aria-roledescription="carousel"
      aria-label={labels.regionLabel}
      onKeyDown={handleKeyDown}
    >
      <div className="overflow-hidden">
        <ul
          data-testid="business-fields-track"
          className="flex list-none gap-4 p-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{ transform }}
        >
          {fields.map((item, index) => {
            const isVisible =
              index >= activeIndex && index < activeIndex + visibleCount;
            return (
              <li
                key={item.title}
                data-testid="business-field-slide"
                data-visible={isVisible ? "true" : "false"}
                aria-hidden={isVisible ? undefined : "true"}
                className="shrink-0"
                style={{ width: slideWidth }}
              >
                <div className="h-full [&>article]:h-full">
                  <BusinessFieldCard
                    item={item}
                    index={index}
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
                onClick={() => setActiveIndex(index)}
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
