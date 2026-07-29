import { buildPageHref, clampPage, parsePageParam } from "@/lib/pagination";

/**
 * THIEN-DUC-NEWS-SLIDER-AND-PAGINATION-M1 — chuẩn hoá `?page=`.
 *
 * `null` nghĩa là "URL không chuẩn, hãy chuyển hướng"; số nghĩa là trang cần
 * render. Trang 1 cố ý trả `null` để `/tin-tuc?page=1` không tồn tại song song
 * với `/tin-tuc`.
 */
describe("parsePageParam", () => {
  it("không có tham số → trang 1", () => {
    expect(parsePageParam(undefined)).toBe(1);
  });

  it("page hợp lệ ≥ 2 → chính nó", () => {
    expect(parsePageParam("2")).toBe(2);
    expect(parsePageParam("17")).toBe(17);
  });

  it("page=1 → null (chuẩn hoá về URL không query)", () => {
    expect(parsePageParam("1")).toBeNull();
  });

  it("giá trị không hợp lệ → null", () => {
    expect(parsePageParam("0")).toBeNull();
    expect(parsePageParam("-3")).toBeNull();
    expect(parsePageParam("abc")).toBeNull();
    expect(parsePageParam("1.5")).toBeNull();
    expect(parsePageParam("")).toBeNull();
    expect(parsePageParam("  ")).toBeNull();
  });

  it("lặp tham số (?page=2&page=5) → lấy giá trị đầu", () => {
    expect(parsePageParam(["2", "5"])).toBe(2);
  });

  it("khoảng trắng thừa vẫn đọc được", () => {
    expect(parsePageParam(" 3 ")).toBe(3);
  });
});

describe("clampPage", () => {
  it("trang trong khoảng → giữ nguyên", () => {
    expect(clampPage(2, 5)).toBe(2);
  });

  it("vượt quá trang cuối → trang cuối", () => {
    expect(clampPage(99, 5)).toBe(5);
  });

  it("nhỏ hơn 1 → 1", () => {
    expect(clampPage(-4, 5)).toBe(1);
  });

  it("không có trang nào → 1", () => {
    expect(clampPage(3, 0)).toBe(1);
  });
});

describe("buildPageHref", () => {
  it("trang 1 không mang query", () => {
    expect(buildPageHref("/tin-tuc", 1)).toBe("/tin-tuc");
  });

  it("trang ≥ 2 gắn ?page=", () => {
    expect(buildPageHref("/tin-tuc", 4)).toBe("/tin-tuc?page=4");
    expect(buildPageHref("/en/tin-tuc", 2)).toBe("/en/tin-tuc?page=2");
  });
});
