import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { isLocale, localeHtmlLang, locales, type Locale } from "@/lib/i18n/config";
import { absoluteUrl, buildAlternates, defaultOgImage } from "@/lib/seo";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// ISR cho toàn bộ trang dưới [locale]: trang tĩnh được dựng lại tối đa mỗi 60s
// khi có lượt truy cập. Thiếu dòng này, HTML prerender lúc `next build` bị cache
// vô thời hạn — nội dung sửa trong Admin (dự án hợp tác, tin tức, banner…) chỉ
// hiện sau lần deploy kế tiếp, gây "cập nhật chậm". Giá trị phải là literal
// (Next yêu cầu phân tích tĩnh), không viết `60 * 1`.
export const revalidate = 60;

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = rootCopy[locale];

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: copy.title,
      template: `%s | ${siteConfig.shortName}`,
    },
    description: copy.description,
    alternates: buildAlternates("/", locale),
    icons: {
      icon: "/images/brand/favicon-thien-duc.png",
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
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
  // `proxy.ts` chỉ để lọt `vi`/`en`, nhưng route vẫn có thể bị gọi trực tiếp lúc
  // build hoặc từ một liên kết hỏng — không chặn ở đây thì `localeHtmlLang[...]`
  // trả undefined và trang render với `lang` rỗng.
  if (!isLocale(locale)) notFound();

  return (
    <html
      lang={localeHtmlLang[locale]}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
