import { fireEvent, render, screen } from "@testing-library/react";
import ProjectImageGallery from "./project-item-gallery";

// JSDOM không dựng layout cho Image fill; dùng img để kiểm tra sự kiện tải ảnh.
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, className, onLoad }: React.ComponentProps<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element -- Ảnh thuần chỉ dùng trong test JSDOM.
    <img src={src} alt={alt} className={className} onLoad={onLoad} />
  ),
}));

describe("ProjectImageGallery", () => {
  beforeAll(() => {
    window.HTMLElement.prototype.scrollTo = jest.fn();
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  it("ảnh chính phủ kín khung, không để dải trống ở cạnh ảnh", () => {
    render(
      <ProjectImageGallery
        images={["/images/projects/fancy-tower.jpg"]}
        title="Fancy Tower"
      />,
    );

    expect(screen.getByRole("img", { name: /Fancy Tower/ })).toHaveClass(
      "object-cover", "object-center",
    );
  });

  it("giữ nguyên khung chuẩn khi ảnh ngang và ảnh dọc tải xong hoặc chuyển ảnh", () => {
    const { container } = render(
      <ProjectImageGallery
        images={["/images/projects/wide.jpg", "/images/projects/portrait.jpg"]}
        title="Fancy Tower"
      />,
    );
    const stage = container.querySelector<HTMLElement>(".project-gallery-stage")!;
    expect(stage).toHaveClass("project-image-frame");
    for (const [index, dimensions] of [[2400, 900], [800, 1600]].entries()) {
      fireEvent.click(screen.getByRole("button", { name: `Xem hình ${index + 1}` }));
      const image = screen.getByRole("img", { name: `Fancy Tower - hình ${index + 1}` });
      Object.defineProperty(image, "naturalWidth", { configurable: true, value: dimensions[0] });
      Object.defineProperty(image, "naturalHeight", { configurable: true, value: dimensions[1] });
      fireEvent.load(image);
      expect(stage.style.aspectRatio).toBe("");
      expect(stage).toHaveClass("project-image-frame");
      expect(image).toHaveClass("object-cover", "object-center");
    }
  });
});
