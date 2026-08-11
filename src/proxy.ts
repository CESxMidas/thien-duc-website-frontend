import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { routes } from "@/lib/routes";

/**
 * Đường dẫn từng nhận `?q=` trước khi tìm kiếm tách sang `/tim-kiem`.
 * So khớp sau khi đã bỏ tiền tố locale.
 */
const LEGACY_SEARCH_PATHS = new Set<string>([routes.news, routes.projects]);

/**
 * Định tuyến locale (Next.js 16 đổi tên `middleware.ts` → `proxy.ts`).
 *
 * - `/en/...`  → đi thẳng vào `app/[locale]` với locale = "en".
 * - `/vi/...`  → **redirect 308** về bản không tiền tố. Tiếng Việt chỉ có một
 *               URL chính tắc, tránh nội dung trùng lặp trong chỉ mục.
 * - `/du-an`   → **rewrite** nội bộ sang `/vi/du-an`. Thanh địa chỉ giữ nguyên,
 *               nên URL production hiện tại không đổi và không mất SEO.
 * - `/tin-tuc?q=` · `/du-an?q=` → **redirect 308** sang `/tim-kiem?q=`.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const firstSegment = pathname.split("/")[1] ?? "";

  /* Chuyển hướng URL tìm kiếm cũ phải nằm ở ĐÂY, không phải trong page.
     `app/[locale]/tin-tuc/loading.tsx` đặt cả cây `/tin-tuc/**` vào chế độ
     streaming: response đã được cam kết trước khi code trang chạy, nên
     `permanentRedirect()` trong page không đổi được HTTP status — Next nhúng
     lệnh chuyển hướng vào payload đã stream và trả **200**. Trình duyệt vẫn đi
     tiếp, nhưng bot không nhận được 308 và link equity của URL cũ mất.
     (Đã đo: `/du-an?q=` trả 308 đúng vì nhánh đó không có `loading.tsx`, còn
     `/tin-tuc?q=` trả 200 kèm `;308;` trong payload.)
     Middleware chạy TRƯỚC mọi render nên luôn phát được 308 thật. */
  const localeStripped = isLocale(firstSegment)
    ? pathname.slice(`/${firstSegment}`.length) || "/"
    : pathname;
  if (LEGACY_SEARCH_PATHS.has(localeStripped)) {
    const query = request.nextUrl.searchParams.get("q")?.trim();
    if (query) {
      // `/vi/...` không được giữ tiền tố: tiếng Việt chỉ có một URL chính tắc
      // (không tiền tố). Giữ lại sẽ tạo chuỗi hai lần chuyển hướng.
      const prefix =
        isLocale(firstSegment) && firstSegment !== defaultLocale
          ? `/${firstSegment}`
          : "";
      const target = new URL(`${prefix}${routes.search}`, request.url);
      target.searchParams.set("q", query);
      return NextResponse.redirect(target, 308);
    }
  }

  if (firstSegment === defaultLocale) {
    const stripped = pathname.slice(`/${defaultLocale}`.length) || "/";
    return NextResponse.redirect(new URL(`${stripped}${search}`, request.url), 308);
  }

  if (isLocale(firstSegment)) {
    return NextResponse.next();
  }

  return NextResponse.rewrite(
    new URL(`/${defaultLocale}${pathname}${search}`, request.url),
  );
}

export const config = {
  /**
   * Bỏ qua nội bộ Next, file tĩnh và các route metadata sinh ở gốc `app/`
   * (`sitemap.xml`, `robots.txt`) — chúng không nằm dưới `[locale]`, rewrite vào
   * `/vi/sitemap.xml` sẽ thành 404.
   */
  matcher: [
    "/((?!_next/|api/|images/|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};
