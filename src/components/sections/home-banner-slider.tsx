"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { homeBanners } from "@/data/banners";

const AUTOPLAY_MS = 5200;

export function HomeBannerSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const activeBanner = homeBanners[activeIndex];

  const nextIndex = useMemo(
    () => (activeIndex + 1) % homeBanners.length,
    [activeIndex],
  );

  useEffect(() => {
    if (paused || homeBanners.length <= 1) {
      return;
    }

    const timer = window.setTimeout(() => {
      setActiveIndex(nextIndex);
    }, AUTOPLAY_MS);

    return () => window.clearTimeout(timer);
  }, [nextIndex, paused]);

  function goToPrevious() {
    setActiveIndex((current) => (current === 0 ? homeBanners.length - 1 : current - 1));
  }

  function goToNext() {
    setActiveIndex((current) => (current + 1) % homeBanners.length);
  }

  return (
    <section
      className="relative overflow-hidden bg-[#c99248]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Banner dự án nổi bật"
    >
      <div className="relative h-[300px] sm:h-[360px] lg:h-[580px]">
        {homeBanners.map((banner, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={banner.image}
              className={`absolute inset-0 transition duration-1000 ease-out ${
                isActive ? "z-10 opacity-100" : "z-0 opacity-0"
              }`}
              aria-hidden={!isActive}
            >
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                preload={index === 0}
                sizes="100vw"
                className={`object-cover transition duration-[6200ms] ease-out ${
                  isActive ? "scale-105" : "scale-100"
                }`}
                style={{ objectPosition: banner.objectPosition ?? "center center" }}
              />
            </div>
          );
        })}

        <div className="absolute inset-0 z-20 bg-[linear-gradient(90deg,rgba(201,146,72,0.38)_0%,rgba(201,146,72,0.2)_42%,rgba(201,146,72,0.04)_100%)]" />
        <div className="absolute inset-x-0 top-0 z-20 h-1 bg-[#fdcd04]" />

        <div className="absolute inset-x-0 bottom-12 z-30 px-6 sm:bottom-16 lg:bottom-20">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl text-white">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#fdcd04] sm:text-sm">
                Dự án và hoạt động Thiên Đức
              </p>
              <h2 className="text-2xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                {activeBanner.title}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/85 sm:text-base lg:text-lg">
                {activeBanner.subtitle}
              </p>
              <Link
                href={activeBanner.href}
                className="mt-5 inline-flex h-11 items-center bg-[#fdcd04] px-5 text-sm font-semibold text-[#191919] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#fdcd04] focus:ring-offset-2 focus:ring-offset-[#c99248]"
              >
                {activeBanner.ctaLabel}
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-5 right-5 z-30 hidden items-center gap-2 md:flex">
          <button
            type="button"
            aria-label="Banner trước"
            onClick={goToPrevious}
            className="grid size-11 place-items-center border border-white/40 bg-[#c99248]/20 text-white backdrop-blur transition hover:border-[#fdcd04] hover:bg-[#fdcd04] hover:text-[#191919]"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Banner tiếp theo"
            onClick={goToNext}
            className="grid size-11 place-items-center border border-white/40 bg-[#c99248]/20 text-white backdrop-blur transition hover:border-[#fdcd04] hover:bg-[#fdcd04] hover:text-[#191919]"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2">
          {homeBanners.map((banner, index) => (
            <button
              key={banner.image}
              type="button"
              aria-label={`Chuyển tới banner ${index + 1}`}
              aria-current={index === activeIndex}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === activeIndex ? "w-9 bg-[#fdcd04]" : "w-2.5 bg-white/70 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
