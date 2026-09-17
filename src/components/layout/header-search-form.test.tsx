
import { render, screen, within } from "@testing-library/react";
import { HeaderSearchForm } from "./header-search-form";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import enDictionary from "@/lib/i18n/dictionaries/en.json";
import viDictionary from "@/lib/i18n/dictionaries/vi.json";

const vi = (viDictionary as unknown as Dictionary).header;
const en = (enDictionary as unknown as Dictionary).header;

describe("HeaderSearchForm", () => {
  it("ô nhập có nhãn thật, không phụ thuộc placeholder", () => {
    render(
      <HeaderSearchForm action="/tin-tuc" labels={vi} inputId="search-test" />,
    );

    const input = screen.getByLabelText(vi.searchLabel);
    expect(input).toHaveAttribute("name", "q");
    expect(input).toHaveAttribute("type", "search");
    expect(input).toHaveAttribute("id", "search-test");
  });

  it("nút gửi có tên truy cập RIÊNG, khác nhãn của ô nhập", () => {
    render(
      <HeaderSearchForm action="/tin-tuc" labels={vi} inputId="search-test" />,
    );

    expect(
      screen.getByRole("button", { name: vi.searchSubmit }),
    ).toHaveAttribute("type", "submit");
    expect(vi.searchSubmit).not.toBe(vi.searchLabel);
    expect(en.searchSubmit).not.toBe(en.searchLabel);
  });

  it("là landmark search và submit đúng đích theo locale", () => {
    const { unmount } = render(
      <HeaderSearchForm action="/tin-tuc" labels={vi} inputId="search-vi" />,
    );
    expect(screen.getByRole("search")).toHaveAttribute("action", "/tin-tuc");
    unmount();

    render(
      <HeaderSearchForm action="/en/tin-tuc" labels={en} inputId="search-en" />,
    );
    expect(screen.getByRole("search")).toHaveAttribute("action", "/en/tin-tuc");
  });

  it("không dựng state phía client: chỉ là form GET thuần", () => {
    render(
      <HeaderSearchForm action="/tin-tuc" labels={vi} inputId="search-test" />,
    );

    const form = screen.getByRole("search");

    expect(form.getAttribute("method")).toBeNull();
    expect(within(form).getByRole("searchbox")).toBeInTheDocument();
  });

  it("lớp gọi quyết định `display`, component không tự khai", () => {

    render(
      <HeaderSearchForm
        action="/tin-tuc"
        labels={vi}
        inputId="search-test"
        className="hidden lg:flex"
      />,
    );

    const form = screen.getByRole("search");
    expect(form).toHaveClass("search-field", "hidden", "lg:flex");
    expect(form.className).not.toMatch(/(^|\s)flex(\s|$)/);
  });
});
