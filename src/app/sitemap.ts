import type { MetadataRoute } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { ApiError, isApiConfigured } from "@/lib/api/client";
import { getNewsPosts } from "@/lib/api/news";
import { getProjects } from "@/lib/api/projects";
import type { NewsPost, Project } from "@/types/content";
import { defaultLocale } from "@/lib/i18n/config";
import { routes } from "@/lib/routes";
import { absoluteUrl, buildAlternates } from "@/lib/seo";

type SitemapEntry = MetadataRoute.Sitemap[number];

function isProductionBuild(): boolean {
  return process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD;
}

function isBackendUnavailable(error: unknown): boolean {
  if (error instanceof ApiError) return true;
  return error instanceof TypeError && error.message === "fetch failed";
}

export const revalidate = 3600;

function entry(
  path: string,
  changeFrequency: SitemapEntry["changeFrequency"],
  priority: number,
  lastModified?: string | Date,
): SitemapEntry {
  const alternates = buildAlternates(path, defaultLocale);

  return {
    url: absoluteUrl(path),
    lastModified: lastModified ?? new Date(),
    changeFrequency,
    priority,
    alternates: { languages: alternates?.languages as Record<string, string> },
  };
}


async function loadOrDegrade<T>(
  label: string,
  load: () => Promise<T[]>,
): Promise<T[]> {
  try {
    return await load();
  } catch (error) {
    if (!isBackendUnavailable(error)) throw error;

    if (!isProductionBuild()) throw error;
    const reason = error instanceof Error ? error.message : String(error);
    console.warn(
      `[sitemap] ${label}: không lấy được dữ liệu công khai (${reason}). ` +
        `Bỏ qua nhóm URL này trong sitemap của bản build.`,
    );
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  const [projects, newsPosts]: [Project[], NewsPost[]] = isApiConfigured
    ? await Promise.all([
        loadOrDegrade("dự án", () => getProjects(defaultLocale)),
        loadOrDegrade("tin tức", () => getNewsPosts(defaultLocale)),
      ])
    : [[], []];

  const staticEntries = [
    entry(routes.home, "weekly", 1),
    entry(routes.about, "monthly", 0.8),
    entry(routes.projects, "weekly", 0.9),
    entry(routes.news, "daily", 0.8),
    entry(routes.members, "yearly", 0.6),
    entry(routes.contact, "yearly", 0.6),
  ];

  const projectEntries = projects.flatMap((project) => [
    entry(`${routes.projects}/${project.slug}`, "monthly", 0.8),
    ...(project.items ?? []).map((item) =>
      entry(`${routes.projects}/${project.slug}/${item.slug}`, "monthly", 0.6),
    ),
  ]);

  const newsEntries = newsPosts.map((post) =>
    entry(
      `${routes.news}/${post.slug}`,
      "monthly",
      0.6,
      post.publishedAt || undefined,
    ),
  );

  const categorySlugs = [
    ...new Set(
      newsPosts
        .map((post) => post.category?.slug)
        .filter((slug): slug is string => Boolean(slug)),
    ),
  ];
  const categoryEntries = categorySlugs.map((slug) =>
    entry(`${routes.newsCategory}/${slug}`, "weekly", 0.6),
  );

  return [
    ...staticEntries,
    ...projectEntries,
    ...categoryEntries,
    ...newsEntries,
  ];
}
