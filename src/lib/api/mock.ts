import { aboutHero, aboutOverview } from "@/data/about";
import { homeBanners } from "@/data/banners";
import { contactHero } from "@/data/contact";
import { newsPosts } from "@/data/news";
import { projects } from "@/data/projects";
import type { ProjectStatus } from "@/types/content";
import type {
  BannerDto,
  NewsPostDto,
  PageDto,
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
  items: (project.items ?? []).map((item, itemIndex) => ({
    id: `mock-project-${index + 1}-item-${itemIndex + 1}`,
    projectId: `mock-project-${index + 1}`,
    slug: item.slug,
    title: { vi: item.title },
    summary: item.summary ? { vi: item.summary } : null,
    description: item.description ? { vi: item.description } : null,
    status: item.status ? statusToDto[item.status] : null,
    image: item.image ?? null,
    highlights: item.highlights?.map((vi) => ({ vi })) ?? null,
    quickFacts: item.quickFacts ?? null,
    gallerySections: item.gallerySections ?? null,
    order: itemIndex,
    galleryImages: (item.gallery ?? []).map((url, imageIndex) => ({
      id: `mock-project-${index + 1}-item-${itemIndex + 1}-image-${imageIndex + 1}`,
      url,
      order: imageIndex,
    })),
  })),
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

/**
 * Trang nội dung: chỉ phần chữ (tiêu đề + đoạn giới thiệu) do CMS quản lý. Các
 * khối có cấu trúc riêng (thẻ giá trị cốt lõi, quy trình liên hệ, bản đồ) vẫn là
 * bố cục tĩnh trong `src/data/*`, không nhét vừa `content: LocalizedText[]`.
 */
export const mockPages: PageDto[] = [
  {
    id: "mock-page-gioi-thieu",
    slug: "gioi-thieu",
    title: { vi: aboutHero.title },
    content: [
      { vi: aboutHero.description },
      ...aboutOverview.paragraphs.map((vi) => ({ vi })),
    ],
  },
  {
    id: "mock-page-lien-he",
    slug: "lien-he",
    title: { vi: contactHero.title },
    content: [{ vi: contactHero.description }],
  },
];

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
