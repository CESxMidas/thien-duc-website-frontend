import { render, screen } from "@testing-library/react";
import { buildPageList, Pagination } from "@/components/ui/pagination";
import viDictionary from "@/lib/i18n/dictionaries/vi.json";
import enDictionary from "@/lib/i18n/dictionaries/en.json";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

const viLabels = viDictionary.pagination as Dictionary["pagination"];
const enLabels = enDictionary.pagination as Dictionary["pagination"];

function renderPagination(
  currentPage: number,
  totalPages: number,
  labels = viLabels,
) {
  return render(
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      buildHref={(page) => (page <= 1 ? "/tin-tuc" : `/tin-tuc?page=${page}`)}
      labels={labels}
    />,
  );
}

describe("buildPageList", () => {
  it("ít trang → liệt kê hết, không lược", () => {
    expect(buildPageList(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("nhiều trang, đang ở giữa → lược cả hai đầu", () => {
    expect(buildPageList(6, 12)).toEqual([1, null, 5, 6, 7, null, 12]);
  });

  it("đang ở gần đầu → không chèn dấu lược thừa ở đầu", () => {
    expect(buildPageList(2, 12)).toEqual([1, 2, 3, null, 12]);
  });

  it("đang ở trang cuối → dãy kết thúc bằng trang cuối", () => {
    expect(buildPageList(12, 12)).toEqual([1, null, 11, 12]);
  });

  it("không chèn dấu lược khi chỉ cách đúng 1 trang", () => {
    expect(buildPageList(3, 8)).toEqual([1, 2, 3, 4, null, 8]);
  });
});

describe("Pagination", () => {
  it("chỉ có một trang → không render gì", () => {
    const { container } = renderPagination(1, 1);
    expect(container).toBeEmptyDOMElement();
  });

  it("không có trang nào → không render gì", () => {
    const { container } = renderPagination(1, 0);
    expect(container).toBeEmptyDOMElement();
  });

  it("là landmark nav có nhãn", () => {
    renderPagination(2, 5);
    expect(
      screen.getByRole("navigation", { name: viLabels.navLabel }),
    ).toBeInTheDocument();
  });

  it("trang hiện tại mang aria-current=page, trang khác thì không", () => {
    renderPagination(3, 5);

    const current = screen.getByRole("link", { name: "Trang 3, trang hiện tại" });
    expect(current).toHaveAttribute("aria-current", "page");

    const other = screen.getByRole("link", { name: "Trang 2" });
    expect(other).not.toHaveAttribute("aria-current");
  });

  it("link số trang trỏ đúng URL; trang 1 không có ?page=", () => {
    renderPagination(3, 5);

    expect(screen.getByRole("link", { name: "Trang 1" })).toHaveAttribute(
      "href",
      "/tin-tuc",
    );
    expect(screen.getByRole("link", { name: "Trang 4" })).toHaveAttribute(
      "href",
      "/tin-tuc?page=4",
    );
  });

  it("ở trang đầu: Previous vô hiệu về mặt ngữ nghĩa, Next là link", () => {
    renderPagination(1, 5);

    const previous = screen.getByTestId("pagination-previous");
    expect(previous.tagName).toBe("SPAN");
    expect(previous).toHaveAttribute("aria-disabled", "true");

    expect(screen.getByTestId("pagination-next")).toHaveAttribute(
      "href",
      "/tin-tuc?page=2",
    );
  });

  it("ở trang cuối: Next vô hiệu, Previous là link", () => {
    renderPagination(5, 5);

    const next = screen.getByTestId("pagination-next");
    expect(next.tagName).toBe("SPAN");
    expect(next).toHaveAttribute("aria-disabled", "true");

    expect(screen.getByTestId("pagination-previous")).toHaveAttribute(
      "href",
      "/tin-tuc?page=4",
    );
  });

  it("Previous/Next mang rel để bot hiểu quan hệ trang", () => {
    renderPagination(3, 5);

    expect(screen.getByTestId("pagination-previous")).toHaveAttribute(
      "rel",
      "prev",
    );
    expect(screen.getByTestId("pagination-next")).toHaveAttribute("rel", "next");
  });

  it("locale EN dùng nhãn tiếng Anh", () => {
    renderPagination(2, 5, enLabels);

    expect(
      screen.getByRole("navigation", { name: "News pagination" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Page 2, current page" }),
    ).toBeInTheDocument();
  });
});
