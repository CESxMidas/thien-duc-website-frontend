import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

/**
 * Định tuyến locale (Next.js 16 đổi tên `middleware.ts` → `proxy.ts`).
 *
 * - `/en/...`  → đi thẳng vào `app/[locale]` với locale = "en".
 * - `/vi/...`  → **redirect 308** về bản không tiền tố. Tiếng Việt chỉ có một
 *               URL chính tắc, tránh nội dung trùng lặp trong chỉ mục.
 * - `/du-an`   → **rewrite** nội bộ sang `/vi/du-an`. Thanh địa chỉ giữ nguyên,
 *               nên URL production hiện tại không đổi và không mất SEO.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const firstSegment = pathname.split("/")[1] ?? "";

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
