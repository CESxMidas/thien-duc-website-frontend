/**
 * Khoá hành vi slider dự án.
 *
 * Hai điều dễ hỏng nhất và đã được cân nhắc kỹ:
 * - **Không nhân bản thẻ**: mỗi dự án đúng một lần trong DOM. Nhân bản là cách
 *   duy nhất để lặp vòng liền mạch, nhưng nó tạo link trùng cho SEO và cho
 *   trình đọc màn hình.
 * - **Có giới hạn hai đầu**: thẻ cuối dừng sát mép phải, nút mờ đi. Không nhảy
 *   ngược về đầu.
 *
 * jsdom không có layout engine nên `window.innerWidth` mặc định 1024 →
 * `visibleCount = 3`, khớp desktop. Test bám vào state (`data-index`,
 * `data-visible`) chứ không đo pixel.
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { ProjectsCarousel } from "./projects-carousel";
import type { Project } from "@/types/content";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import viDictionary from "@/lib/i18n/dictionaries/vi.json";

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

const slides = () => screen.getAllByTestId("projects-carousel-slide");
const indexOf = () =>
  Number(screen.getByTestId("projects-carousel-track").dataset.index);
const next = () => fireEvent.click(screen.getByLabelText(labels.ariaNext));
const visibleTitles = () =>
  slides()
    .filter((li) => li.dataset.visible === "true")
    .map((li) => li.querySelector("h2")!.textContent);

describe("ProjectsCarousel", () => {
  it("KHÔNG nhân bản: mỗi dự án đúng một lần trong DOM", () => {
    renderCarousel(5);

    expect(slides()).toHaveLength(5);
    expect(screen.getAllByRole("link", { name: /Dự án 1/ })).toHaveLength(1);
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
    // 5 thẻ, 3 thẻ/lần → chỉ số lớn nhất là 2.
    next();
    next();
    expect(indexOf()).toBe(2);
    expect(visibleTitles()).toEqual(["Dự án 3", "Dự án 4", "Dự án 5"]);
  });

  it("hết dải thì nút mờ đi, KHÔNG nhảy ngược về đầu", () => {
    renderCarousel(5);

    expect(screen.getByLabelText(labels.ariaPrevious)).toBeDisabled();
    next();
    next();
    expect(screen.getByLabelText(labels.ariaNext)).toBeDisabled();
    expect(screen.getByLabelText(labels.ariaPrevious)).not.toBeDisabled();

    // Bấm thêm ở vị trí cuối không được làm gì cả.
    next();
    expect(indexOf()).toBe(2);
  });

  it("thẻ khuất bị gỡ khỏi Tab và khỏi trình đọc màn hình", () => {
    renderCarousel(5);
    const hidden = slides().filter((li) => li.dataset.visible === "false");

    expect(hidden).toHaveLength(2);
    for (const li of hidden) {
      expect(li).toHaveAttribute("aria-hidden", "true");
      expect(li.querySelector("a")).toHaveAttribute("tabindex", "-1");
    }
  });

  it("một chấm cho một VỊ TRÍ TRƯỢT, không phải cho một dự án", () => {
    renderCarousel(5);
    // 5 thẻ, 3 thẻ/lần → 3 vị trí + 2 nút tiến/lùi.
    expect(screen.getAllByRole("button")).toHaveLength(5);
  });

  it("phím mũi tên trái/phải cũng chuyển thẻ", () => {
    renderCarousel(5);
    const region = screen.getByRole("group", { name: labels.regionLabel });

    fireEvent.keyDown(region, { key: "ArrowRight" });
    expect(indexOf()).toBe(1);
    fireEvent.keyDown(region, { key: "ArrowLeft" });
    expect(indexOf()).toBe(0);
  });

  it("ít thẻ hơn số ô nhìn thấy → không hiện bộ điều hướng", () => {
    renderCarousel(3);

    expect(slides()).toHaveLength(3);
    expect(screen.queryByLabelText(labels.ariaNext)).toBeNull();
    expect(screen.queryByLabelText(labels.ariaPrevious)).toBeNull();
  });

  it("link trỏ đúng route dự án theo locale", () => {
    renderCarousel(5);
    expect(screen.getByRole("link", { name: /Dự án 1/ })).toHaveAttribute(
      "href",
      "/du-an/du-an-1",
    );
  });
});
