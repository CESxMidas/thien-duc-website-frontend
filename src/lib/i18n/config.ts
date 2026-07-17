export const locales = ["vi", "en"] as const;

export type Locale = (typeof locales)[number];

/**
 * Tiếng Việt là ngôn ngữ mặc định và **không có tiền tố** trên URL (`/du-an`),
 * tiếng Anh có tiền tố (`/en/du-an`). Giữ nguyên URL tiếng Việt đang chạy
 * production nên không phải 301 hàng loạt và không mất tín hiệu SEO đã tích lũy.
 *
 * `/vi/...` vẫn truy cập được nhưng `proxy.ts` chuyển hướng về bản không tiền tố.
 */
export const defaultLocale: Locale = "vi";

/** Ngôn ngữ khai báo trong thẻ `<html lang>` và `hreflang` của sitemap. */
export const localeHtmlLang: Record<Locale, string> = {
  vi: "vi-VN",
  en: "en",
};

export const localeLabels: Record<Locale, string> = {
  vi: "Tiếng Việt",
  en: "English",
};

/**
 * Tên ngôn ngữ theo **route đang xem** (EN-FULL-A): trên `/en` mọi nhãn a11y
 * phải là tiếng Anh, nên nút chuyển sang tiếng Việt đọc là "Vietnamese". Route
 * tiếng Việt giữ nguyên endonym "Tiếng Việt". Khoá ngoài = locale route, khoá
 * trong = ngôn ngữ của nút.
 */
export const localeNameIn: Record<Locale, Record<Locale, string>> = {
  vi: { vi: "Tiếng Việt", en: "English" },
  en: { vi: "Vietnamese", en: "English" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Gắn tiền tố locale vào đường dẫn nội bộ. Query string được giữ nguyên
 * (`/du-an?status=x` → `/en/du-an?status=x`).
 */
export function localizePath(path: string, locale: Locale): string {
  if (locale === defaultLocale) return path;
  if (path === "/") return `/${locale}`;
  return `/${locale}${path}`;
}

/**
 * Tách tiền tố locale khỏi pathname. Dùng ở client (`usePathname`) — sau khi
 * `proxy.ts` rewrite, trình duyệt vẫn thấy URL gốc nên `/du-an` trả về `vi`.
 */
export function splitLocale(pathname: string): {
  locale: Locale;
  path: string;
} {
  const segments = pathname.split("/");
  const candidate = segments[1] ?? "";

  if (isLocale(candidate)) {
    const path = `/${segments.slice(2).join("/")}`;
    return { locale: candidate, path: path === "/" ? "/" : path };
  }
  return { locale: defaultLocale, path: pathname };
}
