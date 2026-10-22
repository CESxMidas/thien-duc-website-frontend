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
  });
});
