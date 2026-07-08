export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

export type ProjectStatus =
  | "da-ban-giao"
  | "dang-thi-cong"
  | "chuan-bi-khoi-cong"


export type ProjectMapLabelKind = "place" | "area" | "road" | "direction";

export type ProjectMapLabel = {
  text: string;
  /** Vị trí nhãn trên ảnh, tính theo phần trăm (0-100). */
  left: number;
  top: number;
  kind?: ProjectMapLabelKind;
};

export type ProjectMapLocation = {
  image: string;
  googleMapsUrl: string;
  heading?: string;
  description?: string;
  address?: string;
  /** Vị trí marker dự án trên ảnh, tính theo phần trăm (0-100). */
  markerLeft: number;
  markerTop: number;
  /** Nhãn chữ thật vẽ đè lên ảnh nền (cho ảnh nền không có chữ). */
  labels?: ProjectMapLabel[];
};

export type ProjectFact = {
  label: string;
  value: string;
};

export type ProjectGallerySection = {
  title: string;
  description?: string;
  images: string[];
};

export type Project = {
  title: string;
  slug: string;
  summary: string;
  status: ProjectStatus;
  location?: string;
  image?: string;
  gallery?: string[];
  gallerySections?: ProjectGallerySection[];
  category?: string;
  description?: string;
  highlights?: string[];
  quickFacts?: ProjectFact[];
  mapLocation?: ProjectMapLocation;
};

/** Hạng mục con của dự án (bảng project_items) — dùng cho route du-an/[slug]/[hang-muc]. */
export type ProjectItem = {
  title: string;
  slug: string;
  summary?: string;
  description?: string;
  status?: ProjectStatus;
  image?: string;
  highlights?: string[];
  quickFacts?: ProjectFact[];
  gallerySections?: ProjectGallerySection[];
};

export type NewsPost = {
  title: string;
  slug: string;
  summary: string;
  publishedAt: string;
  eventDate?: string;
  category?: string;
  content?: string[];
  author?: string;
  image?: string;
};
