import { apiFetchOptional } from "@/lib/api/client";
import { localized } from "@/lib/api/mappers";
import type { PageDto } from "@/lib/api/types";
import type { Locale } from "@/lib/i18n/config";

export type StaticPageContent = {
  title: string;
  paragraphs: string[];
};

export async function getPageBySlug(
  slug: string,
  locale: Locale,
): Promise<StaticPageContent | undefined> {
  const dto = await apiFetchOptional<PageDto>(
    `/pages/${encodeURIComponent(slug)}`,
  );

  if (!dto) return undefined;

  return {
    title: localized(dto.title, locale),
    paragraphs: (dto.content ?? []).map((item) => localized(item, locale)),
  };
}
