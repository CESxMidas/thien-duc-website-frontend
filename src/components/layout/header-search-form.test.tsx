/**
 * Khoá lại hợp đồng trợ năng của ô tìm kiếm dùng chung.
 *
 * Ba lỗi đã từng xảy ra thật và test này chặn tái diễn:
 * 1. Bản mobile mất `<label>`, chỉ còn placeholder → trình đọc màn hình đọc
 *    "edit text, blank".
 * 2. Ô nhập và nút gửi cùng mang một tên truy cập ("Tìm kiếm tin tức") → nghe
 *    hai control giống hệt nhau.
 * 3. Hai bản (desktop + drawer) cùng nằm trong DOM và trùng `id`, khiến
 *    `<label htmlFor>` trỏ nhầm phần tử.
 */
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
    // `method` rỗng = GET mặc định của trình duyệt. Có `method="post"` nghĩa là
    // ai đó đã đổi sang cơ chế khác — từ khóa sẽ không còn nằm trên URL.
    expect(form.getAttribute("method")).toBeNull();
    // `input[type=search]` mang role `searchbox`, không phải `textbox`.
    expect(within(form).getByRole("searchbox")).toBeInTheDocument();
  });

  it("lớp gọi quyết định `display`, component không tự khai", () => {
    // Desktop và drawer dùng hai `display` khác nhau ở hai breakpoint khác nhau;
    // nếu component tự gắn `flex` thì utility của lớp gọi sẽ chọi nhau.
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
