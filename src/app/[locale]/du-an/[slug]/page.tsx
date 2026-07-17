import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeading } from "@/components/ui/page-heading";
import { ProjectGallerySections } from "@/components/sections/project-gallery-sections";
import { ProjectItemsCarousel } from "@/components/sections/project-items-carousel";
import { ProjectLocationMap } from "@/components/sections/project-location-map";
import { ProjectMapEmbed } from "@/components/sections/project-map-embed";
import { ProjectPhotoStrip } from "@/components/sections/project-photo-strip";
import { isApiConfigured } from "@/lib/api/client";
import { getProjectBySlug, getProjects } from "@/lib/api/projects";
import { defaultLocale, isLocale, localizePath } from "@/lib/i18n/config";
import { getDictionary, interpolate } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo";

function ProjectFactCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col justify-center rounded-sm border border-brand/12 bg-white/85 p-4 shadow-sm">
      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
        {label}
      </dt>
      <dd className="mt-2 font-semibold leading-snug text-ink">{value}</dd>
    </div>
  );
}

function ProjectOverviewHighlights({
  highlights,
  label,
}: {
  highlights: string[];
  label: string;
}) {
  return (
    <div className="mt-6 flex min-h-0 flex-1 flex-col">
      {highlights.length > 0 ? (
        <div className="flex flex-1 flex-col rounded-sm border border-brand/12 bg-gold-soft/55 p-5">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
            {label}
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
      ) : null}
    </div>
  );
}

/** Slug không phụ thuộc ngôn ngữ — locale do `generateStaticParams` của layout sinh. */
export async function generateStaticParams() {
  // Build không có API (CI) → bỏ prerender, trang render on-demand (xem client.ts).
  if (!isApiConfigured) return [];
  const projects = await getProjects(defaultLocale);
  return projects.map((project) => ({ slug: project.slug }));
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
    title: `${project.title}`,
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
  const overviewHighlights = project.highlights ?? [];
  const items = project.items ?? [];

  // Hưng Phú dùng bản đồ minh hoạ (`mapLocation`); các dự án khác nhúng Google
  // Maps nếu suy ra được địa chỉ (ưu tiên quickFact "Địa chỉ", không thì
  // "tên dự án + địa danh"). Có bản đồ thì ảnh dự án hiện trong khối bản đồ,
  // không lặp lại ở hero phía trên.
  const addressFact = (project.quickFacts ?? []).find((fact) =>
    /địa chỉ/i.test(fact.label),
  );
  const mapQuery =
    addressFact?.value ??
    (project.location ? `${project.title} ${project.location}` : undefined);
  const hasEmbedMap = !project.mapLocation && Boolean(mapQuery);
  const hasMap = Boolean(project.mapLocation) || hasEmbedMap;

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

        {project.image && !hasMap ? (
          <section className="mx-auto max-w-7xl px-4 pb-10 pt-4 sm:px-6 sm:pb-12">
            <div className="image-reveal reveal-from-left relative aspect-video max-h-130 overflow-hidden border border-brand/20 bg-surface shadow-[0_20px_48px_rgba(127,75,13,0.12)]">
              <Image
                src={project.image}
                alt={project.title}
                fill
                preload
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover"
              />
            </div>
          </section>
        ) : null}

        <section className="project-detail-band py-14">
          <div className="reveal-sides-pair mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:items-stretch">
            <aside className="reveal-from-left hover-card project-detail-panel relative flex h-full flex-col overflow-hidden p-6 md:p-8">
              <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-gold via-brand-soft to-brand" />
              <p className="text-eyebrow mb-4 text-brand">
                {dictionary.projectDetail.quickInfoEyebrow}
              </p>
              <h2 className="text-2xl font-semibold leading-tight md:text-3xl">
                {dictionary.projectDetail.quickInfoTitle}
              </h2>
              {/* `flex-1 auto-rows-fr` để lưới thông số giãn đều lấp hết chiều
                  cao panel — hai cột luôn bằng nhau mà không để lại khoảng
                  trống thừa ở đáy cột trái. */}
              <dl className="mt-6 grid flex-1 auto-rows-fr gap-4 sm:grid-cols-2">
                <ProjectFactCell
                  label={dictionary.projectDetail.locationLabel}
                  value={project.location ?? dictionary.projectDetail.updating}
                />
                <div className="flex flex-col justify-center rounded-sm border border-brand/12 bg-white/85 p-4 shadow-sm">
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
                  value={project.category ?? dictionary.projectDetail.updating}
                />
                {(project.quickFacts ?? []).map((fact) => (
                  <ProjectFactCell
                    key={fact.label}
                    label={fact.label}
                    value={fact.value}
                  />
                ))}
              </dl>
            </aside>

            <article className="reveal-from-right hover-card project-detail-panel-accent relative flex h-full flex-col overflow-hidden border-l-4 border-l-gold p-6 md:p-8">
              <p className="text-eyebrow mb-4 text-brand">
                {dictionary.projectDetail.overviewEyebrow}
              </p>
              <h2 className="text-2xl font-semibold leading-tight md:text-3xl">
                {project.mapLocation?.heading ??
                  dictionary.projectDetail.overviewFallbackTitle}
              </h2>
              {/* Địa chỉ + nút Google Maps cố ý bỏ ở đây: khối bản đồ ngay dưới
                  đã có đủ địa chỉ và nút chỉ đường, nhắc lại là thừa và làm cột
                  này dài hơn hẳn cột bên trái. */}
              <p className="mt-5 line-clamp-6 text-base leading-7 text-slate">
                {project.description ??
                  dictionary.projectDetail.overviewFallbackDescription}
              </p>
              {project.mapLocation?.description ? (
                <p className="mt-4 line-clamp-3 text-base leading-7 text-slate">
                  {project.mapLocation.description}
                </p>
              ) : null}

              <ProjectOverviewHighlights
                highlights={overviewHighlights}
                label={dictionary.projectDetail.highlightsLabel}
              />
            </article>
          </div>
        </section>

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

        {items.length > 0 ? (
          <section className="project-detail-band py-14">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
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

              {/* Một showcase tự chạy duy nhất — trước đây hạng mục hiện hai lần
                  (lưới thẻ + khối gallerySections cùng tên) gây trùng lặp. */}
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
        ) : gallerySections.length > 0 ? (
          <section className="project-detail-band py-14">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <ProjectGallerySections
                sections={gallerySections}
                projectTitle={project.title}
              />
            </div>
          </section>
        ) : gallery.length > 0 ? (
          <section className="project-detail-band py-14">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="reveal-from-left mb-8">
                <p className="text-eyebrow mb-4 text-brand">
                  {dictionary.projectDetail.galleryEyebrow}
                </p>
                <h2 className="max-w-3xl text-2xl font-semibold leading-tight md:text-3xl">
                  {dictionary.projectDetail.galleryTitle}
                </h2>
              </div>
              {/* Dự án không chia hạng mục: xếp ảnh thành hàng (tối đa 3) và tự
                  trượt khi đủ ảnh — song song với carousel hạng mục của dự án
                  có hạng mục, để bố cục giữa các dự án đồng nhất. */}
              <ProjectPhotoStrip images={gallery} title={project.title} />
            </div>
          </section>
        ) : null}

        <section className="project-detail-band py-14">
          <div className="reveal-sides-pair mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:items-stretch">
            <aside className="reveal-from-left hover-card project-detail-panel relative flex h-full flex-col justify-center overflow-hidden p-6 md:p-8">
              <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-gold via-brand-soft to-brand" />
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

            <div className="reveal-from-right flex h-full flex-col justify-center gap-4">
              {(project.highlights ?? []).map((highlight) => (
                <div
                  key={highlight}
                  className="hover-card project-detail-highlight p-5"
                >
                  <div className="mb-4 h-1 w-14 bg-linear-to-r from-gold to-brand" />
                  <p className="text-sm leading-6 text-slate">{highlight}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
          <div className="reveal-sides-pair grid gap-6 bg-brand-soft p-6 text-white md:grid-cols-[1fr_auto] md:items-center md:p-10">
            <div className="reveal-from-left">
              <p className="text-eyebrow mb-4 text-gold">
                {dictionary.projectDetail.ctaEyebrow}
              </p>
              <h2 className="text-3xl font-semibold leading-tight">
                {dictionary.projectDetail.ctaTitle}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white">
                {dictionary.projectDetail.ctaDescription}
              </p>
            </div>
            <div className="reveal-from-right flex flex-wrap gap-3 self-start rounded border border-brand/30 bg-gold-soft p-3 shadow-[0_4px_14px_rgba(127,75,13,0.16)] md:self-center">
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
