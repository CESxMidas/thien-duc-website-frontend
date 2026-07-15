export const homeHero = {
  eyebrow: "Công ty Thiên Đức",
  title: "Đầu tư – Xây dựng – Phát triển bất động sản bền vững",
  description:
    'Thành lập năm 2010, Công ty TNHH Đầu tư – Xây dựng – Thương mại Thiên Đức hoạt động trong lĩnh vực bất động sản, đầu tư xây dựng và phát triển đô thị. Với phương châm "Khách hàng hài lòng — Thiên Đức thành công", doanh nghiệp tập trung vào tiến độ, chất lượng thực thi và giá trị sử dụng lâu dài cho từng dự án.',
  primaryCta: {
    label: "Xem dự án",
    href: "/du-an",
  },
  secondaryCta: {
    label: "Liên hệ tư vấn",
    href: "/lien-he",
  },
};

export const homeStrengths = [
  {
    title: "Đầu tư & phát triển",
    description:
      "Tìm kiếm, đầu tư và phát triển các dự án có định hướng rõ ràng về quy hoạch, tiện ích và khả năng khai thác.",
  },
  {
    title: "Hợp tác chiến lược",
    description:
      "Kết nối cùng đối tác để mở rộng năng lực triển khai, tối ưu nguồn lực và tạo giá trị bền vững.",
  },
  {
    title: "Dự án tiêu biểu",
    description:
      "Khu đô thị Hưng Phú là dự án trọng điểm, thể hiện định hướng phát triển đô thị tại Bến Tre.",
  },
  {
    title: "Cam kết thực thi",
    description:
      "Theo sát tiến độ, chất lượng xây dựng và thông tin minh bạch trong quá trình phát triển dự án.",
  },
];

/**
 * Dự án hợp tác — khối riêng ở trang chủ (chuyển từ danh mục "Dự án tiêu biểu"
 * cũ ở trang Giới thiệu). Đây là các dự án Thiên Đức đồng phát triển cùng đối
 * tác quốc tế, **không** nằm trong danh mục `/du-an` (do Thiên Đức làm chủ đầu
 * tư) nên không có trang chi tiết. Ảnh do đối tác (CapitaLand) giữ bản quyền —
 * thẻ hiển thị bằng thông tin thay vì mượn ảnh dự án khác.
 */
export const homeCooperationIntro = {
  eyebrow: "Dự án hợp tác",
  title: "Đồng hành cùng đối tác phát triển bất động sản quốc tế",
  description:
    "Giai đoạn 2014 – 2018, Thiên Đức hợp tác chiến lược cùng Tập đoàn CapitaLand (Singapore), đồng chủ đầu tư và bàn giao các tổ hợp căn hộ cao cấp chuẩn quốc tế tại TP.HCM.",
};

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

export const homeFeaturedProjectCopy = {
  "khu-do-thi-hung-phu": {
    title: "Khu đô thị Hưng Phú",
    location: "Bến Tre",
    summary:
      "Dự án đô thị tiêu biểu của Thiên Đức, đang được triển khai với định hướng hạ tầng đồng bộ và không gian sống bền vững.",
  },
};

export const homeContactCta = {
  eyebrow: "Liên hệ Thiên Đức",
  title: "Trao đổi về dự án, hợp tác hoặc nhu cầu tư vấn",
  description:
    "Đội ngũ Thiên Đức sẵn sàng tiếp nhận thông tin từ khách hàng, đối tác và các bên quan tâm đến dự án.",
};
