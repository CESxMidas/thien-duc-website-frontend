import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { PageHeading } from "@/components/ui/page-heading";
import {
  projects,
  projectStatusFilters,
  projectStatusLabels,
} from "@/data/projects";
import { routes } from "@/lib/routes";
import type { ProjectStatus } from "@/types/content";

type ProjectsPageProps = {
  searchParams: Promise<{
    status?: string | string[];
  }>;
};

export const metadata: Metadata = {
  title: "Dự án Thiên Đức | Danh mục dự án bất động sản",
  description:
    "Danh mục các dự án bất động sản Thiên Đức đang triển khai, chuẩn bị phát triển hoặc đã hoàn thành, với thông tin tổng quan và hình ảnh dự án.",
};

function getStatusFilter(status: string | string[] | undefined) {
  const value = Array.isArray(status) ? status[0] : status;
  const validStatuses = projectStatusFilters.map((item) => item.value);

  return validStatuses.includes(value as ProjectStatus)
    ? (value as ProjectStatus | "all")
    : "all";
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const { status } = await searchParams;
  const activeStatus = getStatusFilter(status);
  const filteredProjects =
    activeStatus === "all"
      ? projects
      : projects.filter((project) => project.status === activeStatus);

  return (
    <SiteShell>
      <div className="projects-motion">
      <PageHeading
        eyebrow="Dự án"
        title="Dự án của Thiên Đức"
        description="Tổng hợp các dự án Thiên Đức đang triển khai, đã hoàn thành hoặc đang chuẩn bị phát triển trong lĩnh vực bất động sản và xây dựng."
      />

      <section className="mx-auto max-w-7xl px-6 pb-8">
        <div className="reveal-from-left flex flex-wrap gap-2">
          {projectStatusFilters.map((filter) => {
            const active = activeStatus === filter.value;
            const href =
              filter.value === "all"
                ? routes.projects
                : `${routes.projects}?status=${filter.value}`;
            const count =
              filter.value === "all"
                ? projects.length
                : projects.filter((project) => project.status === filter.value)
                    .length;

            return (
              <Link
                key={filter.value}
                href={href}
                scroll={false}
                aria-current={active ? "page" : undefined}
                className={`button-polish inline-flex min-h-10 items-center gap-1.5 border px-4 text-sm font-semibold transition ${
                  active
                    ? "border-[#B06613] bg-[#B06613] text-white"
                    : "border-black/10 bg-white text-[#1d2428] hover:border-[#B06613] hover:text-[#B06613]"
                }`}
              >
                {active ? (
                  <Check className="size-4 shrink-0" aria-hidden="true" />
                ) : null}
                {filter.label}
                <span className={active ? "text-white/80" : "text-[#59646a]"}>
                  ({count})
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
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
                href={`${routes.projects}/${project.slug}`}
                className={`hover-card group overflow-hidden border border-black/10 bg-white hover:border-[#B06613] ${
                  filteredProjects.length === 1
                    ? "reveal-sides-pair md:grid md:grid-cols-[1.08fr_0.92fr]"
                    : ""
                }`}
              >
                {project.image ? (
                  <div
                    className={`image-reveal relative overflow-hidden bg-[#f2f2f2] ${
                      filteredProjects.length === 1
                        ? "reveal-from-left aspect-[16/10] md:aspect-auto md:min-h-80"
                        : "aspect-[3/2]"
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
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#B06613]">
                    {project.location ? <span>{project.location}</span> : null}
                    {project.location ? (
                      <span className="h-1 w-1 rounded-full bg-[#fdcd04]" />
                    ) : null}
                    <span>{projectStatusLabels[project.status]}</span>
                  </div>
                  <h2 className="mt-3 text-2xl font-semibold leading-tight">
                    {project.title}
                  </h2>
                  {project.category ? (
                    <p className="mt-2 text-sm font-semibold text-[#59646a]">
                      {project.category}
                    </p>
                  ) : null}
                  <p className="mt-4 text-sm leading-6 text-[#59646a]">
                    {project.summary}
                  </p>
                  <span className="link-arrow mt-6 inline-flex h-10 w-fit items-center border border-black/15 px-4 text-sm font-semibold group-hover:border-[#B06613] group-hover:text-[#B06613]">
                    Xem chi tiết
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="reveal-section border border-black/10 bg-white p-8 text-center">
            <h2 className="text-2xl font-semibold">Chưa có dự án phù hợp</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#59646a]">
              Hiện chưa có dự án trong nhóm trạng thái này. Bạn có thể quay lại
              danh sách tất cả dự án để xem các thông tin đang có.
            </p>
            <Link
              href={routes.projects}
              className="button-polish mt-6 inline-flex h-11 items-center bg-[#B06613] px-5 text-sm font-semibold text-white transition hover:bg-[#7f4b0d]"
            >
              Xem tất cả dự án
            </Link>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="reveal-sides-pair grid gap-6 bg-[#c99248] p-6 text-white md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div className="reveal-from-left">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#fdcd04]">
              Thông tin dự án
            </p>
            <h2 className="text-3xl font-semibold leading-tight">
              Quan tâm dự án của Thiên Đức?
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white">
              Liên hệ Thiên Đức để trao đổi thêm về thông tin dự án, nhu cầu tư
              vấn hoặc định hướng hợp tác.
            </p>
          </div>
          <Link
            href={routes.contact}
            className="button-polish reveal-from-right inline-flex h-11 items-center justify-center self-start bg-[#fdcd04] px-5 text-sm font-semibold text-[#191919] transition hover:bg-white md:self-center"
          >
            Liên hệ tư vấn
          </Link>
        </div>
      </section>
      </div>
    </SiteShell>
  );
}
