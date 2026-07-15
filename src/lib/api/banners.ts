import type { HomeBanner } from "@/data/banners";
import { apiFetch } from "@/lib/api/client";
import { mapBanner } from "@/lib/api/mappers";
import type { BannerDto } from "@/lib/api/types";
import type { Locale } from "@/lib/i18n/config";

export async function getBanners(locale: Locale): Promise<HomeBanner[]> {
  const data = await apiFetch<BannerDto[]>("/banners");
  return data.map((dto) => mapBanner(dto, locale));
}
