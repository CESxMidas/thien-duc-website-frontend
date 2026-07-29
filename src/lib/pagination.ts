/**
 * Đọc `?page=` từ `searchParams`.
 *
 * Trả về `null` khi giá trị **không phải** một số trang hợp lệ (`0`, `-2`,
 * `abc`, `1.5`, rỗng). Trang gọi sẽ chuyển hướng về URL chuẩn thay vì im lặng
 * hiển thị trang 1 dưới một URL sai — như vậy mỗi nội dung chỉ có đúng một URL.
 *
 * `?page=1` cũng trả `null`: trang đầu chuẩn hoá về URL không có query, tránh
 * hai URL cùng nội dung (`/tin-tuc` và `/tin-tuc?page=1`).
 */
export function parsePageParam(
  value: string | string[] | undefined,
): number | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === undefined) return 1;

  const trimmed = raw.trim();
  // `Number("")` là 0 chứ không phải NaN — phải chặn chuỗi rỗng trước.
  if (trimmed === "") return null;

  const parsed = Number(trimmed);
  if (!Number.isInteger(parsed) || parsed < 1) return null;
  if (parsed === 1) return null;

  return parsed;
}

/**
 * Kẹp số trang vào khoảng có thật. Yêu cầu vượt quá trang cuối trả về trang
 * cuối — người dùng (hoặc bot đi theo link cũ) thấy nội dung thật thay vì một
 * trang trắng.
 */
export function clampPage(page: number, totalPages: number): number {
  if (totalPages < 1) return 1;
  return Math.min(Math.max(page, 1), totalPages);
}

/** URL của một trang. Trang 1 không mang `?page=` (xem `parsePageParam`). */
export function buildPageHref(basePath: string, page: number): string {
  return page <= 1 ? basePath : `${basePath}?page=${page}`;
}
