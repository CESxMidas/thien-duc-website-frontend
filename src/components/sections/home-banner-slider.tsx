"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  KeyboardEvent,
  TouchEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { homeBanners } from "@/data/banners";
import { routes } from "@/lib/routes";

const AUTOPLAY_MS = 7000;
const MANUAL_PAUSE_MS = 12000;
const SWIPE_THRESHOLD_PX = 48;
const bannerCount = homeBanners.length;

export function HomeBannerSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [manualPaused, setManualPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const manualPauseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const activeBanner = homeBanners[activeIndex];
  const autoplayEnabled = bannerCount > 1 && !reducedMotion;
  const isPaused = hoverPaused || tabHidden || manualPaused;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);

    const syncVisibility = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", syncVisibility);

    return () => {
      query.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", syncVisibility);
      if (manualPauseTimer.current) clearTimeout(manualPauseTimer.current);
    };
  }, []);

  /** Người dùng tự điều khiển → tạm dừng autoplay 12s rồi chạy tiếp. */
  function pauseForManualInteraction() {
    setManualPaused(true);
    if (manualPauseTimer.current) clearTimeout(manualPauseTimer.current);
    manualPauseTimer.current = setTimeout(
      () => setManualPaused(false),
      MANUAL_PAUSE_MS,
    );
  }

  function goToPrevious() {
    pauseForManualInteraction();
    setActiveIndex((current) => (current === 0 ? bannerCount - 1 : current - 1));
  }

  function goToNext() {
    pauseForManualInteraction();
    setActiveIndex((current) => (current + 1) % bannerCount);
  }

  function goToSlide(index: number) {
    pauseForManualInteraction();
    setActiveIndex(index);
  }

  function handleProgressEnd() {
    if (autoplayEnabled && !isPaused) {
      setActiveIndex((current) => (current + 1) % bannerCount);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToPrevious();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goToNext();
    }
  }

  function handleTouchStart(event: TouchEvent<HTMLElement>) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: TouchEvent<HTMLElement>) {
    if (touchStartX.current === null) return;
    const deltaX =
      (event.changedTouches[0]?.clientX ?? touchStartX.current) -
      touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;
    if (deltaX < 0) goToNext();
    else goToPrevious();
  }

  return (
    <section
      className="relative overflow-hidden bg-[#3d2a16]"
      aria-label="Banner dự án nổi bật"
      aria-roledescription="carousel"
      onPointerEnter={() => setHoverPaused(true)}
      onPointerLeave={() => setHoverPaused(false)}
      onFocus={() => setHoverPaused(true)}
      onBlur={() => setHoverPaused(false)}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative h-[clamp(480px,75svh,820px)]">
        {homeBanners.map((banner, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={banner.image}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} / ${bannerCount}`}
              aria-hidden={!isActive}
              inert={!isActive}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "z-10 opacity-100" : "z-0 opacity-0"
              }`}
            >
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                preload={index === 0}
                loading={index === 0 ? undefined : "lazy"}
                sizes="100vw"
                className={`object-cover transition duration-[7200ms] ease-out ${
                  isActive && !reducedMotion ? "scale-105" : "scale-100"
                }`}
                style={{ objectPosition: banner.objectPosition ?? "center center" }}
              />
            </div>
          );
        })}

        <div className="absolute inset-0 z-20 bg-[linear-gradient(90deg,rgba(25,25,25,0.72)_0%,rgba(25,25,25,0.42)_43%,rgba(25,25,25,0.08)_100%)]" />
        <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_18%_78%,rgba(253,205,4,0.18),transparent_32%)]" />

        {autoplayEnabled ? (
          <div className="absolute inset-x-0 top-0 z-20 h-1 bg-white/20">
            <div
              key={activeIndex}
              className="banner-progress h-full bg-[#fdcd04]"
              onAnimationEnd={handleProgressEnd}
              style={{
                animationDuration: `${AUTOPLAY_MS}ms`,
                animationPlayState: isPaused ? "paused" : "running",
              }}
            />
          </div>
        ) : null}

        <div className="absolute inset-x-0 bottom-16 z-30 px-6 sm:bottom-20">
          <div className="mx-auto max-w-7xl">
            <div
              key={activeBanner.title}
              className={`flex max-w-2xl flex-col justify-between border border-white/15 bg-[#191919]/28 p-5 text-white shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-sm sm:p-7 ${
                reducedMotion ? "" : "banner-copy-in"
              }`}
            >
              <div className="mb-4 flex items-center gap-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#fdcd04] sm:text-sm">
                  {activeBanner.eyebrow}
                </p>
                <span className="h-px flex-1 bg-white/25" aria-hidden="true" />
              </div>
              <div className="flex items-start gap-4">
                <p className="hidden text-sm font-semibold text-white/70 sm:block">
                  {String(activeIndex + 1).padStart(2, "0")}
                  <span className="mx-2 text-white/30">/</span>
                  {String(bannerCount).padStart(2, "0")}
                </p>
                <div className="flex flex-col justify-between gap-4">
                  <h1 className="line-clamp-2 text-[1.35rem] font-semibold leading-tight sm:text-3xl lg:text-4xl">
                    {activeBanner.title}
                  </h1>
                  <p className="mt-3 line-clamp-3 max-w-xl text-sm leading-6 text-white/85 sm:text-base lg:text-lg">
                    {activeBanner.subtitle}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href={activeBanner.href}
                      className="button-polish inline-flex h-11 items-center bg-[#fdcd04] px-5 text-sm font-semibold text-[#191919] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#fdcd04] focus:ring-offset-2 focus:ring-offset-[#191919]"
                    >
                      {activeBanner.ctaLabel}
                    </Link>
                    <Link
                      href={routes.contact}
                      className="button-polish inline-flex h-11 items-center border border-white/60 px-5 text-sm font-semibold text-white transition hover:border-white hover:bg-white hover:text-[#191919] focus:outline-none focus:ring-2 focus:ring-[#fdcd04] focus:ring-offset-2 focus:ring-offset-[#191919]"
                    >
                      Liên hệ tư vấn
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-5 right-5 z-30 flex items-center gap-2">
          <button
            type="button"
            aria-label="Banner trước"
            onClick={goToPrevious}
            className="button-polish grid size-9 place-items-center border border-white/40 bg-[#191919]/30 text-white backdrop-blur hover:border-[#fdcd04] hover:bg-[#fdcd04] hover:text-[#191919] focus:outline-none focus:ring-2 focus:ring-[#fdcd04] focus:ring-offset-2 focus:ring-offset-[#191919] md:size-11"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Banner tiếp theo"
            onClick={goToNext}
            className="button-polish grid size-9 place-items-center border border-white/40 bg-[#191919]/30 text-white backdrop-blur hover:border-[#fdcd04] hover:bg-[#fdcd04] hover:text-[#191919] focus:outline-none focus:ring-2 focus:ring-[#fdcd04] focus:ring-offset-2 focus:ring-offset-[#191919] md:size-11"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center rounded-full border border-white/20 bg-[#191919]/25 px-1 backdrop-blur">
          {homeBanners.map((banner, index) => (
            <button
              key={banner.image}
              type="button"
              aria-label={`Chuyển tới banner ${index + 1}`}
              aria-current={index === activeIndex}
              onClick={() => goToSlide(index)}
              className="grid min-h-11 min-w-11 place-items-center"
            >
              <span
                className={`block h-2.5 rounded-full transition-all ${
                  index === activeIndex
                    ? "w-9 bg-[#fdcd04]"
                    : "w-2.5 bg-white/70 hover:bg-white"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
