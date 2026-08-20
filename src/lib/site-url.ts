/**
 * Giải ra **base URL công khai của site**, tách riêng khỏi `config/site.ts` để
 * test được mà không cần build và không cần đặt biến môi trường thật.
 *
 * Vì sao phải có module này: `siteConfig.url` là base của MỌI URL tuyệt đối
 * (`absoluteUrl` → canonical, hreflang, Open Graph, JSON-LD, `robots.sitemap`,
 * `sitemap.xml`, `metadataBase`). Trước đây nó viết là
 *
 *     process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
 *
 * mà `??` CHỈ đỡ `undefined`/`null` — **không đỡ chuỗi rỗng**. Trên Vercel biến
 * được khai báo nhưng để trống là chuyện thường (đúng như `.env.example` mẫu:
 * `NEXT_PUBLIC_SITE_URL=`), khi đó base là `""` và `new URL("/sitemap.xml", "")`
 * ném `TypeError: Invalid URL` — làm đỏ cả bản deploy ngay ở bước prerender
 * `/robots.txt`. Hàm dưới đây coi rỗng/khoảng trắng/URL không parse được là
 * **chưa đặt**, nên không còn đường nào để một base rỗng lọt xuống `new URL`.
 *
 * Chỉ đọc biến có tiền tố `NEXT_PUBLIC_`: `config/site.ts` đi vào cả bundle
 * trình duyệt (`site-header.tsx`, `contact-form.tsx` là client component). Biến
 * không có tiền tố này bị Next bỏ khỏi bundle client → server và client sẽ dựng
 * hai URL khác nhau và gây lệch hydrate.
 */

/** Hình dạng env tối thiểu mà resolver cần — không nhận cả `process.env`. */
export type SiteUrlEnv = {
  /** Biến CHÍNH THỨC phải cấu hình trên Vercel (Production + Preview). */
  NEXT_PUBLIC_SITE_URL?: string;
  /** Vercel tự cấp: domain production của project, ổn định qua mọi deploy. */
  NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL?: string;
  /** Vercel tự cấp: URL riêng của đúng bản deploy này (hữu ích cho Preview). */
  NEXT_PUBLIC_VERCEL_URL?: string;
  /** Chỉ dùng để quyết định CÓ cảnh báo hay không — xem `resolveSiteUrl`. */
  NODE_ENV?: string;
};

/**
 * Lưới an toàn CUỐI CÙNG, chỉ dành cho `next dev` và build không cấu hình gì
 * (CI hiện tại không đặt `NEXT_PUBLIC_SITE_URL` — xem `.github/workflows/ci.yml`).
 * Một bản deploy Vercel cấu hình đúng KHÔNG BAO GIỜ chạm tới giá trị này: đã có
 * `NEXT_PUBLIC_SITE_URL`, và ngay cả khi quên thì hai biến hệ thống của Vercel
 * vẫn đỡ trước. Rơi tới đây thì có cảnh báo in ra log build, không im lặng.
 */
export const FALLBACK_SITE_URL = "http://localhost:3000";

/** Thứ tự ưu tiên khi tìm base URL. Đặt tay luôn thắng biến Vercel tự cấp. */
const SITE_URL_SOURCES = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL",
  "NEXT_PUBLIC_VERCEL_URL",
] as const satisfies readonly (keyof SiteUrlEnv)[];

/**
 * Chuẩn hoá một ứng viên thành origin tuyệt đối, hoặc `undefined` nếu không
 * dùng được. Trả về chuỗi **không có dấu `/` cuối** vì có chỗ nối chuỗi trực
 * tiếp (`breadcrumb.tsx`: `${siteConfig.url}${item.href}`) — thừa `/` thành
 * `https://site//du-an`.
 */
function normalize(raw: string | undefined): string | undefined {
  const value = raw?.trim();
  if (!value) return undefined;

  // Có scheme sẵn hay là host trần? Biến hệ thống của Vercel là host trần
  // (`ten-project.vercel.app`) và `new URL` ném nếu thiếu scheme, nên phải tự
  // gắn `https://` vào — nhưng CHỈ khi thật sự không có scheme nào.
  //
  // Thứ tự ở đây quan trọng: kiểm tra scheme PHẢI làm trên chuỗi gốc, trước khi
  // gắn thêm. Gắn `https://` bừa vào một giá trị đã có scheme lạ thì
  // `ftp://evil.example` biến thành `https://ftp://evil.example`, và chuỗi đó
  // *parse được* thành host `ftp`, path `//evil.example` — tức là qua lọt mọi
  // chốt kiểm tra `protocol` phía sau và cho ra base URL rác.
  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(value)?.[1].toLowerCase();
  if (scheme && scheme !== "http" && scheme !== "https") return undefined;

  const withScheme = scheme ? value : `https://${value}`;

  let parsed: URL;
  try {
    parsed = new URL(withScheme);
  } catch {
    // Giá trị rác (vd. dán nhầm cả dòng `NEXT_PUBLIC_SITE_URL=https://…`) bị bỏ
    // qua để rơi xuống ứng viên kế tiếp, thay vì ném và làm đỏ build.
    return undefined;
  }

  // Chốt cuối: `new URL` vẫn có thể đổi protocol so với chuỗi vào, và host rỗng
  // (`https://`) thì không dùng làm base được.
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return undefined;
  if (!parsed.hostname) return undefined;

  return parsed.toString().replace(/\/+$/, "");
}

/**
 * Base URL công khai đã chuẩn hoá — LUÔN là URL tuyệt đối hợp lệ, nên mọi
 * `new URL(path, siteUrl)` phía sau không thể ném vì base rỗng.
 */
export function resolveSiteUrl(env: SiteUrlEnv): string {
  for (const name of SITE_URL_SOURCES) {
    const url = normalize(env[name]);
    if (url) return url;
  }

  // Không ném: làm đỏ build vì thiếu một biến SEO là cái giá quá đắt (và chính
  // là sự cố đang phải sửa). Nhưng cũng không im lặng: canonical trỏ về
  // localhost là loại lỗi chỉ lộ ra khi Google đã index sai. Chỉ cảnh báo ở bản
  // production — chạy `next dev` không cấu hình gì là chuyện bình thường.
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
