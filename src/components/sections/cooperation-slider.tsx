"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Building2, ChevronLeft, ChevronRight, Handshake } from "lucide-react";
import type { CooperationProject } from "@/data/home";
import { interpolate, type Dictionary } from "@/lib/i18n/get-dictionary";

const AUTOPLAY_MS = 5200;

export function CooperationSlider({
  projects,
  labels,
}: {
  projects: CooperationProject[];
 
  labels: Dictionary["homeCooperation"];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const count = projects.length;
  const canSlide = count > 1;

  const singleProject = count === 1;

  const scrollToIndex = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;

      const clamped = (index + count) % count;
      const child = track.children[clamped] as HTMLElement | undefined;
      if (child) {
        track.scrollTo({
          left: child.offsetLeft - track.offsetLeft,
          behavior: "smooth",
        });
      }
    },
    [count],
  );

  function handleScroll() {
    const track = trackRef.current;
    if (!track) return;

    const children = Array.from(track.children) as HTMLElement[];
    const nearest = children.reduce(
      (best, child, index) => {
        const distance = Math.abs(
          child.offsetLeft - track.offsetLeft - track.scrollLeft,
        );
        return distance < best.distance ? { index, distance } : best;
      },
      { index: 0, distance: Infinity },
    );
    setActiveIndex(nearest.index);
  }

  useEffect(() => {
    if (!canSlide || isPaused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      scrollToIndex(activeIndex + 1);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [activeIndex, canSlide, isPaused, scrollToIndex]);

  return (
    <section className="border-y border-earth/25 bg-white">
      <div className="mx-auto max-w-site px-4 py-12 sm:px-6 lg:py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-eyebrow mb-4 text-earth">
              {labels.eyebrow}
            </p>
            <h2 className="text-[2.1rem] font-medium leading-[1.08] text-charcoal sm:text-[3rem]">
              {labels.title}
            </h2>
            <p className="mt-5 text-base leading-8 text-charcoal/72 sm:text-lg">
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
          ref={trackRef}
          onScroll={handleScroll}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={() => setIsPaused(false)}
          className="stagger-list no-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 justify-center px-4 sm:px-6 md:px-0 md:justify-start"
        >
          {projects.map((project) => (
            <article
              key={project.name}
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
                  className="relative -mx-6 -mt-6 mb-6 h-44 bg-cover bg-center md:-mx-8 md:-mt-8 md:h-52"
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
