import { render, screen } from "@testing-library/react";
import { NewsDetailGallery } from "./news-detail-gallery";

describe("NewsDetailGallery", () => {
  it("mot anh thi hien thi anh lon don gian", () => {
    render(
      <NewsDetailGallery
        images={["/images/news/a.jpg"]}
        title="Tin mau"
        galleryLabel="Hình ảnh bài viết"
        imageLabel="Ảnh"
      />,
    );

    expect(screen.getByRole("img", { name: "Tin mau" })).toBeInTheDocument();
    expect(screen.queryByLabelText("Hinh anh bai viet")).toBeNull();
  });

  it("nhieu anh thi hien thi du tat ca anh", () => {
    render(
      <NewsDetailGallery
        title="Tin mau"
        galleryLabel="Hình ảnh bài viết"
        imageLabel="Ảnh"
        images={[
          "/images/news/a.jpg",
          "/images/news/b.jpg",
          "/images/news/c.jpg",
          "/images/news/d.jpg",
          "/images/news/e.jpg",
          "/images/news/f.jpg",
          "/images/news/g.jpg",
        ]}
      />,
    );

    expect(screen.getByLabelText("Hình ảnh bài viết")).toBeInTheDocument();
    expect(screen.getAllByRole("img")).toHaveLength(7);
    expect(screen.queryByText("+2")).toBeNull();
    expect(screen.getByRole("img", { name: "Tin mau — Ảnh 7" })).toBeInTheDocument();
  });

  it("khong lap lai anh trung nhau", () => {
    render(
      <NewsDetailGallery
        title="Tin mau"
        galleryLabel="Hình ảnh bài viết"
        imageLabel="Ảnh"
        images={[
          "/images/news/a.jpg",
          "/images/news/a.jpg",
          "/images/news/b.jpg",
        ]}
      />,
    );

    expect(screen.getAllByRole("img")).toHaveLength(2);
  });
});
