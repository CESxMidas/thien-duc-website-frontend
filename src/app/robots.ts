import type { MetadataRoute } from "next";
import { absoluteUrl, placeholderPaths } from "@/lib/seo";
import { defaultLocale, locales, localizePath } from "@/lib/i18n/config";

const ADMIN_PATH = "/admin";

export default function robots(): MetadataRoute.Robots {

  const disallow = [
    ...placeholderPaths.flatMap((path) =>
      locales.map((locale) => localizePath(path, locale)),
    ),
    ADMIN_PATH,
  ];

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
