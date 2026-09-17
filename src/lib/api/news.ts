import type { NewsCategory, NewsPost } from "@/types/content";
import { apiFetch, apiFetchOptional } from "@/lib/api/client";
import { localized, mapNewsPost } from "@/lib/api/mappers";
import type { LocalizedText, NewsPostDto, PaginatedDto } from "@/lib/api/types";
import type { Locale } from "@/lib/i18n/config";

type NewsCategoryDto = {
  slug: string;
  name: LocalizedText;
  order: number;
  publishedCount: number;
};

export async function getNewsCategories(
  locale: Locale,
): Promise<NewsCategory[]> {
  const data = await apiFetch<NewsCategoryDto[]>("/news/categories");
  return data.map((dto) => ({
    slug: dto.slug,
    name: localized(dto.name, locale),

    publishedCount: dto.publishedCount ?? 0,
  }));
}

export const NEWS_PAGE_SIZE = 9;

export type NewsPage = {
  items: NewsPost[];
  page: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export async function getNewsPosts(locale: Locale): Promise<NewsPost[]> {
  const data = await apiFetch<NewsPostDto[]>("/news");
  return data.map((dto) => mapNewsPost(dto, locale));
}


export async function getNewsPage(
  locale: Locale,
  {
    page = 1,
    limit = NEWS_PAGE_SIZE,
    categorySlug,
  }: { page?: number; limit?: number; categorySlug?: string } = {},
): Promise<NewsPage> {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  // Chỉ gắn khi có giá trị: backend bật `forbidNonWhitelisted` và từ chối
  // `?categorySlug=` rỗng bằng 400 — gửi tham số rỗng là làm hỏng trang.
  if (categorySlug) query.set("categorySlug", categorySlug);
  const data = await apiFetch<PaginatedDto<NewsPostDto>>(`/news?${query}`);

  return {
    items: data.items.map((dto) => mapNewsPost(dto, locale)),
    page: data.page,
    totalItems: data.totalItems,
    totalPages: data.totalPages,
    hasNextPage: data.hasNextPage,
    hasPreviousPage: data.hasPreviousPage,
  };
}

export async function getNewsPostBySlug(
  slug: string,
  locale: Locale,
): Promise<NewsPost | undefined> {
  // `apiFetchOptional` để 404 trả `undefined` cho `notFound()`, còn lỗi mạng/5xx
  // vẫn ném ra — nếu dùng `apiFetch` thì bài không tồn tại sẽ thành lỗi 500.
  const data = await apiFetchOptional<NewsPostDto>(
    `/news/${encodeURIComponent(slug)}`,
  );
  return data ? mapNewsPost(data, locale) : undefined;
}
