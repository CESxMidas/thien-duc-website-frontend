/**
 * Danh sách `id` loại yêu cầu (đồng thời là `inquiryType` gửi backend) — giữ
 * thứ tự hiển thị của select. Nhãn hiển thị song ngữ nằm trong dictionary
 * (`contactForm.inquiryOptions[id]`, i18n-B3), keyed theo đúng các id này.
 *
 * Copy tĩnh của trang liên hệ (hero, tiêu đề khối form, quy trình, khối bản đồ)
 * đã chuyển sang dictionary (`dictionary.contact`, i18n-B4).
 */
export const inquiryTypeIds = [
  "tu-van-du-an",
  "hop-tac-phat-trien",
  "thong-tin-doanh-nghiep",
] as const;
