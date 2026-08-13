/**
 * Regression nhỏ cho phần "khung" website sau đợt gọn hoá topstrip + footer:
 * - Topstrip giữ đủ 3 link (bản đồ / điện thoại / email) **có tên truy cập**,
 *   dù nhãn bị `sr-only` ở mobile để dải không tràn ngang.
 * - Footer giữ nguyên cấu trúc: landmark contentinfo, mọi link điều hướng,
 *   thông tin liên hệ, CTA nằm **trong** cột liên hệ, và khối pháp lý.
 * Không kiểm pixel — chỉ chốt phần dễ vỡ khi tinh chỉnh giao diện tiếp.
 */
import { render, screen, within } from "@testing-library/react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { SiteShell } from "./site-shell";
import { footerSections } from "@/data/footer";
import {
  legalInfo,
  siteConfig,
  zaloDisplayValue,
  zaloHref,
} from "@/config/site";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import viDictionary from "@/lib/i18n/dictionaries/vi.json";

jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

// jsdom không có hai observer này; header dùng chúng để thu gọn topstrip khi
// cuộn và đo `--site-header-height`. Stub no-op là đủ cho test markup.
class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

beforeAll(() => {
  Object.assign(globalThis, {
    IntersectionObserver: NoopObserver,
    ResizeObserver: NoopObserver,
  });
});

const dictionary = viDictionary as unknown as Dictionary;
const phoneDigits = siteConfig.phone.replace(/[^\d+]/g, "");

describe("HeaderTopStrip", () => {
  it("giữ đủ 3 link liên hệ với tên truy cập, không phụ thuộc nhãn hiện trên màn hình", () => {
    render(<SiteHeader locale="vi" dictionary={dictionary} />);

    // Nhãn địa chỉ/email `sr-only` ở màn hẹp — getByRole vẫn phải thấy chúng.
    expect(
      screen.getByRole("link", {
        name: new RegExp(siteConfig.phone.replace(/[()]/g, "\\$&")),
      }),
    ).toHaveAttribute("href", `tel:${phoneDigits}`);
    expect(
      screen.getByRole("link", { name: siteConfig.email }),
    ).toHaveAttribute("href", `mailto:${siteConfig.email}`);
    expect(screen.getByRole("link", { name: /1D Trần Não/ })).toHaveAttribute(
      "href",
      expect.stringContaining("maps.google.com"),
    );
  });
});

describe("SiteShell — nút Zalo nổi theo route", () => {
  /** `SiteShell` là Server Component `async`: gọi rồi render phần tử trả về. */
  const renderShell = async (props?: { showFloatingContact?: boolean }) =>
    render(
      await SiteShell({ locale: "vi", children: <p>nội dung</p>, ...props }),
    );

  const floating = () =>
    document.querySelector<HTMLAnchorElement>("a.floating-zalo");

  it("mặc định (trang chủ, dự án, tin tức) có render nút nổi", async () => {
    await renderShell();

    const link = floating();
    expect(link).not.toBeNull();
    expect(link).toHaveAttribute("href", zaloHref());
    expect(link).toHaveAccessibleName(dictionary.zalo.ariaLabel);
  });

  it("trang tắt kênh nổi thì KHÔNG render nó — không phải chỉ ẩn bằng CSS", async () => {
    await renderShell({ showFloatingContact: false });

    expect(floating()).toBeNull();
    // Không còn bất kỳ link Zalo nào ngoài footer.
    const zaloLinks = screen.getAllByRole("link", {
      name: dictionary.zalo.ariaLabel,
    });
    expect(zaloLinks).toHaveLength(1);
    expect(zaloLinks[0].closest("footer")).not.toBeNull();
  });
});

describe("SiteFooter", () => {
  it("giữ landmark contentinfo và toàn bộ link điều hướng", () => {
    render(<SiteFooter locale="vi" dictionary={dictionary} />);
    const footer = screen.getByRole("contentinfo");

    for (const section of footerSections) {
      expect(
        within(footer).getByRole("heading", { name: section.title }),
      ).toBeInTheDocument();

      for (const link of section.links) {
        expect(
          within(footer).getByRole("link", { name: link.label }),
        ).toHaveAttribute("href", link.href);
      }
    }
  });

  it("gắn CTA liên hệ ngay trong cột liên hệ, cạnh điện thoại/email/địa chỉ", () => {
    render(<SiteFooter locale="vi" dictionary={dictionary} />);

    const contactHeading = screen.getByRole("heading", {
      name: dictionary.footer.contact,
    });
    const contactColumn = contactHeading.parentElement as HTMLElement;

    expect(
      within(contactColumn).getByRole("link", {
        name: new RegExp(dictionary.common.contactCta),
      }),
    ).toHaveAttribute("href", "/lien-he");
    expect(
      within(contactColumn).getByRole("link", { name: /tel|điện thoại/i }),
    ).toHaveAttribute("href", `tel:${phoneDigits}`);
  });

  it("có mục liên hệ Zalo trong cột liên hệ, cùng khuôn với điện thoại/email", () => {
    render(<SiteFooter locale="vi" dictionary={dictionary} />);

    const contactHeading = screen.getByRole("heading", {
      name: dictionary.footer.contact,
    });
    const contactColumn = contactHeading.parentElement as HTMLElement;
    const zaloLink = within(contactColumn).getByRole("link", {
      name: dictionary.zalo.ariaLabel,
    });

    expect(zaloLink).toHaveAttribute("href", zaloHref());
    expect(zaloLink).toHaveAttribute("target", "_blank");
    expect(zaloLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(within(zaloLink).getByText(zaloDisplayValue() as string))
      .toBeInTheDocument();
  });

  it("giữ thông tin pháp lý và bản quyền trong khối đáy", () => {
    render(<SiteFooter locale="vi" dictionary={dictionary} />);
    const footer = screen.getByRole("contentinfo");

    expect(within(footer).getByText(legalInfo.legalName)).toBeInTheDocument();
    expect(
      within(footer).getByText(new RegExp(legalInfo.taxCode)),
    ).toBeInTheDocument();
    expect(
      within(footer).getByText(new RegExp(`© ${new Date().getFullYear()}`)),
    ).toBeInTheDocument();
  });
});
