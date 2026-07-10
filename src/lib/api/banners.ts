import type { HomeBanner } from "@/data/banners";
import { apiFetch, isApiEnabled } from "@/lib/api/client";
import { mapBanner } from "@/lib/api/mappers";
import { mockBanners } from "@/lib/api/mock";
import type { BannerDto } from "@/lib/api/types";
import type { Locale } from "@/lib/i18n/config";

export async function getBanners(locale: Locale): Promise<HomeBanner[]> {
  if (!isApiEnabled) {
    return mockBanners.map((dto) => mapBanner(dto, locale));
  }
  const data = await apiFetch<BannerDto[]>("/banners");
  return data.map((dto) => mapBanner(dto, locale));
}
