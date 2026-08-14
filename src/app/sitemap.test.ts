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
import { getNewsPosts } from "@/lib/api/news";
import { getProjects } from "@/lib/api/projects";
import { ApiError } from "@/lib/api/client";

async function urls() {
  const entries = await sitemap();
  return entries.map((entry) => entry.url);
}

const mockNews = getNewsPosts as jest.MockedFunction<typeof getNewsPosts>;
const mockProjects = getProjects as jest.MockedFunction<typeof getProjects>;

/** Đúng hình dạng lỗi undici ném ra khi không mở được kết nối tới backend. */
function backendDown() {
  return new TypeError("fetch failed");
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

/**
 * Backend không phản hồi.
 *
 * Sự cố đã đo được trên code trước bản sửa này: Render Free ngủ sau 15 phút,
 * `next build` trúng lúc đó thì `/sitemap.xml` ném `TypeError: fetch failed` và
 * **cả bản deploy hỏng** (`Export encountered an error on /sitemap.xml/route`).
 * Mọi route khác đã tự hạ cấp êm qua `staticParamsSafe` / `isApiReachableAtBuild`;
 * sitemap là chỗ duy nhất còn sót.
 *
 * Hai pha xử lý **ngược nhau**, và đó là điểm mấu chốt:
 * - **Build**: chưa có cache nào để giữ, ném là hỏng deploy → hạ cấp.
 * - **Chạy (ISR)**: đã có sitemap tốt trong cache, ném để Next tiếp tục phục vụ
 *   bản cũ và thử lại sau. Nuốt lỗi ở đây sẽ ghi đè sitemap đầy đủ bằng bản
 *   thiếu URL và khoá nguyên một giờ.
 */
describe("sitemap — backend không phản hồi", () => {
  const realPhase = process.env.NEXT_PHASE;

  /** Giả lập đang trong `next build`. */
  function asBuild() {
    process.env.NEXT_PHASE = "phase-production-build";
  }

  /** Giả lập đang phục vụ request (ISR regeneration). */
  function asRuntime() {
    delete process.env.NEXT_PHASE;
  }

  afterEach(() => {
    // Trả env về đúng giá trị ban đầu, kể cả khi ban đầu nó không tồn tại.
    if (realPhase === undefined) delete process.env.NEXT_PHASE;
    else process.env.NEXT_PHASE = realPhase;
    jest.clearAllMocks();
  });

  describe("lúc BUILD — ưu tiên deploy được", () => {
    beforeEach(() => {
      asBuild();
      // Cảnh báo hạ cấp là hành vi có chủ đích; chặn ở đây để log test sạch.
      jest.spyOn(console, "warn").mockImplementation(() => undefined);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("cả hai nguồn hỏng: vẫn trả sitemap hợp lệ, chỉ còn URL tĩnh", async () => {
      mockNews.mockRejectedValueOnce(backendDown());
      mockProjects.mockRejectedValueOnce(backendDown());

      const list = await urls();

      expect(list.length).toBeGreaterThan(0);
      expect(list.some((url) => url.endsWith("/gioi-thieu"))).toBe(true);
      expect(list.some((url) => url.endsWith("/tin-tuc"))).toBe(true);
      expect(list.some((url) => url.endsWith("/du-an"))).toBe(true);
    });

    it("cả hai nguồn hỏng: KHÔNG đoán URL nội dung nào", async () => {
      mockNews.mockRejectedValueOnce(backendDown());
      mockProjects.mockRejectedValueOnce(backendDown());

      for (const url of await urls()) {
        // Không có slug bài, slug dự án hay slug chuyên mục nào — backend chưa
        // xác nhận được thì không được phép suy đoán từ trí nhớ.
        expect(url).not.toContain("/tin-tuc/");
        expect(url).not.toContain("/du-an/");
      }
    });

    it("cả hai nguồn hỏng: entry vẫn đúng hình dạng, không lộ field lạ", async () => {
      mockNews.mockRejectedValueOnce(backendDown());
      mockProjects.mockRejectedValueOnce(backendDown());

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

    it("chỉ tin tức hỏng: giữ URL dự án, bỏ bài + chuyên mục", async () => {
      mockNews.mockRejectedValueOnce(backendDown());

      const list = await urls();

      expect(
        list.some((url) => url.endsWith("/du-an/khu-do-thi-hung-phu")),
      ).toBe(true);
      expect(list.some((url) => url.includes("/tin-tuc/danh-muc/"))).toBe(false);
      expect(list.some((url) => url.endsWith("/tin-tuc/bai-a"))).toBe(false);
    });

    it("chỉ dự án hỏng: giữ URL bài + chuyên mục, bỏ dự án", async () => {
      mockProjects.mockRejectedValueOnce(backendDown());

      const list = await urls();

      expect(list.some((url) => url.endsWith("/tin-tuc/bai-a"))).toBe(true);
      expect(
        list.some((url) => url.endsWith("/tin-tuc/danh-muc/tin-du-an")),
      ).toBe(true);
      expect(
        list.some((url) => url.endsWith("/du-an/khu-do-thi-hung-phu")),
      ).toBe(false);
    });

    it("backend trả envelope lỗi (ApiError) cũng được coi là không sẵn sàng", async () => {
      mockNews.mockRejectedValueOnce(
        new ApiError("INTERNAL", "Lỗi máy chủ", 500),
      );
      mockProjects.mockRejectedValueOnce(
        new ApiError("INTERNAL", "Lỗi máy chủ", 500),
      );

      await expect(sitemap()).resolves.toBeDefined();
    });
  });

  describe("lúc CHẠY (ISR) — ưu tiên giữ sitemap tốt đã cache", () => {
    beforeEach(asRuntime);

    it("backend hỏng: ném lỗi để Next giữ bản cache cũ", async () => {
      mockNews.mockRejectedValueOnce(backendDown());
      mockProjects.mockRejectedValueOnce(backendDown());

      // Theo docs ISR: "the last successfully generated data will continue to
      // be served from the cache. On the next subsequent request, Next.js will
      // retry revalidating the data."
      await expect(sitemap()).rejects.toThrow("fetch failed");
    });

    it("một nguồn hỏng cũng ném — không tự hạ cấp sitemap đang tốt", async () => {
      mockNews.mockRejectedValueOnce(backendDown());

      await expect(sitemap()).rejects.toThrow("fetch failed");
    });

    it("backend bình thường: vẫn dựng sitemap đầy đủ như cũ", async () => {
      const list = await urls();

      expect(list.some((url) => url.endsWith("/tin-tuc/bai-a"))).toBe(true);
      expect(
        list.some((url) => url.endsWith("/du-an/khu-do-thi-hung-phu")),
      ).toBe(true);
    });
  });

  describe("lỗi lập trình KHÔNG bị nuốt", () => {
    it("lỗi không phải mạng vẫn ném ra, kể cả lúc build", async () => {
      asBuild();
      // Bug thật (vd. mapper đọc field của `undefined`) không được hoá trang
      // thành "backend hỏng" — nuốt nó đi thì sitemap chỉ âm thầm thiếu URL và
      // không ai biết để sửa.
      mockNews.mockRejectedValueOnce(
        new TypeError("Cannot read properties of undefined (reading 'slug')"),
      );

      await expect(sitemap()).rejects.toThrow("Cannot read properties");
    });

    it("lỗi lạ (không phải Error) vẫn ném ra", async () => {
      asBuild();
      mockProjects.mockRejectedValueOnce("hỏng bất thường");

      await expect(sitemap()).rejects.toBe("hỏng bất thường");
    });
  });
});
