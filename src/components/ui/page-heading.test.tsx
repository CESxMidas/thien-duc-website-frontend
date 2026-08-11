import { render, screen } from "@testing-library/react";
import { PageHeading } from "./page-heading";

/**
 * Chốt phân loại nội dung: mô tả của `PageHeading` là **deck dẫn dắt** (TYPE B)
 * chứ không phải đoạn văn hành chính (TYPE A) — nên KHÔNG thụt dòng đầu và
 * KHÔNG căn đều. Đoạn 1–3 dòng khi justify chỉ bị kéo giãn dòng đầu, nhìn lệch.
 *
 * Test này giữ ranh giới đó khỏi bị "thụt dòng toàn site" quét qua.
 */
describe("PageHeading", () => {
  it("mô tả dưới tiêu đề KHÔNG nhận kiểu đoạn văn hành chính", () => {
    render(
      <PageHeading
        eyebrow="Giới thiệu"
        title="Công ty Thiên Đức"
        description="Đoạn dẫn dắt ngắn nằm ngay dưới tiêu đề trang."
      />,
    );

    const description = screen.getByText(/Đoạn dẫn dắt ngắn/);

    expect(description.tagName).toBe("P");
    expect(description.className).not.toContain("text-justified");
    expect(description.className).not.toContain("prose-content");
  });

  it("eyebrow là chữ thường (không tương tác), không phải nút hay liên kết", () => {
    render(<PageHeading eyebrow="Giới thiệu" title="Công ty Thiên Đức" />);

    expect(screen.queryByRole("button", { name: /giới thiệu/i })).toBeNull();
    expect(screen.queryByRole("link", { name: /giới thiệu/i })).toBeNull();
    expect(screen.getByText("Giới thiệu").tagName).toBe("P");
  });

  it("tiêu đề trang vẫn là h1 và không bị thụt dòng", () => {
    render(<PageHeading title="Công ty Thiên Đức" />);

    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading.className).not.toContain("text-justified");
  });
});
