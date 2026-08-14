/**
 * Hợp đồng sitemap.
 *
 * Ba điều dễ hỏng nhất:
 * - **URL tìm kiếm không bao giờ được vào sitemap** — trang kết quả là
 *   `noindex`, đưa vào sitemap là gửi hai tín hiệu ngược nhau.
 * - **Chuyên mục rỗng không vào sitemap** — chúng đang `noindex` vì là trang
 *   mỏng; cùng lý do trên.
 * - **Không có URL phân trang** — trang 2 trở đi tự trỏ canonical về chính nó
 *   nhưng không cần được liệt kê.
 */
import type { NewsPost } from "@/types/content";

const newsPosts: NewsPost[] = [
  {
    title: "Bài thuộc chuyên mục A",
    slug: "bai-a",
    summary: "Tóm tắt",
    publishedAt: "2026-07-01",
    category: { slug: "tin-du-an", name: "Tin dự án" },
  },
  {
    title: "Bài thứ hai cùng chuyên mục A",
    slug: "bai-a2",
    summary: "Tóm tắt",
    publishedAt: "2026-06-01",
    category: { slug: "tin-du-an", name: "Tin dự án" },
  },
  {
    title: "Bài không có chuyên mục",
    slug: "bai-khong-chuyen-muc",
    summary: "Tóm tắt",
    publishedAt: "2026-05-01",
  },
  /**
   * Bài lên lịch ĐÃ TỚI HẠN. Với frontend nó không khác gì một bài đã đăng:
   * backend đã cho nó vào `GET /news` theo luật hiển thị của mình, còn ở đây
   * không có field nào để phân biệt — đúng như thiết kế.
   */
  {
    title: "Bài lên lịch đã tới hạn",
    slug: "bai-len-lich-da-toi-gio",
    summary: "Tóm tắt",
    publishedAt: "2026-08-20T01:00:00.000Z",
    category: { slug: "tin-du-an", name: "Tin dự án" },
  },
];

/** Bài đang hẹn giờ ở TƯƠNG LAI — backend không trả về, nên sitemap không thấy. */
const futureScheduledSlug = "bai-hen-gio-tuong-lai";

jest.mock("@/lib/api/client", () => ({
  ...jest.requireActual("@/lib/api/client"),
  isApiConfigured: true,
}));

jest.mock("@/lib/api/news", () => ({
  getNewsPosts: jest.fn(async () => newsPosts),
}));

jest.mock("@/lib/api/projects", () => ({
  getProjects: jest.fn(async () => [
    {
      title: "Khu đô thị Hưng Phú",
      slug: "khu-do-thi-hung-phu",
      summary: "Tóm tắt",
      status: "da-ban-giao",
    },
  ]),
}));

import sitemap, { revalidate } from "./sitemap";

async function urls() {
  const entries = await sitemap();
  return entries.map((entry) => entry.url);
}

describe("sitemap", () => {
  it("KHÔNG chứa URL tìm kiếm", async () => {
    for (const url of await urls()) {
      expect(url).not.toContain("/tim-kiem");
      expect(url).not.toContain("?q=");
    }
  });

  it("KHÔNG chứa URL phân trang", async () => {
    for (const url of await urls()) {
      expect(url).not.toContain("?page=");
    }
  });

  it("có trang đích của chuyên mục ĐANG CÓ bài, đúng một lần", async () => {
    const matched = (await urls()).filter((url) =>
      url.endsWith("/tin-tuc/danh-muc/tin-du-an"),
    );

    // Hai bài cùng chuyên mục → vẫn chỉ một URL chuyên mục.
    expect(matched).toHaveLength(1);
  });

  it("KHÔNG sinh URL chuyên mục cho bài không gắn chuyên mục", async () => {
    const matched = (await urls()).filter((url) =>
      url.includes("/tin-tuc/danh-muc/"),
    );

    expect(matched).toHaveLength(1);
    expect(matched[0]).toContain("tin-du-an");
  });

  it("vẫn giữ nguyên URL bài viết và dự án như trước", async () => {
    const list = await urls();

    expect(list.some((url) => url.endsWith("/tin-tuc/bai-a"))).toBe(true);
    expect(
      list.some((url) => url.endsWith("/du-an/khu-do-thi-hung-phu")),
    ).toBe(true);
  });
});

/**
 * Sitemap được cache **vô thời hạn** nếu không khai báo gì (Route Handler tĩnh):
 * bài lên lịch tuy đã công khai ở API vẫn vắng mặt cho tới lần deploy kế tiếp.
 * Giá trị này là thứ duy nhất ngăn điều đó, nên khoá lại bằng test.
 */
describe("sitemap — làm mới lúc chạy", () => {
  it("khai báo revalidate = 3600 (một giờ)", () => {
    expect(revalidate).toBe(3600);
  });
});

/**
 * Ranh giới trách nhiệm: quyết định bài nào công khai là việc của **backend**.
 * Frontend chỉ dựng URL cho những gì `GET /news` trả về — không đọc `scheduledAt`,
 * không so đồng hồ máy, không biết bài đó là PUBLISHED hay lịch đã tới hạn.
 */
describe("sitemap — tin lên lịch", () => {
  it("bài API trả về (kể cả lịch đã tới hạn) CÓ URL trong sitemap", async () => {
    const list = await urls();

    expect(
      list.some((url) => url.endsWith("/tin-tuc/bai-len-lich-da-toi-gio")),
    ).toBe(true);
  });

  it("bài API KHÔNG trả về (đang hẹn giờ tương lai) không có URL nào", async () => {
    const list = await urls();

    expect(list.some((url) => url.includes(futureScheduledSlug))).toBe(false);
  });

  it("lastModified của bài lấy từ publishedAt — mốc công khai đầu tiên", async () => {
    const entries = await sitemap();
    const scheduled = entries.find((item) =>
      item.url.endsWith("/tin-tuc/bai-len-lich-da-toi-gio"),
    );

    expect(scheduled?.lastModified).toBe("2026-08-20T01:00:00.000Z");
  });

  it("không lộ field biên tập nào ra XML", async () => {
    for (const item of await sitemap()) {
      expect(Object.keys(item).sort()).toEqual([
        "alternates",
        "changeFrequency",
        "lastModified",
        "priority",
        "url",
      ]);
    }
  });
});
