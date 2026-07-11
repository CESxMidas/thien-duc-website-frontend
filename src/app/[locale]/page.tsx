import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { HomeBannerSection } from "@/components/sections/home-banner-section";
import { HomeContactCta } from "@/components/sections/home-contact-cta";
import { HomeCooperation } from "@/components/sections/home-cooperation";
import { HomeFeaturedProjects } from "@/components/sections/home-featured-projects";
import { HomeIntroStrip } from "@/components/sections/home-intro-strip";
import { HomeLatestNews } from "@/components/sections/home-latest-news";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo";

const homeCopy: Record<Locale, { title: string; description: string }> = {
  vi: {
    title: "Công ty Thiên Đức | Đầu tư & phát triển bất động sản TP.HCM",
    description:
      "Công ty TNHH Đầu tư – Xây dựng – Thương mại Thiên Đức hoạt động trong lĩnh vực bất động sản, đầu tư xây dựng và phát triển đô thị.",
  },
  en: {
    title: "Thien Duc Company | Real estate investment & development in HCMC",
    description:
      "Thien Duc Investment - Construction - Trading Co., Ltd works in real estate, construction investment, and urban development.",
  },
};

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return buildPageMetadata({
    ...homeCopy[locale],
    path: routes.home,
    locale,
  });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <SiteShell locale={locale}>
      <HomeBannerSection locale={locale} />
      <HomeFeaturedProjects locale={locale} />
      <HomeIntroStrip />
      <HomeCooperation locale={locale} />
      <HomeLatestNews locale={locale} />
      <HomeContactCta locale={locale} />
    </SiteShell>
  );
}
