import { render, screen } from "@testing-library/react";
import type { Project, ProjectStatus } from "@/types/content";
import {
  HomeFeaturedProjects,
  selectPrimaryFeaturedProject,
} from "./home-featured-projects";

const getProjectsMock = jest.fn<Promise<Project[]>, [string]>();

jest.mock("@/lib/api/projects", () => ({
  getProjects: (locale: string) => getProjectsMock(locale),
}));

function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    slug: "du-an-mau",
    title: "Dự án mẫu",
    summary: "Tóm tắt ngắn cho dự án mẫu.",
    status: "da-ban-giao" as ProjectStatus,
    location: "Bến Tre",
    image: "/images/projects/mau.jpg",
    ...overrides,
  };
}

async function renderSection() {
  render(await HomeFeaturedProjects({ locale: "vi" }));
}

beforeEach(() => {
  getProjectsMock.mockReset();
});

/**
 * Logic chọn dự án nổi bật — điểm mấu chốt: KHÔNG được phụ thuộc slug cụ thể.
 * Bản trước lọc cứng `slug === "khu-do-thi-hung-phu"`, nên đổi tên slug là
 * section biến mất im lặng.
 */
describe("selectPrimaryFeaturedProject", () => {
  it("chọn dự án ĐANG THI CÔNG khi có, dù nằm giữa danh sách", () => {
    const picked = selectPrimaryFeaturedProject([
      makeProject({ slug: "a", status: "da-ban-giao" }),
      makeProject({ slug: "b", status: "dang-thi-cong" }),
      makeProject({ slug: "c", status: "chuan-bi-khoi-cong" }),
    ]);

    expect(picked?.slug).toBe("b");
  });

  it("nhiều dự án đang thi công → lấy cái ĐẦU TIÊN theo thứ tự API", () => {
    const picked = selectPrimaryFeaturedProject([
      makeProject({ slug: "a", status: "da-ban-giao" }),
      makeProject({ slug: "b", status: "dang-thi-cong" }),
      makeProject({ slug: "c", status: "dang-thi-cong" }),
    ]);

    expect(picked?.slug).toBe("b");
  });

  it("không có dự án đang thi công → lấy dự án ĐẦU TIÊN theo thứ tự API", () => {
    const picked = selectPrimaryFeaturedProject([
      makeProject({ slug: "a", status: "da-ban-giao" }),
      makeProject({ slug: "b", status: "da-ban-giao" }),
    ]);

    expect(picked?.slug).toBe("a");
  });

  it("KHÔNG phụ thuộc slug `khu-do-thi-hung-phu` — đổi tên vẫn có dự án nổi bật", () => {
    const picked = selectPrimaryFeaturedProject([
      makeProject({ slug: "ten-slug-hoan-toan-khac", status: "da-ban-giao" }),
    ]);

    expect(picked?.slug).toBe("ten-slug-hoan-toan-khac");
  });

  it("gỡ Hưng Phú khỏi dữ liệu → vẫn chọn được dự án khác", () => {
    const picked = selectPrimaryFeaturedProject([
      makeProject({ slug: "chung-cu-la-bonita" }),
      makeProject({ slug: "du-an-vung-tau" }),
    ]);

    expect(picked?.slug).toBe("chung-cu-la-bonita");
  });

  it("danh sách rỗng → không chọn được gì", () => {
    expect(selectPrimaryFeaturedProject([])).toBeUndefined();
  });
});

describe("HomeFeaturedProjects", () => {
  it("API không trả dự án nào → section không render", async () => {
    getProjectsMock.mockResolvedValue([]);

    const { container } = render(await HomeFeaturedProjects({ locale: "vi" }));

    expect(container).toBeEmptyDOMElement();
  });

  it("một dự án → bố cục nổi bật 2 cột, thẻ giữ chiều cao tối thiểu", async () => {
    getProjectsMock.mockResolvedValue([makeProject({ slug: "mot-du-an" })]);
    await renderSection();

    const card = screen
      .getAllByRole("link")
      .find((link) => link.getAttribute("href")?.includes("mot-du-an"));

    expect(card).toBeDefined();
    // Chiều cao tối thiểu thuộc về THẺ, không phải ảnh — đây là điểm sửa chính.
    expect(card!.className).toContain("md:min-h-80");
    expect(card!.className).toContain("md:grid-cols-[1.1fr_0.9fr]");
  });

  it("API trả nhiều dự án → trang chủ VẪN chỉ hiện MỘT thẻ nổi bật lớn", async () => {
    // Đúng dữ liệu production hiện tại: cả 4 dự án đều đã bàn giao.
    getProjectsMock.mockResolvedValue([
      makeProject({ slug: "khu-do-thi-hung-phu" }),
      makeProject({ slug: "chung-cu-la-bonita" }),
      makeProject({ slug: "du-an-vung-tau" }),
      makeProject({ slug: "du-an-bay-hien" }),
    ]);
    await renderSection();

    const cards = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href")?.includes("/du-an/"));

    expect(cards).toHaveLength(1);
    expect(cards[0].getAttribute("href")).toContain("khu-do-thi-hung-phu");
    // Vẫn là bố cục nổi bật hai cột, không rơi sang lưới nhiều thẻ.
    expect(cards[0].className).toContain("md:min-h-80");
  });

  it("thiếu location → KHÔNG còn dấu chấm phân cách mồ côi", async () => {
    getProjectsMock.mockResolvedValue([
      makeProject({ slug: "khong-co-location", location: undefined }),
    ]);
    const { container } = render(await HomeFeaturedProjects({ locale: "vi" }));

    // Dấu chấm vàng chỉ xuất hiện khi có từ 2 mẩu metadata trở lên.
    expect(container.querySelectorAll(".bg-gold")).toHaveLength(0);
    // Trạng thái vẫn phải hiển thị dù thiếu location.
    expect(screen.getByText(/đã bàn giao/i)).toBeInTheDocument();
  });

  it("có đủ location + trạng thái → hiện đúng một dấu phân cách", async () => {
    getProjectsMock.mockResolvedValue([makeProject({ slug: "du-du-lieu" })]);
    const { container } = render(await HomeFeaturedProjects({ locale: "vi" }));

    expect(container.querySelectorAll(".bg-gold")).toHaveLength(1);
  });

  it("tiêu đề và tóm tắt dài đều được clamp để thẻ không phình", async () => {
    getProjectsMock.mockResolvedValue([
      makeProject({
        slug: "noi-dung-dai",
        title:
          "Khu đô thị thương mại và dịch vụ phía Đông thành phố Bến Tre giai đoạn mở rộng",
        summary: "Đoạn tóm tắt rất dài. ".repeat(30),
      }),
    ]);
    await renderSection();

    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading.className).toContain("line-clamp-3");
    expect(heading.className).toContain("md:line-clamp-2");

    const summary = screen.getByText(/Đoạn tóm tắt rất dài/);
    expect(summary.className).toContain("line-clamp-3");
    expect(summary.className).toContain("lg:line-clamp-4");
  });

  it("`sizes` của ảnh khớp bề ngang thật của bố cục nổi bật (~55%)", async () => {
    getProjectsMock.mockResolvedValue([makeProject({ slug: "mot" })]);
    const { container } = render(await HomeFeaturedProjects({ locale: "vi" }));

    expect(container.querySelector("img")?.getAttribute("sizes")).toBe(
      "(min-width: 768px) 55vw, 100vw",
    );
  });

  it("giữ tương thích bản copy VI viết tay cho Hưng Phú", async () => {
    getProjectsMock.mockResolvedValue([
      makeProject({
        slug: "khu-do-thi-hung-phu",
        title: "Tiêu đề từ CMS",
        summary: "Tóm tắt từ CMS.",
      }),
    ]);
    await renderSection();

    // Locale VI vẫn dùng bản rút gọn viết tay, không phải chuỗi CMS.
    expect(screen.getByRole("heading", { level: 3 }).textContent).toBe(
      "Khu đô thị Hưng Phú",
    );
  });

  it("locale EN dùng nội dung CMS thay vì bản viết tay tiếng Việt", async () => {
    getProjectsMock.mockResolvedValue([
      makeProject({
        slug: "khu-do-thi-hung-phu",
        title: "Hung Phu Urban Area",
        summary: "Summary from CMS.",
      }),
    ]);
    render(await HomeFeaturedProjects({ locale: "en" }));

    expect(screen.getByRole("heading", { level: 3 }).textContent).toBe(
      "Hung Phu Urban Area",
    );
  });
});
