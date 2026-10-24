import { fireEvent, render, screen } from "@testing-library/react";
import { CooperationSlider } from "./cooperation-slider";
import { ProjectPhotoStrip } from "./project-photo-strip";
import vi from "@/lib/i18n/dictionaries/vi.json";

beforeEach(() => {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: 1440,
  });
  window.matchMedia = jest.fn().mockImplementation(() => ({ matches: false }));
});
function finish(id: string) {
  const event = new Event("transitionend", { bubbles: true });
  Object.defineProperty(event, "propertyName", { value: "transform" });
  fireEvent(screen.getByTestId(id), event);
}
it("autoplays cooperation cards through both loop boundaries", () => {
  render(
    <CooperationSlider
      projects={Array.from({ length: 4 }, (_, index) => ({
        name: `Partner ${index + 1}`,
        location: "Location",
        scale: "Scale",
        status: "Status",
        role: "Role",
        partner: "Company",
      }))}
      labels={vi.homeCooperation}
    />,
  );
  for (let index = 0; index < 5; index++) {
    fireEvent.animationEnd(screen.getByTestId("cooperation-progress"));
    finish("cooperation-track");
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(2);
  }
  expect(screen.getAllByRole("heading", { level: 3 })[0]).toHaveTextContent(
    "Partner 2",
  );
});
it("autoplays the photo strip without reversing the whole track at the end", () => {
  render(
    <ProjectPhotoStrip
      title="Project"
      images={["/1.jpg", "/2.jpg", "/3.jpg", "/4.jpg"]}
    />,
  );
  for (let index = 0; index < 4; index++) {
    fireEvent.animationEnd(screen.getByTestId("photo-strip-progress"));
    finish("photo-strip-track");
    expect(screen.getAllByRole("img")).toHaveLength(3);
  }
  expect(screen.getAllByRole("img")[0]).toHaveAccessibleName(
    "Project - hình 1",
  );
  expect(screen.getByTestId("photo-strip-track")).toHaveStyle({
    transitionProperty: "none",
  });
});

it("preserves photo-strip swiping and leaves vertical scrolling alone", () => {
  render(
    <ProjectPhotoStrip
      title="Project"
      images={["/1.jpg", "/2.jpg", "/3.jpg", "/4.jpg"]}
    />,
  );
  const clipper = screen.getByTestId("photo-strip-track").parentElement!;
  const start = () =>
    fireEvent.touchStart(clipper, {
      touches: [{ clientX: 200, clientY: 100 }],
    });
  start();
  fireEvent.touchEnd(clipper, {
    changedTouches: [{ clientX: 190, clientY: 250 }],
  });
  expect(screen.getAllByRole("img")[0]).toHaveAccessibleName(
    "Project - hình 1",
  );
  start();
  fireEvent.touchEnd(clipper, {
    changedTouches: [{ clientX: 100, clientY: 110 }],
  });
  finish("photo-strip-track");
  expect(screen.getAllByRole("img")[0]).toHaveAccessibleName(
    "Project - hình 2",
  );
});
