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
import { projects, projectStatusLabels } from "@/data/projects";
import { routes } from "@/lib/routes";

type ProjectDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getProject(slug: string) {
  return projects.find((item) => item.slug === slug);
}

function ProjectFactCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-[#B06613]/12 bg-white/85 p-4 shadow-sm">
      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[#B06613]">
        {label}
      </dt>
      <dd className="mt-2 font-semibold leading-snug text-[#191919]">{value}</dd>
    </div>
  );
}

function ProjectOverviewHighlights({ highlights }: { highlights: string[] }) {
  return (
    <div className="mt-6 flex min-h-0 flex-1 flex-col">
      {highlights.length > 0 ? (
        <div className="flex flex-1 flex-col rounded-sm border border-[#B06613]/12 bg-[#fff4cf]/55 p-5">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#B06613]">
            Giá trị nổi bật
          </p>
          <ul className="grid gap-3">
            {highlights.map((highlight) => (
              <li
                key={highlight}
                className="flex items-start gap-3 text-sm leading-6 text-[#59646a]"
              >
                <CheckCircle2
                  className="mt-0.5 size-4 shrink-0 text-[#B06613]"
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

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

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
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  const gallery = project.gallery ?? [];
  const gallerySections = project.gallerySections ?? [];
  const overviewHighlights = project.highlights ?? [];

  return (
    <SiteShell>
      <div className="projects-motion">
        <section className="project-detail-hero border-b border-[#B06613]/10">
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
            <div className="image-reveal reveal-from-left relative aspect-[16/9] max-h-[520px] overflow-hidden border border-[#B06613]/20 bg-[#f2f2f2] shadow-[0_20px_48px_rgba(127,75,13,0.12)]">
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
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#fdcd04] via-[#c99248] to-[#B06613]" />
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#B06613]">
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
                <div className="rounded-sm border border-[#B06613]/12 bg-white/85 p-4 shadow-sm">
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[#B06613]">
                    Trạng thái
                  </dt>
                  <dd className="mt-2">
                    <span className="inline-flex rounded-sm bg-[#B06613] px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
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

            <article className="reveal-from-right hover-card project-detail-panel-accent relative flex h-full flex-col overflow-hidden border-l-4 border-l-[#fdcd04] p-6 md:p-8">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#B06613]">
                Tổng quan dự án
              </p>
              <h2 className="text-2xl font-semibold leading-tight md:text-3xl">
                {project.mapLocation?.heading ??
                  "Định hướng phát triển và thông tin tổng quan"}
              </h2>
              <p className="mt-5 text-base leading-7 text-[#59646a]">
                {project.description ??
                  "Thông tin tổng quan của dự án đang được cập nhật theo tài liệu được duyệt."}
              </p>
              {project.mapLocation?.description ? (
                <p className="mt-4 text-base leading-7 text-[#59646a]">
                  {project.mapLocation.description}
                </p>
              ) : null}

              <ProjectOverviewHighlights highlights={overviewHighlights} />

              {project.mapLocation ? (
                <div className="mt-6 flex flex-col gap-4 rounded-sm border border-[#B06613]/12 bg-[#fff4cf]/45 p-4 sm:flex-row sm:items-center sm:justify-between">
                  {project.mapLocation.address ? (
                    <p className="inline-flex items-center gap-2 text-sm font-medium text-[#191919]">
                      <MapPin className="size-4 shrink-0 text-[#B06613]" />
                      <span>{project.mapLocation.address}</span>
                    </p>
                  ) : (
                    <span />
                  )}
                  <a
                    href={project.mapLocation.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="button-polish inline-flex h-11 shrink-0 items-center justify-center bg-[#fdcd04] px-5 text-sm font-semibold text-[#191919] transition hover:bg-[#7f4b0d] hover:text-[#fdcd04]"
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
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#fdcd04] via-[#c99248] to-[#B06613]" />
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#B06613]">
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
                    className="image-reveal hover-card relative aspect-[4/3] overflow-hidden border border-[#B06613]/18 bg-[#f2f2f2] shadow-[0_12px_28px_rgba(127,75,13,0.1)]"
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
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#fdcd04] via-[#c99248] to-[#B06613]" />
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#B06613]">
                Điểm nổi bật
              </p>
              <h2 className="text-2xl font-semibold leading-tight md:text-3xl">
                Những giá trị nổi bật của dự án
              </h2>
              <p className="mt-5 text-sm leading-6 text-[#59646a]">
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
                  <div className="mb-4 h-1 w-14 bg-gradient-to-r from-[#fdcd04] to-[#B06613]" />
                  <p className="text-sm leading-6 text-[#59646a]">{highlight}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="reveal-sides-pair grid gap-6 bg-[#c99248] p-6 text-white md:grid-cols-[1fr_auto] md:items-center md:p-10">
            <div className="reveal-from-left">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#fdcd04]">
                Quan tâm dự án này?
              </p>
              <h2 className="text-3xl font-semibold leading-tight">
                Liên hệ Thiên Đức để được hỗ trợ thông tin
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75">
                Đội ngũ Thiên Đức sẵn sàng tiếp nhận nhu cầu tư vấn, hợp tác
                hoặc trao đổi thêm về dự án.
              </p>
            </div>
            <div className="reveal-from-right flex flex-wrap gap-3 self-start rounded border border-[#B06613]/30 bg-[#fff4cf] p-3 shadow-[0_4px_14px_rgba(127,75,13,0.16)] md:self-center">
              <Link
                href={routes.contact}
                className="button-polish inline-flex h-11 items-center justify-center bg-[#fdcd04] px-5 text-sm font-semibold text-[#191919] transition hover:bg-white"
              >
                Liên hệ tư vấn
              </Link>
              <Link
                href={routes.projects}
                className="button-polish inline-flex h-11 items-center justify-center border border-[#B06613]/35 bg-white px-5 text-sm font-semibold text-[#191919] transition hover:border-[#B06613] hover:bg-[#fdcd04]"
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
