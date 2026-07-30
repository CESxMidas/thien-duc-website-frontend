import { serializeJsonLd } from "./json-ld";

/**
 * AUDIT-M2 / XSS-01 — hồi quy cho lỗ hổng XSS lưu trữ đã tái hiện được.
 *
 * Tiêu đề tin do CMS nhập được nhúng vào `<script type="application/ld+json">`.
 * `JSON.stringify` không escape `<`, nên `</script>` trong tiêu đề đóng sớm thẻ
 * script và phần còn lại được phân giải thành HTML thật.
 */

const LINE_SEPARATOR = String.fromCharCode(0x2028);
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029);

describe("serializeJsonLd", () => {
  it("không để lọt chuỗi </script> nguyên vẹn (lỗ hổng gốc)", () => {
    const out = serializeJsonLd({
      headline: "BREAKOUT</script><img src=x onerror=alert(1)>",
    });
    expect(out).not.toContain("</script>");
    expect(out).not.toContain("<img");
  });

  it("escape mọi dấu < và > thành \\u003c / \\u003e", () => {
    const out = serializeJsonLd({ a: "<b>" });
    expect(out).toContain("\\u003cb\\u003e");
    expect(out).not.toContain("<");
    expect(out).not.toContain(">");
  });

  it("escape & (chặn biến thể tham chiếu thực thể)", () => {
    expect(serializeJsonLd({ a: "x&y" })).toContain("x\\u0026y");
  });

  it("escape U+2028 / U+2029 (ngắt dòng phá cú pháp JS)", () => {
    const out = serializeJsonLd({
      a: `x${LINE_SEPARATOR}y${PARAGRAPH_SEPARATOR}z`,
    });
    expect(out).toContain("\\u2028");
    expect(out).toContain("\\u2029");
    expect(out).not.toContain(LINE_SEPARATOR);
    expect(out).not.toContain(PARAGRAPH_SEPARATOR);
  });

  it("không chặn `<!--` mở comment HTML", () => {
    expect(serializeJsonLd({ a: "<!--" })).not.toContain("<!--");
  });

  it("giữ nguyên NGHĨA: JSON.parse trả lại đúng dữ liệu gốc", () => {
    const data = {
      headline: "Tiêu đề </script> có ký tự <b>&</b> đặc biệt",
      description: `dòng${LINE_SEPARATOR}mới`,
      nested: { list: ["a<b", "c>d", "e&f"] },
      số: 42,
    };
    expect(JSON.parse(serializeJsonLd(data))).toEqual(data);
  });

  it("kết quả vẫn là JSON hợp lệ với payload nguy hiểm điển hình", () => {
    const payloads = [
      "<script>alert(1)</script>",
      '<img src=x onerror=alert(1)>',
      "<svg onload=alert(1)>",
      '<a href="javascript:alert(1)">x</a>',
      '<iframe src="data:text/html,<h1>x"></iframe>',
      "<object data=x></object>",
      "<embed src=x>",
      '<style>@import "evil"</style>',
      "&lt;script&gt;alert(1)&lt;/script&gt;",
      "</SCRIPT ><img src=x onerror=alert(1)>",
      "</script\t><img src=x onerror=alert(1)>",
    ];
    for (const p of payloads) {
      const out = serializeJsonLd({ headline: p });
      expect(() => JSON.parse(out)).not.toThrow();
      expect(JSON.parse(out).headline).toBe(p);
      expect(out.toLowerCase()).not.toContain("</script");
      expect(out).not.toContain("<");
    }
  });

  it("giữ nguyên tiếng Việt có dấu (không escape quá tay)", () => {
    const out = serializeJsonLd({ a: "Khu đô thị Hưng Phú, Bến Tre" });
    expect(out).toContain("Khu đô thị Hưng Phú, Bến Tre");
  });
});
