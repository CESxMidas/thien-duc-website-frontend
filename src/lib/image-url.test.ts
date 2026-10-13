import {
  newsImageFallback,
  resolveNewsImageList,
  resolveNewsImageUrl,
} from "./image-url";

describe("resolveNewsImageUrl", () => {
  it("keeps Cloudinary URLs unchanged", () => {
    const url = "https://res.cloudinary.com/ksnntvmu/image/upload/news/a.webp";
    expect(resolveNewsImageUrl(url)).toBe(url);
  });

  it("keeps local URLs unchanged", () => {
    expect(resolveNewsImageUrl("/images/news/a.jpg")).toBe(
      "/images/news/a.jpg",
    );
  });

  it("maps the verified local replacement for the Fancy Tower article", () => {
    expect(
      resolveNewsImageUrl(
        "https://www.thienduccons.vn/img_data/images/796930583506.jpg",
      ),
    ).toBe("/images/news/2021/le-khoi-cong-fancy-tower-2021-04-07.jpg");
  });

  it("uses the neutral site fallback for broken legacy news URLs", () => {
    expect(
      resolveNewsImageUrl(
        "https://thienduccons.vn/img_data/images/353573832844.jpg",
      ),
    ).toBe(newsImageFallback);
  });

  it("uses the existing fallback for empty images", () => {
    expect(resolveNewsImageUrl(null)).toBe(newsImageFallback);
    expect(resolveNewsImageUrl("")).toBe(newsImageFallback);
  });

  it("keeps unrelated external URLs unchanged", () => {
    const url = "https://cdn.example.com/news/a.jpg";
    expect(resolveNewsImageUrl(url)).toBe(url);
  });
});

describe("resolveNewsImageList", () => {
  it("normalizes and de-duplicates gallery URLs", () => {
    expect(
      resolveNewsImageList([
        "https://www.thienduccons.vn/img_data/images/353573832844.jpg",
        newsImageFallback,
        "/images/news/a.jpg",
      ]),
    ).toEqual([newsImageFallback, "/images/news/a.jpg"]);
  });
});
