import { render, screen } from "@testing-library/react";
import { HomeFacts } from "./home-facts";

describe("HomeFacts", () => {
  it("hiển thị dải số liệu sáng đúng tinh thần mockup Thiên Đức", () => {
    const { container } = render(<HomeFacts locale="vi" />);

    expect(container.firstElementChild).toHaveClass("bg-ivory");
    expect(container.firstElementChild).not.toHaveClass("bg-charcoal");

    expect(screen.getByText("16+")).toBeInTheDocument();
    expect(screen.getByText("20+")).toBeInTheDocument();
    expect(screen.getByText("1000+")).toBeInTheDocument();
    expect(screen.getByText("50+")).toBeInTheDocument();
    expect(
      screen.getByText("Giá trị kiến tạo bằng thời gian"),
    ).toBeInTheDocument();
  });

  it("giữ nội dung song ngữ cho phiên bản tiếng Anh", () => {
    render(<HomeFacts locale="en" />);

    expect(screen.getByText("Years of formation & growth")).toBeInTheDocument();
    expect(screen.getByText("Value created over time")).toBeInTheDocument();
  });
});
