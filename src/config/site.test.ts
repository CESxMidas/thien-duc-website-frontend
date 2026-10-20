
import {
  brandShortName,
  displayAddress,
  displayPhoneNumbers,
  legalInfo,
  localizeAuthor,
  siteConfig,
} from "./site";

describe("official company information", () => {
  it("uses the verified legal identity and contact details", () => {
    expect(siteConfig.name).toBe(
      "CÔNG TY TNHH ĐẦU TƯ XÂY DỰNG THƯƠNG MẠI THIÊN ĐỨC",
    );
    expect(legalInfo.taxCode).toBe("0309910290");
    expect(siteConfig.email).toBe("dautuxaydungthienduc@yahoo.com");
    expect(displayPhoneNumbers()).toBe("(028) 3740 7188 / 0909 768 001");
    expect(displayAddress("vi")).toBe(
      "Số 10 Trần Não, KP5, P. Bình Trưng, TP. Hồ Chí Minh, Việt Nam",
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
