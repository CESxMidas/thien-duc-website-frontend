import { render, screen } from "@testing-library/react";
import { PageHeading } from "./page-heading";

describe("PageHeading", () => {
  it("mô tả dưới tiêu đề thụt đầu dòng và giữ cách căn chữ hiện có", () => {
    render(
      <PageHeading
        eyebrow="Giới thiệu"
        title="Công ty Thiên Đức"
        description="Đoạn dẫn dắt ngắn nằm ngay dưới tiêu đề trang."
      />,
    );

    const description = screen.getByText(/Đoạn dẫn dắt ngắn/);

    expect(description.tagName).toBe("P");
    expect(description).toHaveClass("content-paragraph");
    expect(description.className).not.toContain("text-justified");
    expect(description.className).not.toContain("prose-content");
  });

  it("eyebrow là chữ thường (không tương tác), không phải nút hay liên kết", () => {
    render(<PageHeading eyebrow="Giới thiệu" title="Công ty Thiên Đức" />);

    expect(screen.queryByRole("button", { name: /giới thiệu/i })).toBeNull();
    expect(screen.queryByRole("link", { name: /giới thiệu/i })).toBeNull();
    expect(screen.getByText("Giới thiệu").tagName).toBe("P");
    expect(screen.getByText("Giới thiệu")).not.toHaveClass("content-paragraph");
  });

  it("tiêu đề trang vẫn là h1 và không bị thụt dòng", () => {
    render(<PageHeading title="Công ty Thiên Đức" />);

    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading.className).not.toContain("text-justified");
  });

  it("hỗ trợ điểm nhấn Espresso ở đầu trang", () => {
    const { container } = render(
      <PageHeading
        bare
        eyebrow="Giới thiệu"
        title="Công ty Thiên Đức"
      />,
    );

    expect(container.querySelector("section")).toHaveClass(
      "border-espresso",
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveClass(
      "text-espresso",
    );
  });

  it("hỗ trợ đường viền vàng đồng nhạt làm điểm nhấn", () => {
    const { container } = render(
      <PageHeading
        bare
        tone="gold"
        eyebrow="Giới thiệu"
        title="Công ty Thiên Đức"
      />,
    );

    expect(container.querySelector("section")).toHaveClass("border-gold");
    expect(container.querySelector("section")).not.toHaveClass("border-espresso");
  });
});
