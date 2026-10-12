import { render, screen } from "@testing-library/react";
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
});
