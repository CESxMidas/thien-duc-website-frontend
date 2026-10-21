"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { KeyboardEvent, TouchEvent, useEffect, useRef, useState } from "react";
import type { HomeBanner } from "@/data/banners";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { interpolate, type Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";

const AUTOPLAY_MS = 2000;
const TRANSITION_MS = 1200;
const MANUAL_PAUSE_MS = 12000;
const SWIPE_THRESHOLD_PX = 48;
const AUTOPLAY_TOGGLE_ATTR = "data-banner-autoplay-toggle";

function isAutoplayToggle(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    target.closest(`[${AUTOPLAY_TOGGLE_ATTR}]`) !== null
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
  const [focusPaused, setFocusPaused] = useState(false);
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
  const isPaused = focusPaused || tabHidden || manualPaused || userStopped;

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
    setActiveIndex((current) =>
      current === 0 ? bannerCount - 1 : current - 1,
    );
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
      className="relative overflow-hidden border-x-[0.35rem] border-b-[0.35rem] border-espresso bg-espresso shadow-[inset_0_0_0_1px_rgba(200,164,95,0.18),0_16px_36px_rgba(45,27,19,0.16)] sm:border-x-[0.5rem] sm:border-b-[0.5rem] lg:border-x-[0.75rem] lg:border-b-[0.75rem]"
      aria-label={labels.regionLabel}
      aria-roledescription="carousel"
      onFocus={(event) => {
        if (!isAutoplayToggle(event.target)) setFocusPaused(true);
      }}
      onBlur={(event) => {
        if (!isAutoplayToggle(event.target)) setFocusPaused(false);
      }}
      onPointerEnter={() => setFocusPaused(true)}
      onPointerLeave={() => setFocusPaused(false)}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative h-[clamp(18rem,calc(33.333vw+11rem),33rem)] lg:h-[clamp(18rem,33.333vw,40rem)]">
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
              className={`absolute inset-x-0 bottom-44 top-0 transition-opacity ease-in-out lg:inset-0 ${
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
                className="object-contain lg:object-cover"
                style={{
                  objectPosition: banner.objectPosition ?? "center center",
                }}
              />
            </div>
          );
        })}

        {hasTextCopy ? (
          <div className="absolute inset-x-0 bottom-44 top-0 z-20 bg-espresso/10 lg:inset-0 lg:bg-[linear-gradient(90deg,rgba(34,20,14,0.78)_0%,rgba(63,40,29,0.5)_34%,rgba(63,40,29,0.12)_68%,rgba(34,20,14,0.28)_100%)]" />
        ) : null}
        <div className="absolute inset-x-0 bottom-44 top-0 z-20 bg-gradient-to-t from-ink/20 via-transparent to-transparent lg:bottom-0 lg:h-[34%] lg:top-auto lg:from-ink/44 lg:via-ink/12" />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 z-20 h-44 border-t border-gold/20 bg-[linear-gradient(180deg,#f8f3eb_0%,#efe2cf_100%)] lg:hidden"
        />

        {!activeBanner.title ? <h1 className="sr-only">Thien Duc</h1> : null}

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
          <div className="pointer-events-none absolute inset-x-0 top-[calc(33.333vw+0.75rem)] z-30 px-4 sm:px-8 lg:top-[clamp(3rem,6vw,6.5rem)] lg:px-16 xl:px-20">
            <div className="w-full max-w-[34rem]">
              <div
                key={`${activeBanner.image}-${activeBanner.title ?? ""}`}
                className={`pointer-events-auto flex flex-col justify-between text-white ${
                  reducedMotion ? "" : "banner-copy-in"
                }`}
              >
                {activeBanner.eyebrow ? (
                  <div className="mb-2 sm:mb-4">
                    <p className="text-eyebrow text-earth lg:text-white">
                      {activeBanner.eyebrow}
                    </p>
                  </div>
                ) : null}
                <div className="flex min-w-0 flex-col justify-between gap-3 sm:gap-4">
                  {activeBanner.title ? (
                    <h1 className="line-clamp-2 max-w-[24ch] font-display text-[1.45rem] font-medium uppercase leading-[1.08] tracking-[0.01em] text-charcoal sm:text-[1.75rem] lg:max-w-[15ch] lg:text-[3.05rem] lg:text-white lg:drop-shadow-[0_2px_12px_rgba(0,0,0,0.22)]">
                      {activeBanner.title}
                    </h1>
                  ) : null}

                  {activeBanner.subtitle ? (
                    <p className="mt-1 hidden max-w-[31rem] font-medium text-charcoal/70 lg:mt-2 lg:block lg:line-clamp-2 lg:text-lg lg:leading-7 lg:text-white/86">
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
          className={`pointer-events-none absolute inset-x-0 z-30 px-4 sm:px-8 lg:bottom-[clamp(4.25rem,7vw,6.5rem)] lg:px-16 xl:px-20 ${
            hasTextCopy ? "bottom-3" : "bottom-[4.125rem]"
          }`}
        >
          <div className="pointer-events-auto flex w-full items-center gap-2 sm:w-fit sm:max-w-[min(36rem,calc(100vw-4rem))] lg:flex-wrap lg:gap-x-6">
            {hasPrimaryCta ? (
              <Link
                href={localizePath(activeBanner.href, locale)}
                className="button-polish inline-flex min-h-11 min-w-0 flex-1 items-center justify-center border border-gold bg-gold px-3 py-2.5 text-center text-[0.66rem] font-bold uppercase leading-tight tracking-[0.05em] text-ink shadow-[0_10px_24px_rgba(41,41,41,0.14)] transition hover:-translate-y-0.5 hover:border-earth hover:bg-earth hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-earth sm:flex-none sm:px-5 sm:text-[0.74rem] sm:tracking-[0.07em] lg:min-h-12 lg:py-3 lg:text-[0.78rem] lg:tracking-[0.08em] lg:shadow-[0_14px_32px_rgba(41,41,41,0.26)] lg:hover:border-white lg:hover:bg-white lg:hover:text-charcoal lg:focus-visible:outline-ivory xl:px-6 xl:text-sm xl:tracking-[0.1em]"
              >
                {activeBanner.ctaLabel}
              </Link>
            ) : null}
            <Link
              href={localizePath(routes.contact, locale)}
              className="link-arrow inline-flex min-h-11 min-w-0 flex-1 items-center justify-center gap-2 border border-earth/40 bg-white/80 px-3 py-2.5 text-center text-[0.66rem] font-bold uppercase leading-tight tracking-[0.05em] text-charcoal shadow-[0_10px_24px_rgba(41,41,41,0.08)] underline-offset-4 transition hover:-translate-y-0.5 hover:border-earth hover:bg-earth hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-earth sm:flex-none sm:px-5 sm:text-[0.74rem] sm:tracking-[0.07em] lg:justify-start lg:border-white/70 lg:bg-ink/62 lg:py-3 lg:text-[0.78rem] lg:tracking-[0.08em] lg:text-white lg:shadow-[0_12px_28px_rgba(41,41,41,0.22)] lg:hover:border-gold lg:hover:bg-gold lg:hover:text-ink lg:focus-visible:outline-ivory xl:min-h-12 xl:text-sm xl:tracking-[0.1em]"
            >
              {contactCtaLabel}
            </Link>
          </div>
        </div>

        <div className="absolute right-3 top-3 z-30 flex items-center gap-2 lg:bottom-7 lg:right-7 lg:top-auto">
          {autoplayEnabled ? (
            <button
              type="button"
              data-testid="banner-autoplay-toggle"
              {...{ [AUTOPLAY_TOGGLE_ATTR]: "" }}
              data-paused={userStopped}
              aria-label={userStopped ? labels.ariaPlay : labels.ariaPause}
              onClick={toggleAutoplay}
              className={`button-polish grid size-9 place-items-center border transition-colors lg:size-11 ${
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
            className="button-polish hidden size-11 place-items-center border border-white/40 bg-ink/30 text-white hover:border-ivory hover:bg-ivory hover:text-charcoal focus:outline-none focus:ring-2 focus:ring-ivory focus:ring-offset-2 focus:ring-offset-ink lg:grid"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label={labels.ariaNext}
            onClick={goToNext}
            className="button-polish hidden size-11 place-items-center border border-white/40 bg-ink/30 text-white hover:border-ivory hover:bg-ivory hover:text-charcoal focus:outline-none focus:ring-2 focus:ring-ivory focus:ring-offset-2 focus:ring-offset-ink lg:grid"
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
