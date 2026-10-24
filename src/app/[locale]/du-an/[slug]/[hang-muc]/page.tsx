import { ContentEmphasis } from "@/components/ui/content-emphasis";
import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { PageHeading } from "@/components/ui/page-heading";
import { ProjectItemsCarousel } from "@/components/sections/project-items-carousel";
import ProjectImageGallery from "@/components/sections/project-item-gallery";
import { staticParamsSafe } from "@/lib/api/client";
import { getProjectBySlug, getProjectItem, getProjects } from "@/lib/api/projects";
import { defaultLocale, isLocale, localizePath } from "@/lib/i18n/config";
import { getDictionary, interpolate } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo";

export async function generateStaticParams() {

  return staticParamsSafe("du-an/[slug]/[hang-muc]", async () => {
    const projects = await getProjects(defaultLocale);
    return projects.flatMap((project) =>
      (project.items ?? []).map((item) => ({
        slug: project.slug,
        "hang-muc": item.slug,
      })),
    );
  });
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/du-an/[slug]/[hang-muc]">): Promise<Metadata> {
  const { locale, slug, "hang-muc": itemSlug } = await params;
  if (!isLocale(locale)) notFound();

  const [item, dictionary] = await Promise.all([
    getProjectItem(slug, itemSlug, locale),
    getDictionary(locale),
  ]);
  if (!item) {
    return { title: dictionary.projectItem.notFoundTitle };
  }

  return buildPageMetadata({
    title: `${item.title} | ${dictionary.projectItem.metaSuffix}`,
    description: item.summary ?? "",
    path: `${routes.projects}/${slug}/${item.slug}`,
    locale,
    image: item.image,
    type: "article",
  });
}

function ProjectFactCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-brand/12 bg-white/85 p-4">
      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
        {label}
      </dt>
      <dd className="mt-2 font-semibold leading-snug text-ink">{value}</dd>
    </div>
  );
}

function uniqueImages(images: Array<string | undefined>) {
  return Array.from(new Set(images.filter(Boolean) as string[]));
}

export default async function ProjectItemPage({
  params,
}: PageProps<"/[locale]/du-an/[slug]/[hang-muc]">) {
  const { locale, slug, "hang-muc": itemSlug } = await params;
  if (!isLocale(locale)) notFound();

  const [project, item, dictionary] = await Promise.all([
    getProjectBySlug(slug, locale),
    getProjectItem(slug, itemSlug, locale),
    getDictionary(locale),
  ]);

  if (!project || !item) {
    notFound();
  }

  const projectHref = localizePath(`${routes.projects}/${project.slug}`, locale);
  const gallery = item.gallery ?? [];
  const gallerySections = item.gallerySections ?? [];
  const galleryImages = uniqueImages([
    item.image,
    ...gallery,
    ...gallerySections.flatMap((section) => section.images),
  ]);
  const highlights = item.highlights ?? [];
  const quickFacts = item.quickFacts ?? [];
  // Hạng mục không đặt trạng thái riêng thì lấy theo dự án cha.
  const status = item.status ?? project.status;
  const siblings = (project.items ?? []).filter(
    (other) => other.slug !== item.slug,
  );

  return (
    <SiteShell
      locale={locale}
      breadcrumbs={[
        {
          label: dictionary.breadcrumb.home,
          href: localizePath(routes.home, locale),
        },
        {
          label: dictionary.breadcrumb.projects,
          href: localizePath(routes.projects, locale),
        },
        { label: project.title, href: projectHref },
        { label: item.title },
      ]}
    >
      <div className="projects-motion">
        <section className="project-detail-hero border-b border-divider">
          <PageHeading
            eyebrow={interpolate(dictionary.projectItem.eyebrow, {
              title: project.title,
            })}
            title={item.title}
            description={item.summary}
            emphasizeDescription
            titleClassName="editorial-title text-espresso"
          />
        </section>

        <section className="project-detail-band py-12">
          <div className="page-container reveal-sides-pair grid gap-6 lg:grid-cols-2 lg:items-stretch">
            {galleryImages.length > 0 ? (
              <div className="reveal-from-left h-full min-w-0">
                <ProjectImageGallery images={galleryImages} title={item.title} />
              </div>
            ) : null}

            <article
              className={`editorial-content reveal-from-right hover-card project-detail-panel relative flex h-full flex-col overflow-hidden p-5 md:p-7 ${
                galleryImages.length === 0 ? "lg:col-span-2" : ""
              }`}
            >
              <div className="section-accent-line absolute inset-x-0 top-0" />
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-eyebrow text-brand">
                  {dictionary.projectItem.overviewEyebrow}
                </p>
                <span className="inline-flex rounded-sm bg-brand px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                  {dictionary.projectStatus[status]}
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold leading-tight md:text-3xl">
                {interpolate(dictionary.projectItem.introTitle, {
                  title: item.title,
                })}
              </h2>
          
              <p
                style={{ whiteSpace: "pre-line" }}
                className={`project-description content-paragraph mt-5 text-base leading-7 text-slate ${
                  item.description ? "text-justified" : ""
                }`}
              >
                <ContentEmphasis text={item.description ?? dictionary.projectItem.descriptionFallback} names={[project.title, item.title]} />
              </p>

            
              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                <ProjectFactCell
                  label={dictionary.projectItem.parentProjectLabel}
                  value={project.title}
                />
                {quickFacts.map((fact) => (
                  <ProjectFactCell
                    key={fact.label}
                    label={fact.label}
                    value={fact.value}
                  />
                ))}
              </dl>

              {highlights.length > 0 ? (
                <div className="mt-6 flex min-h-0 flex-1 flex-col">
                  <div className="flex flex-1 flex-col rounded-sm border border-brand/12 bg-gold-soft/55 p-5">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                      {dictionary.projectItem.highlightsLabel}
                    </p>
                    <ul className="grid gap-3">
                      {highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-start gap-3 text-sm leading-6 text-slate"
                        >
                          <CheckCircle2
                            className="mt-0.5 size-4 shrink-0 text-brand"
                            aria-hidden="true"
                          />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
            </article>
          </div>
        </section>

        {siblings.length > 0 ? (
          <section className="page-container py-5 sm:py-8">
            <p className="text-eyebrow mb-4 text-brand">
              {dictionary.projectItem.siblingsEyebrow}
            </p>
            <h2 className="max-w-3xl text-2xl font-semibold leading-tight md:text-3xl">
              {interpolate(dictionary.projectItem.siblingsTitle, {
                title: project.title,
              })}
            </h2>
            <div className="mt-8">
              <ProjectItemsCarousel
                items={siblings}
                projectSlug={project.slug}
                projectStatus={project.status}
                locale={locale}
                statusLabels={dictionary.projectStatus}
                labels={dictionary.itemsCarousel}
              />
            </div>
          </section>
        ) : null}

        <section className="page-container pb-5 sm:pb-8">
          <div className="reveal-sides-pair grid gap-6 bg-brand p-5 text-white md:grid-cols-[1fr_auto] md:items-center md:p-8">
            <div className="reveal-from-left">
              <p className="text-eyebrow mb-4 text-gold-soft">
                {dictionary.projectItem.ctaEyebrow}
              </p>
              <h2 className="text-3xl font-semibold leading-tight">
                {dictionary.projectItem.ctaTitle}
              </h2>
              <p className="content-paragraph mt-4 max-w-2xl text-sm leading-6 text-white">
                {interpolate(dictionary.projectItem.ctaDescription, {
                  title: item.title,
                })}
              </p>
            </div>
            <div className="reveal-from-right flex flex-wrap gap-3 self-start rounded border border-brand/30 bg-gold-soft p-3 md:self-center">
              <Link
                href={localizePath(routes.contact, locale)}
                className="button-polish inline-flex h-11 items-center justify-center bg-gold px-5 text-sm font-semibold text-ink transition hover:bg-white"
              >
                {dictionary.common.contactCta}
              </Link>
              <Link
                href={projectHref}
                className="button-polish inline-flex h-11 items-center justify-center border border-brand/35 bg-white px-5 text-sm font-semibold text-ink transition hover:border-brand hover:bg-gold"
              >
                {dictionary.projectItem.backToProject}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
