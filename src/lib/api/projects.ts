import type { Project } from "@/types/content";
import { apiFetch, isApiEnabled } from "@/lib/api/client";
import { mapProject } from "@/lib/api/mappers";
import { mockProjects } from "@/lib/api/mock";
import type { ProjectDto } from "@/lib/api/types";

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
  const data = await apiFetch<ProjectDto>(
    `/projects/${encodeURIComponent(slug)}`,
  );
  return mapProject(data);
}
