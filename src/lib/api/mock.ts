import { homeBanners } from "@/data/banners";
import { newsPosts } from "@/data/news";
import { projects } from "@/data/projects";
import type { ProjectStatus } from "@/types/content";
import type {
  BannerDto,
  NewsPostDto,
  ProjectDto,
  ProjectStatusDto,
} from "@/lib/api/types";

/**
 * Dữ liệu mock ở đúng dạng DTO backend sẽ trả về, sinh từ `src/data/*`
 * hiện có — một nguồn nội dung duy nhất cho tới khi nối API thật.
 */

const statusToDto: Record<ProjectStatus, ProjectStatusDto> = {
  "da-ban-giao": "DA_BAN_GIAO",
  "dang-thi-cong": "DANG_THI_CONG",
  "chuan-bi-khoi-cong": "CHUAN_BI_KHOI_CONG",
};

export const mockProjects: ProjectDto[] = projects.map((project, index) => ({
  id: `mock-project-${index + 1}`,
  slug: project.slug,
  title: { vi: project.title },
  summary: { vi: project.summary },
  description: project.description ? { vi: project.description } : null,
  status: statusToDto[project.status],
  location: project.location ?? null,
  image: project.image ?? null,
  gallery: project.gallery ?? [],
  category: project.category ?? null,
  highlights: project.highlights?.map((vi) => ({ vi })) ?? null,
  quickFacts: project.quickFacts ?? null,
  gallerySections: project.gallerySections ?? null,
  mapLocation: project.mapLocation ?? null,
  order: index,
}));

export const mockNewsPosts: NewsPostDto[] = newsPosts.map((post, index) => ({
  id: `mock-news-${index + 1}`,
  slug: post.slug,
  title: { vi: post.title },
  summary: { vi: post.summary },
  content: post.content?.map((vi) => ({ vi })) ?? null,
  author: post.author ?? null,
  image: post.image ?? null,
  eventDate: post.eventDate ?? null,
  publishedAt: post.publishedAt,
  category: post.category
    ? { slug: "tin-du-an", name: { vi: post.category } }
    : null,
}));

export const mockBanners: BannerDto[] = homeBanners.map((banner, index) => ({
  id: `mock-banner-${index + 1}`,
  image: banner.image,
  eyebrow: { vi: banner.eyebrow },
  title: { vi: banner.title },
  subtitle: { vi: banner.subtitle },
  href: banner.href,
  ctaLabel: { vi: banner.ctaLabel },
  objectPosition: banner.objectPosition ?? null,
  order: index,
}));
