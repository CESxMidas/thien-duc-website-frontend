"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { homeBanners } from "@/data/banners";

const AUTOPLAY_MS = 4000;
const bannerCount = homeBanners.length;

export function HomeBannerSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeBanner = homeBanners[activeIndex];

  function goToPrevious() {
    setActiveIndex((current) => (current === 0 ? bannerCount - 1 : current - 1));
  }

  function goToNext() {
    setActiveIndex((current) => (current + 1) % bannerCount);
  }

  function goToSlide(index: number) {
    setActiveIndex(index);
  }

  function handleProgressEnd() {
    if (bannerCount <= 1) {
      return;
    }

    goToNext();
  }

  return (
    <section
      className="relative overflow-hidden bg-[#3d2a16]"
      aria-label="Banner dự án nổi bật"
    >
      <div className="relative h-[340px] sm:h-[420px] lg:h-[640px]">
        {homeBanners.map((banner, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={banner.image}
              className={`absolute inset-0 transition-opacity duration-200 ease-out ${
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
                className={`object-cover transition duration-[4200ms] ease-out ${
                  isActive ? "scale-105" : "scale-100"
                }`}
                style={{ objectPosition: banner.objectPosition ?? "center center" }}
              />
            </div>
          );
        })}

        <div className="absolute inset-0 z-20 bg-[linear-gradient(90deg,rgba(25,25,25,0.72)_0%,rgba(25,25,25,0.42)_43%,rgba(25,25,25,0.08)_100%)]" />
        <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_18%_78%,rgba(253,205,4,0.18),transparent_32%)]" />
        <div className="absolute inset-x-0 top-0 z-20 h-1 bg-white/20">
          <div
            key={activeIndex}
            className="banner-progress h-full bg-[#fdcd04]"
            onAnimationEnd={handleProgressEnd}
            style={{
              animationDuration: `${AUTOPLAY_MS}ms`,
            }}
          />
        </div>

        <div className="absolute inset-x-0 bottom-14 z-30 px-6 sm:bottom-16 lg:bottom-20">
          <div className="mx-auto max-w-7xl">
            <div
              key={activeBanner.title}
              className="banner-copy-in flex min-h-[230px] max-w-2xl flex-col justify-between border border-white/15 bg-[#191919]/28 p-5 text-white shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-sm sm:min-h-[260px] sm:p-7 lg:min-h-[280px]"
            >
              <div className="mb-4 flex items-center gap-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#fdcd04] sm:text-sm">
                  Dự án và hoạt động Thiên Đức
                </p>
                <span className="h-px flex-1 bg-white/25" aria-hidden="true" />
              </div>
              <div className="flex items-start gap-4">
                <p className="hidden text-sm font-semibold text-white/70 sm:block">
                  {String(activeIndex + 1).padStart(2, "0")}
                  <span className="mx-2 text-white/30">/</span>
                  {String(bannerCount).padStart(2, "0")}
                </p>
                <div className="flex min-h-[168px] flex-col justify-between sm:min-h-[188px] lg:min-h-[204px]">
                  <h2 className="line-clamp-2 text-[1.35rem] font-semibold leading-tight sm:text-3xl lg:text-4xl">
                    {activeBanner.title}
                  </h2>
                  <p className="mt-3 line-clamp-3 max-w-xl text-sm leading-6 text-white/85 sm:text-base lg:text-lg">
                    {activeBanner.subtitle}
                  </p>
                  <Link
                    href={activeBanner.href}
                    className="button-polish mt-6 inline-flex h-11 items-center bg-[#fdcd04] px-5 text-sm font-semibold text-[#191919] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#fdcd04] focus:ring-offset-2 focus:ring-offset-[#191919]"
                  >
                    {activeBanner.ctaLabel}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-5 right-5 z-30 hidden items-center gap-2 md:flex">
          <button
            type="button"
            aria-label="Banner trước"
            onClick={goToPrevious}
            className="grid size-11 place-items-center border border-white/40 bg-[#191919]/30 text-white backdrop-blur transition hover:border-[#fdcd04] hover:bg-[#fdcd04] hover:text-[#191919] focus:outline-none focus:ring-2 focus:ring-[#fdcd04] focus:ring-offset-2 focus:ring-offset-[#191919]"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Banner tiếp theo"
            onClick={goToNext}
            className="grid size-11 place-items-center border border-white/40 bg-[#191919]/30 text-white backdrop-blur transition hover:border-[#fdcd04] hover:bg-[#fdcd04] hover:text-[#191919] focus:outline-none focus:ring-2 focus:ring-[#fdcd04] focus:ring-offset-2 focus:ring-offset-[#191919]"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/20 bg-[#191919]/25 px-3 py-2 backdrop-blur">
          {homeBanners.map((banner, index) => (
            <button
              key={banner.image}
              type="button"
              aria-label={`Chuyển tới banner ${index + 1}`}
              aria-current={index === activeIndex}
              onClick={() => goToSlide(index)}
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
