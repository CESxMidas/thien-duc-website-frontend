"use client";

import Image from "next/image";
import { TouchEvent, useEffect, useRef, useState } from "react";
import type { HomeBanner } from "@/data/banners";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

const AUTOPLAY_MS = 7000;
const TRANSITION_MS = 1200;
const MANUAL_PAUSE_MS = 12000;
const SWIPE_THRESHOLD_PX = 48;

type HomeBannerSliderProps = {
  banners: HomeBanner[];
  locale: Locale;
  contactCtaLabel: string;
  labels: Dictionary["homeBanner"];
};

export function HomeBannerSlider({
  banners,
  labels,
}: HomeBannerSliderProps) {
  const bannerCount = banners.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [tabHidden, setTabHidden] = useState(false);
  const [manualPaused, setManualPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const manualPauseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const activeBanner = banners[activeIndex];
  const autoplayEnabled = bannerCount > 1 && !reducedMotion;
  const isPaused = tabHidden || manualPaused;

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

  useEffect(() => {
    if (!autoplayEnabled || isPaused) return;

    const timer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % bannerCount);
    }, AUTOPLAY_MS);

    return () => window.clearTimeout(timer);
  }, [activeIndex, autoplayEnabled, bannerCount, isPaused]);

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
    setActiveIndex((current) =>
      current === 0 ? bannerCount - 1 : current - 1,
    );
  }

  function goToNext() {
    pauseForManualInteraction();
    setActiveIndex((current) => (current + 1) % bannerCount);
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

  if (bannerCount === 0 || !activeBanner) {
    return null;
  }

  return (
    <section
      className="relative overflow-hidden border-b border-earth/25 bg-ink"
      aria-label={labels.regionLabel}
      aria-roledescription="carousel"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative h-[clamp(18rem,33.333vw,40rem)]">
        {banners.map((banner, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={banner.image}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} / ${bannerCount}`}
              aria-hidden={!isActive}
              inert={!isActive}
              className={`absolute inset-0 transition-opacity ease-in-out ${
                isActive ? "z-10 opacity-100" : "z-0 opacity-0"
              }`}
              style={{ transitionDuration: `${TRANSITION_MS}ms` }}
            >
              <Image
                src={banner.image}
                alt={banner.title || labels.regionLabel}
                fill
                preload={index === 0}
                loading={index === 0 ? undefined : "lazy"}
                quality={90}
                sizes="100vw"
                className="object-cover"
                style={{
                  objectPosition: banner.objectPosition ?? "center center",
                }}
              />
            </div>
          );
        })}

        {!activeBanner.title ? <h1 className="sr-only">Thien Duc</h1> : null}
      </div>
    </section>
  );
}
