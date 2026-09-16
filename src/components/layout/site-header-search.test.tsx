import { fireEvent, render, screen, within } from "@testing-library/react";
import { SiteHeader } from "./site-header";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import viDictionary from "@/lib/i18n/dictionaries/vi.json";

jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

const dictionary = viDictionary as unknown as Dictionary;

function openDrawer() {
  fireEvent.click(
    screen.getByRole("button", { name: dictionary.header.openMenu }),
  );
}

function openSearch() {
  const trigger = screen.getByRole("button", {
    name: dictionary.header.searchLabel,
  });
  fireEvent.click(trigger);
  return trigger;
}

describe("SiteHeader — tìm kiếm", () => {
  it("nút search mở form GET tìm kiếm trong header", () => {
    render(<SiteHeader locale="vi" dictionary={dictionary} />);

    const trigger = screen.getByRole("button", {
      name: dictionary.header.searchLabel,
    });

    expect(screen.queryByRole("search")).toBeNull();
    fireEvent.click(trigger);

    const form = screen.getByRole("search");
    expect(form).toHaveAttribute("action", "/tim-kiem");
    expect(within(form).getByRole("searchbox")).toHaveAttribute("name", "q");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("form tìm kiếm đúng theo locale tiếng Anh", () => {
    render(<SiteHeader locale="en" dictionary={dictionary} />);

    openSearch();

    expect(screen.getByRole("search")).toHaveAttribute(
      "action",
      "/en/tim-kiem",
    );
  });

  it("nút đóng ẩn form tìm kiếm", () => {
    render(<SiteHeader locale="vi" dictionary={dictionary} />);

    openSearch();
    expect(screen.getByRole("search")).toBeInTheDocument();

    fireEvent.click(
      within(screen.getByRole("search")).getByRole("button", {
        name: dictionary.header.closeMenu,
      }),
    );

    expect(screen.queryByRole("search")).toBeNull();
  });

  it("drawer mobile không nhân bản form tìm kiếm khi mở menu", () => {
    render(<SiteHeader locale="vi" dictionary={dictionary} />);
    openDrawer();

    expect(screen.queryByRole("search")).toBeNull();
  });

  it("bộ đổi ngôn ngữ có bản desktop và bản mobile khi drawer mở", () => {
    render(<SiteHeader locale="vi" dictionary={dictionary} />);
    openDrawer();

    const switchers = screen.getAllByRole("group", {
      name: dictionary.common.languageSwitcher,
    });

    expect(switchers).toHaveLength(2);
    expect(
      within(switchers[0]).getByRole("link", { name: "English" }),
    ).toHaveAttribute("href", "/en");
  });
});
