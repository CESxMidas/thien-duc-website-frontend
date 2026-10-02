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

  it("khong con noi dung va dieu khien nam trong anh banner", () => {
    renderSlider();

    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /xem du an/i })).toBeNull();
    expect(screen.queryByRole("link", { name: /lien he/i })).toBeNull();
    expect(screen.queryByTestId("banner-contact-actions")).toBeNull();
    expect(screen.queryByTestId("banner-autoplay-toggle")).toBeNull();
    expect(document.querySelector(".banner-progress")).toBeNull();
    expect(document.querySelector(".h-px.w-28")).toBeNull();
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
