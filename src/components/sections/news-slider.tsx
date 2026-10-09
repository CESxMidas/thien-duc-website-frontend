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
const AUTOPLAY_INTERVAL_MS = 3000;

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
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    function sync() {
      setVisibleCount(visibleCountFor(window.innerWidth));
    }
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  useEffect(() => {
    if (!window.matchMedia) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPrefersReducedMotion(media.matches);

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const maxIndex = Math.max(0, count - visibleCount);


  const activeIndex = Math.min(rawActiveIndex, count);

  const isInteractive = maxIndex > 0;
  const positionCount = count;
  const loopSlides = isInteractive
    ? [...posts, ...posts.slice(0, visibleCount)]
    : posts;
  const displayIndex = count > 0 ? activeIndex % count : 0;

  function goToPrevious() {
    setIsTransitionEnabled(true);
    setActiveIndex(displayIndex <= 0 ? count - 1 : displayIndex - 1);
  }

  function goToNext() {
    setIsTransitionEnabled(true);
    setActiveIndex(activeIndex >= count ? 1 : activeIndex + 1);
  }

  useEffect(() => {
    if (!isInteractive || isPaused || prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => {
        if (current >= count) return 1;
        return current + 1;
      });
    }, AUTOPLAY_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [count, isInteractive, isPaused, prefersReducedMotion]);

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
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div className="overflow-hidden">
        <ul
          data-testid="news-slider-track"
          className={[
            "flex list-none gap-5 p-0 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
            isTransitionEnabled
              ? "transition-transform duration-500"
              : "transition-none",
          ].join(" ")}
          style={{ transform }}
          onTransitionEnd={() => {
            if (activeIndex !== count) return;

            setIsTransitionEnabled(false);
            setActiveIndex(0);
            window.requestAnimationFrame(() => {
              window.requestAnimationFrame(() => setIsTransitionEnabled(true));
            });
          }}
        >
          {loopSlides.map((post, index) => {
            const isClone = index >= count;
            const isVisible =
              index >= activeIndex && index < activeIndex + visibleCount;

            return (
              <li
                key={`${post.slug}-${isClone ? "clone" : "slide"}-${index}`}
                data-testid={isClone ? undefined : "news-slide"}
                data-visible={isVisible ? "true" : "false"}
                aria-hidden={isVisible && !isClone ? undefined : "true"}
                className="shrink-0"
                style={{ width: slideWidth }}
              >
                <Link
                  href={localizePath(`${routes.news}/${post.slug}`, locale)}
                  tabIndex={isVisible && !isClone ? undefined : -1}
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
                    <p className="td-card-meta text-sm text-slate">
                      {formatDate(post.publishedAt, locale)}
                    </p>
                    <h3 className="td-card-title mt-3 text-xl font-semibold">
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
                  aria-current={index === displayIndex ? "true" : undefined}
                  onClick={() => setActiveIndex(index)}
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
