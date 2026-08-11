/**
 * Chính sách SEO của trang tìm kiếm và của các URL tìm kiếm cũ.
 *
 * Ba điều phải giữ:
 * 1. `/tim-kiem` là **noindex, follow** — không đưa trang kết quả vào chỉ mục,
 *    nhưng link bên trong vẫn dẫn tới dự án và bài viết thật nên phải đi tiếp.
 * 2. Canonical trỏ về trang tìm kiếm **sạch**, không kèm `?q=`: mỗi từ khóa
 *    khác nhau không được sinh một URL riêng trong chỉ mục.
 * (Việc sitemap không chứa URL tìm kiếm được khoá riêng ở `app/sitemap.test.ts`.)
 */
import { generateMetadata } from "./page";
import { siteConfig } from "@/config/site";

/** `PageProps` của Next là promise — bọc lại cho gọn. */
function props(locale: string) {
  return {
    params: Promise.resolve({ locale }),
    searchParams: Promise.resolve({}),
  } as never;
}

describe("Metadata trang /tim-kiem", () => {
  it("noindex nhưng VẪN follow", async () => {
    const metadata = await generateMetadata(props("vi"));

    expect(metadata.robots).toEqual({ index: false, follow: true });
  });

  it("canonical là URL sạch, KHÔNG mang ?q=", async () => {
    const metadata = await generateMetadata(props("vi"));

    expect(metadata.alternates?.canonical).toBe(
      `${siteConfig.url.replace(/\/$/, "")}/tim-kiem`,
    );
    expect(String(metadata.alternates?.canonical)).not.toContain("?");
  });

  it("hreflang khai báo đủ hai bản + x-default", async () => {
    const metadata = await generateMetadata(props("vi"));
    const languages = metadata.alternates?.languages ?? {};

    expect(Object.keys(languages).sort()).toEqual([
      "en",
      "vi-VN",
      "x-default",
    ]);
  });

  it("route EN cũng noindex, canonical trỏ bản EN", async () => {
    const metadata = await generateMetadata(props("en"));

    expect(metadata.robots).toEqual({ index: false, follow: true });
    expect(metadata.alternates?.canonical).toBe(
      `${siteConfig.url.replace(/\/$/, "")}/en/tim-kiem`,
    );
  });
});
