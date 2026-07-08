import type { NavItem } from "@/types/content";

export const mainNavigation: NavItem[] = [
  { label: "Trang chủ", href: "/" },
  { label: "Giới thiệu", href: "/gioi-thieu" },
  {
    label: "Dự án",
    href: "/du-an",
    overviewLabel: "Tất cả dự án",
    children: [
      {
        label: "Khu đô thị Hưng Phú",
        href: "/du-an/khu-do-thi-hung-phu",
        group: "Dự án nổi bật",
      },
      {
        label: "Dự án đã bàn giao",
        href: "/du-an?status=da-ban-giao",
        group: "Theo trạng thái",
      },
      {
        label: "Dự án đang thi công",
        href: "/du-an?status=dang-thi-cong",
        group: "Theo trạng thái",
      },
      {
        label: "Dự án chuẩn bị khởi công",
        href: "/du-an?status=chuan-bi-khoi-cong",
        group: "Theo trạng thái",
      },
    ],
  },
  { label: "Tin tức", href: "/tin-tuc" },
  { label: "Công ty thành viên", href: "/cong-ty-thanh-vien" },
  {
    label: "Tuyển dụng & Nhân sự",
    href: "/tuyen-dung",
    overviewLabel: "Tuyển dụng",
    children: [
      { label: "Sơ đồ tổ chức công ty", href: "/so-do-to-chuc-cong-ty" },
      { label: "Đào tạo", href: "/dao-tao" },
      { label: "Chính sách nhân sự", href: "/chinh-sach-nhan-su" },
    ],
  },
  { label: "Liên hệ", href: "/lien-he" },
];
