import type { NewsPost } from "@/types/content";
import { apiFetch, isApiEnabled } from "@/lib/api/client";
import { mapNewsPost } from "@/lib/api/mappers";
import { mockNewsPosts } from "@/lib/api/mock";
import type { NewsPostDto } from "@/lib/api/types";

export async function getNewsPosts(): Promise<NewsPost[]> {
  if (!isApiEnabled) {
    return mockNewsPosts.map(mapNewsPost);
  }
  const data = await apiFetch<NewsPostDto[]>("/news");
  return data.map(mapNewsPost);
}

export async function getNewsPostBySlug(
  slug: string,
): Promise<NewsPost | undefined> {
  if (!isApiEnabled) {
    const dto = mockNewsPosts.find((post) => post.slug === slug);
    return dto ? mapNewsPost(dto) : undefined;
  }
  const data = await apiFetch<NewsPostDto>(`/news/${encodeURIComponent(slug)}`);
  return mapNewsPost(data);
}
