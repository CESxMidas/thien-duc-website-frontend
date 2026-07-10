import { apiFetchOptional, isApiEnabled } from "@/lib/api/client";
import { localized } from "@/lib/api/mappers";
import { mockPages } from "@/lib/api/mock";
import type { PageDto } from "@/lib/api/types";
import type { Locale } from "@/lib/i18n/config";

export type StaticPageContent = {
  title: string;
  paragraphs: string[];
};

/**
 * Nội dung trang tĩnh do CMS quản lý. Trả `undefined` khi backend chưa có bản
 * ghi (`404`) hoặc trang còn ở trạng thái nháp — trang gọi hàm này tự dùng nội
 * dung dự phòng trong `src/data/*` thay vì hiển thị trang trống.
 */
export async function getPageBySlug(
  slug: string,
  locale: Locale,
): Promise<StaticPageContent | undefined> {
  const dto = isApiEnabled
    ? await apiFetchOptional<PageDto>(`/pages/${encodeURIComponent(slug)}`)
    : mockPages.find((page) => page.slug === slug);

  if (!dto) return undefined;

  return {
    title: localized(dto.title, locale),
    paragraphs: (dto.content ?? []).map((item) => localized(item, locale)),
  };
}
