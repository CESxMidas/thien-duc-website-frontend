"use client";

import { CarouselAutoplay } from "@/components/ui/carousel-autoplay";
import {
  CAROUSEL_TRACK_CLASS,
  CAROUSEL_TRANSITION_MS,
  useCarouselPlayback,
} from "@/lib/use-carousel-playback";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Project } from "@/types/content";
import { trackTransform } from "@/components/sections/news-slider";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { interpolate, type Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import { useLoopCarousel } from "@/lib/use-loop-carousel";

const BREAKPOINT_TABLET = 768;
const BREAKPOINT_DESKTOP = 1024;

const GAP_PX = 20;

function visibleCountFor(width: number): number {
  if (width >= BREAKPOINT_DESKTOP) return 3;
  if (width >= BREAKPOINT_TABLET) return 2;
  return 1;
}

type ProjectsCarouselProps = {
  projects: Project[];
  locale: Locale;
  labels: Dictionary["projects"]["carousel"];
  statusLabels: Dictionary["projectStatus"];
  detailLabel: string;
};

export function ProjectsCarousel({
  projects,
  locale,
  labels,
  statusLabels,
  detailLabel,
}: ProjectsCarouselProps) {
  const router = useRouter();
  const count = projects.length;
  const playback = useCarouselPlayback();

  const [viewportCount, setVisibleCount] = useState(3);
  const visibleCount = Math.min(viewportCount, Math.max(count, 1));

  useEffect(() => {
    function sync() {
      setVisibleCount(visibleCountFor(window.innerWidth));
    }
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const isInteractive = count > 1;
  const positionCount = count;
  const loop = useLoopCarousel(
    isInteractive ? count : 0,
    CAROUSEL_TRANSITION_MS,
  );
  const displayIndex = loop.activeIndex;
  // Keep the real cards in a fixed order. Edge copies fill the viewport while
  // crossing either end, then the hook settles on the identical real cards.
  const edgeCount = isInteractive ? visibleCount : 0;
  const trackIndex = isInteractive ? loop.position + edgeCount - 1 : 0;
  const trackProjects = isInteractive
    ? [
        ...projects.slice(-edgeCount),
        ...projects,
        ...projects.slice(0, edgeCount),
      ]
    : projects;

  function goToPrevious() {
    loop.previous();
  }

  function goToNext() {
    loop.next();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!isInteractive) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToPrevious();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goToNext();
    }
  }

  const trackGaps = (visibleCount - 1) * GAP_PX;
  const slideWidth = `calc((100% - ${trackGaps}px) / ${visibleCount})`;

  return (
    <div
      className="relative"
      role="group"
      aria-roledescription="carousel"
      aria-label={labels.regionLabel}
      onKeyDown={handleKeyDown}
      {...playback.handlers}
    >
      <CarouselAutoplay
        index={displayIndex}
        enabled={isInteractive}
        paused={playback.paused}
        reducedMotion={playback.reducedMotion}
        onNext={goToNext}
        testId="projects-carousel-progress"
      />
      <div className="overflow-hidden">
        <ul
          data-testid="projects-carousel-track"
          data-index={displayIndex}
          className={`flex list-none gap-5 p-0 ${CAROUSEL_TRACK_CLASS}`}
          style={{
            transform: trackTransform(trackIndex, visibleCount, GAP_PX),
            transitionProperty: loop.animate ? "transform" : "none",
          }}
          onTransitionEnd={loop.onTransitionEnd}
        >
          {trackProjects.map((project, position) => {
            const isVisible =
              position >= trackIndex && position < trackIndex + visibleCount;
            const projectHref = localizePath(
              `${routes.projects}/${project.slug}`,
              locale,
            );

            return (
              <li
                key={`${position}-${project.slug}`}
                data-testid="projects-carousel-slide"
                data-visible={isVisible ? "true" : "false"}
                aria-hidden={isVisible ? undefined : "true"}
                inert={!isVisible}
                className="shrink-0"
                style={{ width: slideWidth }}
              >
                <article className="hover-card group flex h-full flex-col overflow-hidden border border-black/10 bg-white hover:border-brand">
                  {project.image ? (
                    <div className="image-reveal relative aspect-3/2 overflow-hidden bg-surface">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover object-left-top origin-top-left"
                      />
                    </div>
                  ) : null}
                  <div className="carousel-card-body">
                    <div className="td-card-meta flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                      {project.location ? (
                        <span>{project.location}</span>
                      ) : null}
                      {project.location ? (
                        <span className="h-1 w-1 rounded-full bg-gold" />
                      ) : null}
                      <span>{statusLabels[project.status]}</span>
                    </div>
                    <h2 className="td-card-title mt-3 text-xl font-semibold">
                      {project.title}
                    </h2>
                    {project.category ? (
                      <p className="carousel-card-category text-sm font-medium text-slate">
                        {project.category}
                      </p>
                    ) : null}
                    <p className="content-paragraph td-card-summary mt-3 text-sm leading-6 text-slate">
                      {project.summary}
                    </p>
                    <button
                      type="button"
                      aria-label={`${detailLabel}: ${project.title}`}
                      tabIndex={isVisible ? undefined : -1}
                      onClick={() => router.push(projectHref)}
                      className="link-arrow mt-auto inline-flex h-10 w-fit items-center border border-black/15 px-4 text-sm font-semibold group-hover:border-brand group-hover:text-brand"
                    >
                      {detailLabel}
                    </button>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>

      {isInteractive ? (
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {Array.from({ length: positionCount }, (_, position) => (
              <button
                key={position}
                type="button"
                aria-label={interpolate(labels.ariaGoTo, {
                  index: String(position + 1),
                })}
                aria-current={position === displayIndex ? "true" : undefined}
                onClick={() => loop.goTo(position)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  position === displayIndex
                    ? "w-8 bg-brand"
                    : "w-2.5 bg-brand/25 hover:bg-brand/45"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              data-testid="projects-carousel-previous"
              aria-label={labels.ariaPrevious}
              onClick={goToPrevious}
              className="button-polish grid size-10 place-items-center border border-brand/25 bg-white text-brand transition hover:border-brand hover:bg-gold hover:text-ink"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              data-testid="projects-carousel-next"
              aria-label={labels.ariaNext}
              onClick={goToNext}
              className="button-polish grid size-10 place-items-center border border-brand/25 bg-white text-brand transition hover:border-brand hover:bg-gold hover:text-ink"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}

      <p aria-live="polite" className="sr-only">
        {interpolate(labels.status, {
          current: String(displayIndex + 1),
          total: String(positionCount),
        })}
      </p>
    </div>
  );
}
