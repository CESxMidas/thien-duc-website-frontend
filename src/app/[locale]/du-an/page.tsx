import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { ProjectCarousel } from "@/components/sections/project-carousel";
import { PageHeading } from "@/components/ui/page-heading";
import { ProjectCard } from "@/components/ui/project-card";
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

  // Thứ tự hiển thị dự án do CMS quản lý qua `Project.order` (backend trả về
  // `orderBy: { order: 'asc' }` — `order` nhỏ hơn đứng trước). Frontend GIỮ
  // NGUYÊN thứ tự đó, cố ý không sort lại.
  //
  // Lưu ý: "mới nhất → cũ nhất" ở đây là **quy ước biên tập do CMS sắp xếp**,
  // KHÔNG phải sắp xếp tự động suy ra từ ngày tháng của dự án. Model `Project`
  // không có trường ngày nghiệp vụ nào; `createdAt` chỉ là thời điểm nhập bản
  // ghi vào CMS nên không phản ánh dòng thời gian dự án, và không được dùng.
  //
  // Tìm kiếm và lọc trạng thái là hai chế độ tách biệt: khi có từ khóa, kết quả
  // đã xếp theo độ liên quan nên không chồng thêm bộ lọc lên trên.
  const projects = query
    ? (await search(query, locale, "projects")).projects
    : await getProjects(locale);

  const filteredProjects =
    query || activeStatus === "all"
      ? projects
      : projects.filter((project) => project.status === activeStatus);

  const statusFilters = (
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
            : projects.filter((project) => project.status === value).length;

        return (
          <Link
            key={value}
            href={href}
            scroll={false}
            aria-current={active ? "page" : undefined}
            className={`button-polish inline-flex min-h-11 items-center gap-1.5 border px-4 text-sm font-semibold transition ${
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
  );

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

        <section className="mx-auto max-w-site px-4 pb-8 sm:px-6 sm:pb-14">
          {filteredProjects.length > 0 ? (
            query ? (
              // Kết quả tìm kiếm giữ LƯỚI: số lượng biến động và người dùng đang
              // muốn quét/so sánh nhanh các kết quả khớp, không phải duyệt tuần tự.
              <div
                className={`grid gap-5 ${
                  filteredProjects.length === 1
                    ? "md:grid-cols-1"
                    : "stagger-sides md:grid-cols-2"
                }`}
              >
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.slug}
                    project={project}
                    href={localizePath(
                      `${routes.projects}/${project.slug}`,
                      locale,
                    )}
                    statusLabel={dictionary.projectStatus[project.status]}
                    viewDetailLabel={dictionary.common.viewDetail}
                    featured={filteredProjects.length === 1}
                  />
                ))}
              </div>
            ) : (
              // `key` theo bộ lọc: đổi trạng thái lọc sẽ remount carousel, nhờ đó
              // vị trí cuộn về thẻ đầu tiên và hai nút tính lại trạng thái tắt/bật.
              <ProjectCarousel
                key={activeStatus}
                toolbar={statusFilters}
                labels={{
                  region: dictionary.projects.carouselLabel,
                  previous: dictionary.projects.previousProject,
                  next: dictionary.projects.nextProject,
                }}
                items={filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.slug}
                    project={project}
                    href={localizePath(
                      `${routes.projects}/${project.slug}`,
                      locale,
                    )}
                    statusLabel={dictionary.projectStatus[project.status]}
                    viewDetailLabel={dictionary.common.viewDetail}
                    featured={filteredProjects.length === 1}
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 85vw"
                  />
                ))}
              />
            )
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

        <section className="mx-auto max-w-site px-4 pb-8 sm:px-6 sm:pb-14">
          <div className="reveal-sides-pair grid gap-6 bg-brand p-6 text-white md:grid-cols-[1fr_auto] md:items-center md:p-10">
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
