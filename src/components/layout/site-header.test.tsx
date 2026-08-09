import { fireEvent, render, screen } from "@testing-library/react";
import { SiteHeader } from "@/components/layout/site-header";
import viDictionary from "@/lib/i18n/dictionaries/vi.json";
import enDictionary from "@/lib/i18n/dictionaries/en.json";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

const vi = viDictionary as unknown as Dictionary;
const en = enDictionary as unknown as Dictionary;

jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

let mockPathname = "/";

// jsdom chưa có IntersectionObserver/ResizeObserver — header dùng cả hai để
// theo dõi cuộn và đồng bộ `--site-header-height`.
beforeAll(() => {
  const stub = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  Object.assign(window, {
    IntersectionObserver: stub,
    ResizeObserver: stub,
    // jsdom không cài đặt hai API này; header dùng chúng khi mở menu mobile
    // (khoá cuộn + tự đóng menu khi resize lên desktop).
    scrollTo: jest.fn(),
    matchMedia: (query: string) => ({
      matches: false,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }),
  });
});

beforeEach(() => {
  mockPathname = "/";
});

/** Drawer mobile là `inert` khi đóng → nội dung của nó nằm ngoài a11y tree. */
function openMobileMenu(dictionary: Dictionary) {
  fireEvent.click(
    screen.getByRole("button", { name: dictionary.header.openMenu }),
  );
}

describe("SiteHeader", () => {
  it("render nút mở tìm kiếm ở header (thay ô input inline cũ)", () => {
    render(<SiteHeader locale="vi" dictionary={vi} />);

    expect(
      screen.getByRole("button", { name: vi.header.searchOpen }),
    ).toBeInTheDocument();
    // Ô input desktop cũ luôn hiện trong a11y tree; nay panel đóng nên không có
    // searchbox nào lộ ra cho tới khi người dùng chủ động mở.
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
  });

  it("giữ ô tìm kiếm trong drawer mobile VÀ ô đó có accessible label", () => {
    render(<SiteHeader locale="vi" dictionary={vi} />);
    openMobileMenu(vi);

    // Trước đây input drawer chỉ có `placeholder` → không có accessible name.
    const drawerSearch = screen.getByRole("searchbox", {
      name: vi.header.searchLabel,
    });
    expect(drawerSearch).toHaveAttribute("name", "q");
    expect(drawerSearch.closest("form")).toHaveAttribute("action", "/tin-tuc");
  });

  it("giữ nút hamburger cho breakpoint dưới desktop", () => {
    render(<SiteHeader locale="vi" dictionary={vi} />);

    expect(
      screen.getByRole("button", { name: vi.header.openMenu }),
    ).toBeInTheDocument();
  });

  it("locale EN: search action và language switcher giữ tiền tố /en", () => {
    mockPathname = "/en/du-an";
    render(<SiteHeader locale="en" dictionary={en} />);
    openMobileMenu(en);

    expect(
      screen.getByRole("searchbox", { name: en.header.searchLabel }).closest("form"),
    ).toHaveAttribute("action", "/en/tin-tuc");

    // Hai LanguageSwitcher cùng lộ ra khi drawer mở: một ở header desktop, một
    // trong drawer. Cả hai đều phải bỏ tiền tố mà giữ nguyên trang đang xem.
    const groups = screen.getAllByRole("group", {
      name: en.common.languageSwitcher,
    });
    expect(groups).toHaveLength(2);

    for (const group of groups) {
      const viLink = group.querySelector('a[hreflang="vi"]');
      expect(viLink).toHaveAttribute("href", "/du-an");
      expect(group.querySelector('a[hreflang="en"]')).toHaveAttribute(
        "href",
        "/en/du-an",
      );
    }
  });
});
