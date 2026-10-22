import { render, screen } from "@testing-library/react";
import { CareersHero } from "./careers-hero";

describe("CareersHero", () => {
  it("renders one accessible page heading and the approved introduction", () => {
    render(
      <CareersHero
        eyebrow="Careers"
        title="Career opportunities at Thien Duc"
        description="Approved careers introduction"
        imageAlt="Thien Duc development"
        positionsCtaLabel="View open positions"
        aboutCtaLabel="About the company"
        aboutHref="/about"
      />,
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Career opportunities at Thien Duc",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Approved careers introduction")).toBeInTheDocument();
    expect(screen.getByAltText("Thien Duc development")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "View open positions" }),
    ).toHaveAttribute("href", "#open-positions");
    expect(
      screen.getByRole("link", { name: "About the company" }),
    ).toHaveAttribute("href", "/about");
    expect(
      screen.getByRole("region", {
        name: "Career opportunities at Thien Duc",
      }),
    ).toHaveClass("careers-hero");
  });
});
