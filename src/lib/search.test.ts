import { getSearchQuery, hasBlankSearchParam } from "@/lib/search";
import { interpolate, type Dictionary } from "@/lib/i18n/get-dictionary";
import enDictionary from "@/lib/i18n/dictionaries/en.json";
import viDictionary from "@/lib/i18n/dictionaries/vi.json";

describe("getSearchQuery", () => {
  it("cắt khoảng trắng hai đầu", () => {
    expect(getSearchQuery("  Hưng Phú  ")).toBe("Hưng Phú");
  });

  it("lấy giá trị đầu khi `?q=` xuất hiện nhiều lần", () => {
    expect(getSearchQuery(["a", "b"])).toBe("a");
  });

  it("không có `?q=` → chuỗi rỗng", () => {
    expect(getSearchQuery(undefined)).toBe("");
  });
});

describe("hasBlankSearchParam", () => {
  it("phân biệt 'không có ?q=' với '?q= rỗng'", () => {
    // Không có tham số: đây là trang tin bình thường, không phải lượt tìm kiếm.
    expect(hasBlankSearchParam(undefined)).toBe(false);
    // Có tham số nhưng rỗng: URL nói đã tìm, nội dung lại là danh sách đầy đủ →
    // trang phải chuyển hướng về URL sạch.
    expect(hasBlankSearchParam("")).toBe(true);
    expect(hasBlankSearchParam("   ")).toBe(true);
  });

  it("từ khóa thật thì không phải rỗng", () => {
    expect(hasBlankSearchParam("a")).toBe(false);
    expect(hasBlankSearchParam(["", "b"])).toBe(true);
  });
});

describe("câu chữ đếm kết quả tìm kiếm", () => {
  const vi = (viDictionary as unknown as Dictionary).news;
  const en = (enDictionary as unknown as Dictionary).news;

  it("điền đủ cả số lượng lẫn từ khóa ở hai ngôn ngữ", () => {
    expect(
      interpolate(vi.searchCountMany, { count: "4", query: "Hưng Phú" }),
    ).toBe("Hiển thị 4 kết quả cho “Hưng Phú”");
    expect(
      interpolate(en.searchCountMany, { count: "4", query: "Hung Phu" }),
    ).toBe("Showing 4 results for “Hung Phu”");
  });

  it("tách riêng chuỗi số ít để tiếng Anh không ra 'Showing 1 results'", () => {
    expect(interpolate(en.searchCountOne, { query: "Hung Phu" })).toBe(
      "Showing 1 result for “Hung Phu”",
    );
    expect(en.searchCountOne).not.toContain("{count}");
  });

  it("KHÔNG hứa hẹn tổng số toàn site — API chặn ở 20 bản ghi", () => {
    // Câu chữ phải là "hiển thị N", không phải "tìm thấy N".
    expect(vi.searchCountMany).toMatch(/^Hiển thị /);
    expect(en.searchCountMany).toMatch(/^Showing /);
  });
});
