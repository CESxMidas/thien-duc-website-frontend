import { routes } from "@/lib/routes";

export const aboutHero = {
  eyebrow: "Giới thiệu",
  title: "Tổng quan về Công ty Thiên Đức",
  description:
    "Công ty TNHH Đầu tư - Xây dựng - Thương mại Thiên Đức được thành lập năm 2010, hoạt động trong lĩnh vực đầu tư, xây dựng, thương mại và phát triển bất động sản tại TP.HCM và các tỉnh.",
};

export const aboutOverview = {
  eyebrow: "Tổng quan doanh nghiệp",
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
      "Phát triển các không gian sống và dự án có giá trị sử dụng lâu dài, đóng góp tích cực cho đô thị và cộng đồng.",
  },
  {
    title: "Sứ mệnh",
    description:
      "Đồng hành cùng khách hàng, đối tác và cộng đồng thông qua các dự án minh bạch, chất lượng và có định hướng thực thi rõ ràng.",
  },
  {
    title: "Giá trị cốt lõi",
    description:
      "Uy tín, minh bạch, chất lượng và hợp tác bền vững là các giá trị Thiên Đức theo đuổi trong quá trình phát triển.",
  },
];

export const aboutFields = [
  {
    title: "Đầu tư và phát triển bất động sản",
    description:
      "Nghiên cứu, đầu tư và phát triển các dự án nhà ở, khu đô thị và sản phẩm bất động sản gắn với nhu cầu sử dụng thực tế.",
  },
  {
    title: "Xây dựng và triển khai công trình",
    description:
      "Tổ chức triển khai hạ tầng, công trình dân dụng và các hạng mục xây dựng với trọng tâm là tiến độ, chất lượng và kiểm soát thực thi.",
  },
  {
    title: "Hợp tác phát triển dự án",
    description:
      "Kết nối nguồn lực với đối tác phù hợp để mở rộng năng lực triển khai và tối ưu giá trị dài hạn cho từng dự án.",
  },
  {
    title: "Thương mại và phân phối sản phẩm",
    description:
      "Đồng hành trong hoạt động giới thiệu, phân phối và kết nối khách hàng với sản phẩm dự án phù hợp.",
  },
];

export const aboutCapability = {
  eyebrow: "Năng lực & hợp tác",
  title: "Tập trung vào tiến độ, chất lượng triển khai và phối hợp đối tác",
  description:
    "Thiên Đức tiếp cận dự án với tinh thần thận trọng, minh bạch và hướng đến giá trị dài hạn. Doanh nghiệp chú trọng phối hợp cùng đối tác trong từng giai đoạn để kiểm soát chất lượng thực thi, thông tin dự án và trải nghiệm của khách hàng.",
  cta: {
    label: "Xem dự án tiêu biểu",
    href: routes.projects,
  },
};

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
