import type { Project, ProjectItem } from "@/types/content";
import { apiFetch, apiFetchOptional } from "@/lib/api/client";
import { mapProject, mapProjectItem } from "@/lib/api/mappers";
import type { ProjectDto, ProjectItemDto } from "@/lib/api/types";
import type { Locale } from "@/lib/i18n/config";

export async function getProjects(locale: Locale): Promise<Project[]> {
  const data = await apiFetch<ProjectDto[]>("/projects");
  return data.map((dto) => mapProject(dto, locale));
}

export async function getProjectBySlug(
  slug: string,
  locale: Locale,
): Promise<Project | undefined> {
  const data = await apiFetchOptional<ProjectDto>(
    `/projects/${encodeURIComponent(slug)}`,
  );
  return data ? mapProject(data, locale) : undefined;
}

/**
 * Một hạng mục con của dự án (ví dụ `du-an/khu-do-thi-hung-phu/fancy-tower`).
 * Backend trả kèm ảnh của riêng hạng mục qua `GET /projects/:slug/:itemSlug`.
 */
export async function getProjectItem(
  projectSlug: string,
  itemSlug: string,
  locale: Locale,
): Promise<ProjectItem | undefined> {
  const data = await apiFetchOptional<ProjectItemDto>(
    `/projects/${encodeURIComponent(projectSlug)}/${encodeURIComponent(itemSlug)}`,
  );
  return data ? mapProjectItem(data, locale) : undefined;
}
