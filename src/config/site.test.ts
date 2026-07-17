/**
 * Test byline localizeAuthor (EN-FULL-C4): thương hiệu site đổi theo locale,
 * tên người thật + route tiếng Việt giữ nguyên, không sinh `[object Object]`.
 */
import { brandShortName, localizeAuthor } from "./site";

describe("localizeAuthor", () => {
  it("thương hiệu site: /vi giữ 'Thiên Đức', /en đổi 'Thien Duc'", () => {
    expect(localizeAuthor("Thiên Đức", "vi")).toBe("Thiên Đức");
    expect(localizeAuthor("Thiên Đức", "en")).toBe("Thien Duc");
    // Bản đồ khớp đúng nguồn brandShortName để không lệch khi đổi thương hiệu.
    expect(localizeAuthor(brandShortName.vi, "en")).toBe(brandShortName.en);
  });

  it("tên người thật giữ nguyên ở cả hai locale (không phiên âm)", () => {
    expect(localizeAuthor("Nguyễn Văn A", "vi")).toBe("Nguyễn Văn A");
    expect(localizeAuthor("Nguyễn Văn A", "en")).toBe("Nguyễn Văn A");
  });

  it("rỗng/null/undefined → undefined (không render, không [object Object])", () => {
    expect(localizeAuthor("", "en")).toBeUndefined();
    expect(localizeAuthor(null, "en")).toBeUndefined();
    expect(localizeAuthor(undefined, "vi")).toBeUndefined();
  });
});
