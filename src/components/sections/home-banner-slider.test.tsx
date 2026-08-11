/**
 * Khoá hành vi banner trang chủ — tập trung vào phần trợ năng.
 *
 * Điều dễ hỏng nhất: nút tạm dừng phải là cơ chế DỪNG thật (WCAG 2.2.2), không
 * phải một khoảng nghỉ có hạn. Trước đây carousel chỉ dừng khi rê chuột — bàn
 * phím và cảm ứng không rê được, nên thực tế là không có cách nào dừng.
 *
 * jsdom không có `matchMedia`; test tự cắm bản giả để điều khiển
 * `prefers-reduced-motion`.
 */
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

/** Cắm `matchMedia` giả — trả `matches` theo tham số cho mọi truy vấn. */
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
    // Thanh tiến trình CHÍNH là đồng hồ đếm: nó dừng thì slide không tự chuyển.
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
    // Chuyển tay xong vẫn phải đứng yên — không được tự bật lại autoplay.
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

  /**
   * Bấm một nút LUÔN làm nó nhận focus. Nếu focus vào nút tạm dừng cũng kích
   * hoạt "tạm dừng khi focus" thì nút "Tiếp tục" tự vô hiệu hoá chính mình:
   * người dùng bàn phím bấm xong, autoplay vẫn đứng im cho tới khi Tab đi chỗ
   * khác. Đã tái hiện trên trình duyệt thật trước khi sửa.
   */
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

  /**
   * Khung căn giữa hàng chấm trải hết bề ngang (`inset-x-0`) ở cùng `z-30` và
   * đứng SAU cụm nút trong DOM. Không có `pointer-events-none` thì nó nuốt mọi
   * cú bấm vào nút tạm dừng/tiến/lùi — Playwright bắt được đúng lỗi này:
   * "…intercepts pointer events".
   */
  it("khung căn giữa hàng chấm không được chặn chuột của cụm nút", () => {
    const { container } = renderSlider();
    const dotsFrame = container.querySelector(".absolute.inset-x-0.bottom-5");

    expect(dotsFrame).toHaveClass("pointer-events-none");
    expect(dotsFrame!.firstElementChild).toHaveClass("pointer-events-auto");
  });
});
