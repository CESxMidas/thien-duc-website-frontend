import { Fragment } from "react";

import Image from "next/image";
import Link from "next/link";

import { getProjects } from "@/lib/api/projects";
import { defaultLocale, localizePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import { homeFeaturedProjectCopy } from "@/data/home";

import type { Project } from "@/types/content";

export function selectPrimaryFeaturedProject(
  projects: Project[],
): Project | undefined {
  return (
    projects.find((project) => project.status === "dang-thi-cong") ??
    projects[0]
  );
}

export async function HomeFeaturedProjects({ locale }: { locale: Locale }) {
  const [projects, dictionary] = await Promise.all([
    getProjects(locale),
    getDictionary(locale),
  ]);

  const primaryProject = selectPrimaryFeaturedProject(projects);

  if (!primaryProject) {
    return null;
  }

  const featuredProjects = [
    primaryProject,
    ...projects.filter((project) => project.slug !== primaryProject.slug),
  ].slice(0, 4);

  const secondaryProjects = featuredProjects.slice(1);

  const displayFor = (project: Project) => {
    const apiCopy = {
      title: project.title,
      location: project.location,
      summary: project.summary,
    };

    return locale === defaultLocale
      ? (homeFeaturedProjectCopy[
          project.slug as keyof typeof homeFeaturedProjectCopy
        ] ?? apiCopy)
      : apiCopy;
  };

  const primaryDisplay = displayFor(primaryProject);

  const primaryMeta = [
    primaryDisplay.location,
    dictionary.projectStatus[primaryProject.status],
  ].filter((part): part is string => Boolean(part));

  const sectionTitle =
    locale === defaultLocale
      ? "Những không gian được kiến tạo"
      : "Spaces shaped for growth";

  const exploreLabel =
    locale === defaultLocale ? "Khám phá dự án" : dictionary.common.viewDetail;

  return (
    <section className="bg-ivory py-10 sm:py-12 lg:py-14">
      {/*
        Không dùng max-w-site nữa.
        Dùng cùng padding ngang với header để section trải rộng.
      */}
      <div className="w-full px-5 sm:px-8 lg:px-20 xl:px-28">
        {/* ==========================================
            TOP FEATURED PROJECT
        =========================================== */}
        <div className="grid gap-5 lg:grid-cols-[0.88fr_2.35fr] lg:gap-6">
          {/* LEFT HEADING */}
          <div className="flex flex-col items-start justify-between gap-7 border-earth/15 lg:border-r lg:pr-7">
            <div>
              <p className="mb-4 text-[0.68rem] font-bold uppercase tracking-[0.15em] text-earth">
                {dictionary.home.featuredEyebrow}
              </p>

              <h2 className="max-w-[15rem] font-display text-[2.35rem] font-medium uppercase leading-[1.05] text-charcoal sm:text-[2.7rem] lg:text-[2.8rem] xl:text-[3rem]">
                {sectionTitle}
              </h2>
            </div>

            <Link
              href={localizePath(routes.projects, locale)}
              className="button-polish inline-flex h-10 items-center gap-4 border border-earth/40 px-5 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-earth transition hover:border-earth hover:bg-earth hover:text-ivory"
            >
              {dictionary.common.viewAllProjects}

              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* PRIMARY PROJECT */}
          <Link
            href={localizePath(
              `${routes.projects}/${primaryProject.slug}`,
              locale,
            )}
            className="group grid overflow-hidden outline-none lg:grid-cols-[1.55fr_1fr]"
          >
            {/* MAIN IMAGE */}
            <div className="relative min-h-[17rem] overflow-hidden border border-earth/15 bg-surface shadow-[0_18px_42px_rgba(41,41,41,0.08)] sm:min-h-[20rem] lg:min-h-[17rem]">
              {primaryProject.image ? (
                <Image
                  src={primaryProject.image}
                  alt={primaryDisplay.title}
                  fill
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  className="object-cover object-center contrast-[1.06] saturate-[1.08] transition duration-700 group-hover:scale-[1.018] group-hover:contrast-[1.12] group-hover:saturate-[1.14]"
                />
              ) : null}
              <span
                aria-hidden="true"
                className="absolute inset-0 border border-white/25 opacity-80 transition group-hover:border-earth/25"
              />
            </div>

            {/* PRIMARY CONTENT */}
            <div className="flex flex-col justify-between bg-ivory px-5 py-5 sm:px-7 lg:px-6 lg:py-4 xl:px-7">
              <div>
                <h3 className="inline-flex max-w-[16rem] border border-earth/25 bg-white/65 px-4 py-3 font-display text-[1.75rem] font-semibold uppercase leading-[1.02] text-charcoal shadow-[0_12px_28px_rgba(41,41,41,0.08)] transition group-hover:-translate-y-0.5 group-hover:border-earth/45 group-hover:bg-earth group-hover:text-ivory group-focus-visible:-translate-y-0.5 group-focus-visible:border-earth/45 group-focus-visible:bg-earth group-focus-visible:text-ivory sm:text-[2.05rem]">
                  {primaryDisplay.title}
                </h3>

                {primaryMeta.length > 0 ? (
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-[0.63rem] font-bold uppercase leading-5 text-earth/75">
                    {primaryMeta.map((part, partIndex) => (
                      <Fragment key={part}>
                        {partIndex > 0 ? (
                          <span className="h-px w-5 bg-earth/35" />
                        ) : null}

                        <span>{part}</span>
                      </Fragment>
                    ))}
                  </div>
                ) : null}

                {primaryDisplay.summary ? (
                  <p className="mt-5 max-w-[31rem] text-[0.78rem] leading-[1.75] text-charcoal/70">
                    {primaryDisplay.summary}
                  </p>
                ) : null}
              </div>

              <span className="mt-5 inline-flex w-fit items-center gap-3 border border-earth/35 bg-white/70 px-4 py-3 text-[0.67rem] font-bold uppercase tracking-[0.12em] text-earth shadow-[0_10px_24px_rgba(41,41,41,0.06)] transition group-hover:border-earth group-hover:bg-earth group-hover:text-ivory group-focus-visible:border-earth group-focus-visible:bg-earth group-focus-visible:text-ivory">
                {exploreLabel}
              </span>
            </div>
          </Link>
        </div>

        {/* ==========================================
            SECONDARY PROJECTS
        =========================================== */}
        {secondaryProjects.length > 0 ? (
          <div className="mt-4 grid gap-3 md:grid-cols-3 lg:ml-[calc(25%+0.25rem)]">
            {secondaryProjects.map((project) => {
              const display = displayFor(project);

              const metaParts = [
                display.location,
                dictionary.projectStatus[project.status],
              ].filter((part): part is string => Boolean(part));

              return (
                <Link
                  key={project.slug}
                  href={localizePath(
                    `${routes.projects}/${project.slug}`,
                    locale,
                  )}
                  className="group relative min-h-[10.5rem] overflow-hidden border border-earth/12 bg-surface text-charcoal shadow-[0_12px_28px_rgba(41,41,41,0.07)] outline-none transition hover:border-earth/28 hover:shadow-[0_18px_36px_rgba(41,41,41,0.12)]"
                >
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={display.title}
                      fill
                      sizes="(min-width: 768px) 30vw, 100vw"
                      className="object-cover object-center contrast-[1.06] saturate-[1.08] transition duration-700 group-hover:scale-[1.025] group-hover:contrast-[1.13] group-hover:saturate-[1.16]"
                    />
                  ) : null}

                  {/* Overlay sáng từ trái sang phải */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-r from-ivory/80 via-ivory/24 to-transparent transition duration-500 group-hover:from-ivory/68 group-hover:via-ivory/16"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-charcoal/42 via-charcoal/8 to-transparent transition duration-500 group-hover:from-charcoal/34"
                  />

                  <span className="relative z-10 flex min-h-[10.5rem] flex-col justify-end px-5 py-4">
                    <h3 className="inline-flex w-fit max-w-[13rem] border border-earth/25 bg-ivory/88 px-3.5 py-2.5 font-display text-[1rem] font-semibold uppercase leading-[1.18] text-charcoal shadow-[0_10px_24px_rgba(41,41,41,0.12)] transition group-hover:-translate-y-1 group-hover:border-earth group-hover:bg-earth group-hover:text-ivory group-focus-visible:-translate-y-1 group-focus-visible:border-earth group-focus-visible:bg-earth group-focus-visible:text-ivory sm:text-[1.05rem]">
                      {display.title}
                    </h3>

                    {metaParts.length > 0 ? (
                      <span className="mt-2 w-fit max-w-[13rem] border-l-2 border-earth/55 bg-ivory/72 px-2.5 py-1 text-[0.58rem] font-bold uppercase leading-4 text-olive/80">
                        {metaParts.join(" | ")}
                      </span>
                    ) : null}

                    <span className="absolute bottom-4 right-4 grid size-8 place-items-center rounded-full bg-earth/90 text-sm text-ivory shadow-[0_10px_22px_rgba(41,41,41,0.18)] transition group-hover:translate-x-1 group-hover:bg-charcoal group-focus-visible:translate-x-1 group-focus-visible:bg-charcoal">
                      →
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
