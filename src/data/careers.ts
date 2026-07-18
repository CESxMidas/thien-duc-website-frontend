/**
 * Khung trang tuyển dụng (câu 4: "dựng khung trước khi đưa dữ liệu chính").
 *
 * `openPositions` **cố ý để rỗng** — công ty chưa cung cấp vị trí, mô tả công
 * việc, quyền lợi hay hạn nộp. Trang render trạng thái "chưa có vị trí" thay vì
 * bịa tin tuyển dụng. Khi có dữ liệu thật, đổ vào mảng này là trang tự hiện.
 *
 * Nội dung hiển thị (hero, giá trị, quy trình, nhãn UI) do **dictionary** quản
 * lý theo locale — xem `careers` trong `dictionaries/{vi,en}.json` (cùng khuôn
 * với `about`/`contact`). File này chỉ giữ **mô hình dữ liệu vị trí tuyển dụng**.
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

export const openPositions: OpenPosition[] = [];
