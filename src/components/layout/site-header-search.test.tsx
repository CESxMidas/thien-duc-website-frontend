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

describe("SiteHeader — tìm kiếm", () => {
  it("header compact có link tìm kiếm trực tiếp, không render form search inline", () => {
    render(<SiteHeader locale="vi" dictionary={dictionary} />);

    expect(
      screen.getByRole("link", { name: dictionary.header.searchLabel }),
    ).toHaveAttribute("href", "/tim-kiem");
    expect(screen.queryByRole("search")).toBeNull();
  });

  it("link tìm kiếm đúng theo locale tiếng Anh", () => {
    render(<SiteHeader locale="en" dictionary={dictionary} />);

    expect(
      screen.getByRole("link", { name: dictionary.header.searchLabel }),
    ).toHaveAttribute("href", "/en/tim-kiem");
  });

  it("drawer mobile vẫn giữ link tìm kiếm ở thanh header và không nhân bản form", () => {
    render(<SiteHeader locale="vi" dictionary={dictionary} />);
    openDrawer();

    expect(
      screen.getByRole("link", { name: dictionary.header.searchLabel }),
    ).toHaveAttribute("href", "/tim-kiem");
    expect(screen.queryByRole("search")).toBeNull();
  });

  it("bộ đổi ngôn ngữ có bản desktop và bản mobile khi drawer mở", () => {
    render(<SiteHeader locale="vi" dictionary={dictionary} />);
    openDrawer();

    const switchers = screen.getAllByRole("group", {
      name: dictionary.common.languageSwitcher,
    });

    expect(switchers).toHaveLength(2);
    expect(within(switchers[0]).getByRole("link", { name: "English" }))
      .toHaveAttribute("href", "/en");
  });
});
