import type { NewsPost } from "@/types/content";
import { apiFetch, apiFetchOptional, isApiEnabled } from "@/lib/api/client";
import { mapNewsPost } from "@/lib/api/mappers";
import { mockNewsPosts } from "@/lib/api/mock";
import type { NewsPostDto } from "@/lib/api/types";
import type { Locale } from "@/lib/i18n/config";

export async function getNewsPosts(locale: Locale): Promise<NewsPost[]> {
  if (!isApiEnabled) {
    return mockNewsPosts.map((dto) => mapNewsPost(dto, locale));
  }
  const data = await apiFetch<NewsPostDto[]>("/news");
  return data.map((dto) => mapNewsPost(dto, locale));
}

export async function getNewsPostBySlug(
  slug: string,
  locale: Locale,
): Promise<NewsPost | undefined> {
  if (!isApiEnabled) {
    const dto = mockNewsPosts.find((post) => post.slug === slug);
    return dto ? mapNewsPost(dto, locale) : undefined;
  }
  // `apiFetchOptional` để 404 trả `undefined` cho `notFound()`, còn lỗi mạng/5xx
  // vẫn ném ra — nếu dùng `apiFetch` thì bài không tồn tại sẽ thành lỗi 500.
  const data = await apiFetchOptional<NewsPostDto>(
    `/news/${encodeURIComponent(slug)}`,
  );
  return data ? mapNewsPost(data, locale) : undefined;
}
