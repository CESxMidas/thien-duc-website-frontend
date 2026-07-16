"use client";

import Image from "next/image";
import Link from "next/link";
import { Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ProjectItem, ProjectStatus } from "@/types/content";
import { projectStatusLabels } from "@/lib/project-status";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { routes } from "@/lib/routes";

const AUTOPLAY_MS = 5200;

type ProjectItemsCarouselProps = {
  items: ProjectItem[];
  projectSlug: string;
  projectStatus: ProjectStatus;
  locale: Locale;
};

/**
 * Gộp các hạng mục con thành một showcase tự chạy — thay cho lưới thẻ tĩnh cộng
 * khối gallerySections lặp lại cùng nội dung. Mỗi slide là một hạng mục (ảnh +
 * thông tin) dẫn tới trang chi tiết hạng mục.
 */
export function ProjectItemsCarousel({
  items,
  projectSlug,
  projectStatus,
  locale,
}: ProjectItemsCarouselProps) {
  const count = items.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  function goToPrevious() {
    setActiveIndex((current) => (current === 0 ? count - 1 : current - 1));
  }

  function goToNext() {
    setActiveIndex((current) => (current + 1) % count);
  }

  function handleProgressEnd() {
    if (count <= 1 || isPaused || prefersReducedMotion.current) {
      return;
    }

    goToNext();
  }

  const autoplay = count > 1;

  return (
    <div
      className="project-items-carousel group relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div className="hover-card relative overflow-hidden border border-brand/18 bg-white shadow-[0_16px_36px_rgba(127,75,13,0.1)]">
        {autoplay ? (
          <div className="absolute inset-x-0 top-0 z-30 h-1 bg-brand/12">
            {!isPaused ? (
              <div
                key={activeIndex}
                className="banner-progress h-full bg-gold"
                onAnimationEnd={handleProgressEnd}
                style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
              />
            ) : (
              <div
                className="h-full bg-gold transition-transform duration-300"
                style={{
                  transform: `scaleX(${(activeIndex + 1) / count})`,
                  transformOrigin: "left",
                }}
              />
            )}
          </div>
        ) : null}

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {items.map((item) => {
              const href = localizePath(
                `${routes.projects}/${projectSlug}/${item.slug}`,
                locale,
              );

              return (
                <Link
                  key={item.slug}
                  href={href}
                  aria-label={`Xem hạng mục ${item.title}`}
                  className="group/slide grid w-full shrink-0 grid-cols-1 md:grid-cols-2"
                >
                  <div className="relative aspect-16/10 overflow-hidden bg-surface md:aspect-auto md:min-h-22rem">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover transition duration-700 ease-out group-hover/slide:scale-105"
                      />
                    ) : (
                      <div className="grid h-full place-items-center bg-linear-to-br from-gold-soft via-white to-gold-soft/60">
                        <Building2
                          className="size-14 text-brand/35"
                          aria-hidden="true"
                        />
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(25,25,25,0)_55%,rgba(25,25,25,0.28)_100%)]" />
                    <span className="absolute left-4 top-4 inline-flex rounded-sm bg-ink/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
                      {projectStatusLabels[item.status ?? projectStatus]}
                    </span>
                  </div>

                  <div className="flex flex-col justify-center gap-4 bg-linear-to-br from-white to-gold-soft/35 p-6 md:p-10">
                    <p className="text-eyebrow text-brand">Hạng mục</p>
                    <h3 className="text-2xl font-semibold leading-tight text-ink md:text-3xl">
                      {item.title}
                    </h3>
                    {item.summary ? (
                      <p className="text-sm leading-6 text-slate md:text-base md:leading-7">
                        {item.summary}
                      </p>
                    ) : null}
                    <span className="link-arrow mt-2 inline-flex h-11 w-fit items-center border border-brand/25 px-5 text-sm font-semibold text-brand transition group-hover/slide:border-brand group-hover/slide:bg-gold group-hover/slide:text-ink">
                      Xem hạng mục
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {count > 1 ? (
        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {items.map((item, index) => (
              <button
                key={item.slug}
                type="button"
                aria-label={`Chuyển tới hạng mục ${item.title}`}
                aria-current={index === activeIndex}
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-8 bg-brand"
                    : "w-2.5 bg-brand/25 hover:bg-brand/45"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Hạng mục trước"
              onClick={goToPrevious}
              className="button-polish grid size-10 place-items-center border border-brand/25 bg-white text-brand hover:border-brand hover:bg-gold hover:text-ink"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Hạng mục tiếp theo"
              onClick={goToNext}
              className="button-polish grid size-10 place-items-center border border-brand/25 bg-white text-brand hover:border-brand hover:bg-gold hover:text-ink"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
