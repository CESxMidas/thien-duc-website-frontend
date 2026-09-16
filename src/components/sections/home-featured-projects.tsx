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

  return (
    <section className="bg-ivory">
      <div className="mx-auto max-w-site px-4 py-12 sm:px-6 lg:py-16">
        <div className="flex flex-col gap-5 border-b border-black/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-eyebrow mb-4 text-earth">
              {dictionary.home.featuredEyebrow}
            </p>
            <h2 className="max-w-3xl text-[2.1rem] font-medium leading-[1.08] text-charcoal sm:text-[3rem]">
              {dictionary.home.featuredTitle}
            </h2>
          </div>
          <Link
            href={localizePath(routes.projects, locale)}
            className="link-arrow inline-flex h-11 items-center self-start border-b border-earth text-sm font-semibold uppercase tracking-[0.14em] text-earth md:self-auto"
          >
            {dictionary.common.viewAllProjects}
          </Link>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-4 lg:auto-rows-[18rem]">
          {featuredProjects.map((project, index) => {
            const apiCopy = {
              title: project.title,
              location: project.location,
              summary: project.summary,
            };
            const display =
              locale === defaultLocale
                ? (homeFeaturedProjectCopy[
                    project.slug as keyof typeof homeFeaturedProjectCopy
                  ] ?? apiCopy)
                : apiCopy;
            const isPrimary = index === 0;
            const metaParts = [
              display.location,
              dictionary.projectStatus[project.status],
            ].filter((part): part is string => Boolean(part));

            return (
              <Link
                key={project.slug}
                href={localizePath(`${routes.projects}/${project.slug}`, locale)}
                className={`group grid overflow-hidden border border-black/10 bg-white transition-colors hover:border-earth ${
                  isPrimary
                    ? "lg:col-span-2 lg:row-span-2"
                    : "lg:col-span-2 lg:grid-cols-[0.95fr_1fr]"
                }`}
              >
                <div
                  className={`relative overflow-hidden bg-surface ${
                    isPrimary ? "min-h-[20rem]" : "min-h-[15rem] lg:min-h-0"
                  }`}
                >
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={display.title}
                      fill
                      sizes={
                        isPrimary
                          ? "(min-width: 1024px) 50vw, 100vw"
                          : "(min-width: 1024px) 25vw, 100vw"
                      }
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                    />
                  ) : null}
                </div>
                <div className="flex flex-col justify-between p-5 sm:p-6">
                  <div>
                    {metaParts.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-earth">
                        {metaParts.map((part, partIndex) => (
                          <Fragment key={part}>
                            {partIndex > 0 ? (
                              <span className="h-px w-6 bg-warm-grey" />
                            ) : null}
                            <span>{part}</span>
                          </Fragment>
                        ))}
                      </div>
                    ) : null}
                    <h3
                      className={`mt-4 font-display font-medium leading-tight text-charcoal ${
                        isPrimary ? "text-3xl sm:text-4xl" : "text-xl"
                      }`}
                    >
                      {display.title}
                    </h3>
                    {display.summary ? (
                      <p
                        className={`mt-4 text-sm leading-6 text-charcoal/70 ${
                          isPrimary ? "line-clamp-5" : "line-clamp-3"
                        }`}
                      >
                        {display.summary}
                      </p>
                    ) : null}
                  </div>
                  <span className="link-arrow mt-6 inline-flex w-fit border-b border-earth text-sm font-semibold uppercase tracking-[0.14em] text-earth">
                    {dictionary.common.viewDetail}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
