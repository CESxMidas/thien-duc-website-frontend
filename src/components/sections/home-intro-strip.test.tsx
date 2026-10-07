import { render, screen } from "@testing-library/react";
import { HomeIntroStrip } from "./home-intro-strip";

describe("HomeIntroStrip", () => {
  async function renderStrip() {
    render(await HomeIntroStrip({ locale: "vi" }));
  }

  it("doi khoi gioi thieu thanh banner quote ngang compact", async () => {
    await renderStrip();

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /khách hàng hài lòng - thiên đức thành công/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Thiên Đức")).toBeInTheDocument();
    expect(screen.getByText("lắng nghe")).toBeInTheDocument();
    expect(screen.getByText("Thấu hiểu từng nhu cầu")).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        level: 2,
        name: /hơn một công trình/i,
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /^tìm hiểu thêm$/i }),
    ).not.toBeInTheDocument();
  });

  it("co nen placeholder san sang thay bang anh background", async () => {
    const { container } = render(await HomeIntroStrip({ locale: "vi" }));
    const banner = container.querySelector<HTMLElement>(
      "[style*='--home-intro-background']",
    );

    expect(banner).not.toBeNull();
    expect(banner).toHaveClass("min-h-[8.5rem]");
  });

  it("giu logo trang tri trong cot phai cua layout cu", async () => {
    const { container } = render(await HomeIntroStrip({ locale: "vi" }));
    const logo = container.querySelector<HTMLImageElement>(
      'img[src*="logo-thien-duc.png"]',
    );

    expect(logo).not.toBeNull();
    expect(logo).toHaveAttribute("alt", "");
    expect(logo?.closest("[aria-hidden='true']")).not.toBeNull();
  });
});
