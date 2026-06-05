export type BusinessField = {
  title: string;
  code: string;
  description: string;
};

/** Nhóm theo mục tiêu hoạt động và ngành nghề kinh doanh đã đăng ký (Điều 4). */
export const businessFields: BusinessField[] = [
  {
    title: "Kinh doanh bất động sản",
    code: "6810",
    description:
      "Kinh doanh bất động sản, quyền sử dụng đất thuộc sở hữu, chủ sử dụng hoặc đi thuê; cho thuê văn phòng, nhà xưởng.",
  },
  {
    title: "Xây dựng công trình",
    code: "4100–4330",
    description:
      "Xây dựng nhà các loại; công trình đường bộ và giao thông; công trình kỹ thuật dân dụng; chuẩn bị mặt bằng; hoàn thiện công trình xây dựng.",
  },
  {
    title: "Kiến trúc & tư vấn kỹ thuật",
    code: "7110",
    description:
      "Giám sát công tác xây dựng và hoàn thiện công trình dân dụng, công nghiệp; thiết kế kết cấu công trình xây dựng dân dụng và công nghiệp.",
  },
  {
    title: "Thương mại vật tư – thiết bị",
    code: "4659–4662",
    description:
      "Bán buôn sắt, thép; máy móc, thiết bị và phụ tùng máy khai khoáng, xây dựng.",
  },
  {
    title: "Vận tải hàng hóa",
    code: "4933–5022",
    description:
      "Vận tải hàng hóa bằng đường bộ và đường thủy nội địa.",
  },
  {
    title: "Đóng tàu & cấu kiện nổi",
    code: "3011",
    description:
      "Đóng tàu và cấu kiện nổi theo ngành nghề đăng ký (không hoạt động tại trụ sở).",
  },
];
