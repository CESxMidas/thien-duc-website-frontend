import { act, fireEvent, render, screen } from "@testing-library/react";
import { BusinessFieldsCarousel } from "./business-fields-carousel";
import dictionary from "@/lib/i18n/dictionaries/vi.json";

const fields = dictionary.about.fields;
const labels = dictionary.about.fieldsCarousel;

beforeEach(() => {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    writable: true,
    value: 1440,
  });
  window.matchMedia = jest.fn().mockReturnValue({ matches: false });
});

function renderCarousel() {
  return render(
    <BusinessFieldsCarousel fields={fields} codeLabel="Mã" labels={labels} />,
  );
}
const track = () => screen.getByTestId("business-fields-track");
function finish() {
  const event = new Event("transitionend", { bubbles: true });
  Object.defineProperty(event, "propertyName", { value: "transform" });
  fireEvent(track(), event);
}
const next = () => {
  fireEvent.click(screen.getByLabelText(labels.ariaNext));
  finish();
};
const visibleTitles = () =>
  screen.getAllByRole("heading").map((node) => node.textContent);

it("cuối danh sách tiếp tục cùng chiều qua bản nối, không trượt ngược về đầu", () => {
  renderCarousel();
  for (let index = 0; index < fields.length - 1; index++) next();
  expect(visibleTitles()).toEqual([
    fields.at(-1)!.title,
    fields[0].title,
    fields[1].title,
  ]);
  const before = track().style.transform;
  fireEvent.click(screen.getByLabelText(labels.ariaNext));
  const boundary = track().style.transform;
  expect(boundary).not.toBe(before);
  expect(track()).toHaveStyle({ transitionProperty: "transform" });
  expect(visibleTitles()).toEqual(
    fields.slice(0, 3).map((field) => field.title),
  );
  finish();
  expect(track().style.transform).not.toBe(boundary);
  expect(track()).toHaveStyle({ transitionProperty: "none" });
  expect(visibleTitles()).toEqual(
    fields.slice(0, 3).map((field) => field.title),
  );
});

it("Previous từ đầu nối về cuối mà không để lộ khoảng trống", () => {
  renderCarousel();
  fireEvent.click(screen.getByLabelText(labels.ariaPrevious));
  expect(visibleTitles()).toEqual([
    fields.at(-1)!.title,
    fields[0].title,
    fields[1].title,
  ]);
  finish();
  expect(visibleTitles()).toEqual([
    fields.at(-1)!.title,
    fields[0].title,
    fields[1].title,
  ]);
  expect(track()).toHaveStyle({ transitionProperty: "none" });
});

it("bấm nhanh trong lúc trượt không vượt khỏi dải ảnh nối", () => {
  renderCarousel();
  fireEvent.click(screen.getByLabelText(labels.ariaNext));
  fireEvent.click(screen.getByLabelText(labels.ariaNext));
  expect(visibleTitles()[0]).toBe(fields[1].title);
  finish();
  next();
  expect(visibleTitles()[0]).toBe(fields[2].title);
});

it("khôi phục điều hướng nếu transition bị trình duyệt ngắt", () => {
  jest.useFakeTimers();
  renderCarousel();
  fireEvent.click(screen.getByLabelText(labels.ariaPrevious));
  act(() => jest.advanceTimersByTime(800));
  expect(track()).toHaveStyle({ transitionProperty: "none" });
  next();
  expect(visibleTitles()[0]).toBe(fields[0].title);
  jest.useRealTimers();
});

it("automatically moves one business field per reading interval", () => {
  renderCarousel();
  expect(visibleTitles()[0]).toBe(fields[0].title);
  fireEvent.animationEnd(screen.getByTestId("business-fields-progress"));
  finish();
  expect(visibleTitles()[0]).toBe(fields[1].title);
});

it.each([
  [375, 1],
  [768, 2],
  [1440, 3],
])("%ipx giữ đủ %i thẻ qua điểm nối", (width, count) => {
  window.innerWidth = width;
  renderCarousel();
  fireEvent.click(screen.getByLabelText(labels.ariaPrevious));
  expect(visibleTitles()).toHaveLength(count);
  finish();
  expect(visibleTitles()).toHaveLength(count);
});
