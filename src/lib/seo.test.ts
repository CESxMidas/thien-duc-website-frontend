/**
 * Test JSON-LD + metadata builders (task →7, bảo vệ bởi task →8).
 * Không hardcode host: mọi URL kỳ vọng dựng từ `siteConfig.url` để test chạy
 * đúng dù `NEXT_PUBLIC_SITE_URL` có được đặt hay không.
 */
import {
  brandName,
  legalDisplayName,
  legalInfo,
  siteConfig,
} from "@/config/site";
import type { NewsPost } from "@/types/content";
import {
  absoluteUrl,
  buildAlternates,
  buildNewsArticleJsonLd,
  buildOrganizationJsonLd,
  buildPageMetadata,
  organizationId,
} from "./seo";

const post: NewsPost = {
  title: "Khởi công dự án Hưng Phú",
  slug: "khoi-cong-du-an-hung-phu",
  summary: "Tóm tắt bài viết.",
  publishedAt: "2026-07-01T08:00:00.000Z",
  image: "/images/news/hung-phu.jpg",
};

describe("absoluteUrl", () => {
  it("ghép path tương đối vào siteConfig.url", () => {
    expect(absoluteUrl("/du-an")).toBe(
      new URL("/du-an", siteConfig.url).toString(),
    );
  });
});

describe("buildOrganizationJsonLd (→7)", () => {
  const org = buildOrganizationJsonLd("vi");

  it("khai đúng @type/@id để schema khác tham chiếu", () => {
    expect(org["@context"]).toBe("https://schema.org");
    expect(org["@type"]).toBe("Organization");
    expect(org["@id"]).toBe(organizationId());
    expect(org["@id"]).toBe(absoluteUrl("/#organization"));
  });

  it("bản vi dùng đúng tên/pháp lý tiếng Việt từ config/site.ts", () => {
    expect(org.name).toBe(brandName.vi);
    expect(org.name).toBe(siteConfig.name);
    expect(org.legalName).toBe(legalDisplayName.vi);
    expect(org.legalName).toBe(legalInfo.legalName);
    expect(org.taxID).toBe(legalInfo.taxCode);
    expect(org.email).toBe(siteConfig.email);
    expect(org.telephone).toBe(siteConfig.phone);
    expect(org.url).toBe(siteConfig.url);
  });

  it("bản en dùng tên/pháp lý hiển thị tiếng Anh (EN-FULL-A)", () => {
    const en = buildOrganizationJsonLd("en");
    expect(en.name).toBe(brandName.en);
    expect(en.name).toBe("Thien Duc Company");
    expect(en.legalName).toBe(legalDisplayName.en);
    expect(en.address).toMatchObject({
      addressLocality: "Ho Chi Minh City",
      addressCountry: "VN",
    });
  });

  it("đổi operatingSince dd/mm/yyyy → foundingDate ISO 8601", () => {
    // legalInfo.operatingSince = "05/04/2010"
    expect(org.foundingDate).toBe("2010-04-05");
  });

  it("address là PostalAddress có addressCountry VN", () => {
    expect(org.address).toMatchObject({
      "@type": "PostalAddress",
      addressCountry: "VN",
    });
  });
});

describe("buildNewsArticleJsonLd (→7)", () => {
  it("bài không ghi tác giả → author trỏ Organization qua @id", () => {
    const article = buildNewsArticleJsonLd(post, "vi");

    expect(article["@type"]).toBe("NewsArticle");
    expect(article.headline).toBe(post.title);
    expect(article.description).toBe(post.summary);
    expect(article.datePublished).toBe(post.publishedAt);
    expect(article.author).toEqual({ "@id": organizationId() });
    expect(article.publisher).toEqual({ "@id": organizationId() });
  });

  it("bài có tác giả → author là Person", () => {
    const article = buildNewsArticleJsonLd(
      { ...post, author: "Nguyễn Văn A" },
      "vi",
    );
    expect(article.author).toEqual({ "@type": "Person", name: "Nguyễn Văn A" });
  });

  it("localize URL đúng theo locale (vi không tiền tố, en có /en)", () => {
    const vi = buildNewsArticleJsonLd(post, "vi");
    const en = buildNewsArticleJsonLd(post, "en");

    expect(vi.mainEntityOfPage).toEqual({
      "@type": "WebPage",
      "@id": absoluteUrl(`/tin-tuc/${post.slug}`),
    });
    expect(en.mainEntityOfPage).toEqual({
      "@type": "WebPage",
      "@id": absoluteUrl(`/en/tin-tuc/${post.slug}`),
    });
    expect(vi.inLanguage).toBe("vi-VN");
    expect(en.inLanguage).toBe("en");
  });

  it("ảnh thành URL tuyệt đối; bài không ảnh thì bỏ field image", () => {
    const withImage = buildNewsArticleJsonLd(post, "vi");
    expect(withImage.image).toEqual([absoluteUrl(post.image!)]);

    const noImage = buildNewsArticleJsonLd({ ...post, image: undefined }, "vi");
    expect(noImage).not.toHaveProperty("image");
  });
});

describe("buildAlternates", () => {
  it("canonical theo locale đang xem, hreflang đủ 2 bản + x-default về vi", () => {
    const alternates = buildAlternates("/du-an", "en")!;

    expect(alternates.canonical).toBe(absoluteUrl("/en/du-an"));
    expect(alternates.languages).toEqual({
      "vi-VN": absoluteUrl("/du-an"),
      en: absoluteUrl("/en/du-an"),
      "x-default": absoluteUrl("/du-an"),
    });
  });
});

describe("buildPageMetadata", () => {
  const input = {
    title: "Dự án",
    description: "Danh sách dự án.",
    path: "/du-an",
    locale: "vi" as const,
  };

  it("gom đủ canonical + Open Graph + Twitter Card", () => {
    const metadata = buildPageMetadata(input);

    expect(metadata.title).toBe(input.title);
    expect(metadata.alternates?.canonical).toBe(absoluteUrl("/du-an"));
    expect(metadata.openGraph).toMatchObject({
      url: absoluteUrl("/du-an"),
      siteName: siteConfig.name,
      locale: "vi-VN",
    });
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
    // Mặc định không noindex
    expect(metadata.robots).toBeUndefined();
  });

  it("noIndex → robots chặn index nhưng vẫn follow", () => {
    const metadata = buildPageMetadata({ ...input, noIndex: true });
    expect(metadata.robots).toEqual({ index: false, follow: true });
  });
});
