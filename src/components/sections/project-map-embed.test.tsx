import { render, screen } from "@testing-library/react";
import { ProjectMapEmbed } from "./project-map-embed";

describe("ProjectMapEmbed", () => {
  it("anh du an ben trai hien tron, khong crop mat logo", () => {
    render(
      <ProjectMapEmbed
        query="Fancy Tower Ben Tre"
        title="Fancy Tower"
        locale="en"
        aerialImage="/images/projects/fancy-tower.jpg"
      />,
    );

    expect(screen.getByRole("img", { name: /Image of Fancy Tower/i })).toHaveClass(
      "object-contain",
    );
  });
});
