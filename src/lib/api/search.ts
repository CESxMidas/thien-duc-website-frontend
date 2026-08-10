import type { NewsPost, Project } from "@/types/content";
import { apiFetch } from "@/lib/api/client";
import { mapNewsPost, mapProject } from "@/lib/api/mappers";
import type { NewsPostDto, ProjectDto } from "@/lib/api/types";
import type { Locale } from "@/lib/i18n/config";

export type SearchScope = "all" | "projects" | "news";

export type SearchResults = {
  projects: Project[];
  news: NewsPost[];
};

type SearchResponseDto = {
  query: string;
  projects: ProjectDto[];
  news: NewsPostDto[];
};

/** Backend từ chối từ khóa dưới 2 ký tự (`SearchQueryDto`). */
export const MIN_SEARCH_LENGTH = 2;

/**
 * Backend cũng chặn từ khóa trên 200 ký tự (`@MaxLength(200)` trong
 * `SearchQueryDto`) và trả **400**. Giữ hằng số này khớp với backend để chặn
 * ngay ở client: gửi lên rồi để 400 ném ra sẽ làm sập cả trang vào error
 * boundary — dán nhầm một đoạn văn dài là website trông như hỏng.
 */
export const MAX_SEARCH_LENGTH = 200;

/**
 * Kết quả của một lượt tìm kiếm, phân biệt rõ ba tình huống mà giao diện phải
 * nói khác nhau:
 * - `ok`      — gọi được API (kể cả khi không có bản ghi nào khớp).
 * - `invalid` — từ khóa không đạt hợp đồng của backend; **không gọi mạng**.
 * - `error`   — API không phản hồi hoặc trả lỗi.
 *
 * Trước đây cả ba đều đổ về cùng một chỗ: từ khóa 1 ký tự bị hiển thị y như
 * "không tìm thấy bài viết nào", còn lỗi API thì thay nguyên trang bằng màn
 * hình lỗi chung.
 */
export type SearchOutcome =
  | { status: "ok"; results: SearchResults }
  | { status: "invalid"; reason: "too-short" | "too-long" }
  | { status: "error" };

/**
 * Tìm kiếm full-text phía server (`GET /search`, YC-10). Kết quả đã xếp theo
 * `ts_rank` — giữ nguyên thứ tự backend trả về, không sắp lại ở client.
 */
export async function search(
  query: string,
  locale: Locale,
  scope: SearchScope = "all",
): Promise<SearchResults> {
  const trimmed = query.trim();
  if (trimmed.length < MIN_SEARCH_LENGTH) {
    return { projects: [], news: [] };
  }

  const params = new URLSearchParams({ q: trimmed, type: scope });
  const data = await apiFetch<SearchResponseDto>(`/search?${params}`);

  return {
    projects: data.projects.map((dto) => mapProject(dto, locale)),
    news: data.news.map((dto) => mapNewsPost(dto, locale)),
  };
}

/**
 * Bản bọc **không ném lỗi** của `search()` — dành cho trang render phía server
 * muốn hiện trạng thái lỗi ngay trong nội dung thay vì để cả trang rơi vào
 * `error.tsx`.
 *
 * Chỉ nuốt lỗi của **lượt gọi tìm kiếm**: mọi thứ khác trên trang (header,
 * footer, danh sách) vẫn render bình thường, và lỗi lập trình ở nơi khác vẫn
 * nổi lên error boundary như cũ.
 */
export async function searchSafe(
  query: string,
  locale: Locale,
  scope: SearchScope = "all",
): Promise<SearchOutcome> {
  const trimmed = query.trim();
  if (trimmed.length < MIN_SEARCH_LENGTH) {
    return { status: "invalid", reason: "too-short" };
  }
  if (trimmed.length > MAX_SEARCH_LENGTH) {
    return { status: "invalid", reason: "too-long" };
  }

  try {
    return { status: "ok", results: await search(trimmed, locale, scope) };
  } catch {
    return { status: "error" };
  }
}
