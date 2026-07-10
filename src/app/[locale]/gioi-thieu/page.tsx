import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Handshake, ShieldCheck, Target } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { BusinessFieldCard } from "@/components/ui/business-field-card";
import { PageHeading } from "@/components/ui/page-heading";
import {
  aboutContactCta,
  aboutFields,
  aboutHero,
  aboutOverview,
  aboutPortfolio,
  aboutPrinciples,
  aboutStats,
  aboutTimeline,
} from "@/data/about";
import { getPageBySlug } from "@/lib/api/pages";
import { isLocale, localizePath, type Locale } from "@/lib/i18n/config";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo";

const PAGE_SLUG = "gioi-thieu";

const metaCopy: Record<Locale, { title: string; description: string }> = {
  vi: {
    title: "Giới thiệu Công ty Thiên Đức | Đầu tư, xây dựng & bất động sản",
    description:
      "Tổng quan về Công ty TNHH Đầu tư - Xây dựng - Thương mại Thiên Đức, doanh nghiệp hoạt động trong lĩnh vực đầu tư, xây dựng, thương mại và phát triển bất động sản từ năm 2010.",
  },
  en: {
    title: "About Thien Duc | Investment, construction & real estate",
    description:
      "An overview of Thien Duc Investment - Construction - Trading Co., Ltd, active in investment, construction, trading, and real estate development since 2010.",
  },
};

const principleIcons = [Target, Handshake, ShieldCheck];

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/gioi-thieu">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return buildPageMetadata({
    ...metaCopy[locale],
    path: routes.about,
    locale,
  });
}

export default async function AboutPage({
  params,
}: PageProps<"/[locale]/gioi-thieu">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // Phần chữ do CMS quản lý (`GET /pages/gioi-thieu`): đoạn đầu là mô tả dưới
  // tiêu đề, các đoạn sau là nội dung khối "Định hướng phát triển". Các khối có
  // bố cục riêng (giá trị cốt lõi, ngành nghề) vẫn là UI tĩnh.
  const page = await getPageBySlug(PAGE_SLUG, locale);
  const [heroDescription, ...overviewParagraphs] = page?.paragraphs ?? [];

  const heading = {
    title: page?.title ?? aboutHero.title,
    description: heroDescription ?? aboutHero.description,
  };
  const paragraphs =
    overviewParagraphs.length > 0 ? overviewParagraphs : aboutOverview.paragraphs;

  return (
    <SiteShell locale={locale}>
      <PageHeading
        eyebrow={aboutHero.eyebrow}
        title={heading.title}
        description={heading.description}
      />

      <section className="reveal-section mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[1fr_0.9fr] lg:items-start">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-brand">
            {aboutOverview.eyebrow}
          </p>
          <h2 className="max-w-3xl text-3xl font-semibold leading-tight md:text-4xl">
            {aboutOverview.title}
          </h2>
          <div className="mt-6 grid gap-4 text-lg leading-8 text-slate">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <blockquote className="mt-8 border-l-4 border-gold bg-white px-5 py-4 text-lg font-semibold text-ink-soft shadow-sm">
            {aboutOverview.motto}
          </blockquote>
        </div>

        <div className="hover-card overflow-hidden border border-black/10 bg-white shadow-sm">
          <div className="image-reveal">
          <Image
            src="/images/projects/hung-phu/fancy-tower/fancy-tower-exterior-day-01.jpg"
            alt="Dự án bất động sản Thiên Đức phát triển"
            width={720}
            height={520}
            className="aspect-4/3 h-auto w-full object-cover"
            sizes="(min-width: 1024px) 45vw, 100vw"
          />
          </div>
          <div className="grid gap-3 p-5 text-sm leading-6 text-slate sm:grid-cols-2">
            <div>
              <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                Thành lập
              </span>
              <span className="mt-1 block text-lg font-semibold text-ink">
                2010
              </span>
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                Địa bàn
              </span>
              <span className="mt-1 block text-lg font-semibold text-ink">
                TP.HCM và các tỉnh
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="reveal-section mx-auto max-w-7xl px-6">
        <dl className="stagger-list grid gap-4 border border-black/10 bg-white p-6 sm:grid-cols-2 lg:grid-cols-4 lg:p-8">
          {aboutStats.map((stat) => (
            <div key={stat.label} className="border-l-4 border-gold pl-4">
              <dt className="text-3xl font-semibold leading-none text-brand">
                {stat.value}
              </dt>
              <dd className="mt-2 font-semibold text-ink">{stat.label}</dd>
              <dd className="mt-1 text-sm leading-6 text-slate">{stat.note}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="reveal-section mx-auto max-w-7xl px-6 py-14">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-brand">
            Chặng đường phát triển
          </p>
          <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
            Từ 2010 đến nay
          </h2>
        </div>

        <ol className="stagger-list mt-10 grid gap-4 md:grid-cols-3">
          {aboutTimeline.map((milestone) => (
            <li
              key={milestone.period}
              className="hover-card border border-black/10 bg-white p-6 hover:border-brand/35"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">
                {milestone.period}
              </p>
              <h3 className="mt-3 text-xl font-semibold">{milestone.title}</h3>
              <p className="mt-4 text-sm leading-6 text-slate">
                {milestone.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="reveal-section mx-auto max-w-7xl px-6 py-14">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-brand">
            Dự án tiêu biểu
          </p>
          <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
            Danh mục dự án đã bàn giao và đang triển khai
          </h2>
        </div>

        {/* Bảng cuộn ngang trong khung riêng — không để tràn ra body trên mobile. */}
        <div className="mt-10 overflow-x-auto border border-black/10 bg-white">
          <table className="w-full min-w-208 border-collapse text-left text-sm">
            <thead className="bg-surface-warm text-xs uppercase tracking-[0.14em] text-brand">
              <tr>
                <th scope="col" className="px-5 py-4 font-semibold">Dự án</th>
                <th scope="col" className="px-5 py-4 font-semibold">Vai trò</th>
                <th scope="col" className="px-5 py-4 font-semibold">Đối tác</th>
                <th scope="col" className="px-5 py-4 font-semibold">Quy mô</th>
                <th scope="col" className="px-5 py-4 font-semibold">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {aboutPortfolio.map((project) => (
                <tr key={project.name} className="border-t border-black/10">
                  <th scope="row" className="px-5 py-4 font-semibold text-ink">
                    {project.name}
                    <span className="mt-1 block text-xs font-normal text-slate">
                      {project.location}
                    </span>
                  </th>
                  <td className="px-5 py-4 leading-6 text-slate">{project.role}</td>
                  <td className="px-5 py-4 leading-6 text-slate">{project.partner}</td>
                  <td className="px-5 py-4 leading-6 text-slate">{project.scale}</td>
                  <td className="px-5 py-4 leading-6 text-slate">{project.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="reveal-section mx-auto max-w-7xl px-6 py-14">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-brand">
            Giá trị nền tảng
          </p>
          <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
            Tầm nhìn, sứ mệnh và giá trị cốt lõi
          </h2>
        </div>

        <div className="stagger-list mt-10 grid gap-4 md:grid-cols-3">
          {aboutPrinciples.map((item, index) => {
            const Icon = principleIcons[index];

            return (
              <article key={item.title} className="hover-card group border border-black/10 bg-white p-6 hover:border-brand/35">
                <Icon className="icon-badge mb-5 size-8 text-brand transition group-hover:scale-110" aria-hidden="true" />
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-4 text-sm leading-6 text-slate">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="reveal-section mx-auto max-w-7xl px-6 py-14">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-brand">
            Lĩnh vực hoạt động
          </p>
          <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
            Ngành nghề kinh doanh đã đăng ký
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate">
            Các lĩnh vực được trình bày theo nhóm ngành nghề trong mục tiêu hoạt
            động và ngành nghề kinh doanh của Công ty Thiên Đức.
          </p>
        </div>

        <div className="stagger-list mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {aboutFields.map((item, index) => (
            <BusinessFieldCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </section>

      <section className="reveal-section mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-sm bg-brand-soft p-6 text-white shadow-[0_8px_28px_rgba(176,102,19,0.18)] md:p-10">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-gold">
            {aboutContactCta.eyebrow}
          </p>
          <h2 className="max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
            {aboutContactCta.title}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white">
            {aboutContactCta.description}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={localizePath(aboutContactCta.primaryCta.href, locale)}
              className="button-polish inline-flex h-11 items-center bg-gold px-5 text-sm font-semibold text-ink hover:bg-white"
            >
              {aboutContactCta.primaryCta.label}
            </Link>
            <Link
              href={localizePath(aboutContactCta.secondaryCta.href, locale)}
              className="button-polish inline-flex h-11 items-center border border-white/50 px-5 text-sm font-semibold text-white hover:bg-white hover:text-ink"
            >
              {aboutContactCta.secondaryCta.label}
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
