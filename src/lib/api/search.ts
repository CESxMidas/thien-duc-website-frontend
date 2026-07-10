import type { NewsPost, Project } from "@/types/content";
import { apiFetch, isApiEnabled } from "@/lib/api/client";
import { mapNewsPost, mapProject } from "@/lib/api/mappers";
import { mockNewsPosts, mockProjects } from "@/lib/api/mock";
import type { NewsPostDto, ProjectDto } from "@/lib/api/types";
import type { Locale } from "@/lib/i18n/config";

export type SearchScope = "all" | "projects" | "news";

export type SearchResults = {
  projects: Project[];
  news: NewsPost[];
};

type SearchResponseDto = {
  query: string;
  projects: ProjectDto[];
  news: NewsPostDto[];
};

/** Backend từ chối từ khóa dưới 2 ký tự (`SearchQueryDto`). */
export const MIN_SEARCH_LENGTH = 2;

/**
 * Tìm kiếm full-text phía server (`GET /search`, YC-10). Kết quả đã xếp theo
 * `ts_rank` — giữ nguyên thứ tự backend trả về, không sắp lại ở client.
 */
export async function search(
  query: string,
  locale: Locale,
  scope: SearchScope = "all",
): Promise<SearchResults> {
  const trimmed = query.trim();
  if (trimmed.length < MIN_SEARCH_LENGTH) {
    return { projects: [], news: [] };
  }

  if (!isApiEnabled) {
    return searchMock(trimmed, locale, scope);
  }

  const params = new URLSearchParams({ q: trimmed, type: scope });
  const data = await apiFetch<SearchResponseDto>(`/search?${params}`);

  return {
    projects: data.projects.map((dto) => mapProject(dto, locale)),
    news: data.news.map((dto) => mapNewsPost(dto, locale)),
  };
}

/**
 * Chế độ mock (chưa đặt `NEXT_PUBLIC_API_URL`): so khớp chuỗi con đơn giản trên
 * DTO. Chỉ để chạy giao diện khi không có backend — không phải full-text thật.
 */
function searchMock(
  query: string,
  locale: Locale,
  scope: SearchScope,
): SearchResults {
  const needle = query.toLowerCase();
  const hit = (...fields: Array<string | undefined>) =>
    fields.filter(Boolean).join(" ").toLowerCase().includes(needle);

  const projects =
    scope === "news"
      ? []
      : mockProjects
          .filter((dto) =>
            hit(
              dto.title.vi,
              dto.summary.vi,
              dto.description?.vi,
              dto.category ?? undefined,
              dto.location ?? undefined,
            ),
          )
          .map((dto) => mapProject(dto, locale));

  const news =
    scope === "projects"
      ? []
      : mockNewsPosts
          .filter((dto) =>
            hit(
              dto.title.vi,
              dto.summary.vi,
              dto.author ?? undefined,
              ...(dto.content?.map((item) => item.vi) ?? []),
            ),
          )
          .map((dto) => mapNewsPost(dto, locale));

  return { projects, news };
}
