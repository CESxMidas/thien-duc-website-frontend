import { render, screen } from "@testing-library/react";
import { HomeIntroStrip } from "./home-intro-strip";

describe("HomeIntroStrip", () => {
  async function renderStrip() {
    render(await HomeIntroStrip({ locale: "vi" }));
  }

  it("render khối giới thiệu dạng editorial ngang với logo thương hiệu", async () => {
    await renderStrip();

    expect(screen.getByAltText("Thiên Đức")).toHaveAttribute(
      "src",
      expect.stringContaining("logo-thien-duc.png"),
    );
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /hơn một công trình/i,
      }),
    ).toBeInTheDocument();
  });

  it("hiển thị motto bên phải như một quote thương hiệu", async () => {
    await renderStrip();

    const motto = screen
      .getAllByText(/khách hàng hài lòng/i)
      .find((node) => node.tagName === "BLOCKQUOTE");

    expect(motto).toBeDefined();
  });

  it("có dải lĩnh vực hoạt động 3 ô ảnh đánh số", async () => {
    await renderStrip();

    expect(
      screen.getByRole("heading", { level: 3, name: /lĩnh vực hoạt động/i }),
    ).toBeInTheDocument();
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
  });

  it("giữ link điều hướng sang trang giới thiệu", async () => {
    await renderStrip();

    expect(
      screen.getByRole("link", { name: /tìm hiểu thêm/i }),
    ).toHaveAttribute("href", "/gioi-thieu");
  });
});
