import { getProjects } from "@/lib/api/projects";
import { defaultLocale, localizePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import { homeFeaturedProjectCopy } from "@/data/home";

import {
  HomeFeaturedProjectsShowcase,
  type FeaturedProjectShowcaseItem,
} from "./home-featured-projects-showcase";

import type { Project } from "@/types/content";

export function selectPrimaryFeaturedProject(
  projects: Project[],
): Project | undefined {
  return (
    projects.find((project) => project.status === "dang-thi-cong") ??
    projects[0]
  );
}

export async function HomeFeaturedProjects({ locale }: { locale: Locale }) {
  const [projects, dictionary] = await Promise.all([
    getProjects(locale),
    getDictionary(locale),
  ]);

  const primaryProject = selectPrimaryFeaturedProject(projects);

  if (!primaryProject) {
    return null;
  }

  const featuredProjects = [
    primaryProject,
    ...projects.filter((project) => project.slug !== primaryProject.slug),
  ].slice(0, 4);

  const displayFor = (project: Project) => {
    const apiCopy = {
      title: project.title,
      location: project.location,
      summary: project.summary,
    };

    return locale === defaultLocale
      ? (homeFeaturedProjectCopy[
          project.slug as keyof typeof homeFeaturedProjectCopy
        ] ?? apiCopy)
      : apiCopy;
  };

  const sectionTitle =
    locale === defaultLocale
      ? "Những không gian được kiến tạo"
      : "Spaces shaped for growth";

  const projectsForShowcase: FeaturedProjectShowcaseItem[] =
    featuredProjects.map((project, index) => {
      const display = displayFor(project);

      return {
        id: String(index + 1).padStart(2, "0"),
        slug: project.slug,
        title: display.title,
        location: display.location,
        statusLabel: dictionary.projectStatus[project.status],
        summary: display.summary,
        image: project.image,
        href: localizePath(`${routes.projects}/${project.slug}`, locale),
      };
    });

  return (
    <HomeFeaturedProjectsShowcase
      projects={projectsForShowcase}
      labels={{
        eyebrow: dictionary.home.featuredEyebrow,
        title: sectionTitle,
        explore:
          locale === defaultLocale
            ? "Khám phá dự án"
            : dictionary.common.viewDetail,
        viewAll: dictionary.common.viewAllProjects,
        viewAllHref: localizePath(routes.projects, locale),
        otherProjects:
          locale === defaultLocale ? "Chọn dự án" : "Select project",
        selectProject:
          locale === defaultLocale ? "Chọn dự án" : "Select project",
        previousProject:
          locale === defaultLocale ? "Dự án trước" : "Previous project",
        nextProject:
          locale === defaultLocale ? "Dự án tiếp theo" : "Next project",
      }}
    />
  );
}
