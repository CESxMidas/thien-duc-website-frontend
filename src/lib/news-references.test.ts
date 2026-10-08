import {
  extractArticleReferences,
  splitTextByLinks,
} from "./news-references";

describe("news-references", () => {
  it("tach doan link tham khao rieng khoi noi dung bai viet", () => {
    const result = extractArticleReferences([
      "Noi dung chinh",
      "Link tham khảo: https://example.com/bai-viet",
    ]);

    expect(result.articleParagraphs).toEqual(["Noi dung chinh"]);
    expect(result.references).toEqual([
      {
        href: "https://example.com/bai-viet",
        label: "example.com",
      },
    ]);
  });

  it("nhan dien doan chi co url la link tham khao", () => {
    const result = extractArticleReferences([
      "https://example.com/a.",
      "www.thienduccons.vn/tin-tuc",
    ]);

    expect(result.articleParagraphs).toEqual([]);
    expect(result.references).toEqual([
      { href: "https://example.com/a", label: "example.com" },
      {
        href: "https://www.thienduccons.vn/tin-tuc",
        label: "thienduccons.vn",
      },
    ]);
  });

  it("giu url nam trong paragraph thuong va tach thanh segment link", () => {
    const paragraph = "Xem them tai https://example.com/bai-viet de biet them.";
    const extracted = extractArticleReferences([paragraph]);

    expect(extracted.articleParagraphs).toEqual([paragraph]);
    expect(extracted.references).toEqual([]);
    expect(splitTextByLinks(paragraph)).toEqual([
      { type: "text", text: "Xem them tai " },
      {
        type: "link",
        text: "https://example.com/bai-viet",
        href: "https://example.com/bai-viet",
      },
      { type: "text", text: " de biet them." },
    ]);
  });

  it("khong lap lai cung mot link tham khao", () => {
    const result = extractArticleReferences([
      "Nguồn: https://example.com/a",
      "Tham khảo: https://example.com/a",
    ]);

    expect(result.references).toHaveLength(1);
  });
});
