import type {
  ProjectGallerySection,
  ProjectMapLabel,
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

/**
 * Quick-fact thô từ backend. Song ngữ (EN-FULL-C3): `label`/`value` là
 * `{ vi, en? }`; dữ liệu cũ có thể còn là chuỗi tiếng Việt thuần. Mapper phân
 * giải theo locale bằng `localizedLoose`, nên UI vẫn nhận `{ label, value }`
 * dạng chuỗi (xem `ProjectFact` trong `types/content.ts`).
 */
export type ProjectFactDto = {
  label: LocalizedText | string;
  value: LocalizedText | string;
};

/**
 * `mapLocation` thô từ backend. Phần **prose** song ngữ (EN-FULL-C5a):
 * `heading`/`description`/`address` là `{ vi, en? }` hoặc chuỗi cũ; mapper phân
 * giải theo locale. `labels[].text` giữ nguyên (chưa song ngữ hóa — để dành
 * C5b), nên `image`/`markers`/`labels` kế thừa y hệt `ProjectMapLocation`.
 */
/**
 * Một nhãn bản đồ thô. `text` song ngữ (EN-FULL-C5b): `{ vi, en? }` hoặc chuỗi
 * cũ; mapper phân giải theo locale. `left`/`top`/`kind` giữ nguyên.
 */
export type ProjectMapLabelDto = Omit<ProjectMapLabel, "text"> & {
  text: LocalizedText | string;
};

export type ProjectMapLocationDto = Omit<
  ProjectMapLocation,
  "heading" | "description" | "address" | "labels"
> & {
  heading?: LocalizedText | string;
  description?: LocalizedText | string;
  address?: LocalizedText | string;
  labels?: ProjectMapLabelDto[];
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
  quickFacts?: ProjectFactDto[] | null;
  gallerySections?: ProjectGallerySection[] | null;
  order: number;
  /** Backend trả kèm khi GET /projects/:slug/:itemSlug (include galleryImages). */
  galleryImages?: ProjectGalleryImageDto[];
};

export type ProjectGalleryImageDto = {
  id: string;
  url: string;
  caption?: LocalizedText | null;
  order: number;
  /**
   * Ảnh gắn với một hạng mục con thì có `projectItemId`; ảnh của cả dự án thì
   * null. GET /projects/:slug trả về **tất cả** ảnh của dự án (cả hai loại), nên
   * mapper phải lọc theo trường này để tách ảnh cấp dự án khỏi ảnh hạng mục.
   */
  projectItemId?: string | null;
};

export type ProjectDto = {
  id: string;
  slug: string;
  title: LocalizedText;
  summary: LocalizedText;
  description?: LocalizedText | null;
  status: ProjectStatusDto;
  // location/category chuyển sang song ngữ (EN-FULL-C2). Chấp nhận cả `string`
  // (dữ liệu cũ chưa migrate) để mapper lùi an toàn về nguyên văn.
  location?: LocalizedText | string | null;
  image?: string | null;
  gallery: string[];
  category?: LocalizedText | string | null;
  highlights?: LocalizedText[] | null;
  quickFacts?: ProjectFactDto[] | null;
  gallerySections?: ProjectGallerySection[] | null;
  mapLocation?: ProjectMapLocationDto | null;
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

/**
 * Trang nội dung tĩnh do CMS quản lý (`GET /pages/:slug`). `content` là mảng
 * đoạn văn song ngữ — cùng quy ước với `NewsPostDto.content`.
 */
export type PageDto = {
  id: string;
  slug: string;
  title: LocalizedText;
  content: LocalizedText[] | null;
};

/** Dự án hợp tác (`GET /cooperation`) — mọi field chữ song ngữ, không có ảnh. */
export type CooperationProjectDto = {
  id: string;
  name: LocalizedText;
  location: LocalizedText;
  role: LocalizedText;
  partner: LocalizedText;
  scale: LocalizedText;
  status: LocalizedText;
  image: string | null;
  order: number;
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
