import { render, screen } from "@testing-library/react";
import { AboutValuesShowcase } from "./about-values-showcase";

const values = [
  { title: "Vision", description: "Vision description" },
  { title: "Mission", description: "Mission description" },
  { title: "Core values", description: "Core values description" },
];

describe("AboutValuesShowcase", () => {
  it("renders the editorial heading and all value statements", () => {
    render(
      <AboutValuesShowcase
        eyebrow="Vision · Mission · Core values"
        title="Creating spaces for meaningful living"
        imageAlt="Architecture and landscape"
        values={values}
      />,
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Creating spaces for meaningful living",
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(3);
    expect(screen.getByText("Vision description")).toBeInTheDocument();
    expect(screen.getByText("Mission description")).toBeInTheDocument();
    expect(screen.getByText("Core values description")).toBeInTheDocument();
  });

  it("makes each value panel keyboard focusable", () => {
    render(
      <AboutValuesShowcase
        eyebrow="Vision · Mission · Core values"
        title="Creating spaces for meaningful living"
        imageAlt="Architecture and landscape"
        values={values}
      />,
    );

    screen.getAllByRole("article").forEach((article) => {
      expect(article).toHaveAttribute("tabindex", "0");
    });
  });
});
