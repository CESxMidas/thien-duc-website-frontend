"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  Pause,
  PhoneCall,
  Play,
  Search,
  Send,
  X,
} from "lucide-react";
import { KeyboardEvent, TouchEvent, useEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { zaloContact, zaloDisplayValue } from "@/config/site";
import { mainNavigation } from "@/data/navigation";
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
    target instanceof Element &&
    target.closest(`[${AUTOPLAY_TOGGLE_ATTR}]`) !== null
  );
}

type HomeBannerSliderProps = {
  banners: HomeBanner[];
  locale: Locale;
  contactCtaLabel: string;
  labels: Dictionary["homeBanner"];
  utilityLabels: {
    offerCta: string;
    languageSwitcher: string;
    searchLabel: string;
    searchPlaceholder: string;
    searchSubmit: string;
    closeMenu: string;
    openMenu: string;
  };
};

export function HomeBannerSlider({
  banners,
  locale,
  contactCtaLabel,
  labels,
  utilityLabels,
}: HomeBannerSliderProps) {
  const bannerCount = banners.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [manualPaused, setManualPaused] = useState(false);
  const [utilityMenuOpen, setUtilityMenuOpen] = useState(false);
  const [utilitySearchOpen, setUtilitySearchOpen] = useState(false);

  const [userStopped, setUserStopped] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const manualPauseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const utilitySearchInputRef = useRef<HTMLInputElement>(null);
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

  useEffect(() => {
    const close = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setUtilityMenuOpen(false);
        setUtilitySearchOpen(false);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  useEffect(() => {
    if (!utilitySearchOpen) return;
    utilitySearchInputRef.current?.focus();
  }, [utilitySearchOpen]);

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
      className="relative -mt-0 overflow-hidden border-b border-earth/25 bg-ink"
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
      <div className="relative h-svh min-h-[40rem]">
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

        <div
          data-testid="banner-utility-bar"
          className="banner-utility-in absolute right-4 top-5 z-40 flex max-w-[calc(100vw-2rem)] items-center justify-end gap-2 rounded-[8px] bg-olive/92 px-3 py-2 text-white shadow-[0_18px_46px_rgba(41,41,41,0.24)] sm:right-6 sm:top-7 sm:px-4 lg:right-14 xl:right-20"
        >
          <Link
            href={localizePath(routes.contact, locale)}
            className="hidden min-h-11 items-center gap-2 text-[0.78rem] font-extrabold uppercase tracking-[0.04em] text-white transition hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold md:inline-flex"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-gold text-gold">
              <Send className="size-4.5" aria-hidden="true" />
            </span>
            <span className="hidden lg:inline">{utilityLabels.offerCta}</span>
          </Link>

          <a
            href={`tel:${zaloContact.value}`}
            className="hidden min-h-11 items-center gap-2 text-sm font-extrabold text-white transition hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold sm:inline-flex"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-gold text-gold">
              <PhoneCall className="size-4.5" aria-hidden="true" />
            </span>
            <span>{zaloDisplayValue()}</span>
          </a>

          <div className="relative">
            <button
              type="button"
              aria-label={utilityLabels.searchLabel}
              aria-expanded={utilitySearchOpen}
              aria-controls="banner-search-panel"
              onClick={() => {
                setUtilitySearchOpen((open) => !open);
                setUtilityMenuOpen(false);
              }}
              className={`grid size-11 place-items-center rounded-full border border-white/32 text-white transition hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold ${
                utilitySearchOpen ? "border-gold bg-white/12 text-gold" : ""
              }`}
            >
              <Search className="size-5" aria-hidden="true" />
            </button>

            {utilitySearchOpen ? (
              <form
                id="banner-search-panel"
                role="search"
                action={localizePath(routes.search, locale)}
                className="absolute right-0 top-[calc(100%+0.75rem)] flex w-[min(26rem,calc(100vw-2rem))] origin-top-right animate-[searchPopoverIn_220ms_var(--ease-out-quart)_both] items-center overflow-hidden rounded-[8px] border border-earth/16 bg-ivory/96 shadow-[0_22px_60px_rgba(41,41,41,0.18)] backdrop-blur-md"
              >
                <label htmlFor="banner-search-input" className="sr-only">
                  {utilityLabels.searchLabel}
                </label>
                <Search
                  className="ml-4 size-4.5 shrink-0 text-earth/65"
                  aria-hidden="true"
                />
                <input
                  ref={utilitySearchInputRef}
                  id="banner-search-input"
                  name="q"
                  type="search"
                  placeholder={utilityLabels.searchPlaceholder}
                  className="h-14 min-w-0 flex-1 bg-transparent px-3.5 text-[0.9rem] font-medium text-charcoal outline-none placeholder:text-charcoal/42"
                />
                <button
                  type="submit"
                  aria-label={utilityLabels.searchSubmit}
                  className="mr-1 grid h-12 w-12 shrink-0 place-items-center rounded-[6px] bg-earth text-ivory transition hover:bg-gold hover:text-ink"
                >
                  <Search className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label={utilityLabels.closeMenu}
                  onClick={() => setUtilitySearchOpen(false)}
                  className="mr-1 grid h-12 w-10 shrink-0 place-items-center text-charcoal/45 transition hover:text-charcoal"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </form>
            ) : null}
          </div>

          <LanguageSwitcher
            locale={locale}
            label={utilityLabels.languageSwitcher}
            showIcon={false}
            variant="light"
            className="hidden sm:inline-flex"
          />

          <div className="relative">
            <button
              type="button"
              aria-label={
                utilityMenuOpen
                  ? utilityLabels.closeMenu
                  : utilityLabels.openMenu
              }
              aria-expanded={utilityMenuOpen}
              aria-controls="banner-navigation"
              onClick={() => {
                setUtilityMenuOpen((open) => !open);
                setUtilitySearchOpen(false);
              }}
              className="inline-flex min-h-11 items-center gap-2 text-white transition hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              {utilityMenuOpen ? (
                <X className="size-8" aria-hidden="true" />
              ) : (
                <Menu className="size-8" aria-hidden="true" />
              )}
              <span className="hidden text-[0.7rem] font-extrabold uppercase tracking-[0.14em] [writing-mode:vertical-rl] sm:inline">
                Menu
              </span>
            </button>

            {utilityMenuOpen ? (
              <nav
                id="banner-navigation"
                className="absolute right-0 top-[calc(100%+0.75rem)] w-[min(19rem,calc(100vw-2rem))] rounded-[8px] border border-white/16 bg-olive/96 p-3 text-white shadow-[0_22px_60px_rgba(41,41,41,0.2)] backdrop-blur-md"
                aria-label="Banner navigation"
              >
                <ul className="divide-y divide-white/12">
                  {mainNavigation.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={localizePath(item.href, locale)}
                        onClick={() => setUtilityMenuOpen(false)}
                        className="flex min-h-11 items-center justify-between rounded-[6px] px-3 text-[0.8rem] font-extrabold uppercase tracking-[0.1em] text-white transition hover:bg-white/10 hover:text-gold"
                      >
                        {item.label}
                        <span aria-hidden="true">↗</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </div>
        </div>

        {hasTextCopy ? (
          <div className="pointer-events-none absolute inset-x-0 top-[clamp(9.5rem,24svh,14rem)] z-30 px-5 sm:px-10 lg:px-16 xl:px-20">
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
          className="pointer-events-none absolute inset-x-0 bottom-[clamp(5rem,10svh,7rem)] z-30 px-5 sm:px-10 lg:px-16 xl:px-20"
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
