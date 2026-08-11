import { render, screen } from "@testing-library/react";
import { HomeIntroStrip } from "./home-intro-strip";

/**
 * Chốt hai quyết định trình bày của dải giới thiệu trang chủ:
 *
 * 1. Đoạn giới thiệu doanh nghiệp là **body paragraph hành chính** (TYPE A) →
 *    phải nhận `.text-justified` (thụt dòng đầu + căn đều). Trước đây đoạn này
 *    nằm ngoài hệ prose nên không thụt dòng nào.
 * 2. Nhãn "CÔNG TY THIÊN ĐỨC" là **nhãn mục, không tương tác** → không được
 *    mang ngữ nghĩa hay dáng vẻ nút bấm.
 */
describe("HomeIntroStrip", () => {
  async function renderStrip() {
    render(await HomeIntroStrip({ locale: "vi" }));
  }

  it("đoạn giới thiệu nhận kiểu đoạn văn hành chính (thụt dòng đầu)", async () => {
    await renderStrip();

    const description = screen.getByText(/Thành lập năm 2010/);

    expect(description.tagName).toBe("P");
    expect(description.className).toContain("text-justified");
  });

  it("nhãn mục KHÔNG phải nút/liên kết và không có nền đặc kiểu CTA", async () => {
    await renderStrip();

    // Không có nút/liên kết nào mang chữ của nhãn mục.
    expect(
      screen.queryByRole("button", { name: /công ty thiên đức/i }),
    ).toBeNull();
    expect(
      screen.queryByRole("link", { name: /công ty thiên đức/i }),
    ).toBeNull();

    // Nhãn dùng đúng utility eyebrow dùng chung, không phải khối nền đặc.
    const eyebrow = screen
      .getAllByText(/công ty thiên đức/i)
      .find((node) => node.className.includes("text-eyebrow"));

    expect(eyebrow).toBeDefined();
    expect(eyebrow!.tagName).toBe("P");
    // `bg-brand` + shadow + `min-h-11` là bộ ba khiến nó đọc ra như nút.
    expect(eyebrow!.className).not.toContain("bg-brand");
    expect(eyebrow!.className).not.toContain("shadow-");
    expect(eyebrow!.className).not.toContain("min-h-11");
  });

  it("tiêu đề mục vẫn là h2 thật, không bị thụt dòng như đoạn văn", async () => {
    await renderStrip();

    const heading = screen.getByRole("heading", { level: 2 });

    expect(heading.className).not.toContain("text-justified");
  });

  it("mô tả trong thẻ thế mạnh KHÔNG bị thụt dòng (copy thẻ, không phải đoạn văn)", async () => {
    await renderStrip();

    const cardHeading = screen.getAllByRole("heading", { level: 3 })[0];
    const cardCopy = cardHeading.parentElement?.querySelector("p");

    expect(cardCopy).not.toBeNull();
    expect(cardCopy!.className).not.toContain("text-justified");
  });
});
