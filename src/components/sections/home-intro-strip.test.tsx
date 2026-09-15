import { render, screen } from "@testing-library/react";
import { HomeIntroStrip } from "./home-intro-strip";

describe("HomeIntroStrip", () => {
  async function renderStrip() {
    render(await HomeIntroStrip({ locale: "vi" }));
  }

  it("render section giới thiệu dạng editorial với ảnh kiến trúc thật", async () => {
    await renderStrip();

    const image = document.querySelector("img");

    expect(image?.getAttribute("src")).toContain(
      "hung-phu-master-plan-aerial-03.jpg",
    );
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("nhãn mục không phải nút/link và không có nền đặc kiểu CTA", async () => {
    await renderStrip();

    expect(
      screen.queryByRole("button", { name: /công ty thiên đức/i }),
    ).toBeNull();
    expect(screen.queryByRole("link", { name: /công ty thiên đức/i })).toBeNull();

    const eyebrow = screen
      .getAllByText(/công ty thiên đức/i)
      .find((node) => node.className.includes("text-eyebrow"));

    expect(eyebrow).toBeDefined();
    expect(eyebrow!.tagName).toBe("P");
    expect(eyebrow!.className).not.toContain("bg-brand");
    expect(eyebrow!.className).not.toContain("shadow-");
    expect(eyebrow!.className).not.toContain("min-h-11");
  });

  it("các thế mạnh/lĩnh vực hiển thị dạng hàng đánh số, không phải icon-card", async () => {
    await renderStrip();

    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
    expect(document.querySelector(".icon-badge")).toBeNull();
  });

  it("có link điều hướng sang trang giới thiệu", async () => {
    await renderStrip();

    expect(
      screen.getByRole("link", { name: /tìm hiểu thiên đức/i }),
    ).toHaveAttribute("href", "/gioi-thieu");
  });
});
