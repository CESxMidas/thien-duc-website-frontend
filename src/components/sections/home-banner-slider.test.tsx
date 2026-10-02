import { render, screen } from "@testing-library/react";
import { HomeBannerSlider } from "./home-banner-slider";
import type { HomeBanner } from "@/data/banners";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import viDictionary from "@/lib/i18n/dictionaries/vi.json";

const dictionary = viDictionary as unknown as Dictionary;
const labels = dictionary.homeBanner;

function makeBanners(count: number): HomeBanner[] {
  return Array.from({ length: count }, (_, index) => ({
    image: `/images/banner-${index + 1}.jpg`,
    eyebrow: `Nhan ${index + 1}`,
    title: `Banner ${index + 1}`,
    subtitle: `Mo ta banner ${index + 1}`,
    href: `/du-an/du-an-${index + 1}`,
    ctaLabel: "Xem du an",
  }));
}

function mockReducedMotion(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: () => ({
      matches,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  });
}

function renderSlider(count = 3) {
  return render(
    <HomeBannerSlider
      banners={makeBanners(count)}
      locale="vi"
      contactCtaLabel="Lien he"
      labels={labels}
    />,
  );
}

beforeEach(() => mockReducedMotion(false));

describe("HomeBannerSlider", () => {
  it("giu khung banner ngang va khong chiem full man", () => {
    const { container } = renderSlider();
    const stage = container.querySelector("section > div");

    expect(stage).toHaveClass("h-[clamp(18rem,33.333vw,40rem)]");
    expect(stage).not.toHaveClass("h-svh");
    expect(stage).not.toHaveClass("min-h-[40rem]");
  });

  it("anh banner phu kin khung de khong con khoang den tren duoi", () => {
    const { container } = renderSlider();
    const image = container.querySelector("img");

    expect(image?.className).toContain("object-cover");
    expect(image?.className).not.toContain("object-contain");
  });

  it("giu noi dung va dieu khien nam gon trong banner", () => {
    renderSlider();

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Banner 1",
    );
    expect(screen.getByRole("link", { name: /xem du an/i })).toHaveAttribute(
      "href",
      "/du-an/du-an-1",
    );
    expect(screen.getByRole("link", { name: /lien he/i })).toHaveAttribute(
      "href",
      "/lien-he",
    );
    expect(screen.getByTestId("banner-contact-actions").className).toContain(
      "bottom-[clamp(4.25rem,7vw,6.5rem)]",
    );
    expect(screen.getByTestId("banner-autoplay-toggle")).toBeInTheDocument();
    expect(document.querySelector(".banner-progress")).not.toBeNull();
    expect(document.querySelector(".h-px.w-28")).not.toBeNull();
  });

  it("khong dua lai thanh lien he so dien thoai menu o goc tren banner", () => {
    renderSlider();

    expect(screen.queryByTestId("banner-utility-bar")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /0909 768 001/i })).toBeNull();
    expect(
      screen.queryByRole("button", { name: dictionary.header.openMenu }),
    ).toBeNull();
  });

  it("khong render gi khi khong co banner", () => {
    const { container } = render(
      <HomeBannerSlider
        banners={[]}
        locale="vi"
        contactCtaLabel="Lien he"
        labels={labels}
      />,
    );

    expect(container.firstChild).toBeNull();
  });
});
