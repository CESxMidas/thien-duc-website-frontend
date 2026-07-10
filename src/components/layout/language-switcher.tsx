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
      className={`items-center gap-1 border border-brand/30 bg-white ${className}`}
      role="group"
      aria-label={label}
    >
      <Globe className="ml-2 size-4 shrink-0 text-brand" aria-hidden="true" />
      {locales.map((item) => {
        const active = item === locale;

        return (
          <Link
            key={item}
            href={localizePath(path, item)}
            hrefLang={item}
            aria-current={active ? "true" : undefined}
            className={`min-h-9 px-2 py-1 text-xs font-bold uppercase transition ${
              active
                ? "text-brand"
                : "text-slate hover:text-brand-dark"
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
