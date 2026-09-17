"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { NewsPost } from "@/types/content";
import { formatDate } from "@/lib/format";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { interpolate, type Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";

const BREAKPOINT_TABLET = 768;
const BREAKPOINT_DESKTOP = 1024;

const GAP_PX = 20;


const MAX_DOTS = 8;

function visibleCountFor(width: number): number {
  if (width >= BREAKPOINT_DESKTOP) return 3;
  if (width >= BREAKPOINT_TABLET) return 2;
  return 1;
}


export function trackTransform(
  activeIndex: number,
  visibleCount: number,
  gapPx: number = GAP_PX,
): string {
  if (activeIndex <= 0) return "translateX(0px)";

  const trackGaps = (visibleCount - 1) * gapPx;
  return `translateX(calc(${-activeIndex} * (100% - ${trackGaps}px) / ${visibleCount} - ${
    activeIndex * gapPx
  }px))`;
}

type NewsSliderProps = {
  posts: NewsPost[];
  locale: Locale;
  labels: Dictionary["newsSlider"];
  detailLabel: string;
};


export function NewsSlider({
  posts,
  locale,
  labels,
  detailLabel,
}: NewsSliderProps) {
  const count = posts.length;
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

  const canGoPrevious = activeIndex > 0;
  const canGoNext = activeIndex < maxIndex;
  const isInteractive = maxIndex > 0;
  const positionCount = maxIndex + 1;

  function goToPrevious() {
    setActiveIndex(Math.max(0, activeIndex - 1));
  }

  function goToNext() {
    setActiveIndex(Math.min(maxIndex, activeIndex + 1));
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
  const transform = trackTransform(activeIndex, visibleCount);

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
          data-testid="news-slider-track"
          className="flex list-none gap-5 p-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{ transform }}
        >
          {posts.map((post, index) => {
    
            const isVisible =
              index >= activeIndex && index < activeIndex + visibleCount;

            return (
              <li
                key={post.slug}
                data-testid="news-slide"
                data-visible={isVisible ? "true" : "false"}
                aria-hidden={isVisible ? undefined : "true"}
                className="shrink-0"
                style={{ width: slideWidth }}
              >
                <Link
                  href={localizePath(`${routes.news}/${post.slug}`, locale)}
                  tabIndex={isVisible ? undefined : -1}
                  className="hover-card group flex h-full flex-col border border-brand/10 bg-white hover:border-brand"
                >
                  {post.image ? (
                    <div className="image-reveal relative aspect-video overflow-hidden bg-surface">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-sm text-slate">
                      {formatDate(post.publishedAt, locale)}
                    </p>
                    <h3 className="mt-3 line-clamp-3 text-xl font-semibold">
                      {post.title}
                    </h3>
                    <span className="link-arrow mt-auto pt-5 text-sm font-semibold text-brand">
                      {detailLabel}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {isInteractive ? (
        <div className="mt-6 flex items-center justify-between gap-4">
         
          {positionCount <= MAX_DOTS ? (
            <div data-testid="news-slider-dots" className="flex items-center gap-2">
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
          ) : (
            <p
              data-testid="news-slider-counter"
              aria-hidden="true"
              className="text-sm font-semibold tabular-nums text-slate"
            >
              {interpolate(labels.counter, {
                current: String(activeIndex + 1),
                total: String(positionCount),
              })}
            </p>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              data-testid="news-slider-previous"
              aria-label={labels.ariaPrevious}
              disabled={!canGoPrevious}
              onClick={goToPrevious}
              className="button-polish grid size-10 place-items-center border border-brand/25 bg-white text-brand transition hover:border-brand hover:bg-gold hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-brand/25 disabled:hover:bg-white disabled:hover:text-brand"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              data-testid="news-slider-next"
              aria-label={labels.ariaNext}
              disabled={!canGoNext}
              onClick={goToNext}
              className="button-polish grid size-10 place-items-center border border-brand/25 bg-white text-brand transition hover:border-brand hover:bg-gold hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-brand/25 disabled:hover:bg-white disabled:hover:text-brand"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}

      <p aria-live="polite" className="sr-only">
        {interpolate(labels.status, {
          current: String(activeIndex + 1),
          total: String(count),
        })}
      </p>
    </div>
  );
}
