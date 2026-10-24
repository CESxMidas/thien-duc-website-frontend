"use client";

import Image from "next/image";
import Link from "next/link";
import { Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ProjectItem, ProjectStatus } from "@/types/content";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { interpolate, type Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import { useLoopCarousel } from "@/lib/use-loop-carousel";

const AUTOPLAY_MS = 5200;

function greatestCommonDivisor(a: number, b: number): number {
  return b === 0 ? a : greatestCommonDivisor(b, a % b);
}

type ProjectItemsCarouselProps = {
  items: ProjectItem[];
  projectSlug: string;
  projectStatus: ProjectStatus;
  locale: Locale;

  statusLabels: Dictionary["projectStatus"];
  labels: Dictionary["itemsCarousel"];
};

export function ProjectItemsCarousel({
  items,
  projectSlug,
  projectStatus,
  locale,
  statusLabels,
  labels,
}: ProjectItemsCarouselProps) {
  const count = items.length;
  const [visibleCount, setVisibleCount] = useState(3);
  const itemsPerPage = Math.min(count, visibleCount);
  const pages = Array.from(
    { length: count ? count / greatestCommonDivisor(count, itemsPerPage) : 0 },
    (_, index) =>
      Array.from(
        { length: itemsPerPage },
        // Nối đầu danh sách vào lượt cuối, không để lại ô trống.
        (_, offset) => items[(index * itemsPerPage + offset) % count],
      ),
  );
  const pageCount = pages.length;
  const loop = useLoopCarousel(pageCount, 700);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = useRef(false);
  const displayIndex = loop.activeIndex;

  useEffect(() => {
    function sync() {
      setVisibleCount(
        window.innerWidth >= 1280 ? 3 : window.innerWidth >= 768 ? 2 : 1,
      );
    }
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  function goToPrevious() {
    loop.previous();
  }

  function goToNext() {
    loop.next();
  }

  function handleProgressEnd() {
    if (pageCount <= 1 || isPaused || prefersReducedMotion.current) {
      return;
    }

    goToNext();
  }

  const autoplay = pageCount > 1;
  const renderedPages = autoplay ? [pages[pageCount - 1], ...pages, pages[0]] : pages;
  const trackIndex = autoplay ? loop.position : 0;
  const columnsClass =
    itemsPerPage === 3
      ? "grid-cols-3"
      : itemsPerPage === 2
        ? "grid-cols-2"
        : "grid-cols-1";

  if (!count) return null;

  return (
    <div
      className="project-items-carousel group relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div className="hover-card relative overflow-hidden border border-brand/18 bg-white">
        {autoplay ? (
          <div className="absolute inset-x-0 top-0 z-30 h-1 bg-brand/12">
            {!isPaused ? (
              <div
                key={displayIndex}
                className="banner-progress h-full bg-gold"
                onAnimationEnd={handleProgressEnd}
                style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
              />
            ) : (
              <div
                className="h-full bg-gold transition-transform duration-300"
                style={{
                  transform: `scaleX(${(displayIndex + 1) / pageCount})`,
                  transformOrigin: "left",
                }}
              />
            )}
          </div>
        ) : null}

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            data-testid="project-items-track"
            style={{
              transform: `translateX(-${trackIndex * 100}%)`,
              transitionProperty: loop.animate ? "transform" : "none",
            }}
            onTransitionEnd={loop.onTransitionEnd}
          >
            {renderedPages.map((page, pageIndex) => (
              <div
                key={`${pageIndex}-${page.map((item) => item.slug).join("|")}`}
                data-testid="project-items-page"
                aria-hidden={pageIndex !== trackIndex ? true : undefined}
                inert={pageIndex !== trackIndex}
                className={`grid w-full shrink-0 gap-4 p-4 md:p-5 ${columnsClass}`}
              >
                {page.map((item) => {
                  const href = localizePath(
                    `${routes.projects}/${projectSlug}/${item.slug}`,
                    locale,
                  );

                  return (
                    <Link
                      key={item.slug}
                      href={href}
                      aria-label={interpolate(labels.ariaView, {
                        title: item.title,
                      })}
                      className="group/slide flex h-full min-w-0 flex-col overflow-hidden border border-brand/12 bg-white transition hover:border-brand/35 hover:shadow-[0_18px_34px_rgba(41,41,41,0.08)]"
                    >
                      <div className="relative aspect-16/10 overflow-hidden bg-surface">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            className="object-cover transition duration-700 ease-out group-hover/slide:scale-105"
                          />
                        ) : (
                          <div className="grid h-full place-items-center bg-ivory">
                            <Building2
                              className="size-14 text-brand/35"
                              aria-hidden="true"
                            />
                          </div>
                        )}
                        <div className="pointer-events-none absolute inset-0 bg-transparent" />
                        <span className="absolute left-4 top-4 inline-flex rounded-sm bg-ink/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                          {statusLabels[item.status ?? projectStatus]}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col gap-4 p-5">
                        <p className="td-card-meta text-eyebrow text-brand">
                          {labels.badge}
                        </p>
                        <h3 className="td-card-title text-xl font-semibold text-ink">
                          {item.title}
                        </h3>
                        <p
                          className="content-paragraph td-card-summary text-sm leading-6 text-slate"
                          aria-hidden={item.summary ? undefined : "true"}
                        >
                          {item.summary ?? ""}
                        </p>
                        <span className="link-arrow mt-auto inline-flex h-10 w-fit items-center border border-brand/25 px-4 text-sm font-semibold text-brand transition group-hover/slide:border-brand group-hover/slide:bg-gold group-hover/slide:text-ink">
                          {labels.viewItem}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {pageCount > 1 ? (
        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {pages.map((page, index) => (
              <button
                key={page.map((item) => item.slug).join("|")}
                type="button"
                aria-label={interpolate(labels.ariaGoTo, {
                  title: page.map((item) => item.title).join(", "),
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

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={labels.ariaPrevious}
              onClick={goToPrevious}
              className="button-polish grid size-10 place-items-center border border-brand/25 bg-white text-brand hover:border-brand hover:bg-gold hover:text-ink"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label={labels.ariaNext}
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
