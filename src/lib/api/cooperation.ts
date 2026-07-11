import { homeCooperation, type CooperationProject } from "@/data/home";
import { apiFetch, isApiEnabled } from "@/lib/api/client";
import { mapCooperationProject } from "@/lib/api/mappers";
import type { CooperationProjectDto } from "@/lib/api/types";
import type { Locale } from "@/lib/i18n/config";

/**
 * Dự án hợp tác cho section trang chủ. Khi chưa bật API (`NEXT_PUBLIC_API_URL`
 * trống) dùng danh sách tĩnh trong `data/home.ts` làm fallback — đúng pattern
 * mock của các service khác.
 */
export async function getCooperationProjects(
  locale: Locale,
): Promise<CooperationProject[]> {
  if (!isApiEnabled) {
    return homeCooperation;
  }
  const data = await apiFetch<CooperationProjectDto[]>("/cooperation");
  return data.map((dto) => mapCooperationProject(dto, locale));
}
