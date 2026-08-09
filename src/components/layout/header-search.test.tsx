import { fireEvent, render, screen } from "@testing-library/react";
import { HeaderSearch } from "@/components/layout/header-search";
import viDictionary from "@/lib/i18n/dictionaries/vi.json";
import enDictionary from "@/lib/i18n/dictionaries/en.json";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

const vi = viDictionary as unknown as Dictionary;
const en = enDictionary as unknown as Dictionary;

function renderSearch(dictionary: Dictionary = vi, action = "/tin-tuc") {
  return render(<HeaderSearch action={action} dictionary={dictionary} />);
}

/** Panel dùng thuộc tính `hidden`, nên truy vấn phải bỏ qua bộ lọc a11y mặc định. */
function panelForm() {
  return document.querySelector("form");
}

describe("HeaderSearch", () => {
  it("hiện nút mở tìm kiếm với accessible name, panel đóng sẵn", () => {
    renderSearch();

    const trigger = screen.getByRole("button", {
      name: vi.header.searchOpen,
    });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    // Input tồn tại trong DOM nhưng nằm trong panel `hidden` → không lộ ra a11y tree.
    expect(
      screen.queryByRole("searchbox", { name: vi.header.searchLabel }),
    ).not.toBeInTheDocument();
  });

  it("mở panel, focus vào input và dùng nhãn submit riêng biệt", () => {
    renderSearch();

    fireEvent.click(screen.getByRole("button", { name: vi.header.searchOpen }));

    const input = screen.getByRole("searchbox", { name: vi.header.searchLabel });
    expect(input).toHaveFocus();

    // Nút submit KHÔNG được trùng nhãn với field (trước đây cả hai đều là
    // "Tìm kiếm tin tức" → screen reader đọc lặp).
    const submit = screen.getByRole("button", { name: vi.header.searchSubmit });
    expect(submit).toHaveAttribute("type", "submit");
    expect(vi.header.searchSubmit).not.toBe(vi.header.searchLabel);
  });

  it("giữ nguyên semantics submit: GET `q` sang route tin tức theo locale", () => {
    renderSearch(en, "/en/tin-tuc");

    fireEvent.click(screen.getByRole("button", { name: en.header.searchOpen }));

    expect(panelForm()).toHaveAttribute("action", "/en/tin-tuc");
    expect(
      screen.getByRole("searchbox", { name: en.header.searchLabel }),
    ).toHaveAttribute("name", "q");
  });

  it("Escape đóng panel và trả focus về nút mở", () => {
    renderSearch();

    const trigger = screen.getByRole("button", { name: vi.header.searchOpen });
    fireEvent.click(trigger);
    expect(
      screen.getByRole("searchbox", { name: vi.header.searchLabel }),
    ).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(
      screen.queryByRole("searchbox", { name: vi.header.searchLabel }),
    ).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("bấm ra ngoài thì đóng panel", () => {
    renderSearch();

    fireEvent.click(screen.getByRole("button", { name: vi.header.searchOpen }));
    fireEvent.pointerDown(document.body);

    expect(
      screen.queryByRole("searchbox", { name: vi.header.searchLabel }),
    ).not.toBeInTheDocument();
  });
});
