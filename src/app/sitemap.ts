import type { MetadataRoute } from "next";
import { isApiConfigured } from "@/lib/api/client";
import { getNewsPosts } from "@/lib/api/news";
import { getProjects } from "@/lib/api/projects";
import { defaultLocale } from "@/lib/i18n/config";
import { routes } from "@/lib/routes";
import { absoluteUrl, buildAlternates } from "@/lib/seo";

type SitemapEntry = MetadataRoute.Sitemap[number];

/**
 * Mỗi URL khai báo một lần theo bản tiếng Việt (canonical) kèm `alternates` trỏ
 * sang bản tiếng Anh — Google gom hai bản thành một trang có hai ngôn ngữ, thay
 * vì hai trang trùng nội dung.
 */
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Slug không phụ thuộc ngôn ngữ — lấy một lần theo locale mặc định.
  // Build không có API (vd. CI) → sitemap chỉ gồm route tĩnh; production
  // (env đã đặt) vẫn đủ dự án + tin tức như cũ.
  const [projects, newsPosts] = isApiConfigured
    ? await Promise.all([getProjects(defaultLocale), getNewsPosts(defaultLocale)])
    : [[], []];

  // Cố ý bỏ các route trong `placeholderPaths` (tuyển dụng, đào tạo…): chúng
  // đang `noindex` vì chưa có nội dung thật, đưa vào sitemap là tín hiệu mâu thuẫn.
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

  return [...staticEntries, ...projectEntries, ...newsEntries];
}
