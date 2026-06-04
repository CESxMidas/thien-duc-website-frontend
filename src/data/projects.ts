import type { Project, ProjectStatus } from "@/types/content";

export const projectStatusLabels: Record<ProjectStatus, string> = {
  "da-ban-giao": "Đã bàn giao",
  "dang-thi-cong": "Đang thi công",
  "chuan-bi-khoi-cong": "Chuẩn bị khởi công",
  "dang-cap-nhat": "Đang cập nhật",
};

export const projectStatusFilters: Array<{
  label: string;
  value: ProjectStatus | "all";
}> = [
  { label: "Tất cả", value: "all" },
  { label: "Đang thi công", value: "dang-thi-cong" },
  { label: "Chuẩn bị khởi công", value: "chuan-bi-khoi-cong" },
  { label: "Đã bàn giao", value: "da-ban-giao" },
];

export const projects: Project[] = [
  {
    title: "Khu đô thị Hưng Phú",
    slug: "khu-do-thi-hung-phu",
    summary:
      "Dự án đô thị tiêu biểu của Thiên Đức, được định hướng phát triển với hạ tầng đồng bộ và không gian sống hiện đại tại Bến Tre.",
    status: "dang-thi-cong",
    location: "Bến Tre",
    category: "Khu đô thị",
    image: "/images/projects/hung-phu/master-plan/hung-phu-master-plan-aerial-01.jpg",
    gallery: [
      "/images/projects/hung-phu/master-plan/hung-phu-master-plan-aerial-02.jpg",
      "/images/projects/hung-phu/master-plan/hung-phu-master-plan-aerial-03.jpg",
      "/images/projects/hung-phu/fancy-tower/fancy-tower-exterior-day-01.jpg",
    ],
    description:
      "Khu đô thị Hưng Phú là một trong những dự án Thiên Đức đồng hành phát triển tại Bến Tre. Dự án hướng đến việc kiến tạo không gian sống ổn định, thuận tiện và phù hợp với nhu cầu an cư, kết nối của cư dân trong khu vực.",
    highlights: [
      "Định hướng phát triển khu đô thị hiện đại tại Bến Tre.",
      "Tập trung vào hạ tầng, cảnh quan và trải nghiệm sử dụng lâu dài.",
      "Thông tin chi tiết về pháp lý, quy mô và tiến độ sẽ được cập nhật theo tài liệu được duyệt.",
    ],
  },
  {
    title: "Chung cư La Bonita",
    slug: "chung-cu-la-bonita",
    summary:
      "Dự án căn hộ tại TP.HCM, được giới thiệu trong danh mục dự án Thiên Đức với hình ảnh và thông tin tổng quan.",
    status: "da-ban-giao",
    location: "TP.HCM",
    category: "Chung cư",
    image:
      "/images/projects/la-bonita/building/la-bonita-building-render-01.jpg",
    gallery: [
      "/images/projects/la-bonita/building/la-bonita-building-render-02.jpg",
    ],
    description:
      "Chung cư La Bonita là dự án được giới thiệu trong danh mục dự án của Thiên Đức tại TP.HCM. Các thông tin chi tiết về quy mô, pháp lý và tiến độ nên được cập nhật theo tài liệu chính thức đã duyệt.",
    highlights: [
      "Vị trí tại TP.HCM.",
      "Hình ảnh dự án đã có trong thư viện media hiện tại.",
      "Các thông tin chi tiết cần được xác nhận trước khi công bố rộng rãi.",
    ],
  },
  {
    title: "Dự án Vũng Tàu",
    slug: "du-an-vung-tau",
    summary:
      "Dự án chung cư tại Vũng Tàu, đang được bổ sung hình ảnh và thông tin tổng quan theo tài liệu được duyệt.",
    status: "dang-cap-nhat",
    location: "Vũng Tàu",
    category: "Chung cư",
    image: "/images/projects/vung-tau/vung-tau-center-exterior-01.webp",
    gallery: [
      "/images/projects/vung-tau/vung-tau-center-exterior-02.webp",
    ],
    description:
      "Dự án Vũng Tàu được giới thiệu trong danh mục dự án chung cư của Thiên Đức. Các thông tin chi tiết về vị trí, quy mô, pháp lý và tiến độ cần được cập nhật theo hồ sơ chính thức trước khi công bố rộng rãi.",
    highlights: [
      "Loại hình chung cư tại khu vực Vũng Tàu.",
      "Hình ảnh hiện đang dùng làm ảnh tham khảo phù hợp với nhóm dự án chung cư.",
      "Thông tin chi tiết về pháp lý, quy mô và tiến độ sẽ được cập nhật theo tài liệu được duyệt.",
    ],
  },
  {
    title: "Dự án Bảy Hiền",
    slug: "du-an-bay-hien",
    summary:
      "Dự án chung cư tại khu vực Bảy Hiền, đang được bổ sung thông tin chi tiết và hình ảnh phù hợp.",
    status: "dang-cap-nhat",
    location: "Bảy Hiền, TP.HCM",
    category: "Chung cư",
    image: "/images/projects/bay-hien/bay-hien-tower-exterior-01.jpg",
    description:
      "Dự án Bảy Hiền được giới thiệu trong danh mục dự án chung cư của Thiên Đức tại TP.HCM. Nội dung hiện trình bày ở mức tổng quan an toàn, chờ công ty xác nhận thêm thông tin chính thức về pháp lý, quy mô và tiến độ.",
    highlights: [
      "Loại hình chung cư tại khu vực Bảy Hiền, TP.HCM.",
      "Hình ảnh hiện đang dùng làm ảnh tham khảo phù hợp với nhóm dự án chung cư.",
      "Các thông tin chi tiết cần được xác nhận trước khi công bố rộng rãi.",
    ],
  },
];
