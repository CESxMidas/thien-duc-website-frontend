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

/**
 * `?q=` CÓ mặt nhưng rỗng/toàn khoảng trắng (`?q=`, `?q=%20%20`).
 *
 * Phân biệt với "không có `?q=`": URL nói rằng đã tìm kiếm, còn trang thì hiện
 * danh sách tin đầy đủ như chưa tìm gì — hai thông điệp trái nhau. Trang gọi
 * dùng hàm này để chuyển hướng về URL sạch thay vì giả vờ đã tìm.
 */
export function hasBlankSearchParam(
  value: string | string[] | undefined,
): boolean {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw !== undefined && raw.trim() === "";
}
