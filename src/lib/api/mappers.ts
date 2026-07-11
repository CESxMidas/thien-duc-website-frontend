import type { HomeBanner } from "@/data/banners";
import type { CooperationProject } from "@/data/home";
import type {
  NewsPost,
  Project,
  ProjectItem,
  ProjectStatus,
} from "@/types/content";
import type { Locale } from "@/lib/i18n/config";
import type {
  BannerDto,
  CooperationProjectDto,
  LocalizedText,
  NewsPostDto,
  ProjectDto,
  ProjectItemDto,
  ProjectStatusDto,
} from "@/lib/api/types";

/**
 * Chuyển DTO (schema backend) về đúng các type UI trong `src/types/content.ts`
 * để component không phải biết shape của backend.
 */

/**
 * Chọn bản dịch theo locale, **fallback về tiếng Việt** khi thiếu `en`.
 *
 * Bản dịch tiếng Anh do biên tập viên nhập dần qua Admin CMS (câu 19 chưa chốt),
 * nên phần lớn field `en` hiện còn trống — trang tiếng Anh vẫn phải hiển thị
 * được nội dung thay vì để khoảng trắng. Chuỗi `en` rỗng cũng coi như thiếu.
 */
export function localized(text: LocalizedText, locale: Locale): string;
export function localized(
  text: LocalizedText | null | undefined,
  locale: Locale,
): string | undefined;
export function localized(
  text: LocalizedText | null | undefined,
  locale: Locale,
) {
  if (!text) return undefined;
  if (locale === "en") return text.en?.trim() || text.vi;
  return text.vi;
}

const statusFromDto: Record<ProjectStatusDto, ProjectStatus> = {
  DA_BAN_GIAO: "da-ban-giao",
  DANG_THI_CONG: "dang-thi-cong",
  CHUAN_BI_KHOI_CONG: "chuan-bi-khoi-cong",
};

export function mapProject(dto: ProjectDto, locale: Locale): Project {
  return {
    title: localized(dto.title, locale),
    slug: dto.slug,
    summary: localized(dto.summary, locale),
    status: statusFromDto[dto.status],
    location: dto.location ?? undefined,
    image: dto.image ?? undefined,
    gallery: dto.gallery.length > 0 ? dto.gallery : undefined,
    gallerySections: dto.gallerySections ?? undefined,
    category: dto.category ?? undefined,
    description: localized(dto.description, locale),
    highlights: dto.highlights?.map((item) => localized(item, locale)),
    quickFacts: dto.quickFacts ?? undefined,
    mapLocation: dto.mapLocation ?? undefined,
    items: dto.items?.map((item) => mapProjectItem(item, locale)),
  };
}

export function mapProjectItem(dto: ProjectItemDto, locale: Locale): ProjectItem {
  return {
    title: localized(dto.title, locale),
    slug: dto.slug,
    summary: localized(dto.summary, locale),
    description: localized(dto.description, locale),
    status: dto.status ? statusFromDto[dto.status] : undefined,
    image: dto.image ?? undefined,
    highlights: dto.highlights?.map((item) => localized(item, locale)),
    quickFacts: dto.quickFacts ?? undefined,
    gallerySections: dto.gallerySections ?? undefined,
    // Ảnh hạng mục nằm ở bảng project_gallery, backend trả theo `order` tăng dần.
    gallery: dto.galleryImages?.map((image) => image.url),
  };
}

export function mapNewsPost(dto: NewsPostDto, locale: Locale): NewsPost {
  return {
    title: localized(dto.title, locale),
    slug: dto.slug,
    summary: localized(dto.summary, locale),
    publishedAt: dto.publishedAt?.slice(0, 10) ?? "",
    eventDate: dto.eventDate?.slice(0, 10),
    category: localized(dto.category?.name, locale),
    content: dto.content?.map((item) => localized(item, locale)),
    author: dto.author ?? undefined,
    image: dto.image ?? undefined,
  };
}

export function mapCooperationProject(
  dto: CooperationProjectDto,
  locale: Locale,
): CooperationProject {
  return {
    name: localized(dto.name, locale),
    location: localized(dto.location, locale),
    role: localized(dto.role, locale),
    partner: localized(dto.partner, locale),
    scale: localized(dto.scale, locale),
    status: localized(dto.status, locale),
  };
}

export function mapBanner(dto: BannerDto, locale: Locale): HomeBanner {
  return {
    image: dto.image,
    eyebrow: localized(dto.eyebrow, locale) ?? "",
    title: localized(dto.title, locale),
    subtitle: localized(dto.subtitle, locale) ?? "",
    href: dto.href,
    ctaLabel: localized(dto.ctaLabel, locale) ?? "",
    objectPosition: dto.objectPosition ?? undefined,
  };
}
