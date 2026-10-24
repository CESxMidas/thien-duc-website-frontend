"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const GAP_PX = 12;
const AUTOPLAY_INTERVAL_MS = 3000;
const SINGLE_LINE_PROJECT_TITLE_LENGTH = 28;

function projectTitleLines(title: string): string[] {
  const normalizedTitle = title.trim().replace(/\s+/g, " ");
  const words = normalizedTitle.split(" ");

  if (
    normalizedTitle.length <= SINGLE_LINE_PROJECT_TITLE_LENGTH ||
    words.length < 2
  ) {
    return [normalizedTitle];
  }

  let bestSplitIndex = 1;
  let smallestDifference = Number.POSITIVE_INFINITY;

  for (let index = 1; index < words.length; index += 1) {
    const firstLineLength = words.slice(0, index).join(" ").length;
    const secondLineLength = words.slice(index).join(" ").length;
    const difference = Math.abs(firstLineLength - secondLineLength);

    if (difference < smallestDifference) {
      bestSplitIndex = index;
      smallestDifference = difference;
    }
  }

  return [
    words.slice(0, bestSplitIndex).join(" "),
    words.slice(bestSplitIndex).join(" "),
  ];
}

function projectTitleFontSize(lines: string[]): string {
  const longestLineLength = Math.max(...lines.map((line) => line.length), 1);
  const containerWidthPercentage = Math.min(
    8.75,
    Math.max(4, 160 / longestLineLength),
  );

  return `clamp(1.15rem, ${containerWidthPercentage.toFixed(2)}cqw, 2.45rem)`;
}

function visibleCountFor(width: number): number {
  if (width >= 1024) return 3;
  if (width >= 768) return 2;
  return 1;
}

function trackTransform(activeIndex: number, visibleCount: number): string {
  if (activeIndex <= 0) return "translateX(0px)";

  const trackGaps = (visibleCount - 1) * GAP_PX;
  return `translateX(calc(${-activeIndex} * (100% - ${trackGaps}px) / ${visibleCount} - ${activeIndex * GAP_PX}px))`;
}

export type FeaturedProjectShowcaseItem = {
  id: string;
  slug: string;
  title: string;
  location?: string;
  statusLabel?: string;
  summary?: string;
  image?: string;
  href: string;
};

type HomeFeaturedProjectsShowcaseProps = {
  projects: FeaturedProjectShowcaseItem[];
  labels: {
    eyebrow: string;
    title: string;
    explore: string;
    viewAll: string;
    viewAllHref: string;
    otherProjects: string;
    selectProject: string;
    previousProject: string;
    nextProject: string;
  };
};

export function HomeFeaturedProjectsShowcase({
  projects,
  labels,
}: HomeFeaturedProjectsShowcaseProps) {
  const router = useRouter();
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [pageStartIndex, setPageStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const maxPageStartIndex = Math.max(projects.length - visibleCount, 0);
  const safePageStartIndex = Math.min(pageStartIndex, maxPageStartIndex);
  const displayIndex =
    projects.length > 0
      ? Math.min(activeProjectIndex, projects.length - 1)
      : 0;
  const activeProject = projects[displayIndex] ?? projects[0];

  useEffect(() => {
    function syncVisibleCount() {
      setVisibleCount(visibleCountFor(window.innerWidth));
    }

    syncVisibleCount();
    window.addEventListener("resize", syncVisibleCount);
    return () => window.removeEventListener("resize", syncVisibleCount);
  }, []);

  useEffect(() => {
    if (!window.matchMedia) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPrefersReducedMotion(media.matches);

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const isInteractive = projects.length > visibleCount;
  const slideWidth = `calc((100% - ${(visibleCount - 1) * GAP_PX}px) / ${visibleCount})`;

  function selectProject(index: number) {
    if (projects.length === 0) return;
    setActiveProjectIndex(index);
    setPageStartIndex((current) => {
      if (index < current) return index;
      if (index >= current + visibleCount) {
        return Math.min(index - visibleCount + 1, maxPageStartIndex);
      }
      return current;
    });
  }

  function selectPreviousProject() {
    const previousStart =
      safePageStartIndex <= 0
        ? maxPageStartIndex
        : Math.max(safePageStartIndex - visibleCount, 0);
    setPageStartIndex(previousStart);
    setActiveProjectIndex(previousStart);
  }

  function selectNextProject() {
    const nextStart =
      safePageStartIndex >= maxPageStartIndex
        ? 0
        : Math.min(safePageStartIndex + visibleCount, maxPageStartIndex);
    setPageStartIndex(nextStart);
    setActiveProjectIndex(nextStart);
  }

  useEffect(() => {
    if (!isInteractive || isPaused || prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      setPageStartIndex((current) => {
        const nextStart =
          current >= maxPageStartIndex
            ? 0
            : Math.min(current + visibleCount, maxPageStartIndex);
        setActiveProjectIndex(nextStart);
        return nextStart;
      });
    }, AUTOPLAY_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [
    isInteractive,
    isPaused,
    maxPageStartIndex,
    prefersReducedMotion,
    visibleCount,
  ]);

  if (!activeProject) {
    return null;
  }

  const activeMeta = [activeProject.location, activeProject.statusLabel].filter(
    (part): part is string => Boolean(part),
  );
  const activeProjectTitleLines = projectTitleLines(activeProject.title);

  return (
    <section
      aria-labelledby="featured-projects-title"
      className="featured-projects-section relative isolate overflow-hidden border-y border-earth/18 bg-ivory pb-10 pt-16 sm:pb-12 sm:pt-20 lg:pb-16 lg:pt-24"
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div
        className="section-foliage section-foliage-start hidden sm:block"
        aria-hidden="true"
      >
        <Image
          src="/images/contact/coconut-palm-frond-soft.png"
          alt=""
          fill
          sizes="(min-width: 1024px) 36rem, 26rem"
          className="object-contain object-left-top"
        />
      </div>
      <div
        className="section-foliage section-foliage-end hidden md:block"
        aria-hidden="true"
      >
        <Image
          src="/images/contact/coconut-palm-frond-soft.png"
          alt=""
          fill
          sizes="(min-width: 1024px) 36rem, 26rem"
          className="object-contain object-left-top"
        />
      </div>
      <div className="relative z-10 w-full px-5 sm:px-8 lg:px-20 xl:px-28">
        <header className="mb-7 flex flex-col gap-5 md:mb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[44rem]">
            <p className="mb-3 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-earth">
              {labels.eyebrow}
            </p>
            <h2
              id="featured-projects-title"
              className="font-display text-[2.2rem] font-medium uppercase leading-[1.05] text-charcoal sm:text-[2.75rem] lg:text-[3.05rem]"
            >
              {labels.title}
            </h2>
          </div>

          <Link
            href={labels.viewAllHref}
            className="button-polish inline-flex h-11 w-fit items-center gap-4 border border-earth/35 bg-white/50 px-5 text-[0.66rem] font-bold uppercase tracking-[0.12em] text-earth transition duration-300 hover:border-earth hover:bg-earth hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-earth motion-reduce:transition-none"
          >
            {labels.viewAll}
            <span
              aria-hidden="true"
              className="transition duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
            >
              &#8594;
            </span>
          </Link>
        </header>

        <div className="overflow-hidden border border-earth/18 bg-white shadow-[0_22px_52px_rgba(41,41,41,0.08)]">
          <div className="grid lg:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.9fr)]">
            <div
              key={`${activeProject.slug}-image`}
              className="relative min-h-[23rem] overflow-hidden bg-surface motion-safe:animate-[heroFadeUp_420ms_cubic-bezier(.22,.61,.36,1)_both] sm:min-h-[29rem] lg:min-h-[clamp(30rem,38vw,39rem)]"
            >
              {activeProject.image ? (
                <Image
                  src={activeProject.image}
                  alt={activeProject.title}
                  fill
                  priority={displayIndex === 0}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover object-left-top origin-top-left contrast-[1.06] saturate-[1.08] transition duration-[560ms] ease-[cubic-bezier(.22,.61,.36,1)] hover:scale-[1.025] motion-reduce:transition-none motion-reduce:hover:scale-100"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(135deg,rgba(156,126,95,0.18),rgba(255,251,244,0.88)_46%,rgba(73,83,65,0.2))]"
                />
              )}
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,20,20,0.02)_24%,rgba(20,20,20,0.5)_100%)]"
              />
              <span
                aria-hidden="true"
                className="absolute inset-4 border border-white/30"
              />
            </div>

            <article
              key={`${activeProject.slug}-content`}
              className="flex min-h-[23rem] flex-col border-t border-earth/15 bg-ivory px-5 py-6 [container-type:inline-size] motion-safe:animate-[heroFadeUp_420ms_cubic-bezier(.22,.61,.36,1)_both] sm:min-h-[29rem] sm:px-7 sm:py-7 lg:min-h-[clamp(30rem,38vw,39rem)] lg:border-l lg:border-t-0 lg:px-8 lg:py-8"
            >
              <div>
                <div className="mb-5 flex max-w-[18rem] items-center gap-4">
                  <span className="font-display text-[2.1rem] leading-none text-earth">
                    {activeProject.id}
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-px flex-1 bg-earth/22"
                  />
                </div>

                <h3
                  className="font-display font-medium uppercase leading-[1.05] text-charcoal"
                  style={{
                    fontSize: projectTitleFontSize(activeProjectTitleLines),
                  }}
                >
                  {activeProjectTitleLines.map((line) => (
                    <span
                      key={line}
                      className="block whitespace-nowrap"
                    >
                      {line}
                    </span>
                  ))}
                </h3>

                {activeMeta.length > 0 ? (
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-[0.64rem] font-bold uppercase leading-5 tracking-[0.08em] text-brand">
                    {activeMeta.map((part, partIndex) => (
                      <span
                        key={part}
                        className="inline-flex items-center gap-2"
                      >
                        {partIndex > 0 ? (
                          <span
                            aria-hidden="true"
                            className="h-px w-5 bg-earth/35"
                          />
                        ) : null}
                        {part}
                      </span>
                    ))}
                  </div>
                ) : null}

                {activeProject.summary ? (
                  <p className="content-paragraph mt-5 max-w-[32rem] text-[0.9rem] leading-[1.82] text-charcoal/74">
                    {activeProject.summary}
                  </p>
                ) : null}

                <button
                  type="button"
                  aria-label={`${labels.explore}: ${activeProject.title}`}
                  onClick={() => router.push(activeProject.href)}
                  className="group mt-9 inline-flex w-fit items-center gap-3 border border-earth/40 bg-white/70 px-4 py-3 text-[0.67rem] font-bold uppercase tracking-[0.12em] text-brand shadow-[0_10px_24px_rgba(41,41,41,0.06)] transition duration-300 hover:border-earth hover:bg-earth hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-earth motion-reduce:transition-none"
                >
                  {labels.explore}
                  <span
                    aria-hidden="true"
                    className="transition duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none"
                  >
                    &#8594;
                  </span>
                </button>
              </div>
            </article>
          </div>
        </div>

        <div className="mt-5">
          <p className="sr-only">{labels.otherProjects}</p>
          <div className="overflow-hidden">
            <div
              className="flex list-none gap-3 p-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
              style={{
                transform: trackTransform(safePageStartIndex, visibleCount),
              }}
            >
              {projects.map((project, index) => {
                const isActive = index === displayIndex;
                const isVisible =
                  index >= safePageStartIndex &&
                  index < safePageStartIndex + visibleCount;

                return (
                  <article
                    key={`${project.slug}-${index}`}
                    style={{ width: slideWidth }}
                    className={[
                      "group relative flex shrink-0 flex-col overflow-hidden border bg-white text-left shadow-[0_12px_28px_rgba(41,41,41,0.06)] transition duration-[520ms] ease-[cubic-bezier(.22,.61,.36,1)] motion-reduce:transition-none",
                      isActive
                        ? "border-earth/55 opacity-100"
                        : "border-earth/14 opacity-100 hover:border-earth/34 focus-visible:border-earth/55",
                    ].join(" ")}
                  >
                    <span
                      aria-hidden="true"
                      className={[
                        "absolute inset-x-0 top-0 z-20 h-1 bg-earth transition duration-[520ms] motion-reduce:transition-none",
                        isActive
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-60",
                      ].join(" ")}
                    />

                    <button
                      type="button"
                      aria-label={`${labels.selectProject}: ${project.title}`}
                      aria-pressed={isActive}
                      tabIndex={isVisible ? undefined : -1}
                      onClick={() => selectProject(index)}
                      onFocus={() => selectProject(index)}
                      className="block w-full flex-1 text-left outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-earth"
                    >
                      <span className="relative block h-64 overflow-hidden bg-surface sm:h-72 md:h-80 lg:h-[22rem]">
                        {project.image ? (
                          <Image
                            src={project.image}
                            alt=""
                            fill
                            sizes="(min-width: 768px) 24vw, 70vw"
                            className={[
                              "object-cover object-left-top origin-top-left contrast-[1.04] saturate-[1.05] transition duration-[560ms] ease-[cubic-bezier(.22,.61,.36,1)] motion-reduce:transition-none",
                              isActive
                                ? "scale-[1.025]"
                                : "group-hover:scale-[1.025] group-focus-visible:scale-[1.025]",
                            ].join(" ")}
                          />
                        ) : (
                          <span
                            aria-hidden="true"
                            className="absolute inset-0 bg-earth/10"
                          />
                        )}
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,20,20,0.02)_10%,rgba(20,20,20,0.56)_100%)]"
                        />
                        <span className="absolute bottom-3 left-3 font-display text-[1.4rem] leading-none text-ivory">
                          {project.id}
                        </span>
                      </span>

                      <span className="block px-4 pb-3 pt-4">
                        <span className="block font-display text-[1.1rem] font-medium uppercase leading-[1.1] text-charcoal sm:text-[1.18rem]">
                          {project.title}
                        </span>
                        {project.location ? (
                          <span className="mt-2 block text-[0.62rem] font-bold uppercase tracking-[0.08em] text-charcoal/80">
                            {project.location}
                          </span>
                        ) : null}
                      </span>
                    </button>

                    <div className="mt-auto px-4 pb-4">
                      <button
                        type="button"
                        aria-label={`${labels.explore}: ${project.title}`}
                        tabIndex={isVisible ? undefined : -1}
                        onClick={() => router.push(project.href)}
                        className="inline-flex h-10 w-fit items-center gap-2 border border-transparent px-0 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-charcoal/85 transition duration-300 hover:text-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-earth motion-reduce:transition-none"
                      >
                        {labels.explore}
                        <span
                          aria-hidden="true"
                          className="transition duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none"
                        >
                          &#8594;
                        </span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
          {isInteractive ? (
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                aria-label={labels.previousProject}
                onClick={selectPreviousProject}
                className="grid size-10 place-items-center border border-earth/35 bg-white text-earth transition hover:border-earth hover:bg-earth hover:text-ivory"
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label={labels.nextProject}
                onClick={selectNextProject}
                className="grid size-10 place-items-center border border-earth/35 bg-white text-earth transition hover:border-earth hover:bg-earth hover:text-ivory"
              >
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
