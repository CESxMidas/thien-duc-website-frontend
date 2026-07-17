import type { Metadata } from "next";
import { Be_Vietnam_Pro, Playfair_Display } from "next/font/google";
import { notFound } from "next/navigation";
import { brandName, brandShortName, siteConfig } from "@/config/site";
import { JsonLd } from "@/components/ui/json-ld";
import { isApiConfigured } from "@/lib/api/client";
import { isLocale, localeHtmlLang, locales, type Locale } from "@/lib/i18n/config";
import {
  absoluteUrl,
  buildAlternates,
  buildOrganizationJsonLd,
  defaultOgImage,
} from "@/lib/seo";
import "../globals.css";

// Body/UI: Be Vietnam Pro — font Việt bản địa, hiển thị dấu tiếng Việt hoàn hảo,
// đồng bộ với heading của Admin. Chỉ nạp các weight thực dùng (400 body, 500
// nav/button, 600–700 nhấn) — mục 9 UI-UX-HANDOFF: tiết kiệm băng thông.
const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Display/heading: Playfair Display serif — tạo chất "modern luxury real estate".
// Chỉ dùng cho tiêu đề lớn (H1/H2, hero), không dùng cho đoạn văn dài (mục 3).
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
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

export function generateStaticParams() {
  // Build không có API (vd. CI): trả rỗng → toàn bộ cây /[locale] bỏ prerender
  // lúc build, render on-demand khi chạy (ISR bên dưới). Prerender trang chủ/
  // gioi-thieu/lien-he đều cần fetch CMS — thiếu API là nổ `Failed to parse URL`.
  if (!isApiConfigured) return [];
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
      template: `%s | ${brandShortName[locale]}`,
    },
    description: copy.description,
    alternates: buildAlternates("/", locale),
    icons: {
      icon: "/images/brand/favicon-thien-duc.png",
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
  // `proxy.ts` chỉ để lọt `vi`/`en`, nhưng route vẫn có thể bị gọi trực tiếp lúc
  // build hoặc từ một liên kết hỏng — không chặn ở đây thì `localeHtmlLang[...]`
  // trả undefined và trang render với `lang` rỗng.
  if (!isLocale(locale)) notFound();

  return (
    <html
      lang={localeHtmlLang[locale]}
      className={`${beVietnamPro.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        {/* Organization JSON-LD toàn site (task →7) — NewsArticle tham chiếu qua @id. */}
        <JsonLd data={buildOrganizationJsonLd(locale)} />
        {children}
      </body>
    </html>
  );
}
