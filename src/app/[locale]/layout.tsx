import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import { brandName, brandShortName, siteConfig } from "@/config/site";
import { JsonLd } from "@/components/ui/json-ld";
import { isApiReachableAtBuild } from "@/lib/api/client";
import { getBrandingSettings } from "@/lib/api/settings";
import { isLocale, localeHtmlLang, locales, type Locale } from "@/lib/i18n/config";
import {
  absoluteUrl,
  buildAlternates,
  buildOrganizationJsonLd,
  defaultOgImage,
} from "@/lib/seo";
import "../globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const rootCopy: Record<Locale, { title: string; description: string }> = {
  vi: {
    title: "Công ty Thiên Đức",
    description:
      "Website giới thiệu công ty, dự án và tin tức của Công ty TNHH Đầu tư - Xây dựng - Thương mại Thiên Đức.",
  },
  en: {
    title: "Thien Duc Company",
    description:
      "Company profile, projects and news from Thien Duc Investment - Construction - Trading Co., Ltd.",
  },
};

export async function generateStaticParams() {

  if (!(await isApiReachableAtBuild("[locale]/layout"))) return [];
  return locales.map((locale) => ({ locale }));
}

export const revalidate = 60;

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = rootCopy[locale];
  const branding = await getBrandingSettings().catch(() => null);

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: copy.title,
      template: `%s | ${brandShortName[locale]}`,
    },
    description: copy.description,
    alternates: buildAlternates("/", locale),
    icons: {
      icon: branding?.faviconUrl || "/images/brand/favicon-thien-duc.png",
    },
    openGraph: {
      type: "website",
      siteName: brandName[locale],
      locale: localeHtmlLang[locale],
      title: copy.title,
      description: copy.description,
      images: [{ url: absoluteUrl(defaultOgImage), width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
      images: [absoluteUrl(defaultOgImage)],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  return (
    <html
      lang={localeHtmlLang[locale]}
      className={`${manrope.variable} ${cormorantGaramond.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        {/* Organization JSON-LD toàn site (task →7) — NewsArticle tham chiếu qua @id. */}
        <JsonLd data={buildOrganizationJsonLd(locale)} />
        {children}
      </body>
    </html>
  );
}
