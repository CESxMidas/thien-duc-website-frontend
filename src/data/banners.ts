/**
 * Banner trang chủ do CMS quản lý — dữ liệu thật đến từ `GET /banners`
 * (`src/lib/api/banners.ts` → `mapBanner`). File này **chỉ giữ kiểu** đã phân
 * giải theo locale mà `HomeBannerSlider` nhận.
 *
 * Trước đây file còn một mảng `homeBanners` chép cứng nội dung banner. Nội dung
 * đó nay nằm ở backend (`prisma/banner-content.json` +
 * `prisma/seed-banners.js`); giữ lại bản chép cứng sẽ thành nguồn sự thật thứ
 * hai và trôi lệch so với những gì biên tập viên sửa trong Admin.
 */
export type HomeBanner = {
  image: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  href: string;
  ctaLabel: string;
  objectPosition?: string;
};
