/**
 * `searchSafe` là ranh giới giữa "từ khóa xấu / API hỏng" và giao diện.
 *
 * Hai hành vi quan trọng nhất được khoá ở đây:
 * - Từ khóa không hợp lệ **không được gọi mạng** (trước đây 1 ký tự vẫn đi tới
 *   nhánh trả mảng rỗng và hiển thị y như "không tìm thấy bài viết nào").
 * - Lỗi API **không được ném ra ngoài** — ném ra là cả trang rơi vào error
 *   boundary chung, mất luôn header/footer.
 */
import {
  MAX_SEARCH_LENGTH,
  MIN_SEARCH_LENGTH,
  searchSafe,
} from "@/lib/api/search";
import { apiFetch } from "@/lib/api/client";

jest.mock("@/lib/api/client", () => ({
  apiFetch: jest.fn(),
}));

const mockedApiFetch = apiFetch as jest.MockedFunction<typeof apiFetch>;

beforeEach(() => {
  mockedApiFetch.mockReset();
});

describe("searchSafe", () => {
  it("từ khóa 1 ký tự → invalid/too-short, KHÔNG gọi API", async () => {
    await expect(searchSafe("a", "vi", "news")).resolves.toEqual({
      status: "invalid",
      reason: "too-short",
    });
    expect(mockedApiFetch).not.toHaveBeenCalled();
  });

  it("từ khóa chỉ có khoảng trắng cũng là too-short", async () => {
    await expect(searchSafe("   ", "vi", "news")).resolves.toEqual({
      status: "invalid",
      reason: "too-short",
    });
    expect(mockedApiFetch).not.toHaveBeenCalled();
  });

  it("từ khóa vượt 200 ký tự → invalid/too-long, KHÔNG gọi API", async () => {
    await expect(
      searchSafe("x".repeat(MAX_SEARCH_LENGTH + 1), "vi", "news"),
    ).resolves.toEqual({ status: "invalid", reason: "too-long" });
    expect(mockedApiFetch).not.toHaveBeenCalled();
  });

  it("đúng ngưỡng tối thiểu và tối đa vẫn được gọi API", async () => {
    mockedApiFetch.mockResolvedValue({ query: "", projects: [], news: [] });

    await searchSafe("x".repeat(MIN_SEARCH_LENGTH), "vi", "news");
    await searchSafe("x".repeat(MAX_SEARCH_LENGTH), "vi", "news");

    expect(mockedApiFetch).toHaveBeenCalledTimes(2);
  });

  it("API ném lỗi → trả status error thay vì để lỗi nổi lên error boundary", async () => {
    mockedApiFetch.mockRejectedValue(new Error("ECONNREFUSED"));

    await expect(searchSafe("Hưng Phú", "vi", "news")).resolves.toEqual({
      status: "error",
    });
  });

  it("gọi được thì trả ok — kể cả khi không có bản ghi nào khớp", async () => {
    mockedApiFetch.mockResolvedValue({ query: "abc", projects: [], news: [] });

    await expect(searchSafe("abc", "vi", "news")).resolves.toEqual({
      status: "ok",
      results: { projects: [], news: [] },
    });
  });
});
