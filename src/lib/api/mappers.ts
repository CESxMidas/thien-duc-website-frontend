import type { HomeBanner } from "@/data/banners";
import type { CooperationProject } from "@/data/home";
import type {
  NewsPost,
  Project,
  ProjectFact,
  ProjectItem,
  ProjectMapLocation,
  ProjectStatus,
} from "@/types/content";
import { localizeAuthor } from "@/config/site";
import type { Locale } from "@/lib/i18n/config";
import type {
  BannerDto,
  CooperationProjectDto,
  LocalizedText,
  NewsPostDto,
  ProjectDto,
  ProjectFactDto,
  ProjectItemDto,
  ProjectMapLocationDto,
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

/**
 * Như `localized()` nhưng nhận thêm `string` — dùng cho các field vừa chuyển
 * sang song ngữ (location/category, EN-FULL-C2): dữ liệu cũ có thể còn là chuỗi
 * tiếng Việt thuần, khi đó hiện nguyên văn ở cả hai locale.
 */
function localizedLoose(
  value: LocalizedText | string | null | undefined,
  locale: Locale,
): string | undefined {
  if (value == null) return undefined;
  if (typeof value === "string") return value;
  return localized(value, locale);
}

/**
 * Quick-fact song ngữ → cặp chuỗi theo locale (EN-FULL-C3). `label`/`value` có
 * thể là `{ vi, en? }` (mới) hoặc chuỗi tiếng Việt thuần (dữ liệu cũ);
 * `localizedLoose` lo cả hai và lùi về `vi` khi thiếu `en`, nên `/en` không bao
 * giờ render `[object Object]` và route tiếng Việt giữ nguyên nội dung.
 */
function localizeFact(fact: ProjectFactDto, locale: Locale): ProjectFact {
  return {
    label: localizedLoose(fact.label, locale) ?? "",
    value: localizedLoose(fact.value, locale) ?? "",
  };
}

/**
 * Phân giải khối bản đồ theo locale. Prose (EN-FULL-C5a) + nhãn overlay
 * (EN-FULL-C5b): `heading`/`description`/`address` và `labels[].text` là
 * `{ vi, en? }` (mới) hoặc chuỗi cũ — `localizedLoose` lo cả hai và lùi về `vi`.
 * Vị trí/kiểu của nhãn (`left`/`top`/`kind`) và `image`/`markers` giữ nguyên.
 */
function mapMapLocation(
  dto: ProjectMapLocationDto,
  locale: Locale,
): ProjectMapLocation {
  return {
    image: dto.image,
    googleMapsUrl: dto.googleMapsUrl,
    // Chuỗi rỗng coi như thiếu (→ undefined) để heading lùi về tiêu đề mặc định
    // và mô tả/địa chỉ trống không render ô rỗng.
    heading: localizedLoose(dto.heading, locale) || undefined,
    description: localizedLoose(dto.description, locale) || undefined,
    address: localizedLoose(dto.address, locale) || undefined,
    markerLeft: dto.markerLeft,
    markerTop: dto.markerTop,
    labels: dto.labels?.map((label) => ({
      ...label,
      text: localizedLoose(label.text, locale) ?? "",
    })),
  };
}

/**
 * Ảnh **cấp dự án** (ảnh con của chính dự án, không thuộc hạng mục nào).
 *
 * Ưu tiên quan hệ `galleryImages` do Admin upload — GET /projects/:slug trả về
 * *tất cả* ảnh (cả ảnh hạng mục), nên lọc lấy ảnh có `projectItemId == null`
 * để **không** lẫn ảnh hạng mục vào thư viện cấp dự án. Quan hệ rỗng thì lùi về
 * `gallery` phẳng (dữ liệu cũ). Trả `undefined` khi không có ảnh để trang không
 * render khối thư viện trống.
 */
function mapProjectGallery(dto: ProjectDto): string[] | undefined {
  const relationImages = dto.galleryImages
    ?.filter((image) => image.projectItemId == null)
    .map((image) => image.url);

  if (relationImages && relationImages.length > 0) {
    return relationImages;
  }

  return dto.gallery.length > 0 ? dto.gallery : undefined;
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
    location: localizedLoose(dto.location, locale),
    image: dto.image ?? undefined,
    gallery: mapProjectGallery(dto),
    gallerySections: dto.gallerySections ?? undefined,
    category: localizedLoose(dto.category, locale),
    description: localized(dto.description, locale),
    highlights: dto.highlights?.map((item) => localized(item, locale)),
    quickFacts: dto.quickFacts?.map((fact) => localizeFact(fact, locale)),
    mapLocation: dto.mapLocation
      ? mapMapLocation(dto.mapLocation, locale)
      : undefined,
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
    quickFacts: dto.quickFacts?.map((fact) => localizeFact(fact, locale)),
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
    author: localizeAuthor(dto.author, locale),
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
    image: dto.image ?? undefined,
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
