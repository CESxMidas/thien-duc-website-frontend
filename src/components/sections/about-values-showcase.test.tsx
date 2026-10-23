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
        description="These principles shape how we work."
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
    expect(screen.getByRole("heading", { level: 2 })).toHaveClass(
      "about-values-title",
    );
    expect(screen.getAllByRole("article")).toHaveLength(3);
    expect(screen.getByText("These principles shape how we work.")).toBeInTheDocument();
    expect(screen.getByText("Vision description")).toBeInTheDocument();
    expect(screen.getByText("Mission description")).toBeInTheDocument();
    expect(screen.getByText("Core values description")).toBeInTheDocument();
  });

  it("makes each value panel keyboard focusable", () => {
    render(
      <AboutValuesShowcase
        eyebrow="Vision · Mission · Core values"
        title="Creating spaces for meaningful living"
        description="These principles shape how we work."
        imageAlt="Architecture and landscape"
        values={values}
      />,
    );

    screen.getAllByRole("article").forEach((article) => {
      expect(article).toHaveAttribute("tabindex", "0");
    });
  });

  it("uses a full-bleed image with fading overlay and panels in the scene layout", () => {
    const { container } = render(
      <AboutValuesShowcase
        eyebrow="Vision · Mission · Core values"
        title="Creating spaces for meaningful living"
        description="These principles shape how we work."
        imageAlt="Architecture and landscape"
        values={values}
      />,
    );

    const panels = screen.getAllByRole("article");
    const panelGroup = panels[0].parentElement;
    const scene = container.querySelector(".about-values-scene");

    expect(scene?.querySelector("img")).toHaveAttribute(
      "alt",
      "Architecture and landscape",
    );
    expect(scene?.querySelector(".about-values-overlay")).toBeInTheDocument();
    expect(scene?.querySelectorAll(".about-values-foliage")).toHaveLength(2);
    expect(scene).toContainElement(panelGroup);
    expect(panelGroup).toHaveClass(
      "lg:col-start-2",
      "lg:row-start-1",
      "lg:-ml-10",
      "lg:grid-cols-3",
      "lg:gap-4",
      "xl:gap-5",
    );
    expect(scene).toHaveClass(
      "lg:grid",
      "lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.4fr)]",
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveClass(
      "about-values-title",
    );
    expect(scene).not.toHaveClass(
      "lg:min-h-[25rem]",
      "xl:min-h-[26rem]",
    );
  });

  it("aligns the full-bleed image with the header gutters", () => {
    const { container } = render(
      <AboutValuesShowcase
        eyebrow="Vision · Mission · Core values"
        title="Creating spaces for meaningful living"
        description="These principles shape how we work."
        imageAlt="Architecture and landscape"
        values={values}
      />,
    );

    const section = container.querySelector(".about-values-showcase");
    const scene = container.querySelector(".about-values-scene");

    expect(section).toHaveClass(
      "px-5",
      "sm:px-8",
      "lg:px-14",
      "xl:px-20",
    );
    expect(scene).toHaveClass("overflow-hidden", "rounded-2xl");
    expect(scene?.querySelector("img")).toHaveClass(
      "absolute",
      "inset-0",
      "size-full",
      "object-cover",
    );
  });
});
