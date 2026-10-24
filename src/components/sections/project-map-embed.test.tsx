import { render, screen } from "@testing-library/react";
import { ProjectMapEmbed } from "./project-map-embed";

describe("ProjectMapEmbed", () => {
  it("ảnh dự án cạnh bản đồ phủ kín khung, không có dải trống", () => {
    render(
      <ProjectMapEmbed
        query="Fancy Tower Ben Tre"
        title="Fancy Tower"
        locale="en"
        aerialImage="/images/projects/fancy-tower.jpg"
      />,
    );

    expect(screen.getByRole("img", { name: /Image of Fancy Tower/i })).toHaveClass(
      "object-cover", "object-left-top", "origin-top-left",
    );
  });
});
