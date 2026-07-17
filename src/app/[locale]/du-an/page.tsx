import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { PageHeading } from "@/components/ui/page-heading";
import { getProjects } from "@/lib/api/projects";
import { search } from "@/lib/api/search";
import { isLocale, localizePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { projectStatusFilterValues } from "@/lib/project-status";
import { routes } from "@/lib/routes";
import { getSearchQuery } from "@/lib/search";
import { buildPageMetadata } from "@/lib/seo";
import type { ProjectStatus } from "@/types/content";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/du-an">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = await getDictionary(locale);

  return buildPageMetadata({
    title: dictionary.projects.title,
    description: dictionary.projects.description,
    path: routes.projects,
    locale,
  });
}

function getStatusFilter(status: string | string[] | undefined) {
  const value = Array.isArray(status) ? status[0] : status;

  return projectStatusFilterValues.includes(value as ProjectStatus)
    ? (value as ProjectStatus | "all")
    : "all";
}

export default async function ProjectsPage({
  params,
  searchParams,
}: PageProps<"/[locale]/du-an">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const { status, q } = await searchParams;
  const activeStatus = getStatusFilter(status);
  const query = getSearchQuery(q);
  const dictionary = await getDictionary(locale);

  // Tìm kiếm và lọc trạng thái là hai chế độ tách biệt: khi có từ khóa, kết quả
  // đã xếp theo độ liên quan nên không chồng thêm bộ lọc lên trên.
  const projects = query
    ? (await search(query, locale, "projects")).projects
    : await getProjects(locale);

  const filteredProjects =
    query || activeStatus === "all"
      ? projects
      : projects.filter((project) => project.status === activeStatus);

  return (
    <SiteShell locale={locale}>
      <div className="projects-motion">
        <PageHeading
          eyebrow={dictionary.projects.eyebrow}
          title={
            query
              ? dictionary.projects.searchResultsTitle
              : dictionary.projects.title
          }
          description={dictionary.projects.description}
        />

        {query ? null : (
          <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
            <div className="reveal-from-left flex flex-wrap gap-2">
              {projectStatusFilterValues.map((value) => {
                const active = activeStatus === value;
                const href =
                  value === "all"
                    ? localizePath(routes.projects, locale)
                    : localizePath(
                        `${routes.projects}?status=${value}`,
                        locale,
                      );
                const count =
                  value === "all"
                    ? projects.length
                    : projects.filter(
                        (project) => project.status === value,
                      ).length;

                return (
                  <Link
                    key={value}
                    href={href}
                    scroll={false}
                    aria-current={active ? "page" : undefined}
                    className={`button-polish inline-flex min-h-10 items-center gap-1.5 border px-4 text-sm font-semibold transition ${
                      active
                        ? "border-brand bg-brand text-white"
                        : "border-black/10 bg-white text-ink-soft hover:border-brand hover:text-brand"
                    }`}
                  >
                    {active ? (
                      <Check className="size-4 shrink-0" aria-hidden="true" />
                    ) : null}
                    {dictionary.projectStatus[value]}
                    <span className={active ? "text-white/80" : "text-slate"}>
                      ({count})
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-16">
          {filteredProjects.length > 0 ? (
            <div
              className={`grid gap-5 ${
                filteredProjects.length === 1
                  ? "md:grid-cols-1"
                  : "stagger-sides md:grid-cols-2"
              }`}
            >
              {filteredProjects.map((project) => (
                <Link
                  key={project.slug}
                  href={localizePath(
                    `${routes.projects}/${project.slug}`,
                    locale,
                  )}
                  className={`hover-card group overflow-hidden border border-black/10 bg-white hover:border-brand ${
                    filteredProjects.length === 1
                      ? "reveal-sides-pair md:grid md:grid-cols-[1.08fr_0.92fr]"
                      : ""
                  }`}
                >
                  {project.image ? (
                    <div
                      className={`image-reveal relative overflow-hidden bg-surface ${
                        filteredProjects.length === 1
                          ? "reveal-from-left aspect-16/10 md:aspect-auto md:min-h-80"
                          : "aspect-3/2"
                      }`}
                    >
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <div
                    className={`flex flex-col justify-center p-5 md:p-6 ${
                      filteredProjects.length === 1 ? "reveal-from-right" : ""
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                      {project.location ? (
                        <span>{project.location}</span>
                      ) : null}
                      {project.location ? (
                        <span className="h-1 w-1 rounded-full bg-gold" />
                      ) : null}
                      <span>{dictionary.projectStatus[project.status]}</span>
                    </div>
                    <h2 className="mt-3 text-2xl font-semibold leading-tight">
                      {project.title}
                    </h2>
                    {project.category ? (
                      <p className="mt-2 text-sm font-semibold text-slate">
                        {project.category}
                      </p>
                    ) : null}
                    <p className="mt-4 text-sm leading-6 text-slate">
                      {project.summary}
                    </p>
                    <span className="link-arrow mt-6 inline-flex h-10 w-fit items-center border border-black/15 px-4 text-sm font-semibold group-hover:border-brand group-hover:text-brand">
                      {dictionary.common.viewDetail}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="reveal-section border border-black/10 bg-white p-8 text-center">
              <h2 className="text-2xl font-semibold">
                {dictionary.projects.emptyTitle}
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate">
                {dictionary.projects.emptyDescription}
              </p>
              <Link
                href={localizePath(routes.projects, locale)}
                className="button-polish mt-6 inline-flex h-11 items-center bg-brand px-5 text-sm font-semibold text-white transition hover:bg-brand-dark"
              >
                {dictionary.common.viewAllProjects}
              </Link>
            </div>
          )}
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-16">
          <div className="reveal-sides-pair grid gap-6 bg-brand-soft p-6 text-white md:grid-cols-[1fr_auto] md:items-center md:p-10">
            <div className="reveal-from-left">
              <p className="text-eyebrow mb-4 text-gold">
                {dictionary.projects.ctaEyebrow}
              </p>
              <h2 className="text-3xl font-semibold leading-tight">
                {dictionary.projects.ctaTitle}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white">
                {dictionary.projects.ctaDescription}
              </p>
            </div>
            <Link
              href={localizePath(routes.contact, locale)}
              className="button-polish reveal-from-right inline-flex h-11 items-center justify-center self-start bg-gold px-5 text-sm font-semibold text-ink transition hover:bg-white md:self-center"
            >
              {dictionary.common.contactCta}
            </Link>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
