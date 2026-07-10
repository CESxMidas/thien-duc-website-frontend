import { routes } from "@/lib/routes";
import { businessFields } from "./business-fields";

export const aboutHero = {
  eyebrow: "Giới thiệu",
  title: "Tổng quan về Công ty Thiên Đức",
  description:
    "Công ty TNHH Đầu tư Xây dựng Thương mại Thiên Đức thành lập năm 2010, hoạt động trong lĩnh vực đầu tư, xây dựng, thương mại và phát triển bất động sản tại TP.HCM và các tỉnh phía Nam. Hơn 16 năm phát triển, từng hợp tác cùng CapitaLand và hiện là chủ đầu tư khu đô thị Hưng Phú tại Bến Tre.",
};

export const aboutOverview = {
  eyebrow: "Định hướng phát triển",
  title: "Đối tác đầu tư và phát triển dự án theo hướng thận trọng, bền vững",
  paragraphs: [
    "Thiên Đức được thành lập năm 2010 bởi đội ngũ chuyên gia, kiến trúc sư và kỹ sư nhiều năm kinh nghiệm trong ngành xây dựng Việt Nam.",
    "Giai đoạn 2014 - 2018 đánh dấu bước ngoặt khi công ty hợp tác chiến lược cùng tập đoàn bất động sản quốc tế CapitaLand, triển khai và bàn giao thành công các tổ hợp căn hộ cao cấp chuẩn quốc tế tại TP.HCM.",
    "Từ năm 2018 đến nay, Thiên Đức mở rộng quỹ đất và vai trò chủ đầu tư sang các tỉnh thành phía Nam, tiêu biểu là khu đô thị quy mô lớn tại tỉnh Bến Tre.",
  ],
  motto: "Khách hàng hài lòng - Thiên Đức thành công",
};

/** Mốc lịch sử hình thành (câu 7). */
export const aboutTimeline = [
  {
    period: "2010",
    title: "Thành lập",
    description:
      "Đội ngũ chuyên gia, kiến trúc sư và kỹ sư nhiều năm kinh nghiệm trong ngành xây dựng Việt Nam cùng sáng lập công ty.",
  },
  {
    period: "2014 - 2018",
    title: "Hợp tác quốc tế",
    description:
      "Bắt tay hợp tác chiến lược cùng Tập đoàn CapitaLand (Singapore), triển khai và bàn giao các tổ hợp căn hộ cao cấp chuẩn quốc tế tại TP.HCM.",
  },
  {
    period: "2018 - nay",
    title: "Mở rộng vai trò chủ đầu tư",
    description:
      "Mở rộng quỹ đất sang các tỉnh thành phía Nam, tiêu biểu là các dự án khu đô thị quy mô lớn tại tỉnh Bến Tre.",
  },
];

/** Số liệu năng lực cốt lõi (câu 7), tính đến năm 2026. */
export const aboutStats = [
  { value: "16+", label: "Năm hoạt động", note: "Từ 2010 đến nay" },
  { value: "3", label: "Đại dự án phức hợp", note: "Cùng nhiều công trình hạ tầng dân dụng" },
  { value: "1.152", label: "Căn hộ Vista Verde", note: "4 tòa tháp, đồng chủ đầu tư cùng CapitaLand" },
  { value: "11,25 ha", label: "Khu đô thị Hưng Phú", note: "Chủ đầu tư duy nhất, tại Bến Tre" },
];

/**
 * Danh mục dự án tiêu biểu (câu 7). Khác `data/projects.ts`: bảng này gồm cả
 * dự án hợp tác cùng CapitaLand — không nằm trong danh mục dự án đang giới thiệu
 * trên trang `/du-an`, nên không có trang chi tiết riêng.
 */
export const aboutPortfolio = [
  {
    name: "Vista Verde",
    location: "Quận 2, TP.HCM",
    role: "Đồng chủ đầu tư",
    partner: "CapitaLand (Singapore)",
    scale: "25.295 m² · 4 tòa tháp · 1.152 căn hộ",
    status: "Đã bàn giao",
  },
  {
    name: "Feliz en Vista",
    location: "Quận 2, TP.HCM",
    role: "Đồng chủ đầu tư",
    partner: "CapitaLand (Singapore)",
    scale: "4 tòa tháp cao cấp",
    status: "Đã bàn giao",
  },
  {
    name: "Khu đô thị Hưng Phú",
    location: "Bến Tre",
    role: "Chủ đầu tư duy nhất",
    partner: "UBND tỉnh Bến Tre",
    scale: "Biệt thự, nhà liên kế, tòa nhà Liên Sở và hạ tầng đô thị",
    status: "Đã bàn giao hạ tầng, tiếp tục hoàn thiện",
  },
  {
    name: "Chung cư Fancy Tower",
    location: "Bến Tre",
    role: "Chủ đầu tư",
    partner: "Thuộc Khu đô thị Hưng Phú",
    scale: "Chung cư cao tầng đầu tiên tại khu vực",
    status: "Đã hoàn thiện",
  },
];

export const aboutPrinciples = [
  {
    title: "Tầm nhìn",
    description:
      "Trở thành thương hiệu đầu tư và xây dựng bất động sản uy tín hàng đầu Việt Nam, kiến tạo các công trình có giải pháp kiến trúc đột phá, thẩm mỹ cao và bền vững theo thời gian.",
  },
  {
    title: "Sứ mệnh",
    description:
      "Mang lại giải pháp an cư và không gian sống đẳng cấp, an toàn tuyệt đối cho khách hàng; áp dụng kỹ thuật tiên tiến và vật liệu mới để tối ưu hiệu quả kinh tế cho đối tác; đồng hành cùng sự phát triển hạ tầng đô thị hiện đại của quốc gia.",
  },
  {
    title: "Giá trị cốt lõi",
    description:
      "Uy tín — Chất lượng — Đột phá — Bền vững: bốn giá trị nền tảng cho mọi hoạt động đầu tư, xây dựng và hợp tác của Thiên Đức.",
  },
];

export const aboutFields = businessFields;

export const aboutContactCta = {
  eyebrow: "Kết nối với Thiên Đức",
  title: "Trao đổi về dự án, hợp tác hoặc nhu cầu tư vấn",
  description:
    "Đội ngũ Thiên Đức sẵn sàng tiếp nhận thông tin từ khách hàng, đối tác và các bên quan tâm đến định hướng phát triển dự án.",
  primaryCta: {
    label: "Xem dự án",
    href: routes.projects,
  },
  secondaryCta: {
    label: "Liên hệ",
    href: routes.contact,
  },
};
