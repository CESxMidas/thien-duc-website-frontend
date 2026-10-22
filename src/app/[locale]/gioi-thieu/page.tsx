import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { AboutValuesShowcase } from "@/components/sections/about-values-showcase";
import { ContentSidebar } from "@/components/sections/content-sidebar";
import { getNewsPage } from "@/lib/api/news";
import { getProjects } from "@/lib/api/projects";
import { BrandMotto } from "@/components/ui/brand-motto";
import { PageHeading } from "@/components/ui/page-heading";
import { getPageBySlug } from "@/lib/api/pages";
import { isLocale, localizePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo";

const PAGE_SLUG = "gioi-thieu";

const SIDEBAR_NEWS_COUNT = 4;
const SIDEBAR_PROJECT_COUNT = 2;

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

const statsColumns = [
  "",
  "",
  "sm:grid-cols-2",
  "sm:grid-cols-2 xl:grid-cols-3",
];
const timelineColumns = ["", "", "md:grid-cols-2"];

const gridColumns = (map: string[], count: number, fallback: string) =>
  map[count] ?? fallback;

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

  const [page, dictionary, newsPage, projects] = await Promise.all([
    getPageBySlug(PAGE_SLUG, locale),
    getDictionary(locale),
    getNewsPage(locale, { page: 1, limit: SIDEBAR_NEWS_COUNT }),
    getProjects(locale),
  ]);
  const about = dictionary.about;
  const careers = dictionary.careers;
  const [heroDescription, ...overviewParagraphs] = page?.paragraphs ?? [];

  const heading = {
    title: page?.title ?? about.heroTitle,
    description: heroDescription ?? about.heroDescription,
  };
  const paragraphs =
    overviewParagraphs.length > 0
      ? overviewParagraphs
      : about.overviewParagraphs;

  return (
    <SiteShell locale={locale}>

      <div className="page-container grid gap-8 py-5 sm:py-8 lg:grid-cols-[minmax(0,1fr)_19rem]">
      
        <div className="grid content-between gap-8 sm:gap-10">
          <PageHeading
            bare
            eyebrow={about.eyebrow}
            title={heading.title}
            description={heading.description}
          />

          <section className="reveal-section grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-eyebrow mb-3 text-brand">
                {about.overviewEyebrow}
              </p>
              <h2 className="max-w-3xl text-2xl font-semibold leading-tight md:text-3xl">
                {about.overviewTitle}
              </h2>
              <div className="prose-content mt-5 grid gap-3 text-base leading-7 text-slate">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <BrandMotto
                motto={about.motto}
                label={about.mottoLabel}
                className="mt-6"
              />
            </div>

            <div className="hover-card flex flex-col overflow-hidden border border-black/10 bg-white">
              <div className="image-reveal relative aspect-4/3 xl:aspect-auto xl:min-h-72 xl:flex-1">
                <Image
                  src="/images/projects/hung-phu/fancy-tower/fancy-tower-exterior-day-01.jpg"
                  alt={about.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1280px) 32vw, (min-width: 1024px) 55vw, 100vw"
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

        </div>

        <ContentSidebar
          news={newsPage.items}
          projects={projects.slice(0, SIDEBAR_PROJECT_COUNT)}
          locale={locale}
          labels={dictionary.contentSidebar}
          common={dictionary.common}
          statusLabels={dictionary.projectStatus}
        />
      </div>

      <section className="reveal-section page-container py-5 sm:py-8">
        <div className="max-w-3xl">
          <p className="text-eyebrow mb-4 text-brand">
            {about.timelineEyebrow}
          </p>
          <h2 className="text-2xl font-semibold leading-tight md:text-3xl">
            {about.timelineTitle}
          </h2>
        </div>

        <ol
          className={`stagger-list mt-8 grid gap-4 ${gridColumns(
            timelineColumns,
            about.timeline.length,
            "md:grid-cols-3",
          )}`}
        >
          {about.timeline.map((milestone) => (
            <li
              key={milestone.period}
              className="hover-card border border-black/10 bg-white p-5 hover:border-brand/35"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">
                {milestone.period}
              </p>
              <h3 className="mt-3 text-xl font-semibold">{milestone.title}</h3>
              <p className="text-justified mt-4 text-sm leading-6 text-slate">
                {milestone.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <AboutValuesShowcase
        eyebrow={about.principlesEyebrow}
        title={about.principlesShowcaseTitle}
        imageAlt={about.imageAlt}
        values={about.principles}
      />

      <section className="reveal-section page-container py-6 sm:py-10">
        <div className="max-w-3xl">
          <p className="text-eyebrow mb-4 text-brand">
            {about.capabilityEyebrow}
          </p>
          <h2 className="font-display text-3xl font-semibold leading-tight text-charcoal sm:text-4xl">
            {about.capabilityTitle}
          </h2>
        </div>

        <dl
          className={`stagger-list mt-8 grid gap-px overflow-hidden rounded-lg border border-gold/25 bg-gold/20 ${gridColumns(
            statsColumns,
            about.stats.length,
            "sm:grid-cols-2 xl:grid-cols-4",
          )}`}
        >
          {about.stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-[linear-gradient(145deg,#f3e2d0_0%,#ead2b8_100%)] p-6 sm:p-7"
            >
              <dt className="font-display text-5xl font-semibold leading-none text-earth">
                {stat.value}
              </dt>
              <dd className="mt-4 font-semibold text-charcoal">{stat.label}</dd>
              <dd className="mt-2 text-sm leading-6 text-slate">
                {stat.note}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="reveal-section page-container py-6 sm:py-10">
        <div className="relative isolate overflow-hidden rounded-lg bg-[#29352b] px-6 py-10 text-white sm:px-10 sm:py-12 lg:px-14">
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-3/5 bg-[url('/images/fields/field-architecture-line-art.webp')] bg-cover bg-center opacity-[0.12]"
            aria-hidden="true"
          />
          <div className="relative z-10 max-w-3xl">
            <p className="text-eyebrow text-gold-soft">{careers.eyebrow}</p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl">
              {careers.heroTitle}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-ivory/88">
              {careers.heroDescription}
            </p>
            <Link
              href={localizePath(routes.careers, locale)}
              className="group mt-7 inline-flex min-h-11 items-center gap-2 rounded-md bg-gold px-5 py-3 text-sm font-semibold text-charcoal transition hover:bg-gold-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {careers.teaserCta}
              <ArrowUpRight
                className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </section>

      <section className="reveal-section page-container py-5 sm:py-8">
        <div className="rounded-sm bg-brand p-5 text-white md:p-10">
          <p className="text-eyebrow mb-4 text-gold-soft">{about.ctaEyebrow}</p>
          <h2 className="max-w-2xl text-2xl font-semibold leading-tight md:text-3xl">
            {about.ctaTitle}
          </h2>
          <p className="text-justified mt-5 max-w-2xl text-base leading-7 text-white">
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
