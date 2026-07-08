import type { HomeBanner } from "@/data/banners";
import type {
  NewsPost,
  Project,
  ProjectItem,
  ProjectStatus,
} from "@/types/content";
import type {
  BannerDto,
  LocalizedText,
  NewsPostDto,
  ProjectDto,
  ProjectItemDto,
  ProjectStatusDto,
} from "@/lib/api/types";

/**
 * Chuyển DTO (schema backend) về đúng các type UI hiện có trong
 * `src/types/content.ts` để component không phải sửa khi nối API thật.
 * Hiện chỉ dùng bản tiếng Việt; khi làm song ngữ sẽ nhận locale ở đây.
 */

export function localized(text: LocalizedText): string;
export function localized(text: LocalizedText | null | undefined): string | undefined;
export function localized(text: LocalizedText | null | undefined) {
  return text?.vi;
}

const statusFromDto: Record<ProjectStatusDto, ProjectStatus> = {
  DA_BAN_GIAO: "da-ban-giao",
  DANG_THI_CONG: "dang-thi-cong",
  CHUAN_BI_KHOI_CONG: "chuan-bi-khoi-cong",
};

export function mapProject(dto: ProjectDto): Project {
  return {
    title: localized(dto.title),
    slug: dto.slug,
    summary: localized(dto.summary),
    status: statusFromDto[dto.status],
    location: dto.location ?? undefined,
    image: dto.image ?? undefined,
    gallery: dto.gallery.length > 0 ? dto.gallery : undefined,
    gallerySections: dto.gallerySections ?? undefined,
    category: dto.category ?? undefined,
    description: localized(dto.description),
    highlights: dto.highlights?.map((item) => localized(item)),
    quickFacts: dto.quickFacts ?? undefined,
    mapLocation: dto.mapLocation ?? undefined,
  };
}

export function mapProjectItem(dto: ProjectItemDto): ProjectItem {
  return {
    title: localized(dto.title),
    slug: dto.slug,
    summary: localized(dto.summary),
    description: localized(dto.description),
    status: dto.status ? statusFromDto[dto.status] : undefined,
    image: dto.image ?? undefined,
    highlights: dto.highlights?.map((item) => localized(item)),
    quickFacts: dto.quickFacts ?? undefined,
    gallerySections: dto.gallerySections ?? undefined,
  };
}

export function mapNewsPost(dto: NewsPostDto): NewsPost {
  return {
    title: localized(dto.title),
    slug: dto.slug,
    summary: localized(dto.summary),
    publishedAt: dto.publishedAt?.slice(0, 10) ?? "",
    eventDate: dto.eventDate?.slice(0, 10),
    category: localized(dto.category?.name),
    content: dto.content?.map((item) => localized(item)),
    author: dto.author ?? undefined,
    image: dto.image ?? undefined,
  };
}

export function mapBanner(dto: BannerDto): HomeBanner {
  return {
    image: dto.image,
    eyebrow: localized(dto.eyebrow) ?? "",
    title: localized(dto.title),
    subtitle: localized(dto.subtitle) ?? "",
    href: dto.href,
    ctaLabel: localized(dto.ctaLabel) ?? "",
    objectPosition: dto.objectPosition ?? undefined,
  };
}
