import { render, screen, within } from "@testing-library/react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { SiteShell } from "./site-shell";
import { footerSections } from "@/data/footer";
import { legalInfo, siteConfig, zaloHref } from "@/config/site";
import { getVietnamCurrentYear } from "@/lib/format";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import viDictionary from "@/lib/i18n/dictionaries/vi.json";

jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

const dictionary = viDictionary as unknown as Dictionary;
const phoneDigits = siteConfig.phone.replace(/[^\d+]/g, "");
const mapsDestination = encodeURIComponent(siteConfig.address);

describe("SiteHeader", () => {
  it("dùng thanh điều hướng compact theo mockup header với 6 mục chính", () => {
    render(<SiteHeader locale="vi" dictionary={dictionary} />);

    const primary = screen.getByRole("navigation", { name: "Primary" });
    const primaryLinks = within(primary).getAllByRole("link");

    expect(primaryLinks.map((link) => link.textContent)).toEqual([
      "Trang chủ",
      "Giới thiệu",
      "Lĩnh vực",
      "Dự án",
      "Tin tức",
      "Liên hệ",
    ]);
    expect(primaryLinks[2]).toHaveAttribute("href", "/#linh-vuc-hoat-dong");
    expect(
      screen.getByRole("img", { name: dictionary.shared.logoAlt }),
    ).toHaveAttribute(
      "src",
      expect.stringContaining("logo-thien-duc-header-transparent.png"),
    );
    expect(
      screen.queryByRole("link", { name: new RegExp(siteConfig.phone) }),
    ).toBeNull();
    expect(screen.queryByRole("link", { name: siteConfig.email })).toBeNull();
  });

  it("có biến thể header sau banner cho trang chủ với CTA, số điện thoại và menu", () => {
    render(
      <SiteHeader
        locale="vi"
        dictionary={dictionary}
        variant="home-after-banner"
      />,
    );

    expect(screen.getByRole("banner")).toHaveAttribute(
      "data-variant",
      "home-after-banner",
    );
    expect(
      screen.getByRole("link", { name: /Liên hệ nhận ưu đãi/i }),
    ).toHaveAttribute("href", "/lien-he");
    expect(screen.getByRole("link", { name: /0909 768 001/i })).toHaveAttribute(
      "href",
      "tel:0909768001",
    );
    expect(
      screen.getByRole("button", { name: dictionary.header.openMenu }),
    ).toHaveTextContent("Menu");
  });
});

describe("SiteShell", () => {
  it("render header, main và footer, không gắn nút Zalo nổi", async () => {
    render(await SiteShell({ locale: "vi", children: <p>nội dung</p> }));

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveTextContent("nội dung");
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: dictionary.zalo.ariaLabel }),
    ).toHaveAttribute("href", zaloHref());
  });
  it("renders home hero before the header when provided", async () => {
    const { container } = render(
      await SiteShell({
        locale: "vi",
        heroBeforeHeader: <section data-testid="home-hero">banner</section>,
        children: <p>noi dung sau header</p>,
      }),
    );

    const hero = screen.getByTestId("home-hero");
    const header = screen.getByRole("banner");
    const main = screen.getByRole("main");

    expect(header).toHaveAttribute("data-variant", "default");
    expect(hero.compareDocumentPosition(header)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(header.compareDocumentPosition(main)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(container.firstElementChild).toContainElement(hero);
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
      within(footer).getByText(new RegExp(String(getVietnamCurrentYear()))),
    ).toBeInTheDocument();
  });
});
