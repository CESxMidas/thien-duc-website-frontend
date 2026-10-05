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
    expect(screen.getByText("Thien Duc I&C")).toBeInTheDocument();
    expect(screen.getByText("Investment")).toBeInTheDocument();
    expect(screen.getByText("Construction")).toBeInTheDocument();
    expect(screen.getByText("Development")).toBeInTheDocument();
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

  it("co section linh vuc hoat dong voi 3 card link lon", async () => {
    await renderStrip();

    expect(
      screen.getByRole("heading", { level: 2, name: /lĩnh vực hoạt động/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Năng lực cốt lõi")).toBeInTheDocument();
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /đầu tư & phát triển dự án/i }),
    ).toHaveAttribute("href", "/du-an");
    expect(
      screen.getByRole("link", { name: /xây dựng & thi công/i }),
    ).toHaveAttribute("href", "/du-an");
    expect(
      screen.getByRole("link", { name: /phát triển đô thị/i }),
    ).toHaveAttribute("href", "/du-an");
    expect(screen.getAllByText("Khám phá")).toHaveLength(3);
  });
});
