import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { routes } from "@/lib/routes";

/**
 * Đường dẫn từng nhận `?q=` trước khi tìm kiếm tách sang `/tim-kiem`.
 * So khớp sau khi đã bỏ tiền tố locale.
 */
const LEGACY_SEARCH_PATHS = new Set<string>([routes.news, routes.projects]);

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const firstSegment = pathname.split("/")[1] ?? "";

  const localeStripped = isLocale(firstSegment)
    ? pathname.slice(`/${firstSegment}`.length) || "/"
    : pathname;
  if (LEGACY_SEARCH_PATHS.has(localeStripped)) {
    const query = request.nextUrl.searchParams.get("q")?.trim();
    if (query) {

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

  matcher: [
    "/((?!_next/|api/|admin$|admin/|images/|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};
