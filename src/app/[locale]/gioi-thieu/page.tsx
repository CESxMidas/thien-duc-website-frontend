import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { AboutJourney } from "@/components/sections/about-journey";
import { AboutFoundation } from "@/components/sections/about-foundation";
import { AboutCareersTeaser } from "@/components/sections/about-careers-teaser";
import { AboutConnect } from "@/components/sections/about-connect";
import { AboutValuesShowcase } from "@/components/sections/about-values-showcase";
import { PageHeading } from "@/components/ui/page-heading";
import { getPageBySlug } from "@/lib/api/pages";
import { isLocale, type Locale } from "@/lib/i18n/config";
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

  const [page, dictionary] = await Promise.all([
    getPageBySlug(PAGE_SLUG, locale),
    getDictionary(locale),
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
      <div className="about-page">
        <section className="about-intro page-container py-10 sm:py-16">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div>
              <PageHeading
                bare
                tone="default"
                eyebrow={about.eyebrow}
                title={heading.title}
                description={heading.description}
                titleClassName="font-display text-[clamp(2.75rem,4.5vw,5.5rem)] font-medium leading-[1.05] text-espresso"
              />
              <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-gold/40 pt-5">
                <div>
                  <dt className="text-sm text-slate">{about.foundedLabel}</dt>
                  <dd className="mt-1 font-semibold text-earth">{about.foundedValue}</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate">{about.areaLabel}</dt>
                  <dd className="mt-1 font-semibold text-earth">{about.areaValue}</dd>
                </div>
              </dl>
            </div>
            <div className="about-editorial-image relative order-first aspect-[5/4] lg:order-none lg:aspect-[4/5]">
              <Image
                src="/images/projects/hung-phu/fancy-tower/fancy-tower-exterior-day-01.jpg"
                alt={about.imageAlt}
                fill
                preload
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="reveal-section grid gap-8 border-b border-gold/30 pb-12 pt-14 sm:pt-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <div>
              <p className="text-eyebrow text-earth">{about.overviewEyebrow}</p>
              <h2 className="about-section-title mt-4">{about.overviewTitle}</h2>
              <figure className="mt-8 border-l border-gold pl-5">
                <figcaption className="text-sm text-earth">{about.mottoLabel}</figcaption>
                <blockquote className="mt-2 max-w-sm font-display text-2xl font-medium leading-snug text-olive">{about.motto}</blockquote>
              </figure>
            </div>
            <div className="prose-content grid content-start gap-5 text-base leading-8 text-slate">
              {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
        </section>
        <AboutJourney about={about} />
        <AboutValuesShowcase
          eyebrow={about.principlesEyebrow}
          title={about.principlesShowcaseTitle}
          imageAlt={about.imageAlt}
          values={about.principles}
        />
        <AboutFoundation about={about} />
        <AboutCareersTeaser careers={careers} locale={locale} />
        <AboutConnect about={about} locale={locale} />
      </div>
    </SiteShell>
  );
}
