import type { MetadataRoute } from "next";
import { absoluteUrl, placeholderPaths } from "@/lib/seo";
import { defaultLocale, locales, localizePath } from "@/lib/i18n/config";

export default function robots(): MetadataRoute.Robots {
  // Chặn ở cả hai locale: `/tuyen-dung` và `/en/tuyen-dung` là hai URL khác nhau.
  const disallow = placeholderPaths.flatMap((path) =>
    locales.map((locale) => localizePath(path, locale)),
  );

  return {
    rules: {
      userAgent: "*",
      allow: localizePath("/", defaultLocale),
      disallow,
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
