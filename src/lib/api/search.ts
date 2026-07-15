import type { NewsPost, Project } from "@/types/content";
import { apiFetch } from "@/lib/api/client";
import { mapNewsPost, mapProject } from "@/lib/api/mappers";
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

  const params = new URLSearchParams({ q: trimmed, type: scope });
  const data = await apiFetch<SearchResponseDto>(`/search?${params}`);

  return {
    projects: data.projects.map((dto) => mapProject(dto, locale)),
    news: data.news.map((dto) => mapNewsPost(dto, locale)),
  };
}
