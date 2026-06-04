import type { Project } from "@/types/content";

export const projects: Project[] = [
  {
    title: "Khu đô thị Hưng Phú",
    slug: "khu-do-thi-hung-phu",
    summary: "Dư án đô thị trọng điểm của Thiên Đức tại Bến Tre",
    status: "dang-thi-cong",
    location: "Bến Tre",
    image: "/images/banners/home/home-banner-hung-phu-aerial-01.jpg",
  },
  {
    title: "Chung cư La Bonita",
    slug: "chung-cu-la-bonita",
    summary: "Dư án đô thị trọng điểm của Thiên Đức tại Thành Phố Hồ Chí Minh",
    status: "da-ban-giao",
    location: "Thành Phố Hồ Chí Minh",
    image:
      "/images/projects/la-bonita/legacy/la-bonita-building-render-lagacy-01.jpg",
    gallery: [
      "/images/projects/la-bonita/legacy/la-bonita-building-render-lagacy-02.jpg",
    ],
  },
];
