import { brandShortName, localizeAuthor, siteConfig } from "./site";

describe("official company information", () => {
  it("uses the verified legal identity and contact details", () => {
    expect(siteConfig.name).toBe(
      "CÔNG TY TNHH ĐẦU TƯ XÂY DỰNG THƯƠNG MẠI THIÊN ĐỨC",
    );
  });
});

describe("localizeAuthor", () => {
  it("thương hiệu site: /vi giữ 'Thiên Đức', /en đổi 'Thien Duc'", () => {
    expect(localizeAuthor("Thiên Đức", "vi")).toBe("Thiên Đức");
    expect(localizeAuthor("Thiên Đức", "en")).toBe("Thien Duc");
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
