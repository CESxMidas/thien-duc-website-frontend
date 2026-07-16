/**
 * Test Breadcrumb (H5): JSON-LD BreadcrumbList + aria-current + thu gọn mobile.
 */
import { render, screen } from "@testing-library/react";
import { siteConfig } from "@/config/site";
import { Breadcrumb, type BreadcrumbItem } from "./breadcrumb";

const threeLevels: BreadcrumbItem[] = [
  { label: "Trang chủ", href: "/" },
  { label: "Dự án", href: "/du-an" },
  { label: "Khu dân cư Hưng Phú" },
];

function readJsonLd(container: HTMLElement): Record<string, unknown> {
  const script = container.querySelector('script[type="application/ld+json"]');
  expect(script).not.toBeNull();
  return JSON.parse(script!.textContent ?? "{}");
}

describe("Breadcrumb", () => {
  it("nhúng JSON-LD BreadcrumbList đúng thứ tự, item cuối không có URL", () => {
    const { container } = render(<Breadcrumb items={threeLevels} />);
    const jsonLd = readJsonLd(container);

    expect(jsonLd["@type"]).toBe("BreadcrumbList");
    expect(jsonLd.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Trang chủ",
        item: `${siteConfig.url}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Dự án",
        item: `${siteConfig.url}/du-an`,
      },
      // Trang hiện tại: có name nhưng không có item (không href)
      { "@type": "ListItem", position: 3, name: "Khu dân cư Hưng Phú" },
    ]);
  });

  it("phần tử cuối là trang hiện tại: aria-current, không phải link", () => {
    render(<Breadcrumb items={threeLevels} />);

    const current = screen.getByText("Khu dân cư Hưng Phú");
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current.tagName).not.toBe("A");

    // Các cấp trước là link bấm được
    expect(screen.getByRole("link", { name: "Dự án" })).toHaveAttribute(
      "href",
      "/du-an",
    );
  });

  it("nav có aria-label Breadcrumb", () => {
    render(<Breadcrumb items={threeLevels} />);
    expect(
      screen.getByRole("navigation", { name: "Breadcrumb" }),
    ).toBeInTheDocument();
  });

  it("> 3 cấp: các cấp giữa ẩn trên mobile (hidden sm:inline) kèm dấu …", () => {
    const fourLevels: BreadcrumbItem[] = [
      { label: "Trang chủ", href: "/" },
      { label: "Dự án", href: "/du-an" },
      { label: "Khu dân cư Hưng Phú", href: "/du-an/hung-phu" },
      { label: "Hạng mục cầu" },
    ];
    render(<Breadcrumb items={fourLevels} />);

    // Cấp giữa (index 1) thu gọn trên mobile nhưng vẫn là link bấm được
    const middle = screen.getByRole("link", { name: "Dự án" });
    expect(middle.className).toContain("hidden");
    expect(middle.className).toContain("sm:inline");

    // Cấp đầu và 2 cấp cuối không thu gọn
    expect(
      screen.getByRole("link", { name: "Trang chủ" }).className,
    ).not.toContain("hidden");
    expect(
      screen.getByRole("link", { name: "Khu dân cư Hưng Phú" }).className,
    ).not.toContain("hidden");
  });
});
