import type { Locale } from "@/lib/i18n/config";

/**
 * Định dạng ngày theo locale (EN-FULL-A):
 * - `vi` → `dd/mm/yyyy` (Intl `vi-VN`), giữ nguyên output route tiếng Việt.
 * - `en` → `Month D, YYYY` (Intl `en-US`), ví dụ `April 7, 2021`.
 */
export function formatDate(value: string, locale: Locale = "vi") {
  const date = new Date(`${value}T00:00:00+07:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  if (locale === "en") {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
