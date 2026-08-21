/**
 * Chốt phần dễ vỡ của kênh liên hệ Zalo: URL sinh ra đúng dạng canonical, hai
 * biến thể đều là `<a>` thật có tên truy cập song ngữ, icon không bị đọc thành
 * tên thứ hai, và số điện thoại không bị chép cứng ra ngoài `config/site.ts`.
 * Không kiểm pixel.
 */
import { render, screen } from "@testing-library/react";
import { ZaloContactLink } from "./zalo-contact-link";
import { ZaloIcon } from "./zalo-icon";
import {
  zaloContact,
  zaloDisplayValue,
  zaloHref,
  type ZaloContact,
} from "@/config/site";
import viDictionary from "@/lib/i18n/dictionaries/vi.json";
import enDictionary from "@/lib/i18n/dictionaries/en.json";

const CANONICAL_HREF = "https://zalo.me/0909768001";

describe("cấu hình Zalo", () => {
  it("dùng kind `phone` và số thử nghiệm ở dạng nội địa liền", () => {
    expect(zaloContact.kind).toBe("phone");
    expect(zaloContact.value).toBe("0909768001");
  });

  it("dựng đúng URL canonical — không `+84`, không dấu cách", () => {
    expect(zaloHref()).toBe(CANONICAL_HREF);
    expect(zaloHref()).not.toContain(" ");
    expect(zaloHref()).not.toContain("+84");
  });

  it("hiển thị số theo cách nhóm của tiếng Việt", () => {
    expect(zaloDisplayValue()).toBe("0909 768 001");
  });

  it("đổi sang Official Account không phải sửa component: href vẫn dựng được, phần số hiển thị tự tắt", () => {
    const oa: ZaloContact = { kind: "oa", value: "1234567890123456789" };

    expect(zaloHref(oa)).toBe("https://zalo.me/1234567890123456789");
    expect(zaloDisplayValue(oa)).toBeUndefined();
  });
});

describe("ZaloContactLink", () => {
  it.each([["floating"] as const, ["inline"] as const])(
    "biến thể %s là link thật, mở tab mới an toàn",
    (variant) => {
      render(
        <ZaloContactLink
          variant={variant}
          href={zaloHref()}
          ariaLabel={viDictionary.zalo.ariaLabel}
          label={viDictionary.zalo.label}
          displayValue={zaloDisplayValue()}
        />,
      );

      const link = screen.getByRole("link", {
        name: viDictionary.zalo.ariaLabel,
      });

      expect(link.tagName).toBe("A");
      expect(link).toHaveAttribute("href", CANONICAL_HREF);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    },
  );

  it("đặt tên truy cập tiếng Việt, không phơi URL thô làm tên", () => {
    render(
      <ZaloContactLink
        variant="floating"
        href={zaloHref()}
        ariaLabel={viDictionary.zalo.ariaLabel}
        label={viDictionary.zalo.label}
      />,
    );

    expect(
      screen.getByRole("link", { name: "Liên hệ Thiên Đức qua Zalo" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /zalo\.me/ })).toBeNull();
  });

  it("đặt tên truy cập tiếng Anh từ dictionary EN", () => {
    render(
      <ZaloContactLink
        variant="floating"
        href={zaloHref()}
        ariaLabel={enDictionary.zalo.ariaLabel}
        label={enDictionary.zalo.label}
      />,
    );

    expect(
      screen.getByRole("link", { name: "Contact Thiên Đức via Zalo" }),
    ).toBeInTheDocument();
  });

  it("biến thể inline hiện số đã format và giữ nhãn kênh cho trình đọc màn hình", () => {
    render(
      <ZaloContactLink
        variant="inline"
        href={zaloHref()}
        ariaLabel={viDictionary.zalo.ariaLabel}
        label={viDictionary.zalo.label}
        displayValue={zaloDisplayValue()}
      />,
    );

    expect(screen.getByText("0941 383 007")).toBeInTheDocument();
    expect(screen.getByText(/^Zalo:/)).toHaveClass("sr-only");
  });

  it("biến thể floating không in số điện thoại lên nút", () => {
    const { container } = render(
      <ZaloContactLink
        variant="floating"
        href={zaloHref()}
        ariaLabel={viDictionary.zalo.ariaLabel}
        label={viDictionary.zalo.label}
      />,
    );

    expect(container.textContent).not.toContain("0941");
  });
});

describe("ZaloIcon", () => {
  it("là hình trang trí: ẩn khỏi cây trợ năng để link cha giữ tên duy nhất", () => {
    const { container } = render(<ZaloIcon />);
    const svg = container.querySelector("svg") as SVGElement;

    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("focusable", "false");
  });

  it("là SVG nội tuyến — không phát sinh <img> hay request asset ngoài", () => {
    const { container } = render(<ZaloIcon />);

    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("image")).toBeNull();
    expect(container.querySelectorAll("path").length).toBeGreaterThan(0);
  });

  it("tô theo currentColor nên nút cha quyết định màu", () => {
    const { container } = render(<ZaloIcon />);

    expect(container.querySelector("svg")).toHaveAttribute(
      "fill",
      "currentColor",
    );
  });
});
