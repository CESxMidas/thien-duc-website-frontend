import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeading } from "@/components/ui/page-heading";
import { ProjectGallerySections } from "@/components/sections/project-gallery-sections";
import { getProjectBySlug, getProjectItem, getProjects } from "@/lib/api/projects";
import { defaultLocale, isLocale, localizePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { projectStatusLabels } from "@/lib/project-status";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo";

// Thư mục route dùng tên tiếng Việt `[hang-muc]` cho khớp URL công khai
// `/du-an/khu-do-thi-hung-phu/fancy-tower`.

export async function generateStaticParams() {
  const projects = await getProjects(defaultLocale);
  return projects.flatMap((project) =>
    (project.items ?? []).map((item) => ({
      slug: project.slug,
      "hang-muc": item.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/du-an/[slug]/[hang-muc]">): Promise<Metadata> {
  const { locale, slug, "hang-muc": itemSlug } = await params;
  if (!isLocale(locale)) notFound();

  const item = await getProjectItem(slug, itemSlug, locale);
  if (!item) {
    return { title: "Hạng mục không tồn tại | Thiên Đức" };
  }

  return buildPageMetadata({
    title: `${item.title} | Dự án Thiên Đức`,
    description: item.summary ?? "",
    path: `${routes.projects}/${slug}/${item.slug}`,
    locale,
    image: item.image,
    type: "article",
  });
}

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
  const highlights = item.highlights ?? [];
  const quickFacts = item.quickFacts ?? [];
  // Hạng mục không đặt trạng thái riêng thì lấy theo dự án cha.
  const status = item.status ?? project.status;
  const siblings = (project.items ?? []).filter(
    (other) => other.slug !== item.slug,
  );

  return (
    <SiteShell locale={locale}>
      <div className="projects-motion">
        <section className="project-detail-hero border-b border-brand/10">
          <Breadcrumb
            items={[
              { label: "Trang chủ", href: localizePath(routes.home, locale) },
              { label: "Dự án", href: localizePath(routes.projects, locale) },
              { label: project.title, href: projectHref },
              { label: item.title },
            ]}
          />
          <PageHeading
            eyebrow={`Hạng mục · ${project.title}`}
            title={item.title}
            description={item.summary}
          />
        </section>

        {item.image ? (
          <section className="mx-auto max-w-7xl px-6 pb-12 pt-4">
            <div className="image-reveal reveal-from-left relative aspect-video max-h-130 overflow-hidden border border-brand/20 bg-surface shadow-[0_20px_48px_rgba(127,75,13,0.12)]">
              <Image
                src={item.image}
                alt={item.title}
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
                Thông số chính của hạng mục
              </h2>
              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-sm border border-brand/12 bg-white/85 p-4 shadow-sm">
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
                    Trạng thái
                  </dt>
                  <dd className="mt-2">
                    <span className="inline-flex rounded-sm bg-brand px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                      {projectStatusLabels[status]}
                    </span>
                  </dd>
                </div>
                <ProjectFactCell
                  label="Thuộc dự án"
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
            </aside>

            <article className="reveal-from-right hover-card project-detail-panel-accent relative flex h-full flex-col overflow-hidden border-l-4 border-l-gold p-6 md:p-8">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-brand">
                Tổng quan hạng mục
              </p>
              <h2 className="text-2xl font-semibold leading-tight md:text-3xl">
                Giới thiệu {item.title}
              </h2>
              <p className="mt-5 text-base leading-7 text-slate">
                {item.description ??
                  "Thông tin tổng quan của hạng mục đang được cập nhật theo tài liệu được duyệt."}
              </p>

              {highlights.length > 0 ? (
                <div className="mt-6 flex min-h-0 flex-1 flex-col">
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
                </div>
              ) : null}
            </article>
          </div>
        </section>

        {gallerySections.length > 0 ? (
          <section className="project-detail-band py-14">
            <div className="mx-auto max-w-7xl px-6">
              <ProjectGallerySections
                sections={gallerySections}
                projectTitle={item.title}
              />
            </div>
          </section>
        ) : gallery.length > 0 ? (
          <section className="project-detail-band py-14">
            <div className="mx-auto max-w-7xl px-6">
              <div className="reveal-from-left">
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-brand">
                  Hình ảnh hạng mục
                </p>
                <h2 className="max-w-3xl text-2xl font-semibold leading-tight md:text-3xl">
                  Một số hình ảnh của {item.title}
                </h2>
              </div>
              <div className="stagger-sides mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {gallery.map((image, index) => (
                  <div
                    key={image}
                    className="image-reveal hover-card relative aspect-4/3 overflow-hidden border border-brand/18 bg-surface shadow-[0_12px_28px_rgba(127,75,13,0.1)]"
                  >
                    <Image
                      src={image}
                      alt={`${item.title} - hình ảnh ${index + 1}`}
                      fill
                      sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {siblings.length > 0 ? (
          <section className="mx-auto max-w-7xl px-6 py-14">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-brand">
              Hạng mục khác
            </p>
            <h2 className="max-w-3xl text-2xl font-semibold leading-tight md:text-3xl">
              Tiếp tục khám phá {project.title}
            </h2>
            <div className="stagger-list mt-8 grid gap-5 md:grid-cols-2">
              {siblings.map((sibling) => (
                <Link
                  key={sibling.slug}
                  href={`${projectHref}/${sibling.slug}`}
                  className="hover-card group border border-black/10 bg-white p-5 hover:border-brand"
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                    {projectStatusLabels[sibling.status ?? project.status]}
                  </span>
                  <h3 className="mt-3 text-xl font-semibold leading-snug">
                    {sibling.title}
                  </h3>
                  {sibling.summary ? (
                    <p className="mt-3 text-sm leading-6 text-slate">
                      {sibling.summary}
                    </p>
                  ) : null}
                  <span className="link-arrow mt-5 inline-flex h-10 w-fit items-center border border-black/15 px-4 text-sm font-semibold group-hover:border-brand group-hover:text-brand">
                    Xem hạng mục
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mx-auto max-w-7xl px-6 pb-16">
          <div className="reveal-sides-pair grid gap-6 bg-brand-soft p-6 text-white md:grid-cols-[1fr_auto] md:items-center md:p-10">
            <div className="reveal-from-left">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-gold">
                Quan tâm hạng mục này?
              </p>
              <h2 className="text-3xl font-semibold leading-tight">
                Liên hệ Thiên Đức để được hỗ trợ thông tin
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white">
                Đội ngũ Thiên Đức sẵn sàng tiếp nhận nhu cầu tư vấn, hợp tác hoặc
                trao đổi thêm về {item.title}.
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
                href={projectHref}
                className="button-polish inline-flex h-11 items-center justify-center border border-brand/35 bg-white px-5 text-sm font-semibold text-ink transition hover:border-brand hover:bg-gold"
              >
                Về trang dự án
              </Link>
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
