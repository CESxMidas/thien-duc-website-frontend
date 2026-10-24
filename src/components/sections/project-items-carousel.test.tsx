import { fireEvent, render, screen, within } from "@testing-library/react";
import { ProjectItemsCarousel } from "./project-items-carousel";
import type { ProjectItem } from "@/types/content";
import viDictionary from "@/lib/i18n/dictionaries/vi.json";

let reducedMotion = false;

beforeEach(() => {
  reducedMotion = false;
  Object.defineProperty(window, "innerWidth", { configurable: true, writable: true, value: 1440 });
  window.matchMedia = jest.fn().mockImplementation(() => ({ matches: reducedMotion }));
});

function renderItems(count: number) {
  const items: ProjectItem[] = Array.from({ length: count }, (_, index) => ({
    title: `Hạng mục ${index + 1}`,
    slug: `hang-muc-${index + 1}`,
    summary: "Mô tả hạng mục",
  }));
  return render(<ProjectItemsCarousel
    items={items}
    projectSlug="hung-phu"
    projectStatus="da-ban-giao"
    locale="vi"
    statusLabels={viDictionary.projectStatus}
    labels={viDictionary.itemsCarousel}
  />);
}

function finish() {
  const event = new Event("transitionend", { bubbles: true });
  Object.defineProperty(event, "propertyName", { value: "transform" });
  fireEvent(screen.getByTestId("project-items-track"), event);
}
const next = () => { fireEvent.click(screen.getByLabelText(viDictionary.itemsCarousel.ariaNext)); finish(); };
const previous = () => { fireEvent.click(screen.getByLabelText(viDictionary.itemsCarousel.ariaPrevious)); finish(); };
const visiblePage = () => screen.getAllByTestId("project-items-page").find(page => !page.hasAttribute("aria-hidden"))!;
const titles = () => within(visiblePage()).getAllByRole("heading").map(heading => heading.textContent);

it.each([4, 5, 7])("%i hạng mục: lượt cuối có đủ ba thẻ và quay lại đầu", (count) => {
  renderItems(count);
  previous();
  expect(titles()).toHaveLength(3);
  expect(new Set(titles()).size).toBe(3);
  expect(titles()).toEqual([`Hạng mục ${count - 2}`, `Hạng mục ${count - 1}`, `Hạng mục ${count}`]);
  next();
  expect(titles()).toEqual(["Hạng mục 1", "Hạng mục 2", "Hạng mục 3"]);
});

it("bốn hạng mục nối lượt cuối 4–1–2 thay vì chừa hai ô trống", () => {
  renderItems(4);
  next();
  expect(titles()).toEqual(["Hạng mục 4", "Hạng mục 1", "Hạng mục 2"]);
  expect(within(visiblePage()).getByRole("link", { name: "Xem hạng mục Hạng mục 4" })).toHaveAttribute("href", "/du-an/hung-phu/hang-muc-4");
});

it.each([[375, 1], [430, 1], [768, 2], [1024, 2], [1280, 3], [1440, 3]])("chiều rộng %ipx hiển thị %i thẻ mỗi lượt", (width, count) => {
  window.innerWidth = width;
  renderItems(4);
  expect(titles()).toHaveLength(count);
  next();
  expect(titles()).toHaveLength(count);
});

it("đổi kích thước khi đang ở cuối không làm mất trang đang hiển thị", () => {
  window.innerWidth = 375;
  renderItems(4);
  previous();
  expect(titles()).toEqual(["Hạng mục 4"]);
  window.innerWidth = 1440;
  fireEvent(window, new Event("resize"));
  expect(titles()).toEqual(["Hạng mục 2", "Hạng mục 3", "Hạng mục 4"]);
});

it.each([1, 2, 3])("chỉ %i hạng mục: dùng đủ chiều ngang và ẩn điều hướng", (count) => {
  renderItems(count);
  expect(titles()).toHaveLength(count);
  expect(visiblePage()).toHaveClass(`grid-cols-${count}`);
  expect(screen.queryByLabelText(viDictionary.itemsCarousel.ariaNext)).not.toBeInTheDocument();
});

it("các trang khuất không nhận tương tác bàn phím", () => {
  renderItems(4);
  const hiddenPage = screen.getAllByTestId("project-items-page")[0];
  expect(hiddenPage).toHaveAttribute("aria-hidden", "true");
  expect(hiddenPage).toHaveAttribute("inert");
  expect(screen.getAllByRole("link")).toHaveLength(3);
});

it("tự chạy quay vòng và tạm dừng khi rê chuột", () => {
  const { container } = renderItems(4);
  fireEvent.animationEnd(container.querySelector(".banner-progress")!);
  finish();
  expect(titles()[0]).toBe("Hạng mục 4");
  fireEvent.mouseEnter(container.querySelector(".project-items-carousel")!);
  expect(container.querySelector(".banner-progress")).toBeNull();
  fireEvent.mouseLeave(container.querySelector(".project-items-carousel")!);
  fireEvent.animationEnd(container.querySelector(".banner-progress")!);
  expect(titles()[0]).toBe("Hạng mục 3");
});

it("qua cuối vẫn trượt về phía trước rồi đổi vị trí không có transition", () => {
  renderItems(4);
  next(); next(); next();
  const track = screen.getByTestId("project-items-track");
  expect(track).toHaveStyle({ transform: "translateX(-400%)" });
  fireEvent.click(screen.getByLabelText(viDictionary.itemsCarousel.ariaNext));
  expect(track).toHaveStyle({ transform: "translateX(-500%)", transitionProperty: "transform" });
  expect(titles()).toEqual(["Hạng mục 1", "Hạng mục 2", "Hạng mục 3"]);
  finish();
  expect(track).toHaveStyle({ transform: "translateX(-100%)", transitionProperty: "none" });
  expect(titles()).toEqual(["Hạng mục 1", "Hạng mục 2", "Hạng mục 3"]);
});

it("giảm chuyển động tắt tự chạy nhưng vẫn cho chuyển bằng nút", () => {
  reducedMotion = true;
  const { container } = renderItems(4);
  fireEvent.animationEnd(container.querySelector(".banner-progress")!);
  expect(titles()[0]).toBe("Hạng mục 1");
  next();
  expect(titles()[0]).toBe("Hạng mục 4");
});

it("không có hạng mục thì không dựng khung rỗng", () => {
  const { container } = renderItems(0);
  expect(container).toBeEmptyDOMElement();
});
