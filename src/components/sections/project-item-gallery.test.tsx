import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ProjectImageGallery from "./project-item-gallery";

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

  it("hien anh chinh theo kieu contain de khong cat mat cong trinh", () => {
    render(
      <ProjectImageGallery
        images={["/images/projects/fancy-tower.jpg"]}
        title="Fancy Tower"
      />,
    );

    expect(screen.getByRole("img", { name: /Fancy Tower/ })).toHaveClass(
      "object-contain",
    );
  });

  it("doi ti le khung theo ti le that cua anh dang hien thi", async () => {
    const { container } = render(
      <ProjectImageGallery
        images={["/images/projects/fancy-tower.jpg"]}
        title="Fancy Tower"
      />,
    );
    const image = screen.getByRole("img", { name: /Fancy Tower/ });

    Object.defineProperty(image, "naturalWidth", {
      configurable: true,
      value: 1080,
    });
    Object.defineProperty(image, "naturalHeight", {
      configurable: true,
      value: 810,
    });
    fireEvent.load(image);

    await waitFor(() =>
      expect(
        container.querySelector<HTMLElement>(".project-gallery-stage"),
      ).toHaveStyle({ aspectRatio: "1.3333333333333333" }),
    );
  });
});
