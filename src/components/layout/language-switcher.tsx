"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import {
  localeLabels,
  locales,
  localizePath,
  splitLocale,
  type Locale,
} from "@/lib/i18n/config";

type LanguageSwitcherProps = {
  locale: Locale;
  label: string;
  className?: string;
};

/**
 * Chuyển ngôn ngữ giữ nguyên trang đang xem (`/du-an` ↔ `/en/du-an`).
 *
 * Cố ý **không** đọc `useSearchParams`: header nằm trong shell dùng chung, hook
 * đó sẽ ép mọi trang tĩnh rơi vào render động. Đổi ngôn ngữ do đó bỏ query
 * (ví dụ bộ lọc `?status=`) — chấp nhận được, và người dùng vẫn ở đúng trang.
 */
export function LanguageSwitcher({
  locale,
  label,
  className = "",
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const { path } = splitLocale(pathname);

  return (
    <div
      className={`inline-flex items-center gap-0.5 rounded-md border border-brand/25 bg-cream/70 p-0.5 ${className}`}
      role="group"
      aria-label={label}
    >
      <Globe
        className="ml-1.5 mr-0.5 size-3.5 shrink-0 text-brand/70"
        aria-hidden="true"
      />
      {locales.map((item) => {
        const active = item === locale;

        return (
          <Link
            key={item}
            href={localizePath(path, item)}
            hrefLang={item}
            aria-current={active ? "true" : undefined}
            className={`grid min-h-8 min-w-9 place-items-center rounded px-2.5 text-xs font-bold uppercase tracking-wide transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
              active
                ? "bg-brand text-white shadow-sm"
                : "text-slate hover:bg-brand/10 hover:text-brand-dark"
            }`}
          >
            <span className="sr-only">{localeLabels[item]}</span>
            <span aria-hidden="true">{item}</span>
          </Link>
        );
      })}
    </div>
  );
}
