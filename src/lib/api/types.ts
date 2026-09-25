import type {
  ProjectGallerySection,
  ProjectMapLabel,
  ProjectMapLocation,
} from "@/types/content";

export type LocalizedText = {
  vi: string;
  en?: string;
};

export type ProjectFactDto = {
  label: LocalizedText | string;
  value: LocalizedText | string;
};

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
  projectItemId?: string | null;
};

export type ProjectDto = {
  id: string;
  slug: string;
  title: LocalizedText;
  summary: LocalizedText;
  description?: LocalizedText | null;
  status: ProjectStatusDto;
  location?: LocalizedText | string | null;
  image?: string | null;
  gallery: string[];
  category?: LocalizedText | string | null;
  highlights?: LocalizedText[] | null;
  quickFacts?: ProjectFactDto[] | null;
  gallerySections?: ProjectGallerySection[] | null;
  mapLocation?: ProjectMapLocationDto | null;
  order: number;
  items?: ProjectItemDto[];
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
  eventDate?: string | null;
  publishedAt?: string | null;
  category?: { slug: string; name: LocalizedText } | null;
};

export type PageDto = {
  id: string;
  slug: string;
  title: LocalizedText;
  content: LocalizedText[] | null;
};

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
  title?: LocalizedText | null;
  subtitle?: LocalizedText | null;
  href: string;
  ctaLabel?: LocalizedText | null;
  objectPosition?: string | null;
  order: number;
};

export type PaginatedDto<T> = {
  items: T[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};
