import { render, screen } from "@testing-library/react";
import { BrandMotto, BrandMottoCompact } from "./brand-motto";

const VI_MOTTO = "Khách hàng hài lòng — Thiên Đức thành công";
const EN_MOTTO = "Satisfied customers — Thien Duc succeeds";

/**
 * Phương châm phân vế bằng **xuống dòng + tương phản màu**, KHÔNG bằng vạch
 * trang trí. Bản trước chèn một vạch vàng (`h-0.5 w-12 bg-gold`) giữa hai vế;
 * test này giữ cho nó không quay lại.
 *
 * Vạch dọc bên trái của biến thể lớn là quy tắc cấu trúc (TYPE F) nên vẫn còn —
 * kiểm riêng để không xoá nhầm khi dọn vạch ngang.
 */
describe("BrandMotto", () => {
  it("render đủ hai vế phương châm", () => {
    render(<BrandMotto motto={VI_MOTTO} />);

    expect(screen.getByText("Khách hàng hài lòng")).toBeInTheDocument();
    expect(screen.getByText("Thiên Đức thành công")).toBeInTheDocument();
  });

  it("KHÔNG còn vạch ngang trang trí giữa hai vế", () => {
    const { container } = render(<BrandMotto motto={VI_MOTTO} />);

    // Không phần tử rỗng nào đóng vai vạch ngang (cao 0.5, rộng cố định).
    expect(container.querySelector(".h-0\\.5")).toBeNull();
  });

  it("giữ vạch DỌC cấu trúc bên trái (không phải mục tiêu dọn dẹp)", () => {
    const { container } = render(<BrandMotto motto={VI_MOTTO} />);

    const verticalRule = container.querySelector(".inset-y-0.left-0");

    expect(verticalRule).not.toBeNull();
  });

  it("là nội dung tĩnh, không phải nút hay liên kết", () => {
    render(<BrandMotto motto={VI_MOTTO} label="Phương châm" />);

    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("hoạt động với phương châm tiếng Anh", () => {
    render(<BrandMotto motto={EN_MOTTO} />);

    expect(screen.getByText("Satisfied customers")).toBeInTheDocument();
    expect(screen.getByText("Thien Duc succeeds")).toBeInTheDocument();
  });

  it("phương châm không có dấu phân vế vẫn render bình thường", () => {
    render(<BrandMotto motto="Một vế duy nhất" />);

    expect(screen.getByText("Một vế duy nhất")).toBeInTheDocument();
  });
});

describe("BrandMottoCompact", () => {
  it("render đủ hai vế", () => {
    render(<BrandMottoCompact motto={VI_MOTTO} />);

    expect(screen.getByText("Khách hàng hài lòng")).toBeInTheDocument();
    expect(screen.getByText("Thiên Đức thành công")).toBeInTheDocument();
  });

  it("KHÔNG còn vạch ngang giữa hai vế, cũng không còn đường kẻ phía trên", () => {
    const { container } = render(<BrandMottoCompact motto={VI_MOTTO} />);

    expect(container.querySelector(".h-0\\.5")).toBeNull();

    const quote = container.querySelector("blockquote");
    expect(quote?.className).not.toContain("border-t");
  });

  it("là nội dung tĩnh, không phải nút hay liên kết", () => {
    render(<BrandMottoCompact motto={VI_MOTTO} />);

    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("link")).toBeNull();
  });
});
