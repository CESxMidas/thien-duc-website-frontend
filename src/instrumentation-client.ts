// Sentry phía trình duyệt (task →5) — chạy sau khi HTML nạp, trước khi React
// hydrate. Xem node_modules/next/dist/docs/.../instrumentation-client.md.
// Errors-only: không tracing, không Session Replay, không PII.
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV ?? "production",
    tracesSampleRate: 0,
    sendDefaultPii: false,
  });
}

// Breadcrumb điều hướng App Router — giúp đọc ngữ cảnh trước khi lỗi xảy ra.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
