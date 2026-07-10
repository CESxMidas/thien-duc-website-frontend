import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import {
  defaultLocale,
  localeHtmlLang,
  locales,
  localizePath,
  type Locale,
} from "@/lib/i18n/config";

/** Ảnh chia sẻ mạng xã hội mặc định (1200×630 theo khuyến nghị Open Graph). */
export const defaultOgImage = "/images/banners/home/home-banner-hung-phu-aerial-01.jpg";

export function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).toString();
}

/**
 * `canonical` trỏ về đúng URL của locale đang xem, `languages` khai báo hreflang
 * cho cả hai bản. `x-default` chỉ về bản tiếng Việt — đây là thị trường chính.
 */
export function buildAlternates(
  path: string,
  locale: Locale,
): Metadata["alternates"] {
  const languages = Object.fromEntries(
    locales.map((item) => [
      localeHtmlLang[item],
      absoluteUrl(localizePath(path, item)),
    ]),
  );

  return {
    canonical: absoluteUrl(localizePath(path, locale)),
    languages: {
      ...languages,
      "x-default": absoluteUrl(localizePath(path, defaultLocale)),
    },
  };
}

/**
 * Các route còn là khung chờ nội dung thật (câu 5 trong `CAU-HOI-CAN-XAC-NHAN.md`).
 * Chúng bị `noindex` và không xuất hiện trong `sitemap.xml`: trang mỏng bị đưa
 * vào chỉ mục sẽ kéo điểm SEO toàn site xuống. Gỡ slug khỏi đây khi có nội dung.
 */
export const placeholderPaths: readonly string[] = [
  // `/cong-ty-thanh-vien` đã có nội dung thật (câu 6) → đã gỡ khỏi danh sách này.
  "/tuyen-dung",
  "/so-do-to-chuc-cong-ty",
  "/dao-tao",
  "/chinh-sach-nhan-su",
];

type PageMetadataInput = {
  title: string;
  description: string;
  /** Đường dẫn **không** kèm tiền tố locale, ví dụ `/du-an`. */
  path: string;
  locale: Locale;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  /** Chặn công cụ tìm kiếm lập chỉ mục trang này. */
  noIndex?: boolean;
};

/**
 * Gom metadata của một trang: canonical + hreflang + Open Graph + Twitter Card.
 * Dùng cho mọi trang để thẻ chia sẻ không bị thiếu chỗ này chỗ kia.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  locale,
  image = defaultOgImage,
  type = "website",
  publishedTime,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(localizePath(path, locale));

  return {
    title,
    description,
    alternates: buildAlternates(path, locale),
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: siteConfig.name,
      locale: localeHtmlLang[locale],
      images: [{ url: absoluteUrl(image), width: 1200, height: 630, alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(image)],
    },
  };
}
