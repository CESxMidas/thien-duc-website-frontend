import { routes } from "@/lib/routes";

export type FooterLink = {
  label: string;
  href: string;
};

export type FooterSection = {
  title: string;
  links: FooterLink[];
};

export const footerSections: FooterSection[] = [
  {
    title: "Công ty",
    links: [
      { label: "Trang chủ", href: routes.home },
      { label: "Giới thiệu", href: routes.about },
      { label: "Công ty thành viên", href: routes.members },
      { label: "Tin tức", href: routes.news },
    ],
  },
  {
    title: "Dự án",
    links: [
      { label: "Danh sách dự án", href: routes.projects },
      { label: "Khu đô thị Hưng Phú", href: "/du-an/khu-do-thi-hung-phu" },
      { label: "Dự án đang thi công", href: "/du-an?status=dang-thi-cong" },
      { label: "Dự án đã bàn giao", href: "/du-an?status=da-ban-giao" },
    ],
  },
];
