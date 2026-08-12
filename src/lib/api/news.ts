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

/**
 * Danh sách chuyên mục tin (`GET /news/categories`) — backend sắp theo `order`
 * rồi `slug`, giữ nguyên thứ tự đó: đây là thứ tự biên tập viên đặt trong Admin.
 *
 * Kèm `publishedCount` — số bài **đã đăng**. Route công khai cố ý không trả
 * tổng số bài (nó gộp cả bài nháp, là thông tin nội bộ).
 */
export async function getNewsCategories(
  locale: Locale,
): Promise<NewsCategory[]> {
  const data = await apiFetch<NewsCategoryDto[]>("/news/categories");
  return data.map((dto) => ({
    slug: dto.slug,
    name: localized(dto.name, locale),
    // Backend cũ chưa có field này → coi như 0, chuyên mục sẽ bị ẩn thay vì
    // dẫn người dùng vào một trang có thể rỗng.
    publishedCount: dto.publishedCount ?? 0,
  }));
}

/** Số bài mỗi trang ở `/tin-tuc` — khớp lưới 3 cột × 3 hàng trên desktop. */
export const NEWS_PAGE_SIZE = 9;

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
