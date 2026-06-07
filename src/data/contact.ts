export type InquiryType = {
  id: string;
  title: string;
  description: string;
};

export const contactHero = {
  eyebrow: "Liên hệ",
  title: "Kết nối với Thiên Đức",
  description:
    "Thiên Đức tiếp nhận thông tin từ khách hàng, đối tác và các bên quan tâm đến dự án, hợp tác hoặc hoạt động doanh nghiệp.",
};

export const contactIntro = {
  eyebrow: "Thông tin liên hệ",
  title: "Trao đổi trực tiếp với Thiên Đức",
  description:
    "Vui lòng chọn kênh liên hệ phù hợp hoặc gửi yêu cầu qua form. Nội dung sẽ được chuyển đến bộ phận phụ trách tương ứng.",
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
    title: "Gửi yêu cầu",
    description: "Điền form hoặc liên hệ qua điện thoại, email.",
  },
  {
    step: "02",
    title: "Tiếp nhận nội dung",
    description: "Thiên Đức chuyển thông tin đến bộ phận phụ trách phù hợp.",
  },
  {
    step: "03",
    title: "Phản hồi",
    description:
      "Đội ngũ liên hệ lại theo nội dung trao đổi và thông tin bạn cung cấp.",
  },
];

export const contactFormCopy = {
  eyebrow: "Gửi yêu cầu",
  title: "Form liên hệ",
  description:
    "Điền thông tin bên dưới. Khi gửi, hệ thống sẽ mở ứng dụng email để bạn xác nhận và gửi yêu cầu đến Thiên Đức.",
  note:
    "Trang web hiện chưa có hệ thống lưu form trực tiếp. Yêu cầu được gửi qua email đến địa chỉ công ty.",
  submitLabel: "Gửi yêu cầu qua email",
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
