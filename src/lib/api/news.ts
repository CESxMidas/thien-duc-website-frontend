import type { NewsPost } from "@/types/content";
import { apiFetch, apiFetchOptional } from "@/lib/api/client";
import { mapNewsPost } from "@/lib/api/mappers";
import type { NewsPostDto, PaginatedDto } from "@/lib/api/types";
import type { Locale } from "@/lib/i18n/config";

/** Số bài mỗi trang ở `/tin-tuc` — khớp lưới 3 cột × 3 hàng trên desktop. */
export const NEWS_PAGE_SIZE = 9;

/** Số bài nạp cho slider trang chủ. Trang chủ không kéo cả kho tin về. */
export const HOME_NEWS_LIMIT = 8;

export type NewsPage = {
  items: NewsPost[];
  page: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

/**
 * Danh sách phẳng, không phân trang — giữ nguyên cho những chỗ cần **toàn bộ**
 * bài đã đăng (sitemap, `generateStaticParams`).
 */
export async function getNewsPosts(locale: Locale): Promise<NewsPost[]> {
  const data = await apiFetch<NewsPostDto[]>("/news");
  return data.map((dto) => mapNewsPost(dto, locale));
}

/**
 * Một trang bài đã đăng. Thứ tự và việc lọc trạng thái do **backend** quyết
 * định (chỉ PUBLISHED, `publishedAt desc` + `id desc`) — cố ý không sắp lại ở
 * đây: sắp lại phía client chỉ đúng trong phạm vi một trang và sẽ phá vỡ thứ tự
 * giữa các trang.
 */
export async function getNewsPage(
  locale: Locale,
  { page = 1, limit = NEWS_PAGE_SIZE }: { page?: number; limit?: number } = {},
): Promise<NewsPage> {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
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
