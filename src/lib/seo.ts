import type { Metadata } from "next";
import { legalInfo, siteConfig } from "@/config/site";
import {
  defaultLocale,
  localeHtmlLang,
  locales,
  localizePath,
  type Locale,
} from "@/lib/i18n/config";
import type { NewsPost } from "@/types/content";

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

/**
 * `@id` cố định của Organization — NewsArticle (và schema sau này) tham chiếu
 * qua id thay vì lặp lại cả khối. Organization được nhúng ở `[locale]/layout.tsx`
 * nên id này luôn resolve được trên cùng trang.
 */
export const organizationId = () => absoluteUrl("/#organization");

/**
 * JSON-LD `Organization` toàn site (task →7). Mọi field lấy từ `config/site.ts`
 * (thông tin pháp lý thật) — KHÔNG bịa. Cố ý dùng `Organization` thay vì
 * `LocalBusiness`: repo không có `openingHours`/`geo`, và `sameAs` bỏ qua vì
 * chưa có URL mạng xã hội chính thức nào trong repo (bổ sung khi công ty cung cấp).
 */
export function buildOrganizationJsonLd(): Record<string, unknown> {
  // legalInfo.operatingSince dạng dd/mm/yyyy → ISO 8601 cho schema.org.
  const foundingDate = legalInfo.operatingSince.split("/").reverse().join("-");

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId(),
    name: siteConfig.name,
    legalName: legalInfo.legalName,
    url: siteConfig.url,
    logo: absoluteUrl("/images/brand/logo-thien-duc.png"),
    email: siteConfig.email,
    telephone: siteConfig.phone,
    taxID: legalInfo.taxCode,
    foundingDate,
    // Tách từ chuỗi địa chỉ trong siteConfig.address — cùng một dữ liệu gốc.
    address: {
      "@type": "PostalAddress",
      streetAddress: "1D Trần Não, Phường Bình Trưng, Thành Phố Thủ Đức",
      addressLocality: "Thành phố Hồ Chí Minh",
      addressCountry: "VN",
    },
  };
}

/**
 * JSON-LD `NewsArticle` cho trang chi tiết tin (task →7). Chỉ dùng field API
 * trả thật; bài không ghi tác giả thì author là Organization (qua `@id`).
 * `dateModified` cố ý bỏ — API public chưa trả `updatedAt`.
 */
export function buildNewsArticleJsonLd(
  post: NewsPost,
  locale: Locale,
): Record<string, unknown> {
  const url = absoluteUrl(localizePath(`/tin-tuc/${post.slug}`, locale));

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.summary,
    ...(post.image ? { image: [absoluteUrl(post.image)] } : {}),
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    inLanguage: localeHtmlLang[locale],
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: post.author
      ? { "@type": "Person", name: post.author }
      : { "@id": organizationId() },
    publisher: { "@id": organizationId() },
  };
}

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
