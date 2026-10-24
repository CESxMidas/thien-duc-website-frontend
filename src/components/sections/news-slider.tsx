"use client";

import { CarouselAutoplay } from "@/components/ui/carousel-autoplay";
import {
  CAROUSEL_TRACK_CLASS,
  CAROUSEL_TRANSITION_MS,
  useCarouselPlayback,
} from "@/lib/use-carousel-playback";
import { useLoopCarousel } from "@/lib/use-loop-carousel";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { NewsPost } from "@/types/content";
import { formatDate } from "@/lib/format";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { interpolate, type Dictionary } from "@/lib/i18n/get-dictionary";
import { getNewsDisplayDate } from "@/lib/news-related";
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
  const playback = useCarouselPlayback();

  const [viewportCount, setVisibleCount] = useState(3);
  const visibleCount = Math.min(viewportCount, Math.max(count, 1));

  useEffect(() => {
    function sync() {
      setVisibleCount(visibleCountFor(window.innerWidth));
    }
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const isInteractive = count > 1;
  const positionCount = count;
  const loop = useLoopCarousel(
    isInteractive ? count : 0,
    CAROUSEL_TRANSITION_MS,
  );
  const displayIndex = loop.activeIndex;
  const edgeCount = isInteractive ? visibleCount : 0;
  const activeIndex = isInteractive ? edgeCount + loop.position - 1 : 0;
  const loopSlides = isInteractive
    ? [...posts.slice(-edgeCount), ...posts, ...posts.slice(0, edgeCount)]
    : posts;

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
  const transform = trackTransform(activeIndex, visibleCount);

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
        index={displayIndex}
        enabled={isInteractive}
        paused={playback.paused}
        reducedMotion={playback.reducedMotion}
        onNext={goToNext}
        testId="news-slider-progress"
      />
      <div className="overflow-hidden">
        <ul
          data-testid="news-slider-track"
          data-index={displayIndex}
          className={`flex list-none gap-5 p-0 ${CAROUSEL_TRACK_CLASS}`}
          style={{
            transform,
            transitionProperty: loop.animate ? "transform" : "none",
          }}
          onTransitionEnd={loop.onTransitionEnd}
        >
          {loopSlides.map((post, index) => {
            const isClone = index < edgeCount || index >= edgeCount + count;
            const isVisible =
              index >= activeIndex && index < activeIndex + visibleCount;
            const displayDate = getNewsDisplayDate(post);

            return (
              <li
                key={`${post.slug}-${isClone ? "clone" : "slide"}-${index}`}
                data-testid={isClone ? undefined : "news-slide"}
                data-visible={isVisible ? "true" : "false"}
                aria-hidden={isVisible ? undefined : "true"}
                inert={!isVisible}
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
                  <div className="carousel-card-body">
                    {displayDate ? (
                      <p className="td-card-meta text-sm text-slate">
                        {formatDate(displayDate, locale)}
                      </p>
                    ) : null}
                    <h3 className="td-card-title mt-3 text-xl font-semibold">
                      {post.title}
                    </h3>
                    <span className="link-arrow mt-auto text-sm font-semibold text-brand">
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
            <div
              data-testid="news-slider-dots"
              className="flex items-center gap-2"
            >
              {Array.from({ length: positionCount }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={interpolate(labels.ariaGoTo, {
                    index: String(index + 1),
                  })}
                  aria-current={index === displayIndex ? "true" : undefined}
                  onClick={() => loop.goTo(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === displayIndex
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
                current: String(displayIndex + 1),
                total: String(positionCount),
              })}
            </p>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              data-testid="news-slider-previous"
              aria-label={labels.ariaPrevious}
              onClick={goToPrevious}
              className="button-polish grid size-10 place-items-center border border-brand/25 bg-white text-brand transition hover:border-brand hover:bg-gold hover:text-ink"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              data-testid="news-slider-next"
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
          current: String(displayIndex + 1),
          total: String(count),
        })}
      </p>
    </div>
  );
}
