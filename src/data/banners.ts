export type HomeBanner = {
  image: string;
  title: string;
  subtitle: string;
  href: string;
  ctaLabel: string;
  /** Canh khung ảnh trong banner (object-cover). Ví dụ: "center 40%" */
  objectPosition?: string;
};

/** Chỉ dùng file có trong public/images/banners/home/ */
export const homeBanners: HomeBanner[] = [
  {
    image: "/images/banners/home/home-banner-hung-phu-master-plan-02.jpg",
    objectPosition: "center center",
    title: "Khu đô thị Hưng Phú",
    subtitle:
      "Tổng thể dự án đô thị tại Bến Tre với không gian xanh, hạ tầng đồng bộ và định hướng phát triển bền vững.",
    href: "/du-an/khu-do-thi-hung-phu",
    ctaLabel: "Xem dự án",
  },
  {
    image: "/images/banners/home/home-banner-hung-phu-fancy-tower-01.jpg",
    objectPosition: "center 55%",
    title: "Không gian sống hiện đại",
    subtitle:
      "Góc nhìn cảnh quan khu vực dự án Hưng Phú với mật độ xây dựng hài hòa và tiện ích nội khu.",
    href: "/du-an/khu-do-thi-hung-phu",
    ctaLabel: "Khám phá dự án",
  },
  {
    image: "/images/banners/home/home-banner-hung-phu-master-plan-top-01.jpg",
    objectPosition: "center center",
    title: "Quy hoạch tổng thể",
    subtitle:
      "Mặt bằng tổng thể thể hiện bố trí khu dân cư, công trình công cộng và hạ tầng kết nối trong dự án.",
    href: "/du-an/khu-do-thi-hung-phu",
    ctaLabel: "Xem chi tiết",
  },
  {
    image: "/images/banners/home/home-banner-hung-phu-aerial-01.jpg",
    objectPosition: "center center",
    title: "Thiên Đức — Uy tín từ 2010",
    subtitle:
      "Tập trung vào tiến độ, chất lượng và phương châm Khách hàng hài lòng — Thiên Đức thành công.",
    href: "/gioi-thieu",
    ctaLabel: "Giới thiệu công ty",
  },
];
