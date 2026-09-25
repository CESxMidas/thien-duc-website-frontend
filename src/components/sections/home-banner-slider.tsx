"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import {
  KeyboardEvent,
  TouchEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import type { HomeBanner } from "@/data/banners";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { interpolate, type Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";

const AUTOPLAY_MS = 4500;
const TRANSITION_MS = 600;
const KEN_BURNS_MS = AUTOPLAY_MS + 200;

const MANUAL_PAUSE_MS = 12000;
const SWIPE_THRESHOLD_PX = 48;
const AUTOPLAY_TOGGLE_ATTR = "data-banner-autoplay-toggle";

function isAutoplayToggle(target: EventTarget | null): boolean {
  return (
    target instanceof Element && target.closest(`[${AUTOPLAY_TOGGLE_ATTR}]`) !== null
  );
}

type HomeBannerSliderProps = {
  banners: HomeBanner[];
  locale: Locale;
  contactCtaLabel: string;
  labels: Dictionary["homeBanner"];
};

export function HomeBannerSlider({
  banners,
  locale,
  contactCtaLabel,
  labels,
}: HomeBannerSliderProps) {
  const bannerCount = banners.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [manualPaused, setManualPaused] = useState(false);

  const [userStopped, setUserStopped] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const manualPauseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const activeBanner = banners[activeIndex];
  const hasTextCopy = Boolean(
    activeBanner?.eyebrow || activeBanner?.title || activeBanner?.subtitle,
  );
  const hasPrimaryCta = Boolean(activeBanner?.ctaLabel);
  const autoplayEnabled = bannerCount > 1 && !reducedMotion;
  const isPaused = hoverPaused || tabHidden || manualPaused || userStopped;

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

  function toggleAutoplay() {
    const resuming = userStopped;
    setUserStopped(!userStopped);

    if (resuming) {
      if (manualPauseTimer.current) clearTimeout(manualPauseTimer.current);
      setManualPaused(false);
    }
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

  if (bannerCount === 0 || !activeBanner) {
    return null;
  }

  return (
    <section
      className="relative overflow-hidden border-b border-earth/25 bg-ink"
      aria-label={labels.regionLabel}
      aria-roledescription="carousel"
      onPointerEnter={() => setHoverPaused(true)}
      onPointerLeave={() => setHoverPaused(false)}

      onFocus={(event) => {
        if (!isAutoplayToggle(event.target)) setHoverPaused(true);
      }}
      onBlur={(event) => {
        if (!isAutoplayToggle(event.target)) setHoverPaused(false);
      }}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative h-[clamp(32rem,75svh,51.25rem)]">
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
                className={`object-cover transition ease-out ${
                  isActive && !reducedMotion ? "scale-105" : "scale-100"
                }`}
                style={{
                  objectPosition: banner.objectPosition ?? "center center",
                  transitionDuration: `${KEN_BURNS_MS}ms`,
                }}
              />
            </div>
          );
        })}

        {hasTextCopy ? (
          <div className="absolute inset-0 z-20 bg-[linear-gradient(90deg,rgba(41,41,41,0.70)_0%,rgba(41,41,41,0.46)_30%,rgba(41,41,41,0.08)_64%,rgba(41,41,41,0.16)_100%)]" />
        ) : null}
        <div className="absolute inset-x-0 bottom-0 z-20 h-[42%] bg-gradient-to-t from-ink/58 via-ink/18 to-transparent" />

        {!activeBanner.title ? <h1 className="sr-only">Thiên Đức</h1> : null}

        {autoplayEnabled ? (
          <div className="absolute inset-x-0 top-0 z-20 h-1 bg-white/20">
            <div
              key={activeIndex}
              className="banner-progress h-full bg-gold"
              onAnimationEnd={handleProgressEnd}
              style={{
                animationDuration: `${AUTOPLAY_MS}ms`,
                animationPlayState: isPaused ? "paused" : "running",
              }}
            />
          </div>
        ) : null}

        {hasTextCopy ? (
          <div className="pointer-events-none absolute inset-x-0 top-[clamp(5rem,13svh,8.25rem)] z-30 px-5 sm:px-10 lg:px-16 xl:px-20">
            <div className="w-full max-w-[36rem]">
              <div
                key={`${activeBanner.image}-${activeBanner.title ?? ""}`}
                className={`pointer-events-auto flex flex-col justify-between text-white ${
                  reducedMotion ? "" : "banner-copy-in"
                }`}
              >
                {activeBanner.eyebrow ? (
                  <div className="mb-4 sm:mb-5">
                    <p className="text-eyebrow text-white/75">
                      {activeBanner.eyebrow}
                    </p>
                  </div>
                ) : null}
                <div className="flex min-w-0 flex-col justify-between gap-3 sm:gap-4">
                  {activeBanner.title ? (
                    <h1 className="line-clamp-3 max-w-[12ch] font-display text-[2.1rem] font-medium uppercase leading-[1.08] tracking-[0.01em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.22)] min-[380px]:text-[2.45rem] sm:max-w-[13ch] sm:text-[2.85rem] md:text-[3.2rem] lg:text-[3.85rem]">
                      {activeBanner.title}
                    </h1>
                  ) : null}

                  {activeBanner.subtitle ? (
                    <p className="mt-1 line-clamp-3 max-w-[31rem] text-sm font-medium leading-6 text-white/86 sm:mt-2 sm:text-base sm:leading-7 lg:text-lg">
                      {activeBanner.subtitle}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div
          data-testid="banner-contact-actions"
          className="pointer-events-none absolute inset-x-0 bottom-[clamp(4.75rem,9svh,6.5rem)] z-30 px-5 sm:px-10 lg:px-16 xl:px-20"
        >
          <div className="pointer-events-auto flex w-fit max-w-[min(36rem,calc(100vw-2.5rem))] flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
            {hasPrimaryCta ? (
              <Link
                href={localizePath(activeBanner.href, locale)}
                className="button-polish inline-flex min-h-12 max-w-full items-center justify-center border border-gold bg-gold px-5 py-3 text-center text-[0.78rem] font-bold uppercase leading-tight tracking-[0.08em] text-ink shadow-[0_14px_32px_rgba(41,41,41,0.26)] transition hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-charcoal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ivory xl:px-6 xl:text-sm xl:tracking-[0.1em]"
              >
                {activeBanner.ctaLabel}
              </Link>
            ) : null}
            <Link
              href={localizePath(routes.contact, locale)}
              className="link-arrow inline-flex min-h-11 items-center gap-2 border border-white/55 bg-ink/45 px-5 py-3 text-[0.78rem] font-bold uppercase leading-tight tracking-[0.08em] text-white shadow-[0_12px_28px_rgba(41,41,41,0.22)] underline-offset-4 transition hover:-translate-y-0.5 hover:border-gold hover:bg-gold hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ivory xl:min-h-12 xl:text-sm xl:tracking-[0.1em]"
            >
              {contactCtaLabel}
            </Link>
          </div>
        </div>

        <div className="absolute bottom-6 right-5 z-30 flex items-center gap-2 sm:bottom-7 sm:right-7">
        
          {autoplayEnabled ? (
            <button
              type="button"
              data-testid="banner-autoplay-toggle"
              {...{ [AUTOPLAY_TOGGLE_ATTR]: "" }}
              data-paused={userStopped}
              aria-label={userStopped ? labels.ariaPlay : labels.ariaPause}
              onClick={toggleAutoplay}
              className={`button-polish grid size-11 place-items-center border transition-colors md:size-11 ${
                userStopped
                  ? "border-gold bg-gold text-ink"
                  : "border-white/40 bg-ink/30 text-white hover:border-gold hover:bg-gold hover:text-ink"
              }`}
            >
              {userStopped ? (
                <Play className="size-5" aria-hidden="true" />
              ) : (
                <Pause className="size-5" aria-hidden="true" />
              )}
            </button>
          ) : null}
          <button
            type="button"
            aria-label={labels.ariaPrevious}
            onClick={goToPrevious}
          
            className="button-polish hidden size-9 place-items-center border border-white/40 bg-ink/30 text-white hover:border-ivory hover:bg-ivory hover:text-charcoal focus:outline-none focus:ring-2 focus:ring-ivory focus:ring-offset-2 focus:ring-offset-ink sm:grid md:size-11"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label={labels.ariaNext}
            onClick={goToNext}
            className="button-polish hidden size-9 place-items-center border border-white/40 bg-ink/30 text-white hover:border-ivory hover:bg-ivory hover:text-charcoal focus:outline-none focus:ring-2 focus:ring-ivory focus:ring-offset-2 focus:ring-offset-ink sm:grid md:size-11"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

       
        <div className="pointer-events-none absolute inset-x-0 bottom-2 z-30 hidden justify-start px-20 2xl:flex">
          <div className="pointer-events-auto flex items-center gap-3 text-white">
            {banners.map((banner, index) => (
              <button
                key={banner.image}
                type="button"
                aria-label={interpolate(labels.ariaGoTo, {
                  index: String(index + 1),
                })}
                aria-current={index === activeIndex}
                onClick={() => goToSlide(index)}
                className={`min-h-10 text-sm font-semibold transition-colors ${
                  index === activeIndex
                    ? "text-white"
                    : "text-white/58 hover:text-white"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </button>
            ))}
            <span className="ml-2 h-px w-28 bg-white/55" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
