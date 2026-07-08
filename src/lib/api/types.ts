import type {
  ProjectFact,
  ProjectGallerySection,
  ProjectMapLocation,
} from "@/types/content";

/**
 * Kiểu dữ liệu DTO khớp với schema Prisma + chuẩn response của backend
 * (`thien-duc-website-backend`). Nội dung song ngữ lưu dạng { vi, en? } —
 * xem docs/KE-HOACH-CODING.md mục 2.2.1.
 */

export type LocalizedText = {
  vi: string;
  en?: string;
};

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/** Enum ProjectStatus phía backend (Prisma) — FE dùng dạng kebab-case. */
export type ProjectStatusDto =
  | "DA_BAN_GIAO"
  | "DANG_THI_CONG"
  | "CHUAN_BI_KHOI_CONG";

export type ProjectItemDto = {
  id: string;
  projectId: string;
  slug: string;
  title: LocalizedText;
  summary?: LocalizedText | null;
  description?: LocalizedText | null;
  status?: ProjectStatusDto | null;
  image?: string | null;
  highlights?: LocalizedText[] | null;
  quickFacts?: ProjectFact[] | null;
  gallerySections?: ProjectGallerySection[] | null;
  order: number;
};

export type ProjectGalleryImageDto = {
  id: string;
  url: string;
  caption?: LocalizedText | null;
  order: number;
};

export type ProjectDto = {
  id: string;
  slug: string;
  title: LocalizedText;
  summary: LocalizedText;
  description?: LocalizedText | null;
  status: ProjectStatusDto;
  location?: string | null;
  image?: string | null;
  gallery: string[];
  category?: string | null;
  highlights?: LocalizedText[] | null;
  quickFacts?: ProjectFact[] | null;
  gallerySections?: ProjectGallerySection[] | null;
  mapLocation?: ProjectMapLocation | null;
  order: number;
  /** Backend trả kèm khi GET /projects và /projects/:slug (include items). */
  items?: ProjectItemDto[];
  /** Backend trả kèm khi GET /projects/:slug (include galleryImages). */
  galleryImages?: ProjectGalleryImageDto[];
};

export type NewsPostDto = {
  id: string;
  slug: string;
  title: LocalizedText;
  summary: LocalizedText;
  content?: LocalizedText[] | null;
  author?: string | null;
  image?: string | null;
  /** ISO date string */
  eventDate?: string | null;
  /** ISO date string */
  publishedAt?: string | null;
  category?: { slug: string; name: LocalizedText } | null;
};

export type BannerDto = {
  id: string;
  image: string;
  eyebrow?: LocalizedText | null;
  title: LocalizedText;
  subtitle?: LocalizedText | null;
  href: string;
  ctaLabel?: LocalizedText | null;
  objectPosition?: string | null;
  order: number;
};
