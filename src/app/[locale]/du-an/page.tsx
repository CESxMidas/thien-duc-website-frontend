import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Check } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { ProjectsCarousel } from "@/components/sections/projects-carousel";
import { PageHeading } from "@/components/ui/page-heading";
import { getProjects } from "@/lib/api/projects";
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
  const query = getSearchQuery(q);

  // Tìm kiếm đã chuyển hẳn sang `/tim-kiem` (dự án + tin tức trong một lượt).
  // `/du-an?q=...` là URL cũ, chuyển hướng **vĩnh viễn (308)** và giữ nguyên từ
  // khóa. Chỉ chuyển khi THẬT SỰ có từ khóa — `?status=` và danh sách thường
  // không bị đụng tới.
  if (query) {
    permanentRedirect(
      `${localizePath(routes.search, locale)}?q=${encodeURIComponent(query)}`,
    );
  }

  const activeStatus = getStatusFilter(status);
  const dictionary = await getDictionary(locale);
  const projects = await getProjects(locale);

  const filteredProjects =
    activeStatus === "all"
      ? projects
      : projects.filter((project) => project.status === activeStatus);

  return (
    <SiteShell locale={locale}>
      <div className="projects-motion">
        <PageHeading
          eyebrow={dictionary.projects.eyebrow}
          title={dictionary.projects.title}
          description={dictionary.projects.description}
        />

        <section className="mx-auto max-w-site px-4 pb-6 sm:px-6">
          <div className="reveal-from-left flex flex-wrap gap-2">
            {projectStatusFilterValues.map((value) => {
              const active = activeStatus === value;
              const href =
                value === "all"
                  ? localizePath(routes.projects, locale)
                  : localizePath(`${routes.projects}?status=${value}`, locale);
              const count =
                value === "all"
                  ? projects.length
                  : projects.filter((project) => project.status === value)
                      .length;

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

        <section className="mx-auto max-w-site px-4 pb-5 sm:px-6 sm:pb-8">
          {filteredProjects.length > 0 ? (
            <ProjectsCarousel
              projects={filteredProjects}
              locale={locale}
              labels={dictionary.projects.carousel}
              statusLabels={dictionary.projectStatus}
              detailLabel={dictionary.common.viewDetail}
            />
          ) : (
            <div className="reveal-section border border-black/10 bg-white p-6 text-center">
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

        <section className="mx-auto max-w-site px-4 pb-5 sm:px-6 sm:pb-8">
          <div className="reveal-sides-pair grid gap-6 bg-brand p-5 text-white md:grid-cols-[1fr_auto] md:items-center md:p-8">
            <div className="reveal-from-left">
              <p className="text-eyebrow mb-4 text-gold-soft">
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
