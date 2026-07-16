/**
 * Test quy tắc định tuyến locale: vi mặc định KHÔNG tiền tố, en có `/en`.
 * Đây là bất biến SEO (giữ nguyên URL production) — đổi là gãy canonical/hreflang.
 */
import { isLocale, localizePath, splitLocale } from "./config";

describe("localizePath", () => {
  it("vi (mặc định) giữ nguyên đường dẫn, không tiền tố", () => {
    expect(localizePath("/du-an", "vi")).toBe("/du-an");
    expect(localizePath("/", "vi")).toBe("/");
  });

  it("en thêm tiền tố /en; trang chủ thành /en (không có / thừa)", () => {
    expect(localizePath("/du-an", "en")).toBe("/en/du-an");
    expect(localizePath("/", "en")).toBe("/en");
  });

  it("giữ nguyên query string", () => {
    expect(localizePath("/du-an?status=dang-trien-khai", "en")).toBe(
      "/en/du-an?status=dang-trien-khai",
    );
  });
});

describe("splitLocale", () => {
  it("đường dẫn không tiền tố → locale vi, path nguyên vẹn", () => {
    expect(splitLocale("/du-an")).toEqual({ locale: "vi", path: "/du-an" });
    expect(splitLocale("/")).toEqual({ locale: "vi", path: "/" });
  });

  it("tiền tố /en được tách đúng", () => {
    expect(splitLocale("/en/du-an")).toEqual({ locale: "en", path: "/du-an" });
    expect(splitLocale("/en")).toEqual({ locale: "en", path: "/" });
  });

  it("segment giống locale nhưng không phải locale → giữ nguyên", () => {
    expect(splitLocale("/english-course")).toEqual({
      locale: "vi",
      path: "/english-course",
    });
  });
});

describe("isLocale", () => {
  it("chỉ nhận vi/en", () => {
    expect(isLocale("vi")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale("")).toBe(false);
  });
});
