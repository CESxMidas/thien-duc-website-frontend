import { siteConfig } from "@/config/site";

/**
 * Khung trang tuyển dụng (câu 4: "dựng khung trước khi đưa dữ liệu chính").
 *
 * `openPositions` **cố ý để rỗng** — công ty chưa cung cấp vị trí, mô tả công
 * việc, quyền lợi hay hạn nộp. Trang render trạng thái "chưa có vị trí" thay vì
 * bịa tin tuyển dụng. Khi có dữ liệu thật, đổ vào mảng này là trang tự hiện.
 */

export type OpenPosition = {
  title: string;
  department: string;
  location: string;
  type: string;
  /** ISO date `YYYY-MM-DD`. */
  deadline?: string;
  responsibilities: string[];
  requirements: string[];
};

export const careersHero = {
  eyebrow: "Tuyển dụng",
  title: "Cơ hội nghề nghiệp tại Thiên Đức",
  description:
    "Thiên Đức tìm kiếm những cộng sự cùng chia sẻ giá trị Uy tín — Chất lượng — Đột phá — Bền vững để đồng hành trong các dự án đầu tư, xây dựng và phát triển đô thị.",
};

export const careersValues = [
  {
    title: "Môi trường chuyên môn",
    description:
      "Làm việc cùng đội ngũ chuyên gia, kiến trúc sư và kỹ sư nhiều năm kinh nghiệm trong ngành xây dựng.",
  },
  {
    title: "Dự án thực tế quy mô lớn",
    description:
      "Tham gia các dự án khu đô thị, chung cư cao tầng và hạ tầng kỹ thuật từ giai đoạn đầu tới khi bàn giao.",
  },
  {
    title: "Cập nhật liên tục",
    description:
      "Đội ngũ được đào tạo chuyên sâu và cập nhật thường xuyên pháp luật xây dựng hiện hành.",
  },
];

export const careersProcess = [
  {
    step: "01",
    title: "Gửi hồ sơ",
    description: `Gửi CV và thư ứng tuyển về ${siteConfig.email}, ghi rõ vị trí ứng tuyển ở tiêu đề email.`,
  },
  {
    step: "02",
    title: "Sàng lọc",
    description:
      "Bộ phận nhân sự xem xét hồ sơ và liên hệ lại với ứng viên phù hợp trong vòng 7 ngày làm việc.",
  },
  {
    step: "03",
    title: "Phỏng vấn",
    description:
      "Trao đổi chuyên môn với trưởng bộ phận, sau đó là vòng thống nhất điều kiện làm việc.",
  },
];

export const openPositions: OpenPosition[] = [];
