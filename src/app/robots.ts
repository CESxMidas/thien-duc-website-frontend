import type { MetadataRoute } from "next";
import { absoluteUrl, placeholderPaths } from "@/lib/seo";
import { defaultLocale, locales, localizePath } from "@/lib/i18n/config";

/**
 * Admin CMS phục vụ dưới `/admin` của chính domain này (Batch 15B).
 *
 * KHÔNG có tiền tố locale: `/admin` không phải trang Next, nó được rewrite sang
 * Vercel project riêng, nên `localizePath` không áp dụng — một dòng `/admin` là
 * đủ để phủ toàn bộ cây con.
 *
 * Đây là chỉ dẫn SEO, KHÔNG phải biện pháp bảo mật: `robots.txt` là file công
 * khai, liệt kê ở đây thực ra còn *quảng cáo* sự tồn tại của `/admin`. Chấp
 * nhận được vì đường dẫn CMS vốn không phải bí mật, và hai lớp thật sự có tác
 * dụng là `X-Robots-Tag` (next.config.ts) + thẻ `<meta name="robots">` trong
 * `index.html` của Admin. Chốt quyền truy cập vẫn hoàn toàn nằm ở backend.
 */
const ADMIN_PATH = "/admin";

export default function robots(): MetadataRoute.Robots {
  // Chặn ở cả hai locale: `/tuyen-dung` và `/en/tuyen-dung` là hai URL khác nhau.
  const disallow = [
    ...placeholderPaths.flatMap((path) =>
      locales.map((locale) => localizePath(path, locale)),
    ),
    ADMIN_PATH,
  ];

  return {
    rules: {
      userAgent: "*",
      allow: localizePath("/", defaultLocale),
      disallow,
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
