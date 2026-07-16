"use client"; // Error boundary bắt buộc là Client Component

import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { useEffect } from "react";

/**
 * Error boundary theo segment (task →5): bắt lỗi render của mọi trang dưới
 * [locale], gửi lên Sentry và hiện UI lỗi thương hiệu thay vì màn hình mặc
 * định của Next. `reset()` cho người dùng thử tải lại đoạn bị lỗi.
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Thiếu DSN thì captureException là no-op — không cần guard.
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-cream px-6 py-16 text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-brand">
        Đã xảy ra lỗi
      </p>
      <h1 className="max-w-xl text-2xl font-bold text-ink">
        Rất tiếc, trang gặp sự cố khi hiển thị
      </h1>
      <p className="max-w-xl text-sm text-slate">
        Sự cố đã được ghi nhận. Vui lòng thử lại — nếu vẫn lỗi, quay về trang
        chủ hoặc liên hệ với chúng tôi.
      </p>
      <div className="mt-2 flex gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="button-polish bg-brand px-6 py-2.5 text-sm font-bold uppercase text-white hover:bg-brand-dark"
        >
          Thử lại
        </button>
        <Link
          href="/"
          className="button-polish border border-brand px-6 py-2.5 text-sm font-bold uppercase text-brand hover:bg-brand hover:text-white"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
