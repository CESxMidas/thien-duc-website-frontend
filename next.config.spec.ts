/**
 * SEC-XSS-001: kiểm tra security headers trong next.config.ts THẬT (không phải
 * chuỗi hardcode như bản cũ — bản cũ tự so sánh literal với chính nó nên không
 * bắt được regression). Khi làm task →6 (enforce CSP), test này phải cập nhật
 * theo: đổi key sang `Content-Security-Policy` + bỏ unsafe-inline/unsafe-eval.
 */
import nextConfig from "./next.config";

type Header = { key: string; value: string };

let headers: Header[];

beforeAll(async () => {
  const rules = await nextConfig.headers!();
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
      expect(csp).toContain(
        "connect-src 'self' https://thien-duc-website-backend.onrender.com",
      );
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
  it("chỉ cho phép ảnh Cloudinary cloud ksnntvmu", () => {
    expect(nextConfig.images?.remotePatterns).toEqual([
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/ksnntvmu/**",
      },
    ]);
  });
});
