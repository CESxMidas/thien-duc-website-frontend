import { companyContactFixture as companyContact } from "@/test-support/company-contact";
import { render, screen, within } from "@testing-library/react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { SiteShell } from "./site-shell";
import { footerSections } from "@/data/footer";
import { zaloHref } from "@/config/site";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import viDictionary from "@/lib/i18n/dictionaries/vi.json";

jest.mock("@/lib/api/settings", () => ({
  ...jest.requireActual("@/lib/api/settings"),
  getCompanyContact: async () => companyContact,
}));

jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

const dictionary = viDictionary as unknown as Dictionary;
const phoneDigits = companyContact.phone.replace(/[^\d+]/g, "");
const mapsDestination = encodeURIComponent(companyContact.address.vi);

describe("SiteHeader", () => {
  it("dùng thanh điều hướng compact theo mockup header với 7 mục chính", () => {
    render(<SiteHeader locale="vi" dictionary={dictionary} />);

    expect(screen.getByRole("banner").className).toContain(
      "site-header-surface",
    );
    const primary = screen.getByRole("navigation", { name: "Primary" });
    const primaryLinks = within(primary).getAllByRole("link");

    expect(primaryLinks.map((link) => link.textContent)).toEqual([
      "Trang chủ",
      "Giới thiệu",
      "Lĩnh vực",
      "Dự án",
      "Tin tức",
      "Tuyển dụng",
      "Liên hệ",
    ]);
    expect(primaryLinks[2]).toHaveAttribute("href", "/linh-vuc-hoat-dong");
    expect(
      screen.getByRole("img", { name: dictionary.shared.logoAlt }),
    ).toHaveAttribute(
      "src",
      expect.stringContaining("logo-thien-duc-header-transparent.png"),
    );
    expect(
      screen.queryByRole("link", { name: new RegExp(companyContact.phone) }),
    ).toBeNull();
    expect(
      screen.queryByRole("link", { name: companyContact.email }),
    ).toBeNull();
  });

  it("có biến thể header sau banner cho trang chủ với CTA, số điện thoại và menu", () => {
    render(
      <SiteHeader
        locale="vi"
        dictionary={dictionary}
        variant="home-after-banner"
        companyPhone={companyContact.phone}
      />,
    );

    expect(screen.getByRole("banner")).toHaveAttribute(
      "data-variant",
      "home-after-banner",
    );
    expect(screen.getByRole("banner").className).toContain(
      "site-header-surface",
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
  it("places one breadcrumb before content inside main", async () => {
    render(
      await SiteShell({
        locale: "vi",
        breadcrumbs: [{ label: "Trang chủ", href: "/" }, { label: "Dự án" }],
        children: <h1>Danh sách dự án</h1>,
      }),
    );
    const main = screen.getByRole("main");
    const breadcrumb = within(main).getByRole("navigation", {
      name: "Breadcrumb",
    });
    expect(main.firstElementChild).toBe(breadcrumb);
    expect(main.querySelector(".site-page-content")).not.toContainElement(
      breadcrumb,
    );
    expect(within(breadcrumb).getByText("Dự án")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("render header, main và footer, không gắn nút Zalo nổi", async () => {
    render(await SiteShell({ locale: "vi", children: <p>nội dung</p> }));

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveTextContent("nội dung");
    expect(screen.getByText("nội dung").parentElement).toHaveClass(
      "site-page-content",
    );
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: dictionary.zalo.ariaLabel }),
    ).toHaveAttribute("href", zaloHref());
  });
  it("renders the header before the home hero when provided", async () => {
    const { container } = render(
      await SiteShell({
        locale: "vi",
        isHomePage: true,
        heroBeforeHeader: <section data-testid="home-hero">banner</section>,
        children: <p>noi dung sau header</p>,
      }),
    );

    const hero = screen.getByTestId("home-hero");
    const header = screen.getByRole("banner");
    const main = screen.getByRole("main");

    expect(header).toHaveAttribute("data-variant", "default");
    expect(header.compareDocumentPosition(hero)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(hero.compareDocumentPosition(main)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(container.firstElementChild).toContainElement(hero);
    expect(main.querySelector(".site-page-content")).toBeNull();
  });
});

describe("SiteFooter", () => {
  it("hiển thị thông tin vừa cập nhật từ CMS và tạo đúng liên kết", () => {
    const saved = {
      phone: "+84 28 1234 5678",
      email: "contact@thienduc.vn",
      taxCode: "1234567890",
      address: { vi: "Địa chỉ mới", en: "Updated office address" },
    };
    render(
      <SiteFooter locale="en" dictionary={dictionary} companyContact={saved} />,
    );
    expect(
      screen.getByRole("link", { name: /\+84 28 1234 5678/ }),
    ).toHaveAttribute("href", "tel:+842812345678");
    expect(
      screen.getByRole("link", { name: /contact@thienduc.vn/ }),
    ).toHaveAttribute("href", "mailto:contact@thienduc.vn");
    expect(
      screen.getByRole("link", { name: /Updated office address/ }),
    ).toHaveAttribute(
      "href",
      expect.stringContaining(encodeURIComponent(saved.address.vi)),
    );
    expect(screen.getByText(/1234567890/)).toBeInTheDocument();
    expect(screen.queryByText(companyContact.email)).toBeNull();
  });
  it("giữ landmark contentinfo và toàn bộ link điều hướng", () => {
    render(
      <SiteFooter
        companyContact={companyContact}
        locale="vi"
        dictionary={dictionary}
      />,
    );
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
    render(
      <SiteFooter
        companyContact={companyContact}
        locale="vi"
        dictionary={dictionary}
      />,
    );
    const footer = screen.getByRole("contentinfo");

    expect(
      within(footer).getByRole("link", {
        name: new RegExp(companyContact.phone.replace(/[()]/g, "\\$&")),
      }),
    ).toHaveAttribute("href", `tel:${phoneDigits}`);
    expect(
      within(footer).getByRole("link", {
        name: new RegExp(companyContact.email),
      }),
    ).toHaveAttribute("href", `mailto:${companyContact.email}`);
    expect(
      within(footer).getByRole("link", { name: /Số 10 Trần Não/i }),
    ).toHaveAttribute(
      "href",
      expect.stringContaining(
        `https://www.google.com/maps/dir/?api=1&destination=${mapsDestination}`,
      ),
    );
    expect(within(footer).queryByRole("link", { name: /zalo/i })).toBeNull();
  });

  it("dùng nền champagne sáng và logo nâu để footer tách biệt rõ", () => {
    render(
      <SiteFooter
        companyContact={companyContact}
        locale="vi"
        dictionary={dictionary}
      />,
    );
    const footer = screen.getByRole("contentinfo");

    expect(
      within(footer).queryByRole("link", {
        name: new RegExp(dictionary.common.contactCta),
      }),
    ).toBeNull();
    expect(
      within(footer).getByRole("img", { name: dictionary.shared.logoAlt }),
    ).toHaveAttribute(
      "src",
      expect.stringContaining("logo-thien-duc-header-transparent.png"),
    );
    expect(
      within(footer)
        .getByRole("img", { name: dictionary.shared.logoAlt })
        .closest("a"),
    ).not.toHaveClass("border", "rounded-[6px]", "bg-white/12");
    expect(footer).toHaveTextContent(
      "CÔNG TY TNHH ĐẦU TƯ XÂY DỰNG THƯƠNG MẠI THIÊN ĐỨC",
    );
    expect(footer).toHaveTextContent("MST: 0309910290");
    expect(footer).toHaveTextContent("0909 768 001");
    expect(footer).toHaveClass("site-footer", "text-footer-ink");
  });
});
