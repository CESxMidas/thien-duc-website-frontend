import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import { isSentryUploadEnabled, resolveSentryRelease } from "./src/lib/sentry-build";

const nextConfig: NextConfig = {
  // Cho phép HMR/dev assets khi truy cập qua IP LAN (điện thoại, máy khác cùng Wi-Fi).
  //
  // `127.0.0.1` là BẮT BUỘC cho E2E: `next dev` chặn asset dev từ mọi origin
  // khác origin nó được khởi tạo (mặc định `localhost`), nên mở trang qua
  // `http://127.0.0.1:3000` sẽ **không tải được JS → không hydrate**: validate
  // phía client không chạy, `useEffect` không chạy (banner autoplay/reduced-
  // motion sai), form không gửi. Nhìn bề ngoài trang vẫn "hiện" vì HTML server
  // render vẫn về. E2E dùng 127.0.0.1 thay cho `localhost` để tránh phân giải
  // IPv6 (`::1`) ở CI. Tuỳ chọn này chỉ có tác dụng ở chế độ dev.
  allowedDevOrigins: ["127.0.0.1", "192.168.*.*", "172.28.*.*", "10.*.*.*"],
  // Ảnh banner/dự án do CMS lưu trên Cloudinary (cloud `ksnntvmu`). `next/image`
  // chỉ tải ảnh từ host được khai báo — thiếu dòng này ảnh Cloudinary bị chặn.
  // Cloud name nằm ngay trong URL ảnh (`res.cloudinary.com/<cloud>/image/upload/…`);
  // pathname phải khớp đúng cloud thật, sai cloud thì next/image trả 400, ảnh không hiện.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/ksnntvmu/**",
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

/**
 * Upload source map lên Sentry (backlog §6 "Sentry source map upload").
 *
 * Không có source map thì stack trace production chỉ là tên hàm đã minify
 * (`t.a is not a function`) — gần như vô dụng. `withSentryConfig` là tích hợp
 * CHÍNH THỨC của `@sentry/nextjs` (đã cài): nó tự sinh source map ẩn, upload
 * lúc build, rồi **xoá khỏi thư mục build** nên không phát ra công khai.
 *
 * CỔNG BẬT: chỉ chạy khi có ĐỦ `SENTRY_AUTH_TOKEN` + `SENTRY_ORG` +
 * `SENTRY_PROJECT`. Thiếu bất kỳ cái nào (máy dev, CI thường, `npm run build`
 * cục bộ) thì cấu hình gốc được trả về NGUYÊN VẸN — build vẫn xanh, không gọi
 * mạng, không cảnh báo ồn. Token KHÔNG bao giờ nằm trong repo; chỉ đọc từ biến
 * môi trường của môi trường build (Vercel/CI).
 *
 * `release` gắn theo commit SHA để map đúng bundle ↔ mã nguồn. Ưu tiên biến
 * `SENTRY_RELEASE` (đặt tay), sau đó `VERCEL_GIT_COMMIT_SHA`, rồi
 * `GITHUB_SHA`; không có thì để Sentry tự suy luận.
 *
 * CHÍNH SÁCH KHI UPLOAD LỖI: `errorHandler` chỉ CẢNH BÁO, không ném — hỏng
 * đường truyền tới Sentry không được phép làm đổ một bản deploy vốn lành lặn.
 */
/**
 * Phân tích kích thước bundle (backlog §6 "G4 — tối ưu hiệu năng còn lại").
 *
 * KHÔNG cấu hình gì ở đây, và KHÔNG dùng `@next/bundle-analyzer`: Next 16 build
 * bằng **Turbopack** mặc định, còn analyzer đó là plugin của webpack nên
 * Turbopack bỏ qua hoàn toàn — đã đo: build xanh nhưng `.next/analyze/` rỗng.
 * Ép `--webpack` để analyzer chạy được thì lại phân tích một bundle KHÁC với
 * bundle production thật, tức số liệu sai một cách khó thấy.
 *
 * Đường đúng là cờ CÓ SẴN của Next: `next build --experimental-analyze`
 * (Turbopack-native). Xem script `npm run analyze`. Vì là cờ CLI nên analyzer
 * **không bao giờ** chạy trong `npm run build` của Vercel/CI.
 */
const sentryUploadEnabled = isSentryUploadEnabled(process.env);
const sentryRelease = resolveSentryRelease(process.env);

export default sentryUploadEnabled
  ? withSentryConfig(nextConfig, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      ...(sentryRelease ? { release: { name: sentryRelease } } : {}),
      // Không in log build ồn ào; vẫn giữ cảnh báo khi upload hỏng.
      silent: true,
      // Không gửi telemetry sử dụng về Sentry.
      telemetry: false,
      sourcemaps: {
        // Xoá source map khỏi output sau khi upload — không phát công khai.
        deleteSourcemapsAfterUpload: true,
      },
      // Upload hỏng KHÔNG được làm đổ build.
      errorHandler: (err) => {
        console.warn("[sentry] upload source map thất bại, bỏ qua:", err.message);
      },
    })
  : nextConfig;
