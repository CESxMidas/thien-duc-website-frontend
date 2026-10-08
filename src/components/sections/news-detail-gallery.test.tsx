import { fireEvent, render, screen } from "@testing-library/react";
import { NewsDetailGallery } from "./news-detail-gallery";

describe("NewsDetailGallery", () => {
  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  it("mot anh thi hien thi anh lon don gian", () => {
    render(
      <NewsDetailGallery
        images={["/images/news/a.jpg"]}
        title="Tin mau"
        galleryLabel="Gallery"
        imageLabel="Image"
      />,
    );

    expect(screen.getByRole("img", { name: "Tin mau" })).toBeInTheDocument();
    expect(screen.queryByLabelText("Gallery")).toBeNull();
  });

  it("nhieu anh thi hien thi anh chinh va day du thumbnail", () => {
    render(
      <NewsDetailGallery
        title="Tin mau"
        galleryLabel="Gallery"
        imageLabel="Image"
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

    expect(screen.getByLabelText("Gallery")).toBeInTheDocument();
    expect(screen.getAllByRole("img")).toHaveLength(8);
    expect(screen.queryByText("+2")).toBeNull();
    expect(
      screen.getByRole("img", { name: "Tin mau, Image 7" }),
    ).toBeInTheDocument();
  });

  it("click thumbnail thi cap nhat anh chinh va active indicator", () => {
    render(
      <NewsDetailGallery
        title="Tin mau"
        galleryLabel="Gallery"
        imageLabel="Image"
        images={[
          "/images/news/a.jpg",
          "/images/news/b.jpg",
          "/images/news/c.jpg",
        ]}
      />,
    );

    const mainImage = screen.getByRole("img", { name: "Tin mau" });
    expect(mainImage).toHaveAttribute("src", expect.stringContaining("a.jpg"));

    const thirdThumbnail = screen.getByRole("button", { name: "Image 3" });
    fireEvent.click(thirdThumbnail);

    expect(screen.getByRole("img", { name: "Tin mau" })).toHaveAttribute(
      "src",
      expect.stringContaining("c.jpg"),
    );
    expect(thirdThumbnail).toHaveAttribute("aria-current", "true");
  });

  it("khong lap lai anh trung nhau", () => {
    render(
      <NewsDetailGallery
        title="Tin mau"
        galleryLabel="Gallery"
        imageLabel="Image"
        images={[
          "/images/news/a.jpg",
          "/images/news/a.jpg",
          "/images/news/b.jpg",
        ]}
      />,
    );

    expect(screen.getAllByRole("img")).toHaveLength(3);
  });
});
