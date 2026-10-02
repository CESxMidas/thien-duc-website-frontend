import { render, screen, waitFor } from "@testing-library/react";
import { HomeFacts } from "./home-facts";

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

beforeEach(() => mockReducedMotion(true));

describe("HomeFacts", () => {
  it("hien thi 4 so lieu va bo khoi tagline ben phai", async () => {
    const { container } = render(<HomeFacts locale="vi" />);

    expect(container.firstElementChild).toHaveClass("bg-ivory");
    expect(container.firstElementChild).not.toHaveClass("bg-charcoal");

    await waitFor(() => {
      expect(screen.getByLabelText("16+")).toHaveTextContent("16+");
      expect(screen.getByLabelText("20+")).toHaveTextContent("20+");
      expect(screen.getByLabelText("1000+")).toHaveTextContent("1000+");
      expect(screen.getByLabelText("50+")).toHaveTextContent("50+");
    });

    expect(screen.getByLabelText("16+")).toHaveAttribute("data-target", "16");
    expect(screen.getByLabelText("16+").closest("div")).toHaveClass(
      "items-center",
    );
    expect(screen.getByLabelText("16+").closest("div")).toHaveClass(
      "text-center",
    );
    expect(screen.getByText("Năm hình thành & phát triển")).toBeInTheDocument();
    expect(
      screen.getByText("Dự án đầu tư & phát triển"),
    ).toBeInTheDocument();

    expect(screen.queryByText("Giá trị")).not.toBeInTheDocument();
    expect(screen.queryByText("Kiến tạo")).not.toBeInTheDocument();
    expect(screen.queryByText("Bằng thời gian")).not.toBeInTheDocument();
  });

  it("giu noi dung song ngu cho phien ban tieng Anh", async () => {
    render(<HomeFacts locale="en" />);

    await waitFor(() => {
      expect(screen.getByLabelText("16+")).toHaveTextContent("16+");
    });

    expect(screen.getByText("Years of formation & growth")).toBeInTheDocument();
    expect(screen.queryByText("Value")).not.toBeInTheDocument();
    expect(screen.queryByText("Created")).not.toBeInTheDocument();
    expect(screen.queryByText("Over time")).not.toBeInTheDocument();
  });
});
