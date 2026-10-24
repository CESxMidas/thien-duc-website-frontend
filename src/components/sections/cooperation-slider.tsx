"use client";

import { useEffect, useState } from "react";
import { useLoopCarousel } from "@/lib/use-loop-carousel";
import {
  CAROUSEL_TRACK_CLASS,
  CAROUSEL_TRANSITION_MS,
  useCarouselPlayback,
} from "@/lib/use-carousel-playback";
import { CarouselAutoplay } from "@/components/ui/carousel-autoplay";
import { trackTransform } from "./news-slider";
import { Building2, ChevronLeft, ChevronRight, Handshake } from "lucide-react";
import type { CooperationProject } from "@/data/home";
import { interpolate, type Dictionary } from "@/lib/i18n/get-dictionary";

export function CooperationSlider({
  projects,
  labels,
}: {
  projects: CooperationProject[];

  labels: Dictionary["homeCooperation"];
}) {
  const count = projects.length;
  const canSlide = count > 1;
  const singleProject = count === 1;
  const [viewportCount, setViewportCount] = useState(2);
  const visibleCount = Math.min(viewportCount, Math.max(count, 1));
  const playback = useCarouselPlayback();
  const loop = useLoopCarousel(count, CAROUSEL_TRANSITION_MS);
  const activeIndex = loop.activeIndex;
  const trackIndex = canSlide ? visibleCount + loop.position - 1 : 0;
  const renderedProjects = canSlide
    ? [
        ...projects.slice(-visibleCount),
        ...projects,
        ...projects.slice(0, visibleCount),
      ]
    : projects;
  useEffect(() => {
    function sync() {
      setViewportCount(window.innerWidth >= 768 ? 2 : 1);
    }
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);
  function scrollToIndex(index: number) {
    loop.goTo(index);
  }

  return (
    <section
      className="relative border-y border-divider bg-white"
      {...playback.handlers}
    >
      <CarouselAutoplay
        index={activeIndex}
        enabled={canSlide}
        paused={playback.paused}
        reducedMotion={playback.reducedMotion}
        onNext={loop.next}
        testId="cooperation-progress"
      />
      <div className="mx-auto max-w-site px-4 py-12 sm:px-6 lg:py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-eyebrow mb-4 text-earth">{labels.eyebrow}</p>
            <h2 className="text-[2.1rem] font-medium leading-[1.08] text-charcoal sm:text-[3rem]">
              {labels.title}
            </h2>
            <p className="content-paragraph mt-5 text-base leading-8 text-charcoal/72 sm:text-lg">
              {labels.description}
            </p>
          </div>

          {canSlide ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={labels.ariaPrevious}
                onClick={() => scrollToIndex(activeIndex - 1)}
                className="button-polish grid size-10 place-items-center border border-earth/30 bg-white text-earth hover:border-earth hover:bg-ivory hover:text-charcoal"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                aria-label={labels.ariaNext}
                onClick={() => scrollToIndex(activeIndex + 1)}
                className="button-polish grid size-10 place-items-center border border-earth/30 bg-white text-earth hover:border-earth hover:bg-ivory hover:text-charcoal"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          ) : null}
        </div>

        <div
          className="mt-10 touch-pan-y overflow-hidden"
          {...loop.swipeHandlers}
        >
          <div
            data-testid="cooperation-track"
            onTransitionEnd={loop.onTransitionEnd}
            style={{
              transform: trackTransform(trackIndex, visibleCount),
              transitionProperty: loop.animate ? "transform" : "none",
            }}
            className={`flex gap-5 ${CAROUSEL_TRACK_CLASS}`}
          >
            {renderedProjects.map((project, position) => (
              <article
                key={`${position}-${project.name}`}
                aria-hidden={
                  position < trackIndex || position >= trackIndex + visibleCount
                }
                inert={
                  position < trackIndex || position >= trackIndex + visibleCount
                }
                style={{
                  width: `calc((100% - ${(visibleCount - 1) * 20}px) / ${visibleCount})`,
                }}
                className={`group relative flex w-[88%] shrink-0 snap-start flex-col justify-between overflow-hidden border border-black/10 bg-olive p-5 text-ivory sm:w-[70%] sm:p-5 md:p-7 ${
                  singleProject ? "md:w-full" : "md:w-[calc(50%-0.625rem)]"
                }`}
              >
                <div
                  className="pointer-events-none absolute inset-0 bg-transparent"
                  aria-hidden="true"
                />
                <Building2
                  className="pointer-events-none absolute -bottom-8 -right-6 size-44 text-white/6"
                  aria-hidden="true"
                />

                {project.image ? (
                  <div
                    role="img"
                    aria-label={interpolate(labels.imageAlt, {
                      name: project.name,
                    })}
                    style={{ backgroundImage: `url(${project.image})` }}
                    className="relative -mx-5 -mt-5 mb-5 h-44 bg-cover bg-left-top md:-mx-7 md:-mt-7 md:h-52"
                  >
                    <div
                      className="absolute inset-0 bg-transparent"
                      aria-hidden="true"
                    />
                  </div>
                ) : null}

                <div className="relative">
                  <p className="text-eyebrow inline-flex items-center gap-2 text-warm-grey">
                    <Handshake className="size-4" aria-hidden="true" />
                    {labels.cardBadge}
                  </p>
                  <h3
                    className="mt-4 line-clamp-1 text-2xl font-semibold leading-tight md:text-3xl"
                    title={project.name}
                  >
                    {project.name}
                  </h3>
                  <p
                    className="mt-2 line-clamp-2 min-h-10 text-sm font-medium leading-5 text-ivory/70"
                    title={`${project.location} · ${project.scale}`}
                  >
                    {project.location} · {project.scale}
                  </p>
                </div>

                <dl className="relative mt-8 grid gap-4 border-t border-ivory/15 pt-6 text-sm sm:grid-cols-3">
                  <div className="min-w-0">
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ivory/55">
                      {labels.roleLabel}
                    </dt>
                    <dd
                      className="mt-1 line-clamp-2 font-semibold"
                      title={project.role}
                    >
                      {project.role}
                    </dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ivory/55">
                      {labels.partnerLabel}
                    </dt>
                    <dd
                      className="mt-1 line-clamp-2 font-semibold"
                      title={project.partner}
                    >
                      {project.partner}
                    </dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ivory/55">
                      {labels.statusLabel}
                    </dt>
                    <dd
                      className="mt-1 line-clamp-2 font-semibold"
                      title={project.status}
                    >
                      {project.status}
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </div>

        {canSlide ? (
          <div className="mt-6 flex items-center gap-2">
            {projects.map((project, index) => (
              <button
                key={project.name}
                type="button"
                aria-label={interpolate(labels.ariaGoTo, {
                  name: project.name,
                })}
                aria-current={index === activeIndex}
                onClick={() => scrollToIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-8 bg-earth"
                    : "w-2.5 bg-earth/25 hover:bg-earth/45"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
