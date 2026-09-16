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

beforeEach(() => {
  getProjectsMock.mockReset();
});

describe("selectPrimaryFeaturedProject", () => {
  it("chọn dự án ĐANG THI CÔNG khi có, dù nằm giữa danh sách", () => {
    const picked = selectPrimaryFeaturedProject([
      makeProject({ slug: "a", status: "da-ban-giao" }),
      makeProject({ slug: "b", status: "dang-thi-cong" }),
      makeProject({ slug: "c", status: "chuan-bi-khoi-cong" }),
    ]);

    expect(picked?.slug).toBe("b");
  });

  it("không có dự án đang thi công thì lấy dự án đầu tiên theo thứ tự API", () => {
    const picked = selectPrimaryFeaturedProject([
      makeProject({ slug: "a", status: "da-ban-giao" }),
      makeProject({ slug: "b", status: "da-ban-giao" }),
    ]);

    expect(picked?.slug).toBe("a");
  });

  it("danh sách rỗng thì không chọn gì", () => {
    expect(selectPrimaryFeaturedProject([])).toBeUndefined();
  });
});

describe("HomeFeaturedProjects", () => {
  it("API không trả dự án nào thì section không render", async () => {
    getProjectsMock.mockResolvedValue([]);

    const { container } = render(await HomeFeaturedProjects({ locale: "vi" }));

    expect(container).toBeEmptyDOMElement();
  });

  it("hiển thị tối đa 4 dự án thật, với dự án ưu tiên đứng đầu", async () => {
    getProjectsMock.mockResolvedValue([
      makeProject({ slug: "a", title: "A" }),
      makeProject({ slug: "b", title: "B", status: "dang-thi-cong" }),
      makeProject({ slug: "c", title: "C" }),
      makeProject({ slug: "d", title: "D" }),
      makeProject({ slug: "e", title: "E" }),
    ]);

    render(await HomeFeaturedProjects({ locale: "en" }));

    const cards = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href")?.includes("/du-an/"));

    expect(cards).toHaveLength(4);
    expect(cards[0]).toHaveAttribute("href", "/en/du-an/b");
    expect(screen.queryByRole("heading", { name: "E" })).toBeNull();
  });

  it("thiếu location thì vẫn hiển thị trạng thái và không tạo vạch phân cách", async () => {
    getProjectsMock.mockResolvedValue([
      makeProject({ slug: "khong-co-location", location: undefined }),
    ]);

    const { container } = render(await HomeFeaturedProjects({ locale: "vi" }));

    expect(screen.getByText(/đã bàn giao/i)).toBeInTheDocument();
    expect(container.querySelectorAll(".bg-warm-grey")).toHaveLength(0);
  });

  it("locale VI vẫn dùng bản copy rút gọn viết tay cho Hưng Phú", async () => {
    getProjectsMock.mockResolvedValue([
      makeProject({
        slug: "khu-do-thi-hung-phu",
        title: "Tiêu đề từ CMS",
        summary: "Tóm tắt từ CMS.",
      }),
    ]);

    render(await HomeFeaturedProjects({ locale: "vi" }));

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

  it("tên dự án dùng font display theo brief thiết kế", async () => {
    getProjectsMock.mockResolvedValue([makeProject()]);

    render(await HomeFeaturedProjects({ locale: "vi" }));

    expect(screen.getByRole("heading", { level: 3 })).toHaveClass(
      "font-display",
    );
  });
});
