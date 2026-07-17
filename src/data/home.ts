/**
 * Dữ liệu tĩnh còn lại của trang chủ. Copy hiển thị (dải giới thiệu, khối hợp
 * tác, CTA liên hệ, banner a11y) đã chuyển sang dictionary song ngữ
 * (`lib/i18n/dictionaries/{vi,en}.json`, các khóa `homeIntro`/`homeCooperation`/
 * `homeContact`/`homeBanner`) trong i18n-B2 — trước đây hardcode tiếng Việt nên
 * route EN vẫn hiện tiếng Việt.
 */

/**
 * Dự án hợp tác — khối riêng ở trang chủ. Đây là các dự án Thiên Đức đồng phát
 * triển cùng đối tác quốc tế, **không** nằm trong danh mục `/du-an` (do Thiên
 * Đức làm chủ đầu tư) nên không có trang chi tiết. Dữ liệu đến từ API
 * `/cooperation`; ảnh do đối tác (CapitaLand) giữ bản quyền — thẻ hiển thị bằng
 * thông tin thay vì mượn ảnh dự án khác.
 */
export type CooperationProject = {
  name: string;
  location: string;
  role: string;
  partner: string;
  scale: string;
  status: string;
  /** Ảnh phối cảnh (tùy chọn) — thẻ lùi về nền thương hiệu khi không có. */
  image?: string;
};

/**
 * Bản rút gọn viết tay (chỉ tiếng Việt) cho thẻ "Dự án tiêu biểu" trang chủ —
 * locale khác dùng thẳng nội dung CMS (xem `home-featured-projects.tsx`).
 */
export const homeFeaturedProjectCopy = {
  "khu-do-thi-hung-phu": {
    title: "Khu đô thị Hưng Phú",
    location: "Bến Tre",
    summary:
      "Dự án đô thị tiêu biểu của Thiên Đức, đang được triển khai với định hướng hạ tầng đồng bộ và không gian sống bền vững.",
  },
};
