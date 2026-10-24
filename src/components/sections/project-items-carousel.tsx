"use client";

import Image from "next/image";
import Link from "next/link";
import { Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { ProjectItem, ProjectStatus } from "@/types/content";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { interpolate, type Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import { useLoopCarousel } from "@/lib/use-loop-carousel";

import { CarouselAutoplay } from "@/components/ui/carousel-autoplay";
import {
  CAROUSEL_TRACK_CLASS,
  CAROUSEL_TRANSITION_MS,
  useCarouselPlayback,
} from "@/lib/use-carousel-playback";
import { trackTransform } from "./news-slider";

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
  const [viewportCount, setViewportCount] = useState(3);
  const visibleCount = Math.min(viewportCount, Math.max(count, 1));
  const playback = useCarouselPlayback();
  const loop = useLoopCarousel(count, CAROUSEL_TRANSITION_MS);
  const displayIndex = loop.activeIndex;
  const interactive = count > 1;
  const trackIndex = interactive ? visibleCount + loop.position - 1 : 0;
  const renderedItems = interactive
    ? [...items.slice(-visibleCount), ...items, ...items.slice(0, visibleCount)]
    : items;
  const slideWidth = `calc((100% - ${(visibleCount - 1) * 20}px) / ${visibleCount})`;

  useEffect(() => {
    function sync() {
      setViewportCount(
        window.innerWidth >= 1280 ? 3 : window.innerWidth >= 768 ? 2 : 1,
      );
    }
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  function goToPrevious() {
    loop.previous();
  }
  function goToNext() {
    loop.next();
  }

  if (!count) return null;
  return (
    <div
      className="project-items-carousel group relative"
      {...playback.handlers}
    >
      <CarouselAutoplay
        index={displayIndex}
        enabled={interactive}
        paused={playback.paused}
        reducedMotion={playback.reducedMotion}
        onNext={goToNext}
        testId="project-items-progress"
      />
      <div className="overflow-hidden">
        <div
          className={`flex gap-5 ${CAROUSEL_TRACK_CLASS}`}
          data-testid="project-items-track"
          style={{
            transform: trackTransform(trackIndex, visibleCount),
            transitionProperty: loop.animate ? "transform" : "none",
          }}
          onTransitionEnd={loop.onTransitionEnd}
        >
          {renderedItems.map((item, position) => {
            const isVisible =
              position >= trackIndex && position < trackIndex + visibleCount;
            const href = localizePath(
              `${routes.projects}/${projectSlug}/${item.slug}`,
              locale,
            );
            return (
              <Link
                key={`${position}-${item.slug}`}
                data-testid="project-items-slide"
                aria-hidden={!isVisible}
                inert={!isVisible}
                tabIndex={isVisible ? undefined : -1}
                style={{ width: slideWidth }}
                href={href}
                aria-label={interpolate(labels.ariaView, {
                  title: item.title,
                })}
                className="group/slide flex shrink-0 min-w-0 flex-col overflow-hidden border border-brand/12 bg-white transition hover:border-brand/35 hover:shadow-[0_18px_34px_rgba(41,41,41,0.08)]"
              >
                <div className="project-image-frame relative overflow-hidden bg-surface">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover object-left-top origin-top-left transition duration-700 ease-out group-hover/slide:scale-105"
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
                  <span className="absolute right-4 top-4 inline-flex rounded-sm bg-ink/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                    {statusLabels[item.status ?? projectStatus]}
                  </span>
                </div>

                <div className="carousel-card-body">
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
      </div>
      {count > 1 ? (
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {items.map((item, index) => (
              <button
                key={item.slug}
                type="button"
                aria-label={interpolate(labels.ariaGoTo, {
                  title: item.title,
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
