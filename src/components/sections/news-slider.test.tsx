import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { NewsSlider } from "@/components/sections/news-slider";
import viDictionary from "@/lib/i18n/dictionaries/vi.json";
import enDictionary from "@/lib/i18n/dictionaries/en.json";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { NewsPost } from "@/types/content";

const viLabels = viDictionary.newsSlider as Dictionary["newsSlider"];
const enLabels = enDictionary.newsSlider as Dictionary["newsSlider"];

function makePosts(count: number): NewsPost[] {
  return Array.from({ length: count }, (_, index) => ({
    title: `Bài viết ${index + 1}`,
    slug: `bai-viet-${index + 1}`,
    summary: `Tóm tắt ${index + 1}`,
    publishedAt: `2026-01-${String(index + 1).padStart(2, "0")}`,
    image: `/images/news/${index + 1}.jpg`,
  }));
}

/**
 * jsdom báo `innerWidth` mặc định 1024px. Slider đọc giá trị này trong effect
 * để chọn số thẻ hiển thị, nên test đặt bề rộng TRƯỚC khi render.
 */
function setViewportWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    value: width,
    configurable: true,
    writable: true,
  });
}

function renderSlider(
  posts: NewsPost[],
  { width = 1280, labels = viLabels } = {},
) {
  setViewportWidth(width);
  return render(
    <NewsSlider
      posts={posts}
      locale="vi"
      labels={labels}
      detailLabel="Chi tiết bài viết"
    />,
  );
}

/** Thẻ đang nằm trong cửa sổ hiển thị (không bị ẩn khỏi Tab/trình đọc). */
function visibleSlides() {
  return screen
    .getAllByTestId("news-slide")
    .filter((slide) => slide.dataset.visible === "true");
}

describe("NewsSlider — số thẻ hiển thị theo khung nhìn", () => {
  it("desktop (≥1024px): 3 thẻ", () => {
    renderSlider(makePosts(8), { width: 1280 });
    expect(visibleSlides()).toHaveLength(3);
  });

  it("tablet (768–1023px): 2 thẻ", () => {
    renderSlider(makePosts(8), { width: 768 });
    expect(visibleSlides()).toHaveLength(2);
  });

  it("mobile (<768px): 1 thẻ", () => {
    renderSlider(makePosts(8), { width: 375 });
    expect(visibleSlides()).toHaveLength(1);
  });

  it("đổi kích thước cửa sổ thì số thẻ đổi theo", () => {
    renderSlider(makePosts(8), { width: 1280 });
    expect(visibleSlides()).toHaveLength(3);

    act(() => {
      setViewportWidth(375);
      window.dispatchEvent(new Event("resize"));
    });

    expect(visibleSlides()).toHaveLength(1);
  });
});

describe("NewsSlider — điều khiển", () => {
  it("là vùng carousel có nhãn", () => {
    renderSlider(makePosts(8));
    const region = screen.getByRole("group", { name: viLabels.regionLabel });
    expect(region).toHaveAttribute("aria-roledescription", "carousel");
  });

  it("Next đổi cụm thẻ đang hiện, không lặp thẻ", () => {
    renderSlider(makePosts(8));

    expect(within(visibleSlides()[0]).getByText("Bài viết 1")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("news-slider-next"));

    const after = visibleSlides();
    expect(after).toHaveLength(3);
    expect(within(after[0]).getByText("Bài viết 2")).toBeInTheDocument();
    const titles = after.map((slide) => slide.textContent);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("Previous quay lại cụm trước", () => {
    renderSlider(makePosts(8));

    fireEvent.click(screen.getByTestId("news-slider-next"));
    fireEvent.click(screen.getByTestId("news-slider-previous"));

    expect(
      within(visibleSlides()[0]).getByText("Bài viết 1"),
    ).toBeInTheDocument();
  });

  it("ở đầu dãy: Previous bị disabled", () => {
    renderSlider(makePosts(8));
    expect(screen.getByTestId("news-slider-previous")).toBeDisabled();
    expect(screen.getByTestId("news-slider-next")).toBeEnabled();
  });

  it("ở cuối dãy: Next bị disabled, thẻ cuối vẫn nằm trong khung", () => {
    renderSlider(makePosts(5));

    // 5 bài, 3 ô hiện → tối đa 2 bước.
    fireEvent.click(screen.getByTestId("news-slider-next"));
    fireEvent.click(screen.getByTestId("news-slider-next"));

    expect(screen.getByTestId("news-slider-next")).toBeDisabled();
    expect(
      within(visibleSlides()[2]).getByText("Bài viết 5"),
    ).toBeInTheDocument();
  });

  it("ArrowRight/ArrowLeft điều khiển được bằng bàn phím", () => {
    renderSlider(makePosts(8));
    const region = screen.getByRole("group", { name: viLabels.regionLabel });

    region.focus();
    fireEvent.keyDown(region, { key: "ArrowRight" });
    expect(
      within(visibleSlides()[0]).getByText("Bài viết 2"),
    ).toBeInTheDocument();

    fireEvent.keyDown(region, { key: "ArrowLeft" });
    expect(
      within(visibleSlides()[0]).getByText("Bài viết 1"),
    ).toBeInTheDocument();
  });

  it("chấm chỉ vị trí có aria-current đúng và nhảy được tới cụm", () => {
    renderSlider(makePosts(8));

    const target = screen.getByRole("button", {
      name: "Chuyển tới nhóm bài số 3",
    });
    fireEvent.click(target);

    expect(target).toHaveAttribute("aria-current", "true");
    expect(
      within(visibleSlides()[0]).getByText("Bài viết 3"),
    ).toBeInTheDocument();
  });
});

describe("NewsSlider — trường hợp biên", () => {
  it("ít bài hơn số ô hiển thị → không render bộ điều khiển", () => {
    renderSlider(makePosts(2), { width: 1280 });

    expect(screen.queryByTestId("news-slider-next")).not.toBeInTheDocument();
    expect(screen.queryByTestId("news-slider-previous")).not.toBeInTheDocument();
  });

  it("đúng bằng số ô hiển thị → vẫn không có điều khiển", () => {
    renderSlider(makePosts(3), { width: 1280 });
    expect(screen.queryByTestId("news-slider-next")).not.toBeInTheDocument();
  });

  it("một bài duy nhất → hiển thị được, không có điều khiển", () => {
    renderSlider(makePosts(1), { width: 375 });

    expect(screen.getByText("Bài viết 1")).toBeInTheDocument();
    expect(screen.queryByTestId("news-slider-next")).not.toBeInTheDocument();
  });

  it("bài không có ảnh vẫn render được thẻ", () => {
    const posts = makePosts(1);
    delete posts[0].image;
    renderSlider(posts, { width: 375 });

    expect(screen.getByText("Bài viết 1")).toBeInTheDocument();
  });

  it("thẻ ngoài khung bị loại khỏi thứ tự Tab", () => {
    renderSlider(makePosts(8), { width: 1280 });

    const hidden = screen
      .getAllByTestId("news-slide")
      .filter((slide) => slide.dataset.visible === "false");
    expect(hidden.length).toBeGreaterThan(0);
    for (const slide of hidden) {
      expect(slide).toHaveAttribute("aria-hidden", "true");
      expect(within(slide).getByRole("link", { hidden: true })).toHaveAttribute(
        "tabindex",
        "-1",
      );
    }
  });

  it("mở rộng khung nhìn khi đang ở cuối dãy không để lộ khoảng trống", () => {
    // Mobile: 1 ô hiện / 4 bài → trượt được tới chỉ số 3 (bài cuối).
    renderSlider(makePosts(4), { width: 375 });
    fireEvent.click(screen.getByTestId("news-slider-next"));
    fireEvent.click(screen.getByTestId("news-slider-next"));
    fireEvent.click(screen.getByTestId("news-slider-next"));
    expect(within(visibleSlides()[0]).getByText("Bài viết 4")).toBeInTheDocument();

    // Sang desktop: 3 ô hiện → chỉ số tối đa chỉ còn 1, phải bị kẹp lại, nếu
    // không sẽ trượt quá dãy và để lộ khoảng trắng bên phải.
    act(() => {
      setViewportWidth(1280);
      window.dispatchEvent(new Event("resize"));
    });

    const slides = visibleSlides();
    expect(slides).toHaveLength(3);
    expect(within(slides[0]).getByText("Bài viết 2")).toBeInTheDocument();
    expect(within(slides[2]).getByText("Bài viết 4")).toBeInTheDocument();
    expect(screen.getByTestId("news-slider-next")).toBeDisabled();
  });
});

/**
 * Ngưỡng hiện điều khiển, tách riêng vì đây chính là thứ gây hiểu nhầm "slider
 * hỏng": desktop có đúng 3 bài thì KHÔNG có nút — đúng thiết kế, vì không còn
 * gì để trượt tới.
 */
describe("NewsSlider — ngưỡng hiện nút theo breakpoint", () => {
  const cases = [
    { name: "desktop", width: 1280, slots: 3 },
    { name: "tablet", width: 768, slots: 2 },
    { name: "mobile", width: 375, slots: 1 },
  ];

  for (const { name, width, slots } of cases) {
    it(`${name}: đúng ${slots} bài → KHÔNG có nút`, () => {
      renderSlider(makePosts(slots), { width });

      expect(visibleSlides()).toHaveLength(slots);
      expect(screen.queryByTestId("news-slider-next")).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("news-slider-previous"),
      ).not.toBeInTheDocument();
    });

    it(`${name}: ${slots + 1} bài → CÓ nút`, () => {
      renderSlider(makePosts(slots + 1), { width });

      expect(visibleSlides()).toHaveLength(slots);
      expect(screen.getByTestId("news-slider-next")).toBeInTheDocument();
      expect(screen.getByTestId("news-slider-previous")).toBeInTheDocument();
    });
  }
});

describe("NewsSlider — vị trí và khả năng nhìn thấy của điều khiển", () => {
  it("hàng điều khiển nằm NGOÀI khối overflow-hidden nên không bị cắt", () => {
    const { container } = renderSlider(makePosts(8), { width: 1280 });

    const clipper = container.querySelector(".overflow-hidden");
    expect(clipper).not.toBeNull();

    const next = screen.getByTestId("news-slider-next");
    expect(clipper?.contains(next)).toBe(false);
  });

  it("previous đứng trước next trong thứ tự DOM (trái → phải)", () => {
    renderSlider(makePosts(8), { width: 1280 });

    const previous = screen.getByTestId("news-slider-previous");
    const next = screen.getByTestId("news-slider-next");

    // Node.DOCUMENT_POSITION_FOLLOWING = 4 → next nằm sau previous.
    expect(previous.compareDocumentPosition(next) & 4).toBeTruthy();
  });

  it("không đặt z-index âm hay display:none lên hàng điều khiển", () => {
    renderSlider(makePosts(8), { width: 1280 });

    const controls = screen.getByTestId("news-slider-next").parentElement
      ?.parentElement;
    expect(controls?.className).not.toMatch(/hidden|invisible|z-\[-/);
  });

  it("cả hai nút đều có aria-label mô tả được", () => {
    renderSlider(makePosts(8), { width: 1280 });

    expect(screen.getByTestId("news-slider-previous")).toHaveAccessibleName(
      viLabels.ariaPrevious,
    );
    expect(screen.getByTestId("news-slider-next")).toHaveAccessibleName(
      viLabels.ariaNext,
    );
  });
});

describe("NewsSlider — song ngữ", () => {
  it("locale EN dùng nhãn điều khiển tiếng Anh", () => {
    renderSlider(makePosts(8), { labels: enLabels });

    expect(
      screen.getByRole("group", { name: "Latest news" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "View next articles" }),
    ).toBeInTheDocument();
  });
});
