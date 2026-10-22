import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { AboutJourney } from "@/components/sections/about-journey";
import { AboutFoundation } from "@/components/sections/about-foundation";
import { ContentSidebar } from "@/components/sections/content-sidebar";
import { BusinessFieldsCarousel } from "@/components/sections/business-fields-carousel";
import { BrandMotto } from "@/components/ui/brand-motto";
import { getNewsPage } from "@/lib/api/news";
import { getProjects } from "@/lib/api/projects";
import { AboutValuesShowcase } from "@/components/sections/about-values-showcase";
import { PageHeading } from "@/components/ui/page-heading";
import { getPageBySlug } from "@/lib/api/pages";
import { isLocale, type Locale } from "@/lib/i18n/config";
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
      <div className="about-page-shell page-container grid gap-8 py-5 sm:py-8 lg:grid-cols-[minmax(0,1fr)_19rem]">

        <div className="grid content-start gap-6 sm:gap-8">
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
              <AboutJourney about={about} />
            </div>

            <div className="hover-card overflow-hidden border border-black/10 bg-white xl:flex xl:h-full xl:flex-col">
              <div className="image-reveal relative aspect-video shrink-0 bg-surface xl:aspect-auto xl:min-h-72 xl:flex-1">
                <Image
                  src="/images/about/about-foundation-waterfront.webp"
                  alt={about.imageAlt}
                  fill
                  className="object-cover xl:object-center"
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

      <div className="about-page">
        <AboutValuesShowcase
          eyebrow={about.principlesEyebrow}
          title={about.principlesShowcaseTitle}
          imageAlt={about.imageAlt}
          values={about.principles}
        />
        <AboutFoundation about={about} />
        <section className="about-fields reveal-section page-container" aria-labelledby="about-fields-title">
          <div className="about-fields-heading">
            <div>
              <p className="text-eyebrow mb-4 text-brand">{about.fieldsEyebrow}</p>
              <h2 id="about-fields-title" className="about-section-title">
                {about.fieldsTitle}
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-slate">{about.fieldsDescription}</p>
          </div>
          <BusinessFieldsCarousel
            fields={about.fields}
            codeLabel={about.fieldCodeLabel}
            labels={about.fieldsCarousel}
          />
        </section>
      </div>
    </SiteShell>
  );
}
