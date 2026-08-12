export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
  /** Tên nhóm trong dropdown (các item cùng group đứng chung dưới 1 heading). */
  group?: string;
  /** Nhãn cho link cha khi hiển thị như item đầu trong menu con mobile. */
  overviewLabel?: string;
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
  /** Hạng mục con, ví dụ Fancy Tower thuộc Khu đô thị Hưng Phú. */
  items?: ProjectItem[];
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
  /** Ảnh của hạng mục (bảng project_gallery, lọc theo project_item_id). */
  gallery?: string[];
};

/**
 * Chuyên mục tin — giữ CẢ `slug` lẫn `name`.
 *
 * Trước đây mapper rút gọn về mỗi tên hiển thị, nên chuyên mục chỉ là chữ chết
 * trong dòng metadata: không dựng được link tới trang danh mục dù backend luôn
 * trả `slug` kèm theo.
 */
export type NewsCategoryRef = {
  slug: string;
  name: string;
};

/**
 * Một mục trong danh sách chuyên mục (`GET /news/categories`).
 *
 * Khác `NewsCategoryRef` — thứ gắn kèm mỗi bài viết — ở chỗ có thêm số đếm.
 * Tách hai kiểu để TypeScript chặn việc lỡ tay lọc chip bằng dữ liệu chuyên mục
 * lấy từ một bài viết (vốn không mang số đếm nào).
 */
export type NewsCategory = NewsCategoryRef & {
  /**
   * Số bài **đã đăng**. Website dùng nó để ẩn chuyên mục rỗng khỏi bộ lọc: chip
   * dẫn vào trang trống vừa là ngõ cụt cho người đọc, vừa là liên kết nội bộ
   * trỏ vào một trang `noindex`.
   *
   * Cố ý KHÔNG có `totalCount` — route công khai không trả con số đó (nó gộp cả
   * bài nháp), và website cũng không có việc gì cần đến nó.
   */
  publishedCount: number;
};

export type NewsPost = {
  title: string;
  slug: string;
  summary: string;
  publishedAt: string;
  eventDate?: string;
  category?: NewsCategoryRef;
  content?: string[];
  author?: string;
  image?: string;
};
