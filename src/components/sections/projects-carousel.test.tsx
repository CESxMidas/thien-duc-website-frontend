import { fireEvent, render, screen } from "@testing-library/react";
import { ProjectsCarousel } from "./projects-carousel";
import type { Project } from "@/types/content";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import viDictionary from "@/lib/i18n/dictionaries/vi.json";

const mockPush = jest.fn();
let reducedMotion = false;

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const dictionary = viDictionary as unknown as Dictionary;
const labels = dictionary.projects.carousel;

function makeProjects(count: number): Project[] {
  return Array.from({ length: count }, (_, index) => ({
    title: `Dự án ${index + 1}`,
    slug: `du-an-${index + 1}`,
    summary: `Mô tả dự án ${index + 1}`,
    status: "DA_BAN_GIAO" as Project["status"],
  }));
}

function renderCarousel(count: number) {
  return render(
    <ProjectsCarousel
      projects={makeProjects(count)}
      locale="vi"
      labels={labels}
      statusLabels={dictionary.projectStatus}
      detailLabel={dictionary.common.viewDetail}
    />,
  );
}

beforeEach(() => {
  mockPush.mockClear();
  reducedMotion = false;
  window.matchMedia = jest.fn().mockImplementation(() => ({
    matches: reducedMotion,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }));
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    writable: true,
    value: 1440,
  });
});

const slides = () => screen.getAllByTestId("projects-carousel-slide");
const indexOf = () =>
  Number(screen.getByTestId("projects-carousel-track").dataset.index);
function finish() {
  const event = new Event("transitionend", { bubbles: true });
  Object.defineProperty(event, "propertyName", { value: "transform" });
  fireEvent(screen.getByTestId("projects-carousel-track"), event);
}
const next = () => {
  fireEvent.click(screen.getByLabelText(labels.ariaNext));
  finish();
};
const visibleTitles = () =>
  Array.from(
    screen
      .getByTestId("projects-carousel-track")
      .querySelectorAll<HTMLLIElement>('li[data-visible="true"]'),
  ).map((li) => li.querySelector("h2")!.textContent);

describe("ProjectsCarousel", () => {
  it("keeps edge copies hidden from assistive technology", () => {
    renderCarousel(5);
    expect(slides()).toHaveLength(11);
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(3);
    expect(
      screen.getAllByRole("button", { name: /Xem chi tiết: Dự án 1/i }),
    ).toHaveLength(1);
  });

  it("hiện 3 thẻ mỗi lần trên desktop", () => {
    renderCarousel(5);
    expect(visibleTitles()).toEqual(["Dự án 1", "Dự án 2", "Dự án 3"]);
  });

  it("trượt đúng MỘT thẻ mỗi lần bấm", () => {
    renderCarousel(5);
    next();
    expect(indexOf()).toBe(1);
    expect(visibleTitles()).toEqual(["Dự án 2", "Dự án 3", "Dự án 4"]);
  });

  it("thẻ cuối dừng sát mép phải, không trượt vào khoảng trống", () => {
    renderCarousel(5);
    next();
    next();
    expect(indexOf()).toBe(2);
    expect(visibleTitles()).toEqual(["Dự án 3", "Dự án 4", "Dự án 5"]);
  });

  it("hết dải thì Next quay vòng về đầu và Previous quay tới cuối", () => {
    renderCarousel(5);

    fireEvent.click(screen.getByLabelText(labels.ariaPrevious));
    finish();
    expect(indexOf()).toBe(4);
    expect(visibleTitles()).toEqual(["Dự án 5", "Dự án 1", "Dự án 2"]);

    next();
    expect(indexOf()).toBe(0);
    expect(visibleTitles()).toEqual(["Dự án 1", "Dự án 2", "Dự án 3"]);

    next();
    next();
    expect(indexOf()).toBe(2);
    next();
    expect(indexOf()).toBe(3);
  });

  it("thẻ khuất bị gỡ khỏi Tab và khỏi trình đọc màn hình", () => {
    renderCarousel(5);
    const hidden = slides().filter((li) => li.dataset.visible === "false");

    expect(hidden).toHaveLength(8);
    for (const li of hidden) {
      expect(li).toHaveAttribute("aria-hidden", "true");
      expect(li.querySelector("button")).toHaveAttribute("tabindex", "-1");
    }
  });

  it("một chấm cho một VỊ TRÍ TRƯỢT, không phải cho một dự án", () => {
    renderCarousel(5);
    expect(
      screen.getAllByRole("button", { name: /Chuyển tới vị trí/ }),
    ).toHaveLength(5);
  });

  it("phím mũi tên trái/phải cũng chuyển thẻ", () => {
    renderCarousel(5);
    const region = screen.getByRole("group", { name: labels.regionLabel });

    fireEvent.keyDown(region, { key: "ArrowRight" });
    finish();
    expect(indexOf()).toBe(1);
    fireEvent.keyDown(region, { key: "ArrowLeft" });
    expect(indexOf()).toBe(0);
  });

  it("vẫn tự chạy khi ba thẻ vừa đủ khung desktop", () => {
    renderCarousel(3);

    expect(visibleTitles()).toHaveLength(3);
    fireEvent.animationEnd(screen.getByTestId("projects-carousel-progress"));
    finish();
    expect(visibleTitles()).toEqual(["Dự án 2", "Dự án 3", "Dự án 1"]);
  });

  it("button khám phá dự án chuyển tới đúng route chi tiết", () => {
    renderCarousel(5);

    fireEvent.click(
      screen.getByRole("button", { name: /Xem chi tiết: Dự án 1/i }),
    );

    expect(mockPush).toHaveBeenCalledWith("/du-an/du-an-1");
  });

  it("moves the track without reordering cards and ignores clicks during movement", () => {
    renderCarousel(5);
    const track = screen.getByTestId("projects-carousel-track");
    const nodes = Array.from(track.children);
    const initialTransform = track.style.transform;
    fireEvent.click(screen.getByLabelText(labels.ariaNext));
    expect(track.style.transform).not.toBe(initialTransform);
    expect(track).toHaveStyle({ transitionProperty: "transform" });
    expect(Array.from(track.children)).toEqual(nodes);
    fireEvent.click(screen.getByLabelText(labels.ariaNext));
    expect(indexOf()).toBe(1);
    finish();
    next();
    expect(indexOf()).toBe(2);
  });

  it("crosses the last card before settling on the identical first viewport", () => {
    renderCarousel(5);
    const track = screen.getByTestId("projects-carousel-track");
    for (let index = 0; index < 4; index++) next();
    fireEvent.click(screen.getByLabelText(labels.ariaNext));
    const boundaryTransform = track.style.transform;
    const boundaryTitles = visibleTitles();
    expect(indexOf()).toBe(0);
    expect(track).toHaveStyle({ transitionProperty: "transform" });
    finish();
    expect(track.style.transform).not.toBe(boundaryTransform);
    expect(track).toHaveStyle({ transitionProperty: "none" });
    expect(visibleTitles()).toEqual(boundaryTitles);
  });

  it("pauses autoplay for both hover and focus", () => {
    renderCarousel(5);
    const region = screen.getByRole("group", { name: labels.regionLabel });
    const progress = () => screen.getByTestId("projects-carousel-progress");
    fireEvent.mouseEnter(region);
    fireEvent.focus(screen.getByLabelText(labels.ariaNext));
    fireEvent.mouseLeave(region);
    expect(progress()).toHaveStyle({ animationPlayState: "paused" });
    fireEvent.animationEnd(progress());
    expect(indexOf()).toBe(0);
    fireEvent.blur(screen.getByLabelText(labels.ariaNext), {
      relatedTarget: null,
    });
    fireEvent.animationEnd(progress());
    expect(indexOf()).toBe(1);
  });

  it.each([
    [375, 1],
    [430, 1],
    [768, 2],
    [1024, 3],
    [1440, 3],
  ])(
    "keeps %i px viewports filled with %i cards through a loop",
    (width, visible) => {
      window.innerWidth = width;
      renderCarousel(5);
      for (let index = 0; index < 6; index++) {
        next();
        expect(visibleTitles()).toHaveLength(visible);
      }
    },
  );

  it("disables autoplay and animated movement when reduced motion is requested", () => {
    reducedMotion = true;
    renderCarousel(5);
    expect(screen.queryByTestId("projects-carousel-progress")).toBeNull();
    next();
    expect(indexOf()).toBe(1);
    expect(screen.getByTestId("projects-carousel-track")).toHaveStyle({
      transitionProperty: "none",
    });
  });
});
