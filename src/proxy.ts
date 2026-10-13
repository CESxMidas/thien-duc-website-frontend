import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { routes } from "@/lib/routes";

/**
 * Đường dẫn từng nhận `?q=` trước khi tìm kiếm tách sang `/tim-kiem`.
 * So khớp sau khi đã bỏ tiền tố locale.
 */
const LEGACY_SEARCH_PATHS = new Set<string>([routes.news, routes.projects]);
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

function newsNotFoundResponse(locale: string) {
  const title =
    locale === "en" ? "404: News article not found" : "404: Khong tim thay tin tuc";
  const description =
    locale === "en"
      ? "The requested news article could not be found."
      : "Bai viet tin tuc nay khong ton tai.";

  return new NextResponse(
    `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${title}</title></head><body><main><h1>${title}</h1><p>${description}</p></main></body></html>`,
    {
      status: 404,
      headers: { "content-type": "text/html; charset=utf-8" },
    },
  );
}

async function newsDetailExists(slug: string): Promise<boolean | undefined> {
  if (!API_BASE_URL) return undefined;

  try {
    const response = await fetch(
      `${API_BASE_URL}/news/${encodeURIComponent(slug)}`,
      {
        headers: { accept: "application/json" },
        cache: "no-store",
      },
    );

    if (response.status === 404) return false;
    if (response.ok) return true;
  } catch {
    return undefined;
  }

  return undefined;
}

export async function proxy(request: NextRequest) {
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

  const newsDetailMatch = localeStripped.match(/^\/tin-tuc\/([^/]+)$/);
  if (
    newsDetailMatch &&
    (request.method === "GET" || request.method === "HEAD")
  ) {
    const exists = await newsDetailExists(newsDetailMatch[1]);
    if (exists === false) {
      const locale = isLocale(firstSegment) ? firstSegment : defaultLocale;
      if (request.method === "HEAD") {
        return new NextResponse(null, { status: 404 });
      }
      return newsNotFoundResponse(locale);
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
