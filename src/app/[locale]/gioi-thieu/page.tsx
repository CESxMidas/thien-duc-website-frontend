import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Handshake, ShieldCheck, Target } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { BusinessFieldsCarousel } from "@/components/sections/business-fields-carousel";
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

const principleIcons = [Target, Handshake, ShieldCheck];

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

      <div className="mx-auto grid max-w-site gap-8 px-4 py-5 sm:px-6 sm:py-8 lg:grid-cols-[minmax(0,1fr)_19rem]">
      
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

          <section className="reveal-section">
            <dl
              className={`stagger-list grid gap-4 border border-black/10 bg-white p-5 lg:p-6 ${gridColumns(
                statsColumns,
                about.stats.length,
                "sm:grid-cols-2 xl:grid-cols-4",
              )}`}
            >
              {about.stats.map((stat) => (
                <div key={stat.label} className="border-l-4 border-gold pl-4">
                  <dt className="font-display text-4xl font-semibold leading-none text-brand">
                    {stat.value}
                  </dt>
                  <dd className="mt-2 font-semibold text-ink">{stat.label}</dd>
                  <dd className="mt-1 text-sm leading-6 text-slate">
                    {stat.note}
                  </dd>
                </div>
              ))}
            </dl>
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

      <section className="reveal-section mx-auto max-w-site px-4 py-5 sm:px-6 sm:py-8">
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

      <section className="reveal-section mx-auto max-w-site px-4 py-5 sm:px-6 sm:py-8">
        <div className="max-w-3xl">
          <p className="text-eyebrow mb-4 text-brand">
            {about.principlesEyebrow}
          </p>
          <h2 className="text-2xl font-semibold leading-tight md:text-3xl">
            {about.principlesTitle}
          </h2>
        </div>

        <div className="stagger-list mt-8 grid gap-4 md:grid-cols-3">
          {about.principles.map((item, index) => {
            const Icon = principleIcons[index];

            return (
              <article
                key={item.title}
                className="hover-card group border border-black/10 bg-white p-5 hover:border-brand/35"
              >
                <Icon
                  className="icon-badge mb-5 size-8 text-brand transition group-hover:scale-110"
                  aria-hidden="true"
                />
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-justified mt-4 text-sm leading-6 text-slate">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="reveal-section mx-auto max-w-site px-4 py-5 sm:px-6 sm:py-8">
        <div className="max-w-3xl">
          <p className="text-eyebrow mb-4 text-brand">{about.fieldsEyebrow}</p>
          <h2 className="text-2xl font-semibold leading-tight md:text-3xl">
            {about.fieldsTitle}
          </h2>
          <p className="text-justified mt-5 text-base leading-7 text-slate">
            {about.fieldsDescription}
          </p>
        </div>

        <BusinessFieldsCarousel
          fields={about.fields}
          codeLabel={about.fieldCodeLabel}
          labels={about.fieldsCarousel}
        />
      </section>

      <section className="reveal-section mx-auto max-w-site px-4 py-5 sm:px-6 sm:py-8">
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
