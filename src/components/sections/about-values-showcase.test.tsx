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

  it("keeps the value panels close to the heading without a fixed-height gap", () => {
    render(
      <AboutValuesShowcase
        eyebrow="Vision · Mission · Core values"
        title="Creating spaces for meaningful living"
        imageAlt="Architecture and landscape"
        values={values}
      />,
    );

    const panels = screen.getAllByRole("article");
    const panelGroup = panels[0].parentElement;

    expect(panelGroup).toHaveClass("xl:mt-12");
    expect(panelGroup).not.toHaveClass("xl:mt-auto", "xl:pt-20");
    expect(panelGroup?.parentElement?.parentElement).not.toHaveClass(
      "xl:min-h-[760px]",
    );
  });

  it("aligns the showcase and its image with the header gutters", () => {
    const { container } = render(
      <AboutValuesShowcase
        eyebrow="Vision · Mission · Core values"
        title="Creating spaces for meaningful living"
        imageAlt="Architecture and landscape"
        values={values}
      />,
    );

    const section = container.querySelector(".about-values-showcase");
    const imageFrame = container.querySelector(".aspect-\\[16\\/10\\]");

    expect(section).toHaveClass("px-5", "sm:px-8", "lg:px-14", "xl:px-20");
    expect(imageFrame).not.toHaveClass("-mx-5", "sm:-mx-8", "lg:-mx-14");
  });
});
