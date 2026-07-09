import type { Project, ProjectItem } from "@/types/content";
import { apiFetch, apiFetchOptional, isApiEnabled } from "@/lib/api/client";
import { mapProject, mapProjectItem } from "@/lib/api/mappers";
import { mockProjects } from "@/lib/api/mock";
import type { ProjectDto, ProjectItemDto } from "@/lib/api/types";

export async function getProjects(): Promise<Project[]> {
  if (!isApiEnabled) {
    return mockProjects.map(mapProject);
  }
  const data = await apiFetch<ProjectDto[]>("/projects");
  return data.map(mapProject);
}

export async function getProjectBySlug(
  slug: string,
): Promise<Project | undefined> {
  if (!isApiEnabled) {
    const dto = mockProjects.find((project) => project.slug === slug);
    return dto ? mapProject(dto) : undefined;
  }
  const data = await apiFetchOptional<ProjectDto>(
    `/projects/${encodeURIComponent(slug)}`,
  );
  return data ? mapProject(data) : undefined;
}

/**
 * Một hạng mục con của dự án (ví dụ `du-an/khu-do-thi-hung-phu/fancy-tower`).
 * Backend trả kèm ảnh của riêng hạng mục qua `GET /projects/:slug/:itemSlug`.
 */
export async function getProjectItem(
  projectSlug: string,
  itemSlug: string,
): Promise<ProjectItem | undefined> {
  if (!isApiEnabled) {
    const dto = mockProjects
      .find((project) => project.slug === projectSlug)
      ?.items?.find((item) => item.slug === itemSlug);
    return dto ? mapProjectItem(dto) : undefined;
  }
  const data = await apiFetchOptional<ProjectItemDto>(
    `/projects/${encodeURIComponent(projectSlug)}/${encodeURIComponent(itemSlug)}`,
  );
  return data ? mapProjectItem(data) : undefined;
}
