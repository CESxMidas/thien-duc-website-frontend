"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

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
  };
};

export function HomeFeaturedProjectsShowcase({
  projects,
  labels,
}: HomeFeaturedProjectsShowcaseProps) {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const activeProject = projects[activeProjectIndex] ?? projects[0];

  if (!activeProject) {
    return null;
  }

  const activeMeta = [
    activeProject.location,
    activeProject.statusLabel,
  ].filter((part): part is string => Boolean(part));

  return (
    <section
      aria-labelledby="featured-projects-title"
      className="border-y border-earth/18 bg-ivory py-10 sm:py-12 lg:py-14"
    >
      <div className="w-full px-5 sm:px-8 lg:px-20 xl:px-28">
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
              →
            </span>
          </Link>
        </header>

        <div className="overflow-hidden border border-earth/18 bg-white shadow-[0_22px_52px_rgba(41,41,41,0.08)]">
          <div className="grid lg:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.9fr)]">
            <div
              key={`${activeProject.slug}-image`}
              className="relative min-h-[19rem] overflow-hidden bg-surface motion-safe:animate-[heroFadeUp_420ms_cubic-bezier(.22,.61,.36,1)_both] sm:min-h-[24rem] lg:min-h-[clamp(22rem,30vw,30rem)]"
            >
              {activeProject.image ? (
                <Image
                  src={activeProject.image}
                  alt={activeProject.title}
                  fill
                  priority={activeProjectIndex === 0}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover object-center contrast-[1.06] saturate-[1.08] transition duration-[560ms] ease-[cubic-bezier(.22,.61,.36,1)] hover:scale-[1.025] motion-reduce:transition-none motion-reduce:hover:scale-100"
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
              className="flex min-h-[20rem] flex-col justify-between border-t border-earth/15 bg-ivory px-5 py-6 motion-safe:animate-[heroFadeUp_420ms_cubic-bezier(.22,.61,.36,1)_both] sm:px-7 sm:py-7 lg:border-l lg:border-t-0 lg:px-8 lg:py-8"
            >
              <div>
                <div className="mb-5 flex items-center gap-4">
                  <span className="font-display text-[2.1rem] leading-none text-earth">
                    {activeProject.id}
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-px flex-1 bg-earth/22"
                  />
                </div>

                <h3 className="font-display text-[2rem] font-medium uppercase leading-[1.05] text-charcoal sm:text-[2.45rem] lg:text-[2.35rem] xl:text-[2.65rem]">
                  {activeProject.title}
                </h3>

                {activeMeta.length > 0 ? (
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-[0.64rem] font-bold uppercase leading-5 tracking-[0.08em] text-earth/75">
                    {activeMeta.map((part, partIndex) => (
                      <span key={part} className="inline-flex items-center gap-2">
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
                  <p className="mt-5 max-w-[34rem] text-[0.83rem] leading-[1.75] text-charcoal/72">
                    {activeProject.summary}
                  </p>
                ) : null}
              </div>

              <Link
                href={activeProject.href}
                className="group mt-7 inline-flex w-fit items-center gap-3 border border-earth/40 bg-white/70 px-4 py-3 text-[0.67rem] font-bold uppercase tracking-[0.12em] text-earth shadow-[0_10px_24px_rgba(41,41,41,0.06)] transition duration-300 hover:border-earth hover:bg-earth hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-earth motion-reduce:transition-none"
              >
                {labels.explore}
                <span
                  aria-hidden="true"
                  className="transition duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none"
                >
                  →
                </span>
              </Link>
            </article>
          </div>
        </div>

        <div className="mt-5">
          <p className="sr-only">{labels.otherProjects}</p>
          <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4">
            {projects.map((project, index) => {
              const isActive = index === activeProjectIndex;

              return (
                <Link
                  key={project.slug}
                  href={project.href}
                  aria-current={isActive ? "true" : undefined}
                  onFocus={() => setActiveProjectIndex(index)}
                  onMouseEnter={() => setActiveProjectIndex(index)}
                  className={[
                    "group relative min-w-[16rem] snap-start overflow-hidden border bg-white text-left shadow-[0_12px_28px_rgba(41,41,41,0.06)] outline-none transition duration-[520ms] ease-[cubic-bezier(.22,.61,.36,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-earth motion-reduce:transition-none md:min-w-0",
                    isActive
                      ? "border-earth/55 opacity-100"
                      : "border-earth/14 opacity-82 hover:border-earth/34 hover:opacity-100 focus-visible:border-earth/55 focus-visible:opacity-100",
                  ].join(" ")}
                >
                  <span
                    aria-hidden="true"
                    className={[
                      "absolute inset-x-0 top-0 z-20 h-1 bg-earth transition duration-[520ms] motion-reduce:transition-none",
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60",
                    ].join(" ")}
                  />

                  <span className="relative block h-36 overflow-hidden bg-surface sm:h-40 md:h-44 lg:h-48">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 24vw, 70vw"
                        className={[
                          "object-contain object-center contrast-[1.04] saturate-[1.05] transition duration-[560ms] ease-[cubic-bezier(.22,.61,.36,1)] motion-reduce:transition-none",
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

                  <span className="flex min-h-[7.25rem] flex-col justify-between px-4 py-4">
                    <span>
                      <span className="block font-display text-[1.1rem] font-medium uppercase leading-[1.1] text-charcoal sm:text-[1.18rem]">
                        {project.title}
                      </span>
                      {project.location ? (
                        <span className="mt-2 block text-[0.62rem] font-bold uppercase tracking-[0.08em] text-earth/68">
                          {project.location}
                        </span>
                      ) : null}
                    </span>

                    <span className="mt-4 inline-flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-earth">
                      {labels.explore}
                      <span
                        aria-hidden="true"
                        className="transition duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none"
                      >
                        →
                      </span>
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
