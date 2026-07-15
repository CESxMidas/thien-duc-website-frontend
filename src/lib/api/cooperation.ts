import type { CooperationProject } from "@/data/home";
import { apiFetch } from "@/lib/api/client";
import { mapCooperationProject } from "@/lib/api/mappers";
import type { CooperationProjectDto } from "@/lib/api/types";
import type { Locale } from "@/lib/i18n/config";

/** Dự án hợp tác cho section trang chủ (`GET /cooperation`). */
export async function getCooperationProjects(
  locale: Locale,
): Promise<CooperationProject[]> {
  const data = await apiFetch<CooperationProjectDto[]>("/cooperation");
  return data.map((dto) => mapCooperationProject(dto, locale));
}
