/**
 * Khoá hành vi bộ lọc chuyên mục tin.
 *
 * Ba điều dễ hỏng nhất:
 * - **Phải là link, không phải nút**: mỗi chuyên mục là một URL thật. Đổi sang
 *   `<button>` là mất khả năng mở tab mới, mất liên kết nội bộ cho SEO và làm
 *   Back/Forward chạy sai.
 * - **`aria-current="page"`, không phải `aria-selected`**: đây là điều hướng
 *   trang, không phải tab đổi nội dung tại chỗ.
 * - **Tiền tố locale**: `/en/...` cho tiếng Anh, không tiền tố cho tiếng Việt.
 */
import { render, screen } from "@testing-library/react";
import { NewsCategoryFilter } from "./news-category-filter";
import type { NewsCategory } from "@/types/content";

const categories: NewsCategory[] = [
  { slug: "tin-du-an", name: "Tin dự án", publishedCount: 3 },
  { slug: "tin-noi-bo", name: "Tin nội bộ", publishedCount: 1 },
];

function renderFilter(
  props: Partial<React.ComponentProps<typeof NewsCategoryFilter>> = {},
) {
  return render(
    <NewsCategoryFilter
      categories={categories}
      locale="vi"
      allLabel="Tất cả"
      regionLabel="Lọc tin theo chuyên mục"
      {...props}
    />,
  );
}

describe("NewsCategoryFilter", () => {
  it('dựng chip "Tất cả" + mỗi chuyên mục một chip, đều là LINK', () => {
    renderFilter();

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("href trỏ đúng route danh mục dạng path", () => {
    renderFilter();

    expect(screen.getByRole("link", { name: /Tất cả/ })).toHaveAttribute(
      "href",
      "/tin-tuc",
    );
    expect(screen.getByRole("link", { name: /Tin dự án/ })).toHaveAttribute(
      "href",
      "/tin-tuc/danh-muc/tin-du-an",
    );
  });

  it("locale en gắn tiền tố /en vào mọi chip", () => {
    renderFilter({ locale: "en", allLabel: "All" });

    expect(screen.getByRole("link", { name: /All/ })).toHaveAttribute(
      "href",
      "/en/tin-tuc",
    );
    expect(screen.getByRole("link", { name: /Tin dự án/ })).toHaveAttribute(
      "href",
      "/en/tin-tuc/danh-muc/tin-du-an",
    );
  });

  it('không chọn chuyên mục nào → "Tất cả" là mục hiện hành', () => {
    renderFilter();

    expect(screen.getByRole("link", { name: /Tất cả/ })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: /Tin dự án/ })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("đang ở một chuyên mục → đúng chip đó là mục hiện hành, chỉ MỘT chip", () => {
    renderFilter({ activeSlug: "tin-noi-bo" });

    expect(screen.getByRole("link", { name: /Tin nội bộ/ })).toHaveAttribute(
      "aria-current",
      "page",
    );
    const current = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("aria-current") === "page");
    expect(current).toHaveLength(1);
  });

  it("KHÔNG dùng ngữ nghĩa tab (tablist/tab/aria-selected)", () => {
    const { container } = renderFilter({ activeSlug: "tin-du-an" });

    expect(screen.queryAllByRole("tab")).toHaveLength(0);
    expect(screen.queryAllByRole("tablist")).toHaveLength(0);
    expect(container.querySelector("[aria-selected]")).toBeNull();
  });

  it("là landmark điều hướng có nhãn", () => {
    renderFilter();

    expect(
      screen.getByRole("navigation", { name: "Lọc tin theo chuyên mục" }),
    ).toBeInTheDocument();
  });

  it("chưa có chuyên mục nào: không render khung lọc rỗng", () => {
    renderFilter({ categories: [] });

    expect(screen.queryByTestId("news-category-filter")).toBeNull();
  });

  // Số đếm được DÙNG để lọc chuyên mục rỗng, nhưng cố ý không HIỆN trên chip:
  // đây là điều hướng của website doanh nghiệp, không phải bộ lọc thương mại điện tử.
  it("KHÔNG hiện số bài trên chip", () => {
    renderFilter();

    expect(screen.getByRole("link", { name: /Tin dự án/ }).textContent).toBe(
      "Tin dự án",
    );
  });

  /**
   * Chuyên mục chưa có bài đăng KHÔNG được lên chip: trang của nó là
   * `noindex` và rỗng, nên chip sẽ vừa là ngõ cụt cho người đọc vừa là liên
   * kết nội bộ trỏ vào trang không cho lập chỉ mục.
   */
  it("ẩn chuyên mục chưa có bài đã đăng", () => {
    renderFilter({
      categories: [
        { slug: "tin-du-an", name: "Tin dự án", publishedCount: 3 },
        { slug: "tin-cong-ty", name: "Tin công ty", publishedCount: 0 },
      ],
    });

    expect(screen.getByRole("link", { name: /Tin dự án/ })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Tin công ty/ })).toBeNull();
  });

  it('chip "Tất cả" vẫn hiện khi có ít nhất một chuyên mục có bài', () => {
    renderFilter({
      categories: [
        { slug: "tin-du-an", name: "Tin dự án", publishedCount: 1 },
        { slug: "tin-cong-ty", name: "Tin công ty", publishedCount: 0 },
      ],
    });

    expect(screen.getByRole("link", { name: /Tất cả/ })).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(2);
  });

  it("trạng thái đang chọn vẫn đúng sau khi lọc chuyên mục rỗng", () => {
    renderFilter({
      activeSlug: "tin-noi-bo",
      categories: [
        { slug: "tin-du-an", name: "Tin dự án", publishedCount: 3 },
        { slug: "tin-cong-ty", name: "Tin công ty", publishedCount: 0 },
        { slug: "tin-noi-bo", name: "Tin nội bộ", publishedCount: 2 },
      ],
    });

    expect(screen.getByRole("link", { name: /Tin nội bộ/ })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen
        .getAllByRole("link")
        .filter((link) => link.getAttribute("aria-current") === "page"),
    ).toHaveLength(1);
  });

  it("mọi chuyên mục đều rỗng: không render khung lọc", () => {
    renderFilter({
      categories: [
        { slug: "tin-du-an", name: "Tin dự án", publishedCount: 0 },
        { slug: "tin-cong-ty", name: "Tin công ty", publishedCount: 0 },
      ],
    });

    expect(screen.queryByTestId("news-category-filter")).toBeNull();
  });
});
