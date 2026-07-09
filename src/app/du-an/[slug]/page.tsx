import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeading } from "@/components/ui/page-heading";
import { ProjectGallerySections } from "@/components/sections/project-gallery-sections";
import { ProjectLocationMap } from "@/components/sections/project-location-map";
import { getProjectBySlug, getProjects } from "@/lib/api/projects";
import { projectStatusLabels } from "@/lib/project-status";
import { routes } from "@/lib/routes";

type ProjectDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function ProjectFactCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-brand/12 bg-white/85 p-4 shadow-sm">
      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
        {label}
      </dt>
      <dd className="mt-2 font-semibold leading-snug text-ink">{value}</dd>
    </div>
  );
}

function ProjectOverviewHighlights({ highlights }: { highlights: string[] }) {
  return (
    <div className="mt-6 flex min-h-0 flex-1 flex-col">
      {highlights.length > 0 ? (
        <div className="flex flex-1 flex-col rounded-sm border border-brand/12 bg-gold-soft/55 p-5">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
            Giá trị nổi bật
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

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Dự án không tồn tại | Thiên Đức",
    };
  }

  return {
    title: `${project.title} | Dự án Thiên Đức`,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const gallery = project.gallery ?? [];
  const gallerySections = project.gallerySections ?? [];
  const overviewHighlights = project.highlights ?? [];
  const items = project.items ?? [];

  return (
    <SiteShell>
      <div className="projects-motion">
        <section className="project-detail-hero border-b border-brand/10">
          <Breadcrumb
            items={[
              { label: "Trang chủ", href: routes.home },
              { label: "Dự án", href: routes.projects },
              { label: project.title },
            ]}
          />
          <PageHeading
            eyebrow="Chi tiết dự án"
            title={project.title}
            description={project.summary}
          />
        </section>

        {project.image && !project.mapLocation ? (
          <section className="mx-auto max-w-7xl px-6 pb-12 pt-4">
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
          <div className="reveal-sides-pair mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-2 lg:items-stretch">
            <aside className="reveal-from-left hover-card project-detail-panel relative flex h-full flex-col overflow-hidden p-6 md:p-8">
              <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-gold via-brand-soft to-brand" />
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-brand">
                Thông tin nhanh
              </p>
              <h2 className="text-2xl font-semibold leading-tight md:text-3xl">
                Thông số chính của dự án
              </h2>
              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                <ProjectFactCell
                  label="Vị trí"
                  value={project.location ?? "Đang cập nhật"}
                />
                <div className="rounded-sm border border-brand/12 bg-white/85 p-4 shadow-sm">
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
                    Trạng thái
                  </dt>
                  <dd className="mt-2">
                    <span className="inline-flex rounded-sm bg-brand px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                      {projectStatusLabels[project.status]}
                    </span>
                  </dd>
                </div>
                <ProjectFactCell
                  label="Loại hình"
                  value={project.category ?? "Đang cập nhật"}
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
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-brand">
                Tổng quan dự án
              </p>
              <h2 className="text-2xl font-semibold leading-tight md:text-3xl">
                {project.mapLocation?.heading ??
                  "Định hướng phát triển và thông tin tổng quan"}
              </h2>
              <p className="mt-5 text-base leading-7 text-slate">
                {project.description ??
                  "Thông tin tổng quan của dự án đang được cập nhật theo tài liệu được duyệt."}
              </p>
              {project.mapLocation?.description ? (
                <p className="mt-4 text-base leading-7 text-slate">
                  {project.mapLocation.description}
                </p>
              ) : null}

              <ProjectOverviewHighlights highlights={overviewHighlights} />

              {project.mapLocation ? (
                <div className="mt-6 flex flex-col gap-4 rounded-sm border border-brand/12 bg-gold-soft/45 p-4 sm:flex-row sm:items-center sm:justify-between">
                  {project.mapLocation.address ? (
                    <p className="inline-flex items-center gap-2 text-sm font-medium text-ink">
                      <MapPin className="size-4 shrink-0 text-brand" />
                      <span>{project.mapLocation.address}</span>
                    </p>
                  ) : (
                    <span />
                  )}
                  <a
                    href={project.mapLocation.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="button-polish inline-flex h-11 shrink-0 items-center justify-center bg-gold px-5 text-sm font-semibold text-ink transition hover:bg-brand-dark hover:text-gold"
                  >
                    Xem trên Google Maps
                  </a>
                </div>
              ) : null}
            </article>
          </div>
        </section>

        {project.mapLocation ? (
          <ProjectLocationMap
            mapLocation={project.mapLocation}
            title={project.title}
            aerialImage={project.image}
          />
        ) : null}

        {items.length > 0 ? (
          <section className="project-detail-band py-14">
            <div className="mx-auto max-w-7xl px-6">
              <div className="reveal-from-left">
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-brand">
                  Hạng mục trong dự án
                </p>
                <h2 className="max-w-3xl text-2xl font-semibold leading-tight md:text-3xl">
                  Các hạng mục hợp thành {project.title}
                </h2>
              </div>

              <div className="stagger-sides mt-8 grid gap-5 md:grid-cols-3">
                {items.map((item) => (
                  <Link
                    key={item.slug}
                    href={`${routes.projects}/${project.slug}/${item.slug}`}
                    className="hover-card group flex flex-col overflow-hidden border border-brand/18 bg-white hover:border-brand"
                  >
                    {item.image ? (
                      <div className="image-reveal relative aspect-4/3 overflow-hidden bg-surface">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(min-width: 768px) 33vw, 100vw"
                          className="object-cover"
                        />
                      </div>
                    ) : null}
                    <div className="flex flex-1 flex-col p-5">
                      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                        {projectStatusLabels[item.status ?? project.status]}
                      </span>
                      <h3 className="mt-3 text-xl font-semibold leading-snug">
                        {item.title}
                      </h3>
                      {item.summary ? (
                        <p className="mt-3 text-sm leading-6 text-slate">
                          {item.summary}
                        </p>
                      ) : null}
                      <span className="link-arrow mt-6 inline-flex h-10 w-fit items-center border border-brand/20 px-4 text-sm font-semibold group-hover:border-brand group-hover:text-brand">
                        Xem hạng mục
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {gallerySections.length > 0 ? (
          <section className="project-detail-band py-14">
            <div className="mx-auto max-w-7xl px-6">
              <ProjectGallerySections
                sections={gallerySections}
                projectTitle={project.title}
              />
            </div>
          </section>
        ) : gallery.length > 0 ? (
          <section className="project-detail-band py-14">
            <div className="reveal-sides-pair mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
              <aside className="reveal-from-left hover-card project-detail-panel relative flex h-full flex-col justify-center overflow-hidden p-6 md:p-8">
                <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-gold via-brand-soft to-brand" />
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-brand">
                  Hình ảnh dự án
                </p>
                <h2 className="text-2xl font-semibold leading-tight md:text-3xl">
                  Một số hình ảnh trong thư viện hiện có
                </h2>
              </aside>

              <div className="reveal-from-right stagger-sides grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:content-center">
                {gallery.map((image, index) => (
                  <div
                    key={image}
                    className="image-reveal hover-card relative aspect-4/3 overflow-hidden border border-brand/18 bg-surface shadow-[0_12px_28px_rgba(127,75,13,0.1)]"
                  >
                    <Image
                      src={image}
                      alt={`${project.title} - hình ảnh ${index + 1}`}
                      fill
                      sizes="(min-width: 1280px) 33vw, (min-width: 768px) 25vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="project-detail-band py-14">
          <div className="reveal-sides-pair mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-2 lg:items-stretch">
            <aside className="reveal-from-left hover-card project-detail-panel relative flex h-full flex-col justify-center overflow-hidden p-6 md:p-8">
              <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-gold via-brand-soft to-brand" />
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-brand">
                Điểm nổi bật
              </p>
              <h2 className="text-2xl font-semibold leading-tight md:text-3xl">
                Những giá trị nổi bật của dự án
              </h2>
              <p className="mt-5 text-sm leading-6 text-slate">
                Các điểm nhấn về định hướng phát triển, hạ tầng và trải nghiệm
                sống mà dự án mang lại.
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

        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="reveal-sides-pair grid gap-6 bg-brand-soft p-6 text-white md:grid-cols-[1fr_auto] md:items-center md:p-10">
            <div className="reveal-from-left">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-gold">
                Quan tâm dự án này?
              </p>
              <h2 className="text-3xl font-semibold leading-tight">
                Liên hệ Thiên Đức để được hỗ trợ thông tin
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white">
                Đội ngũ Thiên Đức sẵn sàng tiếp nhận nhu cầu tư vấn, hợp tác
                hoặc trao đổi thêm về dự án.
              </p>
            </div>
            <div className="reveal-from-right flex flex-wrap gap-3 self-start rounded border border-brand/30 bg-gold-soft p-3 shadow-[0_4px_14px_rgba(127,75,13,0.16)] md:self-center">
              <Link
                href={routes.contact}
                className="button-polish inline-flex h-11 items-center justify-center bg-gold px-5 text-sm font-semibold text-ink transition hover:bg-white"
              >
                Liên hệ tư vấn
              </Link>
              <Link
                href={routes.projects}
                className="button-polish inline-flex h-11 items-center justify-center border border-brand/35 bg-white px-5 text-sm font-semibold text-ink transition hover:border-brand hover:bg-gold"
              >
                Xem dự án khác
              </Link>
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
