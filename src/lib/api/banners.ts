import type { HomeBanner } from "@/data/banners";
import { apiFetch, isApiEnabled } from "@/lib/api/client";
import { mapBanner } from "@/lib/api/mappers";
import { mockBanners } from "@/lib/api/mock";
import type { BannerDto } from "@/lib/api/types";

export async function getBanners(): Promise<HomeBanner[]> {
  if (!isApiEnabled) {
    return mockBanners.map(mapBanner);
  }
  const data = await apiFetch<BannerDto[]>("/banners");
  return data.map(mapBanner);
}
