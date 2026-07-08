export type InquiryType = {
  id: string;
  title: string;
  description: string;
};

export const contactHero = {
  eyebrow: "Liên hệ",
  title: "Kết nối với Thiên Đức",
  description:
    "Thông tin liên hệ chính thức dành cho khách hàng, đối tác và các bên quan tâm đến hoạt động của Thiên Đức.",
};

export const contactIntro = {
  eyebrow: "Thông tin liên hệ",
  title: "Chọn kênh liên hệ phù hợp",
  description:
    "Bạn có thể gọi, gửi email hoặc xem vị trí văn phòng trước khi gửi thông tin tư vấn chi tiết.",
};

export const inquiryTypes: InquiryType[] = [
  {
    id: "tu-van-du-an",
    title: "Tư vấn dự án",
    description:
      "Trao đổi thông tin tổng quan về dự án, nhu cầu tư vấn hoặc lịch hẹn làm việc.",
  },
  {
    id: "hop-tac-phat-trien",
    title: "Hợp tác phát triển",
    description:
      "Kết nối với Thiên Đức về định hướng hợp tác, phát triển dự án hoặc đối tác triển khai.",
  },
  {
    id: "thong-tin-doanh-nghiep",
    title: "Thông tin doanh nghiệp",
    description:
      "Gửi yêu cầu liên quan đến hoạt động công ty, hồ sơ năng lực hoặc thông tin truyền thông.",
  },
];

export const contactProcess = [
  {
    step: "01",
    title: "Tiếp nhận",
    description: "Ghi nhận thông tin từ form, điện thoại hoặc email.",
  },
  {
    step: "02",
    title: "Phân loại",
    description: "Chuyển nội dung đến bộ phận phụ trách phù hợp.",
  },
  {
    step: "03",
    title: "Phản hồi",
    description:
      "Liên hệ lại theo nội dung và thông tin bạn cung cấp.",
  },
];

export const contactFormCopy = {
  eyebrow: "Gửi yêu cầu",
  title: "Gửi thông tin tư vấn",
  description:
    "Điền nội dung cần trao đổi, yêu cầu sẽ được gửi trực tiếp đến bộ phận phụ trách của Thiên Đức.",
  note:
    "Thông tin của bạn chỉ dùng để phản hồi yêu cầu này và được bảo mật theo quy định.",
  submitLabel: "Gửi yêu cầu",
  fields: {
    name: "Họ và tên",
    phone: "Số điện thoại",
    email: "Email",
    inquiry: "Nội dung cần trao đổi",
    message: "Nội dung yêu cầu",
  },
};

export const contactMap = {
  eyebrow: "Vị trí văn phòng",
  title: "Trụ sở Công ty Thiên Đức",
  description:
    "Bạn có thể xem vị trí trên bản đồ hoặc liên hệ trước để sắp xếp lịch làm việc phù hợp.",
  ctaLabel: "Mở Google Maps",
};

export const contactCta = {
  eyebrow: "Dự án Thiên Đức",
  title: "Quan tâm dự án trước khi liên hệ?",
  description:
    "Xem danh mục dự án và thông tin tổng quan để trao đổi nhanh hơn với đội ngũ tư vấn.",
  primaryLabel: "Xem danh sách dự án",
  primaryHref: "/du-an",
  secondaryLabel: "Giới thiệu công ty",
  secondaryHref: "/gioi-thieu",
};
