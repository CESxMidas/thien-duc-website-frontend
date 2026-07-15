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

// Tên thương hiệu hiển thị trên tab trình duyệt — đồng bộ với Admin
// ("Quản trị Công ty Thiên Đức") và site name mặc định ở `[locale]/layout.tsx`.
const homeBrandTitle: Record<Locale, string> = {
  vi: "Công ty Thiên Đức",
  en: "Thien Duc Company",
};

// `title` dài giàu từ khóa dưới đây chỉ dùng cho Open Graph / Twitter (thẻ chia
// sẻ mạng xã hội); riêng thẻ <title> tab được ép về `homeBrandTitle` bên dưới.
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

  return {
    ...buildPageMetadata({
      ...homeCopy[locale],
      path: routes.home,
      locale,
    }),
    // `absolute` để bỏ qua template "%s | Thiên Đức" của layout cha — tab chỉ
    // hiển thị đúng "Công ty Thiên Đức", đồng bộ với Admin.
    title: { absolute: homeBrandTitle[locale] },
  };
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
