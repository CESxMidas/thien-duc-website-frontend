import type { MetadataRoute } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { ApiError, isApiConfigured } from "@/lib/api/client";
import { getNewsPosts } from "@/lib/api/news";
import { getProjects } from "@/lib/api/projects";
import type { NewsPost, Project } from "@/types/content";
import { defaultLocale } from "@/lib/i18n/config";
import { routes } from "@/lib/routes";
import { absoluteUrl, buildAlternates } from "@/lib/seo";

type SitemapEntry = MetadataRoute.Sitemap[number];

/**
 * Đang chạy trong `next build` hay đang phục vụ request?
 *
 * `NEXT_PHASE` do chính Next đặt, đúng **một** chỗ duy nhất trong toàn bộ
 * framework: `next/dist/build/index.js`. Không có đoạn nào ở `server/` hay
 * `cli/` gán nó, và bản thân Next dùng đúng phép so này ở runtime
 * (`server/web/globals.js`, `router-utils/instrumentation-globals.external.js`)
 * để phân biệt hai pha — nên đây là cơ chế của framework, không phải nội bộ
 * riêng tư. Hằng số nhập từ `next/constants`, một module công khai.
 *
 * Vì sao cần phân biệt: xem `sitemap()` bên dưới — hai pha cần hai cách xử lý
 * **ngược nhau** khi backend không phản hồi.
 */
function isProductionBuild(): boolean {
  return process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD;
}

/**
 * Lỗi này là "backend không với tới được" hay là bug của chính mình?
 *
 * Chỉ hai hình dạng được coi là backend hỏng:
 * - `ApiError` — backend có trả lời, nhưng trả envelope lỗi.
 * - `TypeError: fetch failed` — undici ném khi không mở được kết nối
 *   (ECONNREFUSED, ENOTFOUND, timeout ở tầng socket). Đây đúng là lỗi đã đo
 *   được khi Render Free đang ngủ.
 *
 * Mọi thứ khác — lỗi mapper, `undefined.map`, sai kiểu — **phải nổ ra ngoài**.
 * Nuốt hết bằng `catch {}` sẽ biến một bug thành "sitemap tự nhiên thiếu URL",
 * loại lỗi âm thầm và rất khó lần ra sau này.
 */
function isBackendUnavailable(error: unknown): boolean {
  if (error instanceof ApiError) return true;
  return error instanceof TypeError && error.message === "fetch failed";
}

/**
 * Dựng lại sitemap tối đa mỗi giờ. Thiếu dòng này, `sitemap.ts` là Route Handler
 * **được cache vô thời hạn** (`initialRevalidateSeconds: false`): một bài lên
 * theo lịch tuy đã công khai ngay ở API vẫn không có mặt trong `sitemap.xml`
 * cho tới lần deploy kế tiếp. Một giờ là đủ — HTML đã tự làm mới mỗi 60 giây,
 * và công cụ tìm kiếm không đọc lại sitemap theo từng phút.
 */
export const revalidate = 3600;

/**
 * Mỗi URL khai báo một lần theo bản tiếng Việt (canonical) kèm `alternates` trỏ
 * sang bản tiếng Anh — Google gom hai bản thành một trang có hai ngôn ngữ, thay
 * vì hai trang trùng nội dung.
 */
function entry(
  path: string,
  changeFrequency: SitemapEntry["changeFrequency"],
  priority: number,
  lastModified?: string | Date,
): SitemapEntry {
  const alternates = buildAlternates(path, defaultLocale);

  return {
    url: absoluteUrl(path),
    lastModified: lastModified ?? new Date(),
    changeFrequency,
    priority,
    alternates: { languages: alternates?.languages as Record<string, string> },
  };
}

/**
 * Lấy một nguồn dữ liệu công khai, chịu được việc backend không phản hồi.
 *
 * `label` chỉ dùng cho cảnh báo — không log payload, không log stack.
 */
async function loadOrDegrade<T>(
  label: string,
  load: () => Promise<T[]>,
): Promise<T[]> {
  try {
    return await load();
  } catch (error) {
    // Bug của chính mình thì phải lộ ra, không được hoá trang thành "backend hỏng".
    if (!isBackendUnavailable(error)) throw error;

    // Lúc CHẠY: ném tiếp. Next giữ nguyên sitemap tốt đã cache và thử lại ở
    // request sau (docs `incremental-static-regeneration.md`: "the last
    // successfully generated data will continue to be served from the cache").
    // Nuốt lỗi ở đây sẽ ghi đè một sitemap đầy đủ bằng bản thiếu URL và khoá nó
    // lại nguyên một giờ — mỗi lần Render Free ngủ là một lần mất URL khỏi index.
    if (!isProductionBuild()) throw error;

    // Lúc BUILD: chưa có cache nào để giữ, và ném ở đây là **hỏng cả bản
    // deploy** — đúng sự cố đã đo được (`Export encountered an error on
    // /sitemap.xml/route`). Bỏ qua phần dữ liệu này để build đi tiếp.
    const reason = error instanceof Error ? error.message : String(error);
    console.warn(
      `[sitemap] ${label}: không lấy được dữ liệu công khai (${reason}). ` +
        `Bỏ qua nhóm URL này trong sitemap của bản build.`,
    );
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Slug không phụ thuộc ngôn ngữ — lấy một lần theo locale mặc định.
  // Build không có API (vd. CI) → sitemap chỉ gồm route tĩnh; production
  // (env đã đặt) vẫn đủ dự án + tin tức như cũ.
  //
  // Hai nguồn lấy độc lập nhau: một bên hỏng không kéo bên kia mất theo. Dữ
  // liệu công khai lấy về được thì tin được, nên vẫn nên có mặt trong sitemap.
  // Việc bọc lỗi CHỈ quanh phần gọi mạng — toàn bộ đoạn dựng entry bên dưới
  // nằm ngoài, nên một bug ở đó vẫn nổ ra bình thường thay vì bị nuốt.
  const [projects, newsPosts]: [Project[], NewsPost[]] = isApiConfigured
    ? await Promise.all([
        loadOrDegrade("dự án", () => getProjects(defaultLocale)),
        loadOrDegrade("tin tức", () => getNewsPosts(defaultLocale)),
      ])
    : [[], []];

  // Cố ý bỏ các route trong `placeholderPaths` (tuyển dụng, đào tạo…): chúng
  // đang `noindex` vì chưa có nội dung thật, đưa vào sitemap là tín hiệu mâu thuẫn.
  const staticEntries = [
    entry(routes.home, "weekly", 1),
    entry(routes.about, "monthly", 0.8),
    entry(routes.projects, "weekly", 0.9),
    entry(routes.news, "daily", 0.8),
    entry(routes.members, "yearly", 0.6),
    entry(routes.contact, "yearly", 0.6),
  ];

  const projectEntries = projects.flatMap((project) => [
    entry(`${routes.projects}/${project.slug}`, "monthly", 0.8),
    ...(project.items ?? []).map((item) =>
      entry(`${routes.projects}/${project.slug}/${item.slug}`, "monthly", 0.6),
    ),
  ]);

  const newsEntries = newsPosts.map((post) =>
    entry(
      `${routes.news}/${post.slug}`,
      "monthly",
      0.6,
      post.publishedAt || undefined,
    ),
  );

  /**
   * Trang đích chuyên mục — chỉ những chuyên mục **thật sự có bài đã đăng**.
   *
   * Danh sách suy ra từ chính `newsPosts` chứ không gọi thêm
   * `GET /news/categories`: chuyên mục xuất hiện trên một bài đã đăng thì đương
   * nhiên vừa tồn tại vừa không rỗng — đúng hai điều kiện cần, mà không tốn
   * thêm một lượt gọi mạng lúc build.
   *
   * Cố ý KHÔNG đưa vào sitemap: URL phân trang chuyên mục (`?page=N`), chuyên
   * mục rỗng (đang `noindex`), và mọi URL tìm kiếm.
   */
  const categorySlugs = [
    ...new Set(
      newsPosts
        .map((post) => post.category?.slug)
        .filter((slug): slug is string => Boolean(slug)),
    ),
  ];
  const categoryEntries = categorySlugs.map((slug) =>
    entry(`${routes.newsCategory}/${slug}`, "weekly", 0.6),
  );

  return [
    ...staticEntries,
    ...projectEntries,
    ...categoryEntries,
    ...newsEntries,
  ];
}
