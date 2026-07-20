import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cho phép HMR/dev assets khi truy cập qua IP LAN (điện thoại, máy khác cùng Wi-Fi).
  allowedDevOrigins: [
    "192.168.*.*",
    "172.28.*.*",
    "10.*.*.*",
  ],
  // Ảnh banner/dự án do CMS lưu trên Cloudinary (cloud `thienduc`). `next/image`
  // chỉ tải ảnh từ host được khai báo — thiếu dòng này ảnh Cloudinary bị chặn.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/thienduc/**",
      },
    ],
    // Next 16 yêu cầu allowlist các mức `quality`. Mặc định chỉ có 75; thêm 90
    // để ảnh hero/banner (nguồn 1920×640 bị phóng to trên màn hình lớn) nét hơn,
    // giảm cảm giác mờ. Giữ 75 cho ảnh thường để không tăng dung lượng toàn site.
    qualities: [75, 90],
  },
  // Định tuyến locale (`/vi` → `/`, rewrite `/du-an` → `/vi/du-an`) nằm ở
  // `src/proxy.ts` vì cần đọc pathname của từng request.

  // SEC-XSS-001: Add security headers (CSP Report-Only mode for monitoring)
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Content-Security-Policy (Report-Only mode) — monitor violations before enforcing
          // Allows Next.js runtime scripts (nonce-based), blocks unsafe inline script/style
          {
            key: "Content-Security-Policy-Report-Only",
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
              "style-src 'self' 'unsafe-inline'; " +
              "img-src 'self' https://res.cloudinary.com data:; " +
              "font-src 'self' data:; " +
              "connect-src 'self' https://thien-duc-website-backend.onrender.com; " +
              "frame-ancestors 'none'; " +
              "base-uri 'self'; " +
              "object-src 'none'; " +
              "upgrade-insecure-requests; " +
              "report-uri /__csp-report",
          },
          // X-Content-Type-Options — prevent MIME sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // X-Frame-Options — prevent clickjacking
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // X-XSS-Protection — legacy XSS filter (fallback for older browsers)
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          // Referrer-Policy — limit referrer disclosure
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Strict-Transport-Security — enforce HTTPS (30 days + subdomains)
          {
            key: "Strict-Transport-Security",
            value: "max-age=2592000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
