/**
 * Tuần tự hóa JSON-LD an toàn cho ngữ cảnh `<script>`.
 *
 * **Lỗ hổng đã sửa (AUDIT-M2 / XSS-01):** trước đây JSON-LD được nhúng bằng
 * `dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}`. `JSON.stringify`
 * KHÔNG escape `<` và `/`, nên chỉ cần một tiêu đề tin do CMS nhập chứa
 * `</script><img src=x onerror=...>` là trình duyệt đóng sớm thẻ script rồi phân
 * giải phần còn lại **thành HTML thật** → XSS lưu trữ trên trang công khai. Đã
 * tái hiện được: khối `NewsArticle` bị cắt ở `"headline":"BREAKOUT` và thẻ
 * `<img src=x onerror=alert(1)>` xuất hiện nguyên vẹn trong DOM.
 *
 * Bản sửa escape các ký tự có thể thoát khỏi ngữ cảnh script sang dạng `\uXXXX`:
 *
 * | Ký tự | Vì sao |
 * |---|---|
 * | `<` | chặn `</script>` (đóng thẻ sớm) và `<!--` (mở comment HTML) |
 * | `>` | chặn `-->` khép comment, phòng thêm một lớp |
 * | `&` | chặn biến thể tham chiếu thực thể HTML |
 * | U+2028 / U+2029 | là ký tự ngắt dòng trong JS, làm hỏng cú pháp script |
 *
 * `\uXXXX` vẫn là **JSON hợp lệ**: mọi parser (kể cả Google) giải mã lại đúng ký
 * tự gốc, nên structured data không đổi nghĩa — chỉ khác cách biểu diễn.
 *
 * Đây là escape phía **server** (các component nhúng JSON-LD đều là Server
 * Component), không phụ thuộc JS phía client.
 */
const LINE_SEPARATOR = String.fromCharCode(0x2028);
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029);

/**
 * Dau backslash dung String.fromCharCode(92): viet "\\u003c" truc tiep trong
 * nguon rat de bi hieu nham thanh escape Unicode (khi do map se thanh
 * "<" -> "<", tuc KHONG escape gi ca - da dinh dung bay nay mot lan).
 */
const BACKSLASH = String.fromCharCode(92);

const ESCAPES: Record<string, string> = {
  "<": BACKSLASH + "u003c",
  ">": BACKSLASH + "u003e",
  "&": BACKSLASH + "u0026",
  [LINE_SEPARATOR]: BACKSLASH + "u2028",
  [PARAGRAPH_SEPARATOR]: BACKSLASH + "u2029",
};

const UNSAFE = new RegExp(
  "[<>&" + LINE_SEPARATOR + PARAGRAPH_SEPARATOR + "]",
  "g",
);

/** Chuoi JSON da an toan de dat truc tiep vao than script ld+json. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(UNSAFE, (char) => ESCAPES[char] ?? char);
}
