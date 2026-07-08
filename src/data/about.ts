import { routes } from "@/lib/routes";
import { businessFields } from "./business-fields";

export const aboutHero = {
  eyebrow: "Giới thiệu",
  title: "Tổng quan về Công ty Thiên Đức",
  description:
    "Công ty TNHH Đầu tư - Xây dựng - Thương mại Thiên Đức được thành lập năm 2010, hoạt động trong lĩnh vực đầu tư, xây dựng, thương mại và phát triển bất động sản tại TP.HCM và các tỉnh.",
};

export const aboutOverview = {
  eyebrow: "Định hướng phát triển",
  title: "Đối tác đầu tư và phát triển dự án theo hướng thận trọng, bền vững",
  paragraphs: [
    "Với định hướng phát triển thận trọng và bền vững, Thiên Đức tập trung vào các dự án có quy hoạch rõ ràng, chất lượng triển khai ổn định và giá trị sử dụng lâu dài.",
    "Doanh nghiệp xem uy tín, tiến độ và sự hài lòng của khách hàng là nền tảng cho mỗi hoạt động đầu tư, hợp tác và phát triển dự án.",
  ],
  motto: "Khách hàng hài lòng - Thiên Đức thành công",
};

export const aboutPrinciples = [
  {
    title: "Tầm nhìn",
    description:
      "Trở thành thương hiệu đầu tư và xây dựng bất động sản uy tín hàng đầu Việt Nam, kiến tạo các công trình có giải pháp kiến trúc đột phá, thẩm mỹ cao và bền vững theo thời gian.",
  },
  {
    title: "Sứ mệnh",
    description:
      "Mang lại giải pháp an cư và không gian sống đẳng cấp, an toàn cho khách hàng; áp dụng kỹ thuật, vật liệu mới để tối ưu hiệu quả cho đối tác và đồng hành cùng phát triển hạ tầng đô thị.",
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
