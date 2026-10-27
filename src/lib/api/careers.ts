import type { OpenPosition } from "@/types/content";
import { apiFetch } from "@/lib/api/client";
import { mapRecruitmentPosition } from "@/lib/api/mappers";
import type { RecruitmentPositionDto } from "@/lib/api/types";
import type { Locale } from "@/lib/i18n/config";

export async function getOpenPositions(
  locale: Locale,
): Promise<OpenPosition[]> {
  const positions = await apiFetch<RecruitmentPositionDto[]>(
    "/recruitment-positions",
  );
  return positions.map((position) => mapRecruitmentPosition(position, locale));
}

export async function submitJobApplication(positionId: string, data: FormData) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);
  try {
    return await apiFetch<{ id?: string; received: boolean }>(
      `/recruitment-positions/${encodeURIComponent(positionId)}/applications`,
      { method: "POST", body: data, signal: controller.signal },
    );
  } finally {
    clearTimeout(timeout);
  }
}
