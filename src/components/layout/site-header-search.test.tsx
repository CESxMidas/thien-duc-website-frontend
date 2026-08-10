/**
 * Khoá lại lỗi "khoảng chết 1024–1279px".
 *
 * Trước đây nav hiện từ `lg` (1024) trong khi hamburger + drawer tắt cũng ở
 * `lg`, còn ô tìm kiếm và bộ đổi ngôn ngữ lại chờ tới `xl` (1280). Kết quả là
 * mọi cửa sổ rộng 1024–1279px **không có đường nào** vào tìm kiếm lẫn đổi ngôn
 * ngữ. Test này kiểm cấu trúc breakpoint chứ không kiểm pixel: jsdom không có
 * layout engine, nhưng chuỗi class là đúng thứ quyết định breakpoint.
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { SiteHeader } from "./site-header";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import viDictionary from "@/lib/i18n/dictionaries/vi.json";

jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

beforeAll(() => {
  Object.assign(globalThis, {
    IntersectionObserver: NoopObserver,
    ResizeObserver: NoopObserver,
  });
  // Header hỏi `matchMedia` khi drawer mở (để tự đóng lúc phóng lên desktop).
  window.matchMedia ??= (() => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  })) as unknown as typeof window.matchMedia;
});

const dictionary = viDictionary as unknown as Dictionary;

/**
 * Drawer đóng mang `inert` + `aria-hidden` nên bản tìm kiếm trong đó **cố ý**
 * không có mặt trong cây trợ năng — đúng như mong muốn. Muốn kiểm nó thì phải
 * mở drawer bằng đúng thao tác người dùng làm.
 */
function openDrawer() {
  fireEvent.click(
    screen.getByRole("button", { name: dictionary.header.openMenu }),
  );
}

/** Bản desktop và bản drawer đều ở trong DOM; phân biệt bằng `id` của ô nhập. */
function searchForms() {
  const forms = screen.getAllByRole("search");
  const desktop = forms.find((form) =>
    form.querySelector("#site-search-desktop"),
  );
  const mobile = forms.find((form) =>
    form.querySelector("#site-search-mobile"),
  );
  return { forms, desktop, mobile };
}

describe("SiteHeader — tìm kiếm", () => {
  it("drawer đóng thì chỉ lộ bản desktop ra cây trợ năng", () => {
    render(<SiteHeader locale="vi" dictionary={dictionary} />);
    const { forms, desktop } = searchForms();

    // `inert` trên drawer đóng giữ bản kia khỏi Tab và trình đọc màn hình.
    expect(forms).toHaveLength(1);
    expect(desktop).toBeDefined();
  });

  it("mở drawer thì có đủ hai bản, không trùng id", () => {
    render(<SiteHeader locale="vi" dictionary={dictionary} />);
    openDrawer();
    const { forms, desktop, mobile } = searchForms();

    expect(forms).toHaveLength(2);
    expect(desktop).toBeDefined();
    expect(mobile).toBeDefined();
    expect(document.querySelectorAll("#site-search-mobile")).toHaveLength(1);
  });

  it("ô tìm kiếm desktop hiện từ `lg`, KHÔNG chờ tới `xl` (khoảng chết 1024–1279)", () => {
    render(<SiteHeader locale="vi" dictionary={dictionary} />);
    const { desktop } = searchForms();

    expect(desktop).toHaveClass("hidden", "lg:flex");
    // `xl:w-64` được phép (chỉ là bề rộng); `xl:flex` thì không — đó chính là
    // lỗi cũ khiến tìm kiếm biến mất ở 1024px.
    expect(desktop!.className).not.toContain("xl:flex");
  });

  it("bộ đổi ngôn ngữ cũng hiện từ `lg`, cùng nhịp với tìm kiếm", () => {
    render(<SiteHeader locale="vi" dictionary={dictionary} />);

    const switcher = screen.getByRole("group", {
      name: dictionary.common.languageSwitcher,
    });
    expect(switcher).toHaveClass("hidden", "lg:flex");
    expect(switcher.className).not.toContain("xl:flex");
  });

  it("cả hai bản đều có nhãn thật cho ô nhập và tên riêng cho nút gửi", () => {
    render(<SiteHeader locale="vi" dictionary={dictionary} />);
    openDrawer();

    // Hai ô cùng nhãn hiển thị nhưng khác `id` → `getAllByLabelText` thấy đủ 2.
    expect(
      screen.getAllByLabelText(dictionary.header.searchLabel),
    ).toHaveLength(2);
    expect(
      screen.getAllByRole("button", { name: dictionary.header.searchSubmit }),
    ).toHaveLength(2);
    // Nút gửi KHÔNG được trùng tên với ô nhập.
    expect(dictionary.header.searchSubmit).not.toBe(
      dictionary.header.searchLabel,
    );
  });

  it("tìm kiếm trong drawer đứng TRƯỚC danh sách điều hướng", () => {
    render(<SiteHeader locale="vi" dictionary={dictionary} />);
    openDrawer();
    const { mobile } = searchForms();
    const drawerNav = mobile!.parentElement!.querySelector("nav");

    expect(drawerNav).not.toBeNull();
    // `compareDocumentPosition` trả cờ FOLLOWING khi nav nằm SAU form.
    expect(
      mobile!.compareDocumentPosition(drawerNav!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("submit đúng route tin tức theo locale", () => {
    const { unmount } = render(
      <SiteHeader locale="vi" dictionary={dictionary} />,
    );
    openDrawer();
    const viForms = screen.getAllByRole("search");
    expect(viForms).toHaveLength(2);
    for (const form of viForms) {
      expect(form).toHaveAttribute("action", "/tin-tuc");
    }
    unmount();

    render(<SiteHeader locale="en" dictionary={dictionary} />);
    openDrawer();
    const enForms = screen.getAllByRole("search");
    expect(enForms).toHaveLength(2);
    for (const form of enForms) {
      expect(form).toHaveAttribute("action", "/en/tin-tuc");
    }
  });
});
