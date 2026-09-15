import { render, screen, within } from "@testing-library/react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { SiteShell } from "./site-shell";
import { footerSections } from "@/data/footer";
import { legalInfo, siteConfig } from "@/config/site";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import viDictionary from "@/lib/i18n/dictionaries/vi.json";

jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

const dictionary = viDictionary as unknown as Dictionary;
const phoneDigits = siteConfig.phone.replace(/[^\d+]/g, "");
const mapsDestination = encodeURIComponent(siteConfig.address);

describe("SiteHeader", () => {
  it("dùng thanh điều hướng compact với 5 mục chính và không render topstrip liên hệ", () => {
    render(<SiteHeader locale="vi" dictionary={dictionary} />);

    const primary = screen.getByRole("navigation", { name: "Primary" });
    const primaryLinks = within(primary).getAllByRole("link");

    expect(primaryLinks.map((link) => link.textContent)).toEqual([
      "Trang chủ",
      "Giới thiệu",
      "Dự án",
      "Tin tức",
      "Liên hệ",
    ]);
    expect(
      screen.queryByRole("link", { name: new RegExp(siteConfig.phone) }),
    ).toBeNull();
    expect(
      screen.queryByRole("link", { name: siteConfig.email }),
    ).toBeNull();
  });
});

describe("SiteShell", () => {
  it("render header, main và footer, không gắn nút Zalo nổi", async () => {
    render(await SiteShell({ locale: "vi", children: <p>nội dung</p> }));

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveTextContent("nội dung");
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(document.querySelector("a.floating-zalo")).toBeNull();
  });
});

describe("SiteFooter", () => {
  it("giữ landmark contentinfo và toàn bộ link điều hướng", () => {
    render(<SiteFooter locale="vi" dictionary={dictionary} />);
    const footer = screen.getByRole("contentinfo");

    for (const section of footerSections) {
      expect(
        within(footer).getByRole("heading", {
          name: dictionary.footerSectionTitles[section.title] ?? section.title,
        }),
      ).toBeInTheDocument();

      for (const link of section.links) {
        expect(
          within(footer).getByRole("link", {
            name: dictionary.footerLabels[link.href] ?? link.label,
          }),
        ).toHaveAttribute("href", link.href);
      }
    }
  });

  it("chỉ hiển thị kênh liên hệ đã xác thực và dùng Google directions cho địa chỉ", () => {
    render(<SiteFooter locale="vi" dictionary={dictionary} />);
    const footer = screen.getByRole("contentinfo");

    expect(
      within(footer).getByRole("link", {
        name: new RegExp(siteConfig.phone.replace(/[()]/g, "\\$&")),
      }),
    ).toHaveAttribute("href", `tel:${phoneDigits}`);
    expect(
      within(footer).getByRole("link", {
        name: new RegExp(siteConfig.email),
      }),
    ).toHaveAttribute("href", `mailto:${siteConfig.email}`);
    expect(within(footer).getByRole("link", { name: /1D/ })).toHaveAttribute(
      "href",
      expect.stringContaining(
        `https://www.google.com/maps/dir/?api=1&destination=${mapsDestination}`,
      ),
    );
    expect(within(footer).queryByRole("link", { name: /zalo/i })).toBeNull();
  });

  it("giữ CTA liên hệ và thông tin pháp lý ở footer", () => {
    render(<SiteFooter locale="vi" dictionary={dictionary} />);
    const footer = screen.getByRole("contentinfo");

    expect(
      within(footer).getByRole("link", {
        name: new RegExp(dictionary.common.contactCta),
      }),
    ).toHaveAttribute("href", "/lien-he");
    expect(within(footer).getByText(legalInfo.legalName)).toBeInTheDocument();
    expect(
      within(footer).getByText(new RegExp(legalInfo.taxCode)),
    ).toBeInTheDocument();
    expect(
      within(footer).getByText(new RegExp(String(new Date().getFullYear()))),
    ).toBeInTheDocument();
  });
});
