import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { ProjectCarousel } from "@/components/sections/project-carousel";
import viDictionary from "@/lib/i18n/dictionaries/vi.json";
import enDictionary from "@/lib/i18n/dictionaries/en.json";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

const vi = (viDictionary as unknown as Dictionary).projects;
const en = (enDictionary as unknown as Dictionary).projects;

const labels = {
  region: vi.carouselLabel,
  previous: vi.previousProject,
  next: vi.nextProject,
};

const CARD_WIDTH = 300;
const GAP = 20;

/** Callback của mọi ResizeObserver đang sống — dùng để ép component đo lại. */
let resizeCallbacks: Array<() => void> = [];

beforeAll(() => {
  window.ResizeObserver = class {
    constructor(callback: () => void) {
      resizeCallbacks.push(callback);
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});

beforeEach(() => {
  resizeCallbacks = [];
});

/**
 * jsdom không layout: `scrollWidth`/`clientWidth` luôn bằng 0 và `scrollBy`/
 * `scrollTo` không tồn tại. Ta gắn kích thước giả rồi đánh thức ResizeObserver
 * để component đo lại — phần cuộn mượt do trình duyệt lo, không phải phần cần test.
 */
function stubTrack({ total, visible = 3 }: { total: number; visible?: number }) {
  const track = document.querySelector("ul") as HTMLUListElement;
  const clientWidth = visible * CARD_WIDTH + (visible - 1) * GAP;
  const scrollWidth = total * CARD_WIDTH + (total - 1) * GAP;
  const maxScrollLeft = Math.max(0, scrollWidth - clientWidth);

  Object.defineProperty(track, "clientWidth", {
    configurable: true,
    get: () => clientWidth,
  });
  Object.defineProperty(track, "scrollWidth", {
    configurable: true,
    get: () => scrollWidth,
  });
  for (const li of Array.from(track.children)) {
    Object.defineProperty(li, "clientWidth", {
      configurable: true,
      get: () => CARD_WIDTH,
    });
  }

  const clamp = (value: number) => Math.max(0, Math.min(maxScrollLeft, value));
  track.scrollBy = jest.fn(({ left = 0 }: ScrollToOptions = {}) => {
    track.scrollLeft = clamp(track.scrollLeft + left);
  }) as unknown as typeof track.scrollBy;
  track.scrollTo = jest.fn(({ left = 0 }: ScrollToOptions = {}) => {
    track.scrollLeft = clamp(left);
  }) as unknown as typeof track.scrollTo;

  act(() => {
    for (const callback of resizeCallbacks) callback();
  });

  return { track, step: CARD_WIDTH + GAP, maxScrollLeft };
}

function makeItems(count: number) {
  return Array.from({ length: count }, (_, index) => (
    <a key={index} href={`/du-an/du-an-${index + 1}`}>
      {`Dự án ${index + 1}`}
    </a>
  ));
}

const prevButton = () => screen.getByRole("button", { name: labels.previous });
const nextButton = () => screen.getByRole("button", { name: labels.next });

const clickPrev = () => act(() => void fireEvent.click(prevButton()));
const clickNext = () => act(() => void fireEvent.click(nextButton()));

describe("ProjectCarousel", () => {
  it("giữ nguyên thứ tự backend trả về — dự án đầu tiên render đầu tiên", () => {
    render(<ProjectCarousel items={makeItems(4)} labels={labels} />);

    expect(screen.getAllByRole("link").map((card) => card.textContent)).toEqual([
      "Dự án 1",
      "Dự án 2",
      "Dự án 3",
      "Dự án 4",
    ]);
    const track = document.querySelector("ul") as HTMLUListElement;
    expect(
      within(track.children[0] as HTMLElement).getByRole("link"),
    ).toHaveTextContent("Dự án 1");
  });

  it("không nhân bản thẻ để giả lập vòng lặp", () => {
    render(<ProjectCarousel items={makeItems(5)} labels={labels} />);
    stubTrack({ total: 5 });

    // Đúng 5 thẻ trong DOM dù điều hướng có quay vòng.
    expect(screen.getAllByRole("link")).toHaveLength(5);
    expect(document.querySelectorAll("ul > li")).toHaveLength(5);
  });

  it("cuộn tới/lui bình thường khi đang ở giữa danh sách", () => {
    render(<ProjectCarousel items={makeItems(6)} labels={labels} />);
    const { track, step } = stubTrack({ total: 6 });

    clickNext();
    expect(track.scrollLeft).toBe(step);

    clickNext();
    expect(track.scrollLeft).toBe(step * 2);

    clickPrev();
    expect(track.scrollLeft).toBe(step);
  });

  it("ở cuối bấm Tiếp: XOAY MẢNG, thẻ đầu chuyển xuống cuối, không nhân bản", () => {
    render(<ProjectCarousel items={makeItems(6)} labels={labels} />);
    const { track, maxScrollLeft } = stubTrack({ total: 6 });

    act(() => {
      track.scrollLeft = maxScrollLeft;
    });

    clickNext();

    expect(screen.getAllByRole("link").map((el) => el.textContent)).toEqual([
      "Dự án 2",
      "Dự án 3",
      "Dự án 4",
      "Dự án 5",
      "Dự án 6",
      "Dự án 1",
    ]);
    expect(document.querySelectorAll("ul > li")).toHaveLength(6);
    // Bù tức thời (-step) rồi cuộn tới (+step) → khung nhìn đứng nguyên ở cuối.
    expect(track.scrollLeft).toBe(maxScrollLeft);
  });

  it("ở đầu bấm Trước: xoay ngược, thẻ cuối lên đầu", () => {
    render(<ProjectCarousel items={makeItems(6)} labels={labels} />);
    const { track } = stubTrack({ total: 6 });

    expect(track.scrollLeft).toBe(0);
    clickPrev();

    expect(screen.getAllByRole("link").map((el) => el.textContent)).toEqual([
      "Dự án 6",
      "Dự án 1",
      "Dự án 2",
      "Dự án 3",
      "Dự án 4",
      "Dự án 5",
    ]);
    expect(document.querySelectorAll("ul > li")).toHaveLength(6);
    expect(track.scrollLeft).toBe(0);
  });

  it("xoay hết một vòng thì trở lại thứ tự gốc của CMS", () => {
    render(<ProjectCarousel items={makeItems(4)} labels={labels} />);
    const { track, maxScrollLeft } = stubTrack({ total: 4 });

    act(() => {
      track.scrollLeft = maxScrollLeft;
    });
    for (let i = 0; i < 4; i += 1) clickNext();

    expect(screen.getAllByRole("link").map((el) => el.textContent)).toEqual([
      "Dự án 1",
      "Dự án 2",
      "Dự án 3",
      "Dự án 4",
    ]);
    expect(document.querySelectorAll("ul > li")).toHaveLength(4);
  });

  it("hai nút vẫn BẬT ở hai đầu vì điều hướng quay vòng", () => {
    render(<ProjectCarousel items={makeItems(6)} labels={labels} />);
    const { track, maxScrollLeft } = stubTrack({ total: 6 });

    // Đầu danh sách
    expect(prevButton()).toBeEnabled();
    expect(nextButton()).toBeEnabled();

    // Cuối danh sách
    act(() => {
      track.scrollLeft = maxScrollLeft;
    });
    expect(prevButton()).toBeEnabled();
    expect(nextButton()).toBeEnabled();
  });

  it("một dự án: cả hai nút tắt, thẻ chiếm trọn bề ngang", () => {
    render(<ProjectCarousel items={makeItems(1)} labels={labels} />);
    stubTrack({ total: 1, visible: 1 });

    expect(prevButton()).toBeDisabled();
    expect(nextButton()).toBeDisabled();
    expect(
      (document.querySelector("ul > li") as HTMLElement).className,
    ).toContain("basis-full");
  });

  it("tất cả thẻ lọt hết khung nhìn: cả hai nút tắt, không quay vòng", () => {
    render(<ProjectCarousel items={makeItems(2)} labels={labels} />);
    const { track } = stubTrack({ total: 2, visible: 3 });

    expect(prevButton()).toBeDisabled();
    expect(nextButton()).toBeDisabled();

    // Kể cả khi bị gọi trực tiếp, navigate() cũng không cuộn.
    act(() => {
      fireEvent.click(nextButton());
      fireEvent.click(prevButton());
    });
    expect(track.scrollTo).not.toHaveBeenCalled();
    expect(track.scrollBy).not.toHaveBeenCalled();
    expect(track.scrollLeft).toBe(0);
  });

  it("đổi bộ lọc (remount qua `key`) đưa carousel về thẻ đầu tiên", () => {
    // Trang truyền `key={activeStatus}`, nên đổi bộ lọc = remount. Test mô phỏng
    // đúng cơ chế đó: cuộn đi, remount bằng key mới, vị trí phải về 0.
    const { rerender } = render(
      <ProjectCarousel key="all" items={makeItems(6)} labels={labels} />,
    );
    const { track, step } = stubTrack({ total: 6 });

    clickNext();
    expect(track.scrollLeft).toBe(step);

    rerender(
      <ProjectCarousel
        key="dang-thi-cong"
        items={makeItems(4)}
        labels={labels}
      />,
    );

    const freshTrack = document.querySelector("ul") as HTMLUListElement;
    expect(freshTrack.scrollLeft).toBe(0);
    expect(screen.getAllByRole("link")).toHaveLength(4);
    expect(screen.getAllByRole("link")[0]).toHaveTextContent("Dự án 1");
  });

  it("hai dự án: dừng ở 2 cột, không lên 3", () => {
    render(<ProjectCarousel items={makeItems(2)} labels={labels} />);

    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(
      (document.querySelector("ul > li") as HTMLElement).className,
    ).not.toContain("xl:basis-");
  });

  it("bộ lọc nằm NGOÀI vùng carousel, nút điều hướng vẫn cùng hàng với bộ lọc", () => {
    render(
      <ProjectCarousel
        items={makeItems(4)}
        labels={labels}
        toolbar={<button type="button">Tất cả</button>}
      />,
    );

    const group = screen.getByRole("group", { name: vi.carouselLabel });
    const filter = screen.getByRole("button", { name: "Tất cả" });

    // Bộ lọc quyết định danh sách nào hiển thị, không phải một phần của carousel.
    expect(group).not.toContainElement(filter);
    // Nhưng vẫn phải nằm chung một hàng toolbar với hai nút điều hướng.
    const toolbarRow = filter.parentElement as HTMLElement;
    expect(toolbarRow).toContainElement(prevButton());
    expect(toolbarRow).toContainElement(nextButton());
    // Vùng được đặt tên chỉ bao track thẻ.
    expect(group.querySelector("ul")).toBeInTheDocument();
    expect(group).toContainElement(screen.getAllByRole("link")[0]);
  });

  it("vùng carousel có accessible name; nhãn nút theo đúng locale", () => {
    const { unmount } = render(
      <ProjectCarousel items={makeItems(3)} labels={labels} />,
    );
    expect(
      screen.getByRole("group", { name: vi.carouselLabel }),
    ).toBeInTheDocument();
    expect(prevButton()).toBeInTheDocument();
    expect(nextButton()).toBeInTheDocument();
    unmount();

    render(
      <ProjectCarousel
        items={makeItems(3)}
        labels={{
          region: en.carouselLabel,
          previous: en.previousProject,
          next: en.nextProject,
        }}
      />,
    );
    expect(
      screen.getByRole("group", { name: en.carouselLabel }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: en.previousProject }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: en.nextProject }),
    ).toBeInTheDocument();
  });
});
