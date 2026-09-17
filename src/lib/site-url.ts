
export type SiteUrlEnv = {
  NEXT_PUBLIC_SITE_URL?: string;
  NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL?: string;
  NEXT_PUBLIC_VERCEL_URL?: string;
  NODE_ENV?: string;
};

export const FALLBACK_SITE_URL = "http://localhost:3000";

const SITE_URL_SOURCES = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL",
  "NEXT_PUBLIC_VERCEL_URL",
] as const satisfies readonly (keyof SiteUrlEnv)[];

function normalize(raw: string | undefined): string | undefined {
  const value = raw?.trim();
  if (!value) return undefined;

  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(value)?.[1].toLowerCase();
  if (scheme && scheme !== "http" && scheme !== "https") return undefined;

  const withScheme = scheme ? value : `https://${value}`;

  let parsed: URL;
  try {
    parsed = new URL(withScheme);
  } catch {

    return undefined;
  }

 
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return undefined;
  if (!parsed.hostname) return undefined;

  return parsed.toString().replace(/\/+$/, "");
}


export function resolveSiteUrl(env: SiteUrlEnv): string {
  for (const name of SITE_URL_SOURCES) {
    const url = normalize(env[name]);
    if (url) return url;
  }

 
  if (env.NODE_ENV === "production") {
    console.warn(
      "[site-url] Chưa cấu hình NEXT_PUBLIC_SITE_URL (và không có biến hệ thống " +
        `Vercel nào để suy ra). Tạm dùng ${FALLBACK_SITE_URL} — canonical, hreflang, ` +
        "Open Graph, sitemap.xml và robots.txt sẽ trỏ về localhost. Đặt " +
        "NEXT_PUBLIC_SITE_URL ở Vercel → Settings → Environment Variables rồi redeploy.",
    );
  }
  return FALLBACK_SITE_URL;
}
