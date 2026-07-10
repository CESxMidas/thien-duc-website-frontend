/**
 * Đọc từ khóa `?q=` từ `searchParams`.
 *
 * Việc lọc kết quả nay do backend làm (`GET /search`, xem `src/lib/api/search.ts`)
 * — hàm `matchesSearchQuery` lọc phía client đã bị gỡ: nó tải toàn bộ danh sách
 * rồi mới so chuỗi, không dùng được index full-text và không xếp hạng theo độ
 * liên quan.
 */
export function getSearchQuery(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() ?? "";
}
