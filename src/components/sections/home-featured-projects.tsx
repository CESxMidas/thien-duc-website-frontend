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
    <section className="bg-ivory py-12 sm:py-16">
      <div className="mx-auto max-w-site px-4 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-[0.85fr_2.1fr]">
          <div className="flex flex-col items-start justify-between gap-8 border-earth/15 lg:border-r lg:pr-8">
            <div>
              <p className="text-eyebrow mb-4 text-earth">
                {dictionary.home.featuredEyebrow}
              </p>
              <h2 className="max-w-sm font-display text-[2.35rem] font-medium uppercase leading-[1.08] text-charcoal sm:text-[3.25rem]">
                {sectionTitle}
              </h2>
            </div>
            <Link
              href={localizePath(routes.projects, locale)}
              className="button-polish inline-flex h-11 items-center border border-earth/40 px-5 text-xs font-bold uppercase tracking-[0.12em] text-earth transition hover:border-earth hover:bg-earth hover:text-ivory"
            >
              {dictionary.common.viewAllProjects}
            </Link>
          </div>

          <Link
            href={localizePath(`${routes.projects}/${primaryProject.slug}`, locale)}
            className="group grid overflow-hidden lg:grid-cols-[1.45fr_1fr]"
          >
            <div className="relative min-h-[18rem] overflow-hidden bg-surface sm:min-h-[23rem] lg:min-h-[18rem]">
              {primaryProject.image ? (
                <Image
                  src={primaryProject.image}
                  alt={primaryDisplay.title}
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                />
              ) : null}
            </div>
            <div className="flex flex-col justify-between bg-ivory px-5 py-6 sm:px-7 lg:py-4">
              <div>
                <h3 className="font-display text-3xl font-medium uppercase leading-[1.08] text-charcoal sm:text-4xl">
                  {primaryDisplay.title}
                </h3>
                {primaryMeta.length > 0 ? (
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-bold uppercase leading-5 text-earth/75">
                    {primaryMeta.map((part, partIndex) => (
                      <Fragment key={part}>
                        {partIndex > 0 ? (
                          <span className="h-px w-6 bg-earth/35" />
                        ) : null}
                        <span>{part}</span>
                      </Fragment>
                    ))}
                  </div>
                ) : null}
                {primaryDisplay.summary ? (
                  <p className="mt-5 line-clamp-4 text-sm leading-7 text-charcoal/72">
                    {primaryDisplay.summary}
                  </p>
                ) : null}
              </div>
              <span className="link-arrow mt-6 inline-flex w-fit text-sm font-bold uppercase tracking-[0.12em] text-earth">
                {exploreLabel}
              </span>
            </div>
          </Link>
        </div>

        {secondaryProjects.length > 0 ? (
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {secondaryProjects.map((project) => {
              const display = displayFor(project);
              const metaParts = [
                display.location,
                dictionary.projectStatus[project.status],
              ].filter((part): part is string => Boolean(part));

              return (
                <Link
                  key={project.slug}
                  href={localizePath(`${routes.projects}/${project.slug}`, locale)}
                  className="group relative min-h-[12.5rem] overflow-hidden bg-surface p-5 text-charcoal"
                >
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={display.title}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover opacity-72 transition duration-500 group-hover:scale-[1.035] group-hover:opacity-86"
                    />
                  ) : null}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-r from-ivory via-ivory/80 to-ivory/10"
                  />
                  <span className="relative z-10 flex h-full flex-col justify-end">
                    <h3 className="max-w-48 font-display text-xl font-medium uppercase leading-tight text-charcoal">
                      {display.title}
                    </h3>
                    {metaParts.length > 0 ? (
                      <span className="mt-2 line-clamp-1 text-[0.68rem] font-bold uppercase leading-5 text-earth/75">
                        {metaParts.join(" | ")}
                      </span>
                    ) : null}
                    <span className="absolute bottom-0 right-0 grid size-9 place-items-center rounded-full bg-earth/85 text-ivory transition group-hover:bg-charcoal">
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
