import { ContentEmphasis } from "@/components/ui/content-emphasis";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { AboutJourney } from "@/components/sections/about-journey";
import { AboutFoundation } from "@/components/sections/about-foundation";
import { ContentSidebar } from "@/components/sections/content-sidebar";
import { BusinessFieldsCarousel } from "@/components/sections/business-fields-carousel";
import { BrandMotto } from "@/components/ui/brand-motto";
import { TouchFeedback } from "@/components/ui/touch-feedback";
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
    <SiteShell
      locale={locale}
      breadcrumbs={[
        { label: dictionary.breadcrumb.home, href: locale === "en" ? "/en" : "/" },
              { label: dictionary.navLabels["/gioi-thieu"] ?? "Giới thiệu" },
      ]}
    >
      <div className="about-page-shell page-container grid gap-6 py-4 sm:py-6 lg:grid-cols-[minmax(0,1fr)_19rem]">

        <div className="about-page-overview editorial-content">
          <div className="about-overview-layout">
            <div className="about-overview-content">
              <div className="about-overview-intro">
                <PageHeading
                  bare
                  eyebrow={about.eyebrow}
                  title={heading.title}
                  description={heading.description}
                  emphasizeDescription
                  titleClassName="about-overview-heading"
                />
              </div>
              <dl className="about-overview-facts">
                <div>
                  <dt>{about.foundedLabel}</dt>
                  <dd>{about.foundedValue}</dd>
                </div>
                <div>
                  <dt>{about.areaLabel}</dt>
                  <dd>{about.areaValue}</dd>
                </div>
              </dl>

              <section className="about-overview-copy reveal-section">
                <div className="about-overview-copy-main">
                  <p className="text-eyebrow mb-3 text-brand">
                    {about.overviewEyebrow}
                  </p>
                  <h2 className="max-w-3xl text-2xl font-semibold leading-tight md:text-3xl">
                    {about.overviewTitle}
                  </h2>
                  <div className="prose-content mt-4 grid gap-2 text-base leading-7 text-slate">
                    {paragraphs.map((paragraph) => (
                      <p className="content-paragraph" key={paragraph}><ContentEmphasis text={paragraph} names={["CapitaLand", "2010", "2014", "2018"]} /></p>
                    ))}
                  </div>
                  <TouchFeedback>
                    <BrandMotto
                      motto={dictionary.footerBrand.motto}
                      label={about.mottoLabel}
                      className="about-overview-motto mt-4"
                    />
                  </TouchFeedback>
                  <TouchFeedback>
                    <AboutJourney about={about} />
                  </TouchFeedback>
                </div>
              </section>
            </div>
          </div>
        </div>

        <ContentSidebar
          news={newsPage.items}
          projects={projects.slice(0, SIDEBAR_PROJECT_COUNT)}
          locale={locale}
          labels={dictionary.contentSidebar}
          common={dictionary.common}
          statusLabels={dictionary.projectStatus}
          tone="gold"
        />
      </div>

      <div className="about-page">
        <AboutValuesShowcase
          eyebrow={about.principlesEyebrow}
          title={about.principlesShowcaseTitle}
          description={about.principlesDescription}
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
            <p className="content-paragraph max-w-2xl text-base leading-7 text-slate">{about.fieldsDescription}</p>
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
