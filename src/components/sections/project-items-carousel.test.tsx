import { fireEvent, render, screen } from "@testing-library/react";
import { ProjectItemsCarousel } from "./project-items-carousel";
import vi from "@/lib/i18n/dictionaries/vi.json";

let reducedMotion = false;
beforeEach(() => {
  reducedMotion = false;
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    writable: true,
    value: 1440,
  });
  window.matchMedia = jest
    .fn()
    .mockImplementation(() => ({ matches: reducedMotion }));
});
function renderItems(count: number) {
  return render(
    <ProjectItemsCarousel
      items={Array.from({ length: count }, (_, index) => ({
        title: `Item ${index + 1}`,
        slug: `item-${index + 1}`,
        summary: "Item summary",
      }))}
      projectSlug="test-project"
      projectStatus="da-ban-giao"
      locale="vi"
      statusLabels={vi.projectStatus}
      labels={vi.itemsCarousel}
    />,
  );
}
function finish() {
  const event = new Event("transitionend", { bubbles: true });
  Object.defineProperty(event, "propertyName", { value: "transform" });
  fireEvent(screen.getByTestId("project-items-track"), event);
}
const next = () => {
  fireEvent.click(screen.getByLabelText(vi.itemsCarousel.ariaNext));
  finish();
};
const titles = () =>
  screen.getAllByRole("heading", { level: 3 }).map((node) => node.textContent);

it.each([4, 5, 7])(
  "loops %i items one card at a time with a full viewport",
  (count) => {
    renderItems(count);
    for (let index = 0; index < count; index++) {
      next();
      expect(titles()).toHaveLength(3);
    }
    expect(titles()).toEqual(["Item 1", "Item 2", "Item 3"]);
  },
);
it("crosses the previous boundary without changing visible cards when settling", () => {
  renderItems(4);
  fireEvent.click(screen.getByLabelText(vi.itemsCarousel.ariaPrevious));
  expect(titles()).toEqual(["Item 4", "Item 1", "Item 2"]);
  finish();
  expect(titles()).toEqual(["Item 4", "Item 1", "Item 2"]);
  expect(screen.getByTestId("project-items-track")).toHaveStyle({
    transitionProperty: "none",
  });
});
it.each([
  [375, 1],
  [430, 1],
  [768, 2],
  [1024, 2],
  [1440, 3],
])("keeps %ipx viewport filled with %i cards", (width, visible) => {
  window.innerWidth = width;
  renderItems(4);
  next();
  expect(titles()).toHaveLength(visible);
});
it("keeps the current first item during a responsive change", () => {
  window.innerWidth = 375;
  renderItems(4);
  fireEvent.click(screen.getByLabelText(vi.itemsCarousel.ariaPrevious));
  finish();
  window.innerWidth = 1440;
  fireEvent(window, new Event("resize"));
  expect(titles()).toEqual(["Item 4", "Item 1", "Item 2"]);
});
it.each([2, 3])("autoplays even with only %i items", (count) => {
  renderItems(count);
  fireEvent.animationEnd(screen.getByTestId("project-items-progress"));
  finish();
  expect(titles()[0]).toBe("Item 2");
  expect(screen.getAllByRole("link")).toHaveLength(count);
});
it("keeps hidden copies inert and navigates to the right item", () => {
  renderItems(4);
  expect(screen.getAllByRole("link")).toHaveLength(3);
  expect(screen.getAllByRole("link")[0]).toHaveAttribute(
    "href",
    "/du-an/test-project/item-1",
  );
  expect(screen.getAllByTestId("project-items-slide")[0]).toHaveAttribute(
    "inert",
  );
});
it("pauses autoplay while hovered", () => {
  const { container } = renderItems(4);
  fireEvent.mouseEnter(container.firstElementChild!);
  const progress = screen.getByTestId("project-items-progress");
  expect(progress).toHaveStyle({ animationPlayState: "paused" });
  fireEvent.animationEnd(progress);
  expect(titles()[0]).toBe("Item 1");
  fireEvent.mouseLeave(container.firstElementChild!);
  fireEvent.animationEnd(progress);
  finish();
  expect(titles()[0]).toBe("Item 2");
});
it("disables automatic motion but permits manual navigation for reduced motion", () => {
  reducedMotion = true;
  renderItems(4);
  expect(screen.queryByTestId("project-items-progress")).toBeNull();
  next();
  expect(titles()[0]).toBe("Item 2");
});
it("omits controls for a single item and renders nothing for an empty list", () => {
  const view = renderItems(1);
  expect(screen.queryByLabelText(vi.itemsCarousel.ariaNext)).toBeNull();
  view.unmount();
  expect(renderItems(0).container).toBeEmptyDOMElement();
});
