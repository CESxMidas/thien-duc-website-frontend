import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Handshake, ShieldCheck, Target } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { BusinessFieldCard } from "@/components/ui/business-field-card";
import { PageHeading } from "@/components/ui/page-heading";
import { getPageBySlug } from "@/lib/api/pages";
import { isLocale, localizePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
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
  const [page, dictionary] = await Promise.all([
    getPageBySlug(PAGE_SLUG, locale),
    getDictionary(locale),
  ]);
  const about = dictionary.about;
  const [heroDescription, ...overviewParagraphs] = page?.paragraphs ?? [];

  const heading = {
    title: page?.title ?? about.heroTitle,
    description: heroDescription ?? about.heroDescription,
  };
  const paragraphs =
    overviewParagraphs.length > 0 ? overviewParagraphs : about.overviewParagraphs;

  return (
    <SiteShell locale={locale}>
      <PageHeading
        eyebrow={about.eyebrow}
        title={heading.title}
        description={heading.description}
      />

      <section className="reveal-section mx-auto grid max-w-site gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[1fr_0.9fr] lg:items-start">
        <div>
          <p className="text-eyebrow mb-4 text-brand">
            {about.overviewEyebrow}
          </p>
          <h2 className="max-w-3xl text-3xl font-semibold leading-tight md:text-4xl">
            {about.overviewTitle}
          </h2>
          <div className="prose-content mt-6 grid gap-4 text-lg leading-8 text-slate">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <blockquote className="mt-8 border-l-4 border-gold bg-white px-5 py-4 text-lg font-semibold text-ink-soft shadow-sm">
            {about.motto}
          </blockquote>
        </div>

        <div className="hover-card overflow-hidden border border-black/10 bg-white shadow-sm">
          <div className="image-reveal">
          <Image
            src="/images/projects/hung-phu/fancy-tower/fancy-tower-exterior-day-01.jpg"
            alt={about.imageAlt}
            width={720}
            height={520}
            className="aspect-4/3 h-auto w-full object-cover"
            sizes="(min-width: 1024px) 45vw, 100vw"
          />
          </div>
          <div className="grid gap-3 p-5 text-sm leading-6 text-slate sm:grid-cols-2">
            <div>
              <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                {about.foundedLabel}
              </span>
              <span className="mt-1 block text-lg font-semibold text-ink">
                {about.foundedValue}
              </span>
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                {about.areaLabel}
              </span>
              <span className="mt-1 block text-lg font-semibold text-ink">
                {about.areaValue}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="reveal-section mx-auto max-w-site px-4 sm:px-6">
        <dl className="stagger-list grid gap-4 border border-black/10 bg-white p-6 sm:grid-cols-2 lg:grid-cols-4 lg:p-8">
          {about.stats.map((stat) => (
            <div key={stat.label} className="border-l-4 border-gold pl-4">
              <dt className="font-display text-4xl font-semibold leading-none text-brand">
                {stat.value}
              </dt>
              <dd className="mt-2 font-semibold text-ink">{stat.label}</dd>
              <dd className="mt-1 text-sm leading-6 text-slate">{stat.note}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="reveal-section mx-auto max-w-site px-4 py-8 sm:px-6 sm:py-12">
        <div className="max-w-3xl">
          <p className="text-eyebrow mb-4 text-brand">
            {about.timelineEyebrow}
          </p>
          <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
            {about.timelineTitle}
          </h2>
        </div>

        <ol className="stagger-list mt-10 grid gap-4 md:grid-cols-3">
          {about.timeline.map((milestone) => (
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

      <section className="reveal-section mx-auto max-w-site px-4 py-8 sm:px-6 sm:py-12">
        <div className="max-w-3xl">
          <p className="text-eyebrow mb-4 text-brand">
            {about.principlesEyebrow}
          </p>
          <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
            {about.principlesTitle}
          </h2>
        </div>

        <div className="stagger-list mt-10 grid gap-4 md:grid-cols-3">
          {about.principles.map((item, index) => {
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

      <section className="reveal-section mx-auto max-w-site px-4 py-8 sm:px-6 sm:py-12">
        <div className="max-w-3xl">
          <p className="text-eyebrow mb-4 text-brand">
            {about.fieldsEyebrow}
          </p>
          <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
            {about.fieldsTitle}
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate">
            {about.fieldsDescription}
          </p>
        </div>

        <div className="stagger-list mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {about.fields.map((item, index) => (
            <BusinessFieldCard
              key={item.title}
              item={item}
              index={index}
              codeLabel={about.fieldCodeLabel}
            />
          ))}
        </div>
      </section>

      <section className="reveal-section mx-auto max-w-site px-4 py-8 sm:px-6 sm:py-14">
        <div className="rounded-sm bg-brand-soft p-6 text-white shadow-[0_8px_28px_rgba(176,102,19,0.18)] md:p-10">
          <p className="text-eyebrow mb-4 text-gold">
            {about.ctaEyebrow}
          </p>
          <h2 className="max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
            {about.ctaTitle}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white">
            {about.ctaDescription}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={localizePath(routes.projects, locale)}
              className="button-polish inline-flex h-11 items-center bg-gold px-5 text-sm font-semibold text-ink hover:bg-white"
            >
              {about.ctaPrimary}
            </Link>
            <Link
              href={localizePath(routes.contact, locale)}
              className="button-polish inline-flex h-11 items-center border border-white/50 px-5 text-sm font-semibold text-white hover:bg-white hover:text-ink"
            >
              {about.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
