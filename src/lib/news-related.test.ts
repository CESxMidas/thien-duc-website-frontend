import type { NewsPost } from "@/types/content";
import {
  compareNewsByDisplayDate,
  getNewsDisplayDate,
  isArticleSubheading,
  selectRelatedNews,
} from "./news-related";

function post(input: Partial<NewsPost> & Pick<NewsPost, "slug">): NewsPost {
  return {
    title: input.slug,
    slug: input.slug,
    summary: "",
    publishedAt: input.publishedAt ?? "",
    eventDate: input.eventDate,
    createdAt: input.createdAt,
    category: input.category,
  };
}

describe("news-related", () => {
  it("uu tien ngay hien thi theo eventDate, publishedAt, createdAt", () => {
    expect(
      getNewsDisplayDate(
        post({
          slug: "event",
          eventDate: "2026-10-07",
          publishedAt: "2026-01-01",
          createdAt: "2026-09-01",
        }),
      ),
    ).toBe("2026-10-07");

    expect(
      getNewsDisplayDate(
        post({
          slug: "published",
          publishedAt: "2026-08-01",
          createdAt: "2026-09-01",
        }),
      ),
    ).toBe("2026-08-01");

    expect(getNewsDisplayDate(post({ slug: "created", createdAt: "2026-07-01" })))
      .toBe("2026-07-01");
  });

  it("sort DESC bang ngay uu tien, khong de bai import moi nhay len dau", () => {
    const posts = [
      post({
        slug: "lich-su-import-moi",
        publishedAt: "2020-01-01",
        createdAt: "2026-10-01",
      }),
      post({
        slug: "su-kien-moi",
        eventDate: "2026-09-01",
        publishedAt: "2024-01-01",
        createdAt: "2024-01-01",
      }),
      post({ slug: "tin-published", publishedAt: "2025-05-01" }),
    ];

    expect(posts.sort(compareNewsByDisplayDate).map((item) => item.slug)).toEqual([
      "su-kien-moi",
      "tin-published",
      "lich-su-import-moi",
    ]);
  });

  it("uu tien cung chuyen muc, thieu thi bo sung tin moi toan site", () => {
    const category = { slug: "su-kien", name: "Su kien" };
    const otherCategory = { slug: "du-an", name: "Du an" };
    const current = post({ slug: "current", category });
    const related = selectRelatedNews(
      [
        current,
        post({ slug: "same-old", category, eventDate: "2026-01-01" }),
        post({ slug: "same-new", category, eventDate: "2026-03-01" }),
        post({ slug: "other-new", category: otherCategory, eventDate: "2026-04-01" }),
        post({ slug: "other-old", category: otherCategory, eventDate: "2025-01-01" }),
      ],
      current,
      3,
    );

    expect(related.map((item) => item.slug)).toEqual([
      "same-new",
      "same-old",
      "other-new",
    ]);
  });

  it("nhan dien subheading ngan viet hoa, khong bien paragraph thuong thanh heading", () => {
    expect(isArticleSubheading("MOT DAU MOC QUAN TRONG")).toBe(true);
    expect(
      isArticleSubheading(
        "Day la mot doan noi dung dai co dau cham nen van la paragraph.",
      ),
    ).toBe(false);
  });
});
