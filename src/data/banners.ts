export type HomeBanner = {
  image: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  href: string;
  ctaLabel: string;
  objectPosition?: string;
};

export const homeBanners: HomeBanner[] = [
  {
    image: "/images/banners/home/home-banner-hung-phu-master-plan-02.jpg",
    objectPosition: "center center",
    eyebrow: "Dự án tiêu biểu",
    title: "Khu đô thị Hưng Phú",
    subtitle:
      "Dự án đô thị tại Bến Tre — không gian sống hiện đại, hạ tầng đồng bộ và tiện ích nội khu.",
    href: "/du-an/khu-do-thi-hung-phu",
    ctaLabel: "Xem dự án",
  },
  {
    image: "/images/banners/home/home-banner-hung-phu-fancy-tower-01.jpg",
    objectPosition: "center 55%",
    eyebrow: "Danh mục dự án",
    title: "Hợp tác phát triển dự án",
    subtitle:
      "Đồng hành cùng đơn vị phát triển uy tín — chất lượng triển khai và tiến độ minh bạch.",
    href: "/du-an",
    ctaLabel: "Danh sách dự án",
  },
  {
    image: "/images/banners/home/home-banner-hung-phu-master-plan-top-01.jpg",
    objectPosition: "center center",
    eyebrow: "Giới thiệu công ty",
    title: "Thiên Đức — Uy tín từ 2010",
    subtitle:
      "Hơn một thập kỷ hoạt động trong đầu tư, xây dựng và phát triển bất động sản tại TP.HCM và các tỉnh.",
    href: "/gioi-thieu",
    ctaLabel: "Giới thiệu công ty",
  },
  {
    image: "/images/banners/home/home-banner-hung-phu-aerial-01.jpg",
    objectPosition: "center center",
    eyebrow: "Tin tức & sự kiện",
    title: "Tin tức & hoạt động",
    subtitle:
      "Cập nhật tiến độ dự án, sự kiện doanh nghiệp và thông tin hoạt động từ Thiên Đức.",
    href: "/tin-tuc",
    ctaLabel: "Xem tin tức",
  },
];
