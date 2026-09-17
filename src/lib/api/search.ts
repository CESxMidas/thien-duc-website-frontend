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

export const MIN_SEARCH_LENGTH = 2;

export const MAX_SEARCH_LENGTH = 200;

export type SearchOutcome =
  | { status: "ok"; results: SearchResults }
  | { status: "invalid"; reason: "too-short" | "too-long" }
  | { status: "error" };

async function search(
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

export async function searchSafe(
  query: string,
  locale: Locale,
  scope: SearchScope = "all",
): Promise<SearchOutcome> {
  const trimmed = query.trim();
  if (trimmed.length < MIN_SEARCH_LENGTH) {
    return { status: "invalid", reason: "too-short" };
  }
  if (trimmed.length > MAX_SEARCH_LENGTH) {
    return { status: "invalid", reason: "too-long" };
  }

  try {
    return { status: "ok", results: await search(trimmed, locale, scope) };
  } catch {
    return { status: "error" };
  }
}
