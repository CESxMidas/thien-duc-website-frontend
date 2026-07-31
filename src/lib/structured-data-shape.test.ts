/**
 * THIEN-DUC-OPTIONAL-BACKLOG-REPO-WORK-M1 — kiểm **hình dạng** dữ liệu có cấu
 * trúc (backlog §6, mục G4-c "validator.schema.org xác nhận Organization").
 *
 * Test này KHÔNG thay cho validator ngoài của Google/schema.org — nó khoá những
 * bất biến mà validator hay bắt lỗi, để một thay đổi vô ý không âm thầm phá
 * structured data giữa hai lần kiểm thủ công:
 *   - JSON hợp lệ sau khi qua `serializeJsonLd` (không vỡ vì `<`, `</script>`)
 *   - `@context` / `@type` đúng
 *   - `@id` ổn định (không đổi theo locale) — Google dùng nó để nối thực thể
 *   - mọi URL là tuyệt đối
 *   - KHÔNG có giá trị giữ chỗ / bịa (lorem, example.com, TODO, CHANGEME…)
 *   - song ngữ đổi đúng phần được phép đổi
 *
 * `BreadcrumbList` KHÔNG lặp lại ở đây: nó được dựng bên trong component
 * `Breadcrumb` và đã có test riêng (`components/ui/breadcrumb.test.tsx`) —
 * export nội bộ ra chỉ để test là lộ ruột component không cần thiết.
 *
 * Các loại mở rộng (`RealEstateListing`, `Product`, `LocalBusiness`, `sameAs`)
 * CỐ Ý chưa cài: repo không có giá/offer, giờ mở cửa, toạ độ hay URL mạng xã
 * hội thật. Bảng dữ liệu còn thiếu nằm trong báo cáo phiên.
 */
import { buildNewsArticleJsonLd, buildOrganizationJsonLd } from "@/lib/seo";
import { serializeJsonLd } from "@/lib/json-ld";
import type { NewsPost } from "@/types/content";

/** Giá trị giữ chỗ hay lọt vào structured data khi copy mẫu. */
const PLACEHOLDER_PATTERNS = [
  /lorem\s*ipsum/i,
  /example\.(com|org|net)/i,
  /\bTODO\b/,
  /\bTBD\b/,
  /CHANGEME/i,
  /your-?(site|company|domain)/i,
  /\bfoo\b|\bbar\b/i,
  /xxx+/i,
];

/** Gom mọi giá trị chuỗi trong một object lồng nhau. */
function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, out));
  else if (value && typeof value === "object") {
    Object.values(value as Record<string, unknown>).forEach((item) => collectStrings(item, out));
  }
  return out;
}

/** Gom mọi giá trị trông như URL/đường dẫn. */
function collectUrlish(value: unknown): string[] {
  return collectStrings(value).filter(
    (s) => s.startsWith("http") || s.startsWith("/") || /^www\./.test(s),
  );
}

const samplePost: NewsPost = {
  slug: "bai-viet-mau",
  title: "Tiêu đề bài viết mẫu",
  summary: "Tóm tắt bài viết mẫu dùng cho test hình dạng.",
  image: "/images/news/anh.jpg",
  publishedAt: "2026-07-31T03:00:00.000Z",
  author: "Ban biên tập",
} as NewsPost;

const payloads = [
  ["Organization (vi)", buildOrganizationJsonLd("vi")],
  ["Organization (en)", buildOrganizationJsonLd("en")],
  ["NewsArticle (vi)", buildNewsArticleJsonLd(samplePost, "vi")],
  ["NewsArticle (en)", buildNewsArticleJsonLd(samplePost, "en")],
] as const;

describe("Structured data — bất biến hình dạng", () => {
  it.each(payloads)("%s: qua serializeJsonLd vẫn là JSON hợp lệ", (_label, payload) => {
    const serialized = serializeJsonLd(payload);
    expect(() => JSON.parse(serialized)).not.toThrow();
    expect(JSON.parse(serialized)).toEqual(payload);
  });

  it.each(payloads)("%s: có @context schema.org đúng", (_label, payload) => {
    expect(payload["@context"]).toBe("https://schema.org");
  });

  it.each(payloads)("%s: mọi URL đều TUYỆT ĐỐI (https/http đầy đủ)", (_label, payload) => {
    const relative = collectUrlish(payload).filter((url) => !/^https?:\/\//.test(url));
    expect(relative).toEqual([]);
  });

  it.each(payloads)("%s: KHÔNG chứa giá trị giữ chỗ / bịa", (_label, payload) => {
    const offenders = collectStrings(payload).filter((text) =>
      PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(text)),
    );
    expect(offenders).toEqual([]);
  });

  it.each(payloads)("%s: không field nào rỗng / null / undefined", (_label, payload) => {
    const empty = Object.entries(payload)
      .filter(
        ([, value]) =>
          value === undefined ||
          value === null ||
          (typeof value === "string" && value.trim() === ""),
      )
      .map(([key]) => key);
    expect(empty).toEqual([]);
  });
});

describe("Organization — field bắt buộc và @id ổn định", () => {
  const vi = buildOrganizationJsonLd("vi");
  const en = buildOrganizationJsonLd("en");

  it("@type là Organization (KHÔNG phải LocalBusiness — thiếu geo/openingHours)", () => {
    expect(vi["@type"]).toBe("Organization");
  });

  it("@id giống hệt nhau ở cả hai locale — Google nối cùng một thực thể", () => {
    expect(vi["@id"]).toBe(en["@id"]);
    expect(String(vi["@id"])).toMatch(/^https?:\/\//);
  });

  it.each(["name", "url", "logo", "email", "telephone", "address"])(
    "có field bắt buộc/khuyến nghị: %s",
    (field) => {
      expect(vi[field]).toBeTruthy();
    },
  );

  it("foundingDate là ISO 8601 (yyyy-mm-dd), không phải dd/mm/yyyy", () => {
    expect(vi.foundingDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("address là PostalAddress có quốc gia VN", () => {
    const address = vi.address as Record<string, unknown>;
    expect(address["@type"]).toBe("PostalAddress");
    expect(address.addressCountry).toBe("VN");
    expect(address.streetAddress).toBeTruthy();
  });

  it("CỐ Ý không có sameAs / openingHours / geo / priceRange (chưa có dữ liệu thật)", () => {
    for (const field of ["sameAs", "openingHours", "geo", "priceRange", "aggregateRating"]) {
      expect(vi).not.toHaveProperty(field);
    }
  });

  it("tên hiển thị đổi theo locale nhưng danh tính (@id/url/taxID) thì không", () => {
    expect(vi.url).toBe(en.url);
    expect(vi.taxID).toBe(en.taxID);
    expect(vi.logo).toBe(en.logo);
  });
});

describe("NewsArticle — khớp nội dung thật, không bịa", () => {
  const article = buildNewsArticleJsonLd(samplePost, "vi");

  it("headline/description lấy đúng từ bài viết", () => {
    expect(article.headline).toBe(samplePost.title);
    expect(article.description).toBe(samplePost.summary);
  });

  it("publisher trỏ tới Organization qua @id (không lặp lại toàn bộ)", () => {
    expect(article.publisher).toEqual({ "@id": buildOrganizationJsonLd("vi")["@id"] });
  });

  it("có tác giả → Person; không tác giả → quy về Organization", () => {
    expect(article.author).toEqual({ "@type": "Person", name: "Ban biên tập" });
    const anonymous = buildNewsArticleJsonLd(
      { slug: samplePost.slug, title: samplePost.title, summary: samplePost.summary } as NewsPost,
      "vi",
    );
    expect(anonymous.author).toEqual({ "@id": buildOrganizationJsonLd("vi")["@id"] });
  });

  it("mainEntityOfPage khác nhau giữa vi và en (đúng canonical từng bản)", () => {
    const en = buildNewsArticleJsonLd(samplePost, "en");
    expect(article.mainEntityOfPage).not.toEqual(en.mainEntityOfPage);
  });

  it("bài không có ảnh/ngày thì BỎ HẲN field, không để null", () => {
    const bare = buildNewsArticleJsonLd(
      { slug: samplePost.slug, title: samplePost.title, summary: samplePost.summary } as NewsPost,
      "vi",
    );
    expect(bare).not.toHaveProperty("image");
    expect(bare).not.toHaveProperty("datePublished");
  });
});

describe("Chống XSS breakout trong JSON-LD", () => {
  const hostile = {
    ...samplePost,
    title: 'BREAKOUT</script><img src=x onerror=alert(1)>',
    summary: "Ký tự nguy hiểm: < > &    ",
  } as NewsPost;

  const serialized = serializeJsonLd(buildNewsArticleJsonLd(hostile, "vi"));

  it("không còn chuỗi `</script` thô trong output", () => {
    expect(serialized.toLowerCase()).not.toContain("</script");
  });

  it.each(["<", ">", " ", " "])("ký tự %j được escape, không xuất hiện thô", (ch) => {
    expect(serialized).not.toContain(ch);
  });

  it("vẫn là JSON hợp lệ và round-trip nguyên văn tiêu đề", () => {
    const parsed = JSON.parse(serialized) as { headline: string };
    expect(parsed.headline).toBe(hostile.title);
  });
});
