/**
 * Khoá lại đúng sự cố đã làm đỏ deploy Vercel: `NEXT_PUBLIC_SITE_URL` được khai
 * báo nhưng **để trống** → base `""` → `new URL("/sitemap.xml", "")` ném
 * `TypeError: Invalid URL` khi prerender `/robots.txt`.
 *
 * Bất biến phải giữ: `resolveSiteUrl` LUÔN trả về base tuyệt đối hợp lệ, với
 * mọi hình dạng env — kể cả env rỗng hoàn toàn.
 */
import { FALLBACK_SITE_URL, resolveSiteUrl } from "./site-url";

const PROD = "https://thien-duc.example";

describe("resolveSiteUrl", () => {
  it("có NEXT_PUBLIC_SITE_URL → dùng đúng giá trị đó", () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: PROD })).toBe(PROD);
  });

  it.each(["", "   "])(
    "NEXT_PUBLIC_SITE_URL rỗng (%p) KHÔNG cho ra base rỗng — đây là lỗi build đã gặp",
    (empty) => {
      const url = resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: empty });
      expect(url).not.toBe("");
      // Điều thật sự quan trọng: chỗ gọi phía sau không được ném nữa.
      expect(new URL("/sitemap.xml", url).toString()).toBe(
        `${FALLBACK_SITE_URL}/sitemap.xml`,
      );
    },
  );

  it("biến để trống nhưng đang trên Vercel → lấy domain production, KHÔNG rơi về localhost", () => {
    expect(
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL: "",
        NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: "thien-duc.vercel.app",
        NEXT_PUBLIC_VERCEL_URL: "thien-duc-abc123.vercel.app",
      }),
    ).toBe("https://thien-duc.vercel.app");
  });

  it("Preview không có domain production → dùng URL của chính bản deploy", () => {
    expect(
      resolveSiteUrl({ NEXT_PUBLIC_VERCEL_URL: "thien-duc-abc123.vercel.app" }),
    ).toBe("https://thien-duc-abc123.vercel.app");
  });

  it("đặt tay thắng biến hệ thống Vercel (domain thật thay vì *.vercel.app)", () => {
    expect(
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL: PROD,
        NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: "thien-duc.vercel.app",
      }),
    ).toBe(PROD);
  });

  it("host trần được gắn https://; giá trị không parse được thì bỏ qua, không ném", () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "thien-duc.example" })).toBe(PROD);
    expect(
      resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "http://", NEXT_PUBLIC_VERCEL_URL: "" }),
    ).toBe(FALLBACK_SITE_URL);
  });

  it("khoảng trắng thừa hai đầu bị cắt, không lọt vào URL", () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: `  ${PROD}  ` })).toBe(PROD);
    expect(
      resolveSiteUrl({ NEXT_PUBLIC_VERCEL_URL: "  thien-duc-abc123.vercel.app  " }),
    ).toBe("https://thien-duc-abc123.vercel.app");
  });

  /**
   * Chốt này từng thủng: `normalize` gắn `https://` trước rồi mới kiểm tra
   * `protocol`, nên `ftp://evil.example` thành `https://ftp://evil.example` —
   * chuỗi đó PARSE ĐƯỢC (host `ftp`, path `//evil.example`) và qua lọt chốt
   * `protocol`, cho ra base URL rác `https://ftp//evil.example`.
   */
  it.each([
    "ftp://evil.example",
    "file:///etc/passwd",
    "javascript:alert(1)",
    "data:text/html,x",
  ])("scheme không hỗ trợ (%s) bị loại, KHÔNG bị ép thành https", (bad) => {
    const url = resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: bad });
    expect(url).toBe(FALLBACK_SITE_URL);
    expect(url).not.toContain("ftp");
    expect(url).not.toContain("file");
  });

  it("scheme lạ ở biến chính → rơi xuống ứng viên kế tiếp, không dùng giá trị rác", () => {
    expect(
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL: "ftp://evil.example",
        NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: "thien-duc.vercel.app",
      }),
    ).toBe("https://thien-duc.vercel.app");
  });

  it("http:// vẫn được chấp nhận (dev/staging nội bộ chưa có TLS)", () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "http://staging.example" })).toBe(
      "http://staging.example",
    );
  });

  it("cắt `/` cuối — có chỗ nối chuỗi thẳng (`breadcrumb.tsx`) sẽ thành `//du-an`", () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: `${PROD}/` })).toBe(PROD);
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: `${PROD}//` })).toBe(PROD);
  });

  it("env rỗng hoàn toàn (dev/CI) → localhost, và vẫn là URL hợp lệ", () => {
    expect(resolveSiteUrl({})).toBe(FALLBACK_SITE_URL);
    expect(() => new URL("/sitemap.xml", resolveSiteUrl({}))).not.toThrow();
  });

  /**
   * Bất biến bao trùm: với MỌI hình dạng env, kết quả luôn dùng được làm base
   * của `new URL` — đây chính là điều `/robots.txt` cần lúc prerender.
   */
  it.each([
    {},
    { NEXT_PUBLIC_SITE_URL: "" },
    { NEXT_PUBLIC_SITE_URL: "   " },
    { NEXT_PUBLIC_SITE_URL: "khong-phai-url::" },
    { NEXT_PUBLIC_SITE_URL: "ftp://evil.example" },
    { NEXT_PUBLIC_SITE_URL: "", NEXT_PUBLIC_VERCEL_URL: "x.vercel.app" },
    { NEXT_PUBLIC_SITE_URL: PROD },
  ])("kết quả luôn dùng được làm base của new URL (%p)", (env) => {
    const url = resolveSiteUrl(env);
    expect(url).not.toBe("");
    expect(() => new URL("/sitemap.xml", url)).not.toThrow();
    expect(new URL("/sitemap.xml", url).pathname).toBe("/sitemap.xml");
  });

  it("rơi về localhost ở bản production thì phải CẢNH BÁO, không im lặng", () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
    try {
      resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "", NODE_ENV: "production" });
      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn.mock.calls[0][0]).toContain("NEXT_PUBLIC_SITE_URL");

      // Cấu hình đúng thì tuyệt đối không ồn.
      warn.mockClear();
      resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: PROD, NODE_ENV: "production" });
      expect(warn).not.toHaveBeenCalled();

      // `next dev` không cấu hình gì là bình thường — không cảnh báo.
      resolveSiteUrl({ NODE_ENV: "development" });
      expect(warn).not.toHaveBeenCalled();
    } finally {
      warn.mockRestore();
    }
  });
});
