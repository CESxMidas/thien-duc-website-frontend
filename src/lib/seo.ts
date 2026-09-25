import type { Metadata } from "next";
import {
  addressParts,
  brandName,
  legalInfo,
  legalDisplayName,
  siteConfig,
} from "@/config/site";
import {
  defaultLocale,
  localeHtmlLang,
  locales,
  localizePath,
  type Locale,
} from "@/lib/i18n/config";
import type { NewsPost } from "@/types/content";

export const defaultOgImage = "/images/banners/home/home-banner-hung-phu-aerial-01.jpg";

export function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).toString();
}

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

export const placeholderPaths: readonly string[] = [
  // `/cong-ty-thanh-vien` đã có nội dung thật (câu 6) → đã gỡ khỏi danh sách này.
  "/tuyen-dung",
  "/so-do-to-chuc-cong-ty",
  "/dao-tao",
  "/chinh-sach-nhan-su",
];

export const organizationId = () => absoluteUrl("/#organization");


export function buildOrganizationJsonLd(locale: Locale): Record<string, unknown> {
  // legalInfo.operatingSince dạng dd/mm/yyyy → ISO 8601 cho schema.org.
  const foundingDate = legalInfo.operatingSince.split("/").reverse().join("-");

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId(),
    
    name: brandName[locale],
    legalName: legalDisplayName[locale],
    url: siteConfig.url,
    logo: absoluteUrl("/images/brand/logo-thien-duc.png"),
    email: siteConfig.email,
    telephone: siteConfig.phone,
    taxID: legalInfo.taxCode,
    foundingDate,
    address: {
      "@type": "PostalAddress",
      streetAddress: addressParts[locale].street,
      addressLocality: addressParts[locale].locality,
      addressCountry: "VN",
    },
  };
}

export function buildNewsArticleJsonLd(
  post: NewsPost,
  locale: Locale,
): Record<string, unknown> {
  const url = absoluteUrl(localizePath(`/tin-tuc/${post.slug}`, locale));
  const images = post.gallery?.length
    ? post.gallery
    : post.image
      ? [post.image]
      : [];

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.summary,
    ...(images.length > 0 ? { image: images.map(absoluteUrl) } : {}),
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
  path: string;
  locale: Locale;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  noIndex?: boolean;
};
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
      siteName: brandName[locale],
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
