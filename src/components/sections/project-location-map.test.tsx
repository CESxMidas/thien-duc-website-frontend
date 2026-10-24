import { render, screen } from "@testing-library/react";
import { ProjectLocationMap } from "./project-location-map";

describe("ProjectLocationMap", () => {
  const baseMap = {
    googleMapsUrl: "https://maps.google.com/?q=Fancy+Tower",
    markerLeft: 50,
    markerTop: 50,
  };

  it("khong render anh ban do hong khi CMS chua co anh dia chi", () => {
    render(
      <ProjectLocationMap
        mapLocation={{ ...baseMap, image: "" }}
        title="Fancy Tower"
        locale="vi"
      />,
    );

    expect(screen.queryByRole("img")).toBeNull();
    expect(
      screen.getByRole("link", { name: /Fancy Tower/ }),
    ).toHaveAttribute("href", baseMap.googleMapsUrl);
  });

  it("van render anh ban do khi CMS co anh dia chi", () => {
    render(
      <ProjectLocationMap
        mapLocation={{ ...baseMap, image: "/images/maps/fancy-tower.jpg" }}
        title="Fancy Tower"
        locale="vi"
      />,
    );

    expect(screen.getByRole("img", { name: /Fancy Tower/ })).toHaveAttribute(
      "src",
      expect.stringContaining("fancy-tower.jpg"),
    );
  });

  it("ảnh dự án cạnh sơ đồ vị trí phủ kín khung, không có dải trống", () => {
    render(
      <ProjectLocationMap
        mapLocation={{ ...baseMap, image: "" }}
        title="Fancy Tower"
        locale="en"
        aerialImage="/images/projects/fancy-tower.jpg"
      />,
    );

    expect(
      screen.getByRole("img", { name: /Aerial view of Fancy Tower/i }),
    ).toHaveClass("object-cover", "object-left-top", "origin-top-left");
  });
});
