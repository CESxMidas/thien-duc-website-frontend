import { fireEvent, render, screen } from "@testing-library/react";
import { HomeBannerSlider } from "./home-banner-slider";
import type { HomeBanner } from "@/data/banners";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import viDictionary from "@/lib/i18n/dictionaries/vi.json";
const dictionary = viDictionary as unknown as Dictionary;
const labels = dictionary.homeBanner;

function makeBanners(count: number): HomeBanner[] {
  return Array.from({ length: count }, (_, index) => ({
    image: `/images/banner-${index + 1}.jpg`,
    eyebrow: `Nhãn ${index + 1}`,
    title: `Banner ${index + 1}`,
    subtitle: `Mô tả banner ${index + 1}`,
    href: `/du-an/du-an-${index + 1}`,
    ctaLabel: "Xem dự án",
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
      contactCtaLabel="Liên hệ"
      labels={labels}
    />,
  );
}

const toggle = () => screen.queryByTestId("banner-autoplay-toggle");
const progressBar = () =>
  document.querySelector<HTMLElement>(".banner-progress");
beforeEach(() => mockReducedMotion(false));
describe("HomeBannerSlider", () => {
  it("có nút tạm dừng hiện rõ khi autoplay đang chạy", () => {
    renderSlider();
    const button = toggle();
    expect(button).not.toBeNull();
    expect(button).toHaveAttribute("aria-label", labels.ariaPause);
    expect(button).toHaveAttribute("data-paused", "false");
  });

  it("bấm tạm dừng thì dừng hẳn và đổi nhãn sang 'tiếp tục'", () => {
    renderSlider();
    fireEvent.click(toggle()!);
    expect(toggle()).toHaveAttribute("aria-label", labels.ariaPlay);
    expect(toggle()).toHaveAttribute("data-paused", "true");
    expect(progressBar()).toHaveStyle({ animationPlayState: "paused" });
  });

  it("trạng thái tạm dừng KHÔNG tự hết sau khi rê chuột ra ngoài", () => {
    const { container } = renderSlider();
    const region = container.querySelector("section")!;
    fireEvent.click(toggle()!);
    fireEvent.pointerEnter(region);
    fireEvent.pointerLeave(region);
    expect(toggle()).toHaveAttribute("data-paused", "true");
    expect(progressBar()).toHaveStyle({ animationPlayState: "paused" });
  });

  it("bấm lại thì chạy tiếp", () => {
    renderSlider();
    fireEvent.click(toggle()!);
    fireEvent.click(toggle()!);
    expect(toggle()).toHaveAttribute("aria-label", labels.ariaPause);
    expect(progressBar()).toHaveStyle({ animationPlayState: "running" });
  });

  it("đang tạm dừng vẫn chuyển slide tay được", () => {
    renderSlider();
    fireEvent.click(toggle()!);
    fireEvent.click(screen.getByLabelText(labels.ariaNext));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Banner 2",
    );
    expect(toggle()).toHaveAttribute("data-paused", "true");
  });

  it("prefers-reduced-motion: KHÔNG hiện nút tạm dừng vì vốn không có gì chạy", () => {
    mockReducedMotion(true);
    renderSlider();
    expect(toggle()).toBeNull();
    expect(progressBar()).toBeNull();
  });

  it("chỉ một banner: không có autoplay nên không có nút tạm dừng", () => {
    renderSlider(1);
    expect(toggle()).toBeNull();
    expect(progressBar()).toBeNull();
  });

  it("chu kỳ tự chuyển là 4500ms — khoá giá trị đã duyệt", () => {
    renderSlider();
    expect(progressBar()).toHaveStyle({ animationDuration: "4500ms" });
  });

  it("focus vào NÚT TẠM DỪNG không kích hoạt tạm-dừng-khi-focus", () => {
    renderSlider();
    fireEvent.focus(toggle()!);
    expect(progressBar()).toHaveStyle({ animationPlayState: "running" });
  });

  it("nhưng focus vào nút tiến/lùi thì VẪN tạm dừng (giữ hành vi a11y cũ)", () => {
    renderSlider();
    fireEvent.focus(screen.getByLabelText(labels.ariaNext));
    expect(progressBar()).toHaveStyle({ animationPlayState: "paused" });
  });

  it("bấm tiếp tục khi đang giữ focus trên nút thì chạy lại ngay", () => {
    renderSlider();
    fireEvent.focus(toggle()!);
    fireEvent.click(toggle()!); // dừng
    expect(progressBar()).toHaveStyle({ animationPlayState: "paused" });
    fireEvent.click(toggle()!); // chạy tiếp — focus vẫn ở nút
    expect(progressBar()).toHaveStyle({ animationPlayState: "running" });
  });

  it("khối chữ KHÔNG còn dùng backdrop blur (ảnh phải giữ được chi tiết)", () => {
    const { container } = renderSlider();
    expect(container.querySelector(".backdrop-blur-sm")).toBeNull();
  });

  it("phụ đề theo bố cục hero editorial, tối đa 3 dòng", () => {
    renderSlider();
    const subtitle = screen.getByText("Mô tả banner 1");
    expect(subtitle.className).toContain("line-clamp-3");
    expect(subtitle.className).toContain("max-w-[31rem]");
  });

  it("tiêu đề dùng display font, uppercase và tối đa 3 dòng như mockup", () => {
    renderSlider();
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.className).toContain("line-clamp-3");
    expect(heading.className).toContain("font-display");
    expect(heading.className).toContain("uppercase");
  });

  it("CTA chính là nút viền, CTA phụ là liên kết chữ nhẹ hơn", () => {
    renderSlider();
    const primary = screen.getByRole("link", { name: "Xem dự án" });
    const secondary = screen.getByRole("link", { name: "Liên hệ" });
    expect(primary.className).toContain("border-white/75");
    expect(primary.className).toContain("min-h-12");
    expect(primary.className).toContain("max-w-full");
    expect(primary.className).not.toContain("bg-ivory");
    expect(secondary.className).toContain("link-arrow");
    expect(secondary.className).not.toContain("bg-ivory");
    expect(secondary.className).not.toContain("border");
    expect(secondary.className).toContain("min-h-11");
    expect(secondary.className).toContain("xl:min-h-12");
    expect(secondary.className).toContain("focus-visible:outline-2");
  });

  it("CTA phụ vẫn trỏ tới trang liên hệ", () => {
    renderSlider();
    expect(
      screen.getByRole("link", { name: "Liên hệ" }).getAttribute("href"),
    ).toBe("/lien-he");
  });

  it("vạch ngang chỉ nằm ở cụm số slide, không nằm trong khối chữ", () => {
    const { container } = renderSlider();
    const copyFrame = Array.from(container.querySelectorAll("div")).find(
      (node) => node.className.includes("top-[clamp"),
    );
    expect(copyFrame?.querySelector(".h-px")).toBeNull();
    expect(container.querySelector(".h-px.w-28")).not.toBeNull();
  });

  it("khung định vị khối chữ không chặn chuột của cụm điều khiển", () => {
    const { container } = renderSlider();
    const wrapper = Array.from(container.querySelectorAll("div")).find((node) =>
      node.className.includes("top-[clamp"),
    );
    expect(wrapper?.className).toContain("pointer-events-none");
    expect(wrapper?.querySelector(".pointer-events-auto")).not.toBeNull();
  });

  it("khung số slide đáy trái không được chặn chuột của cụm nút", () => {
    const { container } = renderSlider();
    const dotsFrame = container.querySelector(".absolute.inset-x-0.bottom-2");
    expect(dotsFrame).toHaveClass("hidden");
    expect(dotsFrame).toHaveClass("2xl:flex");
    expect(dotsFrame).toHaveClass("pointer-events-none");
    expect(dotsFrame!.firstElementChild).toHaveClass("pointer-events-auto");
  });
});
