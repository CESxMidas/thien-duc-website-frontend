// Sentry phía server/edge (task →5) — Next gọi `register` một lần khi khởi
// động server, `onRequestError` mỗi khi server bắt được lỗi (RSC, route
// handler, proxy…). Xem node_modules/next/dist/docs/01-app/03-api-reference/
// 03-file-conventions/instrumentation.md.
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.VITE_SENTRY_DSN;

export function register() {
  // Thiếu DSN → không init; captureRequestError về sau tự thành no-op.
  if (!dsn) return;

  // Cùng một cấu hình errors-only cho cả runtime nodejs lẫn edge (proxy.ts).
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV ?? "production",
    tracesSampleRate: 0,
    sendDefaultPii: false,
    beforeSend(event) {
      // Không gửi request data (header có thể chứa cookie) — đồng bộ chính
      // sách scrubbing với backend (src/instrument.ts bên backend).
      delete event.request;
      return event;
    },
  });
}

export const onRequestError = Sentry.captureRequestError;
