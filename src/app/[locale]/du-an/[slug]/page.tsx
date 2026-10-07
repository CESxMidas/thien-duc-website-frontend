import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeading } from "@/components/ui/page-heading";
import ProjectImageGallery from "@/components/sections/project-item-gallery";
import { ProjectItemsCarousel } from "@/components/sections/project-items-carousel";
import { ProjectLocationMap } from "@/components/sections/project-location-map";
import { ProjectMapEmbed } from "@/components/sections/project-map-embed";
import { staticParamsSafe } from "@/lib/api/client";
import { getProjectBySlug, getProjects } from "@/lib/api/projects";
import { defaultLocale, isLocale, localizePath } from "@/lib/i18n/config";
import { getDictionary, interpolate } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo";

function ProjectFactCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col justify-center rounded-sm border border-brand/12 bg-white/85 p-4">
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

export async function generateStaticParams() {
  return staticParamsSafe("du-an/[slug]", async () => {
    const projects = await getProjects(defaultLocale);
    return projects.map((project) => ({ slug: project.slug }));
  });
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/du-an/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const project = await getProjectBySlug(slug, locale);
  if (!project) {
    const dictionary = await getDictionary(locale);
    return { title: dictionary.projectDetail.notFoundTitle };
  }

  return buildPageMetadata({
    title: project.title,
    description: project.summary,
    path: `${routes.projects}/${project.slug}`,
    locale,
    image: project.image,
    type: "article",
  });
}

export default async function ProjectDetailPage({
  params,
}: PageProps<"/[locale]/du-an/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const project = await getProjectBySlug(slug, locale);
  if (!project) {
    notFound();
  }

  const dictionary = await getDictionary(locale);
  const gallery = project.gallery ?? [];
  const gallerySections = project.gallerySections ?? [];
  const galleryImages = uniqueImages([
    project.image,
    ...gallery,
    ...gallerySections.flatMap((section) => section.images),
  ]);
  const overviewHighlights = project.highlights ?? [];
  const items = project.items ?? [];
  const quickFacts = project.quickFacts ?? [];
  const hasProjectGallery = galleryImages.length > 0;

  const addressFact = quickFacts.find((fact) =>
    /địa chỉ|address/i.test(fact.label),
  );
  const mapQuery =
    addressFact?.value ??
    (project.location ? `${project.title} ${project.location}` : undefined);
  const hasEmbedMap = !project.mapLocation && Boolean(mapQuery);

  return (
    <SiteShell locale={locale}>
      <div className="projects-motion">
        <section className="project-detail-hero border-b border-brand/10">
          <Breadcrumb
            items={[
              {
                label: dictionary.breadcrumb.home,
                href: localizePath(routes.home, locale),
              },
              {
                label: dictionary.breadcrumb.projects,
                href: localizePath(routes.projects, locale),
              },
              { label: project.title },
            ]}
          />
          <PageHeading
            eyebrow={dictionary.projectDetail.eyebrow}
            title={project.title}
            description={project.summary}
          />
        </section>

        <section className="project-detail-band py-8 sm:py-12">
          <div
            className={`page-container reveal-sides-pair grid gap-6 lg:items-stretch ${
              hasProjectGallery
                ? "lg:h-[42rem] lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.82fr)] xl:h-[46rem]"
                : "lg:grid-cols-1"
            }`}
          >
            {hasProjectGallery ? (
              <div className="image-reveal reveal-from-left min-h-0 min-w-0">
                <ProjectImageGallery
                  images={galleryImages}
                  title={project.title}
                />
              </div>
            ) : null}

            <article className="reveal-from-right hover-card project-detail-panel-accent relative flex min-h-0 flex-col overflow-hidden border-l-4 border-l-gold p-5 md:p-7">
              <div className="grid gap-6 lg:min-h-0 lg:overflow-y-auto lg:pr-2">
                <div>
                  <p className="text-eyebrow mb-4 text-brand">
                    {dictionary.projectDetail.overviewEyebrow}
                  </p>
                  <h2 className="text-2xl font-semibold leading-tight md:text-3xl">
                    {project.mapLocation?.heading ??
                      dictionary.projectDetail.overviewFallbackTitle}
                  </h2>
                  <p
                    className={`mt-5 text-base leading-7 text-slate ${
                      project.description ? "text-justified" : ""
                    }`}
                  >
                    {project.description ??
                      dictionary.projectDetail.overviewFallbackDescription}
                  </p>
                  {project.mapLocation?.description ? (
                    <p className="mt-4 text-base leading-7 text-slate">
                      {project.mapLocation.description}
                    </p>
                  ) : null}
                </div>

                <div className="border-t border-brand/12 pt-6">
                  <p className="text-eyebrow mb-4 text-brand">
                    {dictionary.projectDetail.quickInfoEyebrow}
                  </p>
                  <h3 className="text-xl font-semibold leading-tight text-ink">
                    {dictionary.projectDetail.quickInfoTitle}
                  </h3>

                  <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                    <ProjectFactCell
                      label={dictionary.projectDetail.locationLabel}
                      value={
                        project.location ?? dictionary.projectDetail.updating
                      }
                    />
                    <div className="flex flex-col justify-center rounded-sm border border-brand/12 bg-white/85 p-4">
                      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
                        {dictionary.projectDetail.statusLabel}
                      </dt>
                      <dd className="mt-2">
                        <span className="inline-flex rounded-sm bg-brand px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                          {dictionary.projectStatus[project.status]}
                        </span>
                      </dd>
                    </div>
                    <ProjectFactCell
                      label={dictionary.projectDetail.categoryLabel}
                      value={
                        project.category ?? dictionary.projectDetail.updating
                      }
                    />
                    {quickFacts.map((fact) => (
                      <ProjectFactCell
                        key={fact.label}
                        label={fact.label}
                        value={fact.value}
                      />
                    ))}
                  </dl>
                </div>
              </div>
            </article>
          </div>
        </section>

        {items.length > 0 ? (
          <section className="project-detail-band py-12">
            <div className="page-container">
              <div className="reveal-from-left mb-8">
                <p className="text-eyebrow mb-4 text-brand">
                  {dictionary.projectDetail.itemsEyebrow}
                </p>
                <h2 className="max-w-3xl text-2xl font-semibold leading-tight md:text-3xl">
                  {interpolate(dictionary.projectDetail.itemsTitle, {
                    title: project.title,
                  })}
                </h2>
              </div>

              <ProjectItemsCarousel
                items={items}
                projectSlug={project.slug}
                projectStatus={project.status}
                locale={locale}
                statusLabels={dictionary.projectStatus}
                labels={dictionary.itemsCarousel}
              />
            </div>
          </section>
        ) : null}

        {project.mapLocation ? (
          <ProjectLocationMap
            mapLocation={project.mapLocation}
            title={project.title}
            locale={locale}
            aerialImage={project.image}
          />
        ) : hasEmbedMap && mapQuery ? (
          <ProjectMapEmbed
            query={mapQuery}
            title={project.title}
            locale={locale}
            aerialImage={project.image}
          />
        ) : null}

        {overviewHighlights.length > 0 ? (
          <section className="project-detail-band py-12">
            <div className="page-container reveal-sides-pair grid gap-6 lg:grid-cols-2 lg:items-stretch">
              <aside className="reveal-from-left hover-card project-detail-panel relative flex h-full flex-col justify-center overflow-hidden p-5 md:p-7">
                <div className="absolute inset-x-0 top-0 h-1 bg-earth" />
                <p className="text-eyebrow mb-4 text-brand">
                  {dictionary.projectDetail.highlightsEyebrow}
                </p>
                <h2 className="text-2xl font-semibold leading-tight md:text-3xl">
                  {dictionary.projectDetail.highlightsTitle}
                </h2>
                <p className="mt-5 text-sm leading-6 text-slate">
                  {dictionary.projectDetail.highlightsDescription}
                </p>
              </aside>

              <div className="reveal-from-right grid h-full gap-4 sm:grid-cols-2">
                {overviewHighlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="hover-card project-detail-highlight flex items-start gap-3 p-5"
                  >
                    <CheckCircle2
                      className="mt-0.5 size-4 shrink-0 text-brand"
                      aria-hidden="true"
                    />
                    <p className="text-sm leading-6 text-slate">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="page-container py-5 sm:py-8">
          <div className="reveal-sides-pair grid gap-6 bg-brand p-5 text-white md:grid-cols-[1fr_auto] md:items-center md:p-8">
            <div className="reveal-from-left">
              <p className="text-eyebrow mb-4 text-gold-soft">
                {dictionary.projectDetail.ctaEyebrow}
              </p>
              <h2 className="text-3xl font-semibold leading-tight">
                {dictionary.projectDetail.ctaTitle}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white">
                {dictionary.projectDetail.ctaDescription}
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
                href={localizePath(routes.projects, locale)}
                className="button-polish inline-flex h-11 items-center justify-center border border-brand/35 bg-white px-5 text-sm font-semibold text-ink transition hover:border-brand hover:bg-gold"
              >
                {dictionary.common.viewAllProjects}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
