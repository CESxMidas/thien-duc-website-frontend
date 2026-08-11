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
];

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

import sitemap from "./sitemap";

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
