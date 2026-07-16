"use client"; // Error boundary bắt buộc là Client Component

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

/**
 * Lưới an toàn cuối cùng (task →5): chỉ kích hoạt khi CHÍNH root layout lỗi —
 * lúc đó global-error thay thế toàn bộ layout nên phải tự khai `<html>/<body>`
 * và không dùng được globals.css/token Tailwind (metadata cũng không hỗ trợ).
 * Vì vậy đây là chỗ duy nhất chấp nhận inline style thay vì token thương hiệu.
 */
export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="vi">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <h1 style={{ fontSize: "20px", margin: 0 }}>
          Rất tiếc, website đang gặp sự cố
        </h1>
        <p style={{ margin: 0, fontSize: "14px", opacity: 0.75 }}>
          Sự cố đã được ghi nhận. Vui lòng tải lại trang sau ít phút.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{
            marginTop: "8px",
            padding: "10px 24px",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Tải lại trang
        </button>
      </body>
    </html>
  );
}
