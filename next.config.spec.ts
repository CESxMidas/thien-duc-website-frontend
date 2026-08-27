/**
 * SEC-XSS-001: kiểm tra security headers trong next.config.ts THẬT (không phải
 * chuỗi hardcode như bản cũ — bản cũ tự so sánh literal với chính nó nên không
 * bắt được regression). Khi làm task →6 (enforce CSP), test này phải cập nhật
 * theo: đổi key sang `Content-Security-Policy` + bỏ unsafe-inline/unsafe-eval.
 */
import nextConfig from "./next.config";
type Header = { key: string; value: string };
type HeaderRule = { source: string; headers: Header[] };
let headers: Header[];
let headerRules: HeaderRule[];

beforeAll(async () => {
  const rules = await nextConfig.headers!();
  headerRules = rules as HeaderRule[];
  const catchAll = rules.find((rule) => rule.source === "/:path*");
  expect(catchAll).toBeDefined();
  headers = catchAll!.headers as Header[];
});

function headerValue(key: string): string {
  const header = headers.find((item) => item.key === key);
  expect(header).toBeDefined();
  return header!.value;
}

describe("next.config.ts — security headers (SEC-XSS-001)", () => {
  describe("CSP (Report-Only — task →6 sẽ chuyển sang enforce)", () => {
    it("dùng chế độ Report-Only, chưa enforce", () => {
      expect(headerValue("Content-Security-Policy-Report-Only")).toBeTruthy();
      expect(
        headers.find((item) => item.key === "Content-Security-Policy"),
      ).toBeUndefined();
    });

    it("khai các directive phòng thủ chính", () => {
      const csp = headerValue("Content-Security-Policy-Report-Only");
      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain("frame-ancestors 'none'");
      expect(csp).toContain("object-src 'none'");
      expect(csp).toContain("base-uri 'self'");
      expect(csp).toContain("upgrade-insecure-requests");
      expect(csp).toContain("report-uri /__csp-report");
    });

    it("whitelist ảnh Cloudinary và API backend", () => {
      const csp = headerValue("Content-Security-Policy-Report-Only");
      expect(csp).toContain("img-src 'self' https://res.cloudinary.com data:");
      // Nguồn CSP là ORIGIN, KHÔNG kèm đường dẫn. Theo CSP Level 3, một source
      // có path không kết thúc bằng "/" phải khớp CHÍNH XÁC path đó — nên
      // ".../api" chỉ cho phép đúng request tới "/api" và sẽ chặn
      // "/api/contact", "/api/news"… Biến ứng dụng NEXT_PUBLIC_API_URL vẫn giữ
      // hậu tố "/api"; hai thứ đó cố ý khác nhau.
      expect(csp).toContain(
        "connect-src 'self' https://thien-duc-website-backend-w1du.onrender.com;",
      );
      expect(csp).not.toContain("onrender.com/api");
      expect(csp).not.toContain("https://thien-duc-website-backend.onrender.com");
    });
  });

  describe("các header bảo mật khác", () => {
    it("X-Content-Type-Options: nosniff", () => {
      expect(headerValue("X-Content-Type-Options")).toBe("nosniff");
    });

    it("X-Frame-Options: DENY", () => {
      expect(headerValue("X-Frame-Options")).toBe("DENY");
    });

    it("Referrer-Policy: strict-origin-when-cross-origin", () => {
      expect(headerValue("Referrer-Policy")).toBe(
        "strict-origin-when-cross-origin",
      );
    });

    it("HSTS bật kèm includeSubDomains", () => {
      const hsts = headerValue("Strict-Transport-Security");
      expect(hsts).toMatch(/max-age=\d+/);
      expect(hsts).toContain("includeSubDomains");
    });
  });
});

describe("next.config.ts — ảnh remote", () => {
  it("chỉ cho phép Cloudinary cloud ksnntvmu và ảnh tin cũ trên thienduccons.vn", () => {
    expect(nextConfig.images?.remotePatterns).toEqual([
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/ksnntvmu/**",
      },
      {
        protocol: "https",
        hostname: "thienduccons.vn",
        pathname: "/img_data/**",
      },
    ]);
  });
});


/**
 * Batch 15B — Admin CMS lộ ra dưới `https://www.thienduccons.vn/admin`.
 *
 * Admin vẫn là Vercel project RIÊNG (Vite SPA); Next chỉ proxy sang đó. Bộ test
 * này khoá đúng ba tính chất mà nếu sai thì `/admin` hỏng ở production nhưng
 * KHÔNG có gì đỏ lúc build.
 */
describe("next.config.ts — proxy Admin dưới /admin (Batch 15B)", () => {
  type RewriteRule = { source: string; destination: string };
  const ADMIN_ORIGIN = "https://thien-duc-website-admin.vercel.app";
  let rewrites: RewriteRule[];

  beforeAll(async () => {
    const result = await nextConfig.rewrites!();
    // `rewrites()` có thể trả mảng hoặc object {beforeFiles,afterFiles,fallback}.
    rewrites = (
      Array.isArray(result)
        ? result
        : [
            ...(result.beforeFiles ?? []),
            ...(result.afterFiles ?? []),
            ...(result.fallback ?? []),
          ]
    ) as RewriteRule[];
  });

  it("có rule cho /admin trần (`:path*` không phủ trường hợp này)", () => {
    expect(rewrites).toContainEqual({
      source: "/admin",
      destination: `${ADMIN_ORIGIN}/admin`,
    });
  });

  it("có rule cho toàn bộ cây con /admin/:path*", () => {
    expect(rewrites).toContainEqual({
      source: "/admin/:path*",
      destination: `${ADMIN_ORIGIN}/admin/:path*`,
    });
  });

  /**
   * Tính chất SỐNG CÒN của kiến trúc: tiền tố `/admin` phải còn nguyên ở đích.
   *
   * Admin build với `base: '/admin/'` + `outDir: 'dist/admin'`, nên file thật
   * nằm ở `dist/admin/assets/*`. Cắt tiền tố ở đây thì `/admin/assets/x.js` đi
   * tới `.../assets/x.js` — không có file nào ở đó → SPA fallback trả HTML cho
   * một request `.js` → trắng trang.
   */
  it("đích GIỮ NGUYÊN tiền tố /admin, không cắt", () => {
    for (const rule of rewrites.filter((r) => r.source.startsWith("/admin"))) {
      expect(rule.destination).toMatch(
        /^https:\/\/[^/]+\/admin(\/|$)/,
      );
    }
  });

  it("là rewrite (proxy phía server), KHÔNG phải redirect sang vercel.app", async () => {
    const redirects = nextConfig.redirects ? await nextConfig.redirects() : [];
    const adminRedirect = redirects.find((r) => r.source.startsWith("/admin"));
    expect(adminRedirect).toBeUndefined();
  });

  it("KHÔNG rewrite /assets ở gốc (sẽ đụng asset của chính FE)", () => {
    const rootAsset = rewrites.find((r) => r.source.startsWith("/assets"));
    expect(rootAsset).toBeUndefined();
  });

  describe("X-Robots-Tag cho Admin", () => {
    function robotsTagFor(source: string): string | undefined {
      const rule = headerRules.find((r) => r.source === source);
      return rule?.headers.find((h) => h.key === "X-Robots-Tag")?.value;
    }

    it("/admin/:path* nhận noindex, nofollow", () => {
      expect(robotsTagFor("/admin/:path*")).toBe("noindex, nofollow");
    });

    it("/admin trần cũng nhận noindex, nofollow", () => {
      expect(robotsTagFor("/admin")).toBe("noindex, nofollow");
    });

    it("KHÔNG đặt noindex cho website công khai", () => {
      expect(robotsTagFor("/:path*")).toBeUndefined();
    });
  });

  /**
   * `headers()` của Next CỘNG DỒN mọi rule khớp, nên `/admin` vẫn phải nhận đủ
   * bộ header bảo mật chung — rule riêng ở trên là THÊM, không phải THAY THẾ.
   */
  it("rule chung /:path* vẫn tồn tại để phủ cả /admin", () => {
    expect(headerRules.some((r) => r.source === "/:path*")).toBe(true);
  });

  /**
   * CSP vẫn ở chế độ Report-Only trong batch này (không enforce).
   *
   * Ghi nhận cho task →6 "enforce CSP": lúc chuyển sang enforce, nếu Admin đã
   * bật `VITE_SENTRY_DSN` thì `connect-src` phải thêm origin ingest của Sentry,
   * nếu không Sentry của Admin sẽ bị chặn im lặng. Hiện `VITE_SENTRY_DSN` chưa
   * đặt trên Vercel project Admin nên chưa phát sinh.
   */
  it("CSP vẫn Report-Only — batch này KHÔNG enforce", () => {
    expect(
      headers.find((h) => h.key === "Content-Security-Policy-Report-Only"),
    ).toBeDefined();
    expect(
      headers.find((h) => h.key === "Content-Security-Policy"),
    ).toBeUndefined();
  });
});
