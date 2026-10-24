import { fireEvent, render, screen } from "@testing-library/react";

import type { Project, ProjectStatus } from "@/types/content";

import {
  HomeFeaturedProjects,
  selectPrimaryFeaturedProject,
} from "./home-featured-projects";
import { HomeFeaturedProjectsShowcase } from "./home-featured-projects-showcase";

const getProjectsMock = jest.fn<Promise<Project[]>, [string]>();
const mockPush = jest.fn();

jest.mock("@/lib/api/projects", () => ({
  getProjects: (locale: string) => getProjectsMock(locale),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
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
  mockPush.mockClear();
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

  it("hiển thị ba selector trong khung và ưu tiên dự án active đầu tiên", async () => {
    getProjectsMock.mockResolvedValue([
      makeProject({ slug: "a", title: "A" }),
      makeProject({ slug: "b", title: "B", status: "dang-thi-cong" }),
      makeProject({ slug: "c", title: "C" }),
      makeProject({ slug: "d", title: "D" }),
      makeProject({ slug: "e", title: "E" }),
    ]);

    render(await HomeFeaturedProjects({ locale: "en" }));

    const selectors = screen.getAllByRole("button", {
      name: /select project/i,
    });

    expect(selectors).toHaveLength(3);
    expect(selectors[0]).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(
      screen.getAllByRole("button", { name: /view details: b/i })[0],
    );

    expect(mockPush).toHaveBeenCalledWith("/en/du-an/b");
    expect(
      screen.queryByRole("button", { name: "Select project: E" }),
    ).toBeNull();
  });

  it("click selector đổi dự án active và cập nhật link chi tiết", async () => {
    getProjectsMock.mockResolvedValue([
      makeProject({ slug: "a", title: "A" }),
      makeProject({ slug: "b", title: "B", status: "dang-thi-cong" }),
      makeProject({ slug: "c", title: "C" }),
    ]);

    render(await HomeFeaturedProjects({ locale: "en" }));

    fireEvent.click(screen.getByRole("button", { name: /select project: a/i }));

    expect(
      screen.getByRole("heading", { level: 3, name: "A" }),
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getAllByRole("button", { name: /view details: a/i })[0],
    );

    expect(mockPush).toHaveBeenCalledWith("/en/du-an/a");
  });

  it("thiếu location thì vẫn hiển thị trạng thái và không tạo separator dư", async () => {
    getProjectsMock.mockResolvedValue([
      makeProject({ slug: "khong-co-location", location: undefined }),
    ]);

    render(await HomeFeaturedProjects({ locale: "vi" }));

    expect(screen.getByText(/đã bàn giao/i)).toBeInTheDocument();
    expect(screen.queryByText("undefined")).toBeNull();
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

  it("tên dự án active dùng font display theo brief thiết kế", async () => {
    getProjectsMock.mockResolvedValue([makeProject()]);

    render(await HomeFeaturedProjects({ locale: "vi" }));

    expect(screen.getByRole("heading", { level: 3 })).toHaveClass(
      "font-display",
    );
  });
});

describe("HomeFeaturedProjectsShowcase", () => {
  const labels = {
    eyebrow: "Featured projects",
    title: "Featured projects",
    explore: "View details",
    viewAll: "View all",
    viewAllHref: "/en/du-an",
    otherProjects: "Select project",
    selectProject: "Select project",
    previousProject: "Previous project",
    nextProject: "Next project",
  };

  function item(index: number) {
    return {
      id: String(index).padStart(2, "0"),
      slug: `project-${index}`,
      title: `Project ${index}`,
      href: `/en/du-an/project-${index}`,
      image: `/images/projects/project-${index}.jpg`,
    };
  }

  it("automatically advances the highlighted project and selector together", () => {
    render(
      <HomeFeaturedProjectsShowcase
        projects={[item(1), item(2), item(3)]}
        labels={labels}
      />,
    );
    fireEvent.animationEnd(screen.getByTestId("featured-projects-progress"));
    expect(
      screen.getByRole("heading", { level: 3, name: "Project 2" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Select project: Project 2" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("nút next/previous chuyển page selector dự án tiêu biểu", () => {
    render(
      <HomeFeaturedProjectsShowcase
        projects={[item(1), item(2), item(3), item(4)]}
        labels={labels}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Next project" }));

    expect(
      screen.getByRole("heading", { level: 3, name: "Project 2" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Select project: Project 2" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.queryByRole("button", { name: "Select project: Project 1" }),
    ).toBeNull();
    expect(
      screen.getByRole("button", { name: "Select project: Project 4" }),
    ).not.toHaveAttribute("tabindex");

    const transition = new Event("transitionend", { bubbles: true });
    Object.defineProperty(transition, "propertyName", { value: "transform" });
    fireEvent(screen.getByTestId("featured-projects-track"), transition);
    fireEvent.click(screen.getByRole("button", { name: "Previous project" }));

    expect(
      screen.getByRole("heading", { level: 3, name: "Project 1" }),
    ).toBeInTheDocument();
  });

  it("button xem chi tiet tren card du an chuyen sang trang chi tiet", () => {
    render(
      <HomeFeaturedProjectsShowcase
        projects={[item(1), item(2), item(3)]}
        labels={labels}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "View details: Project 2" }),
    );

    expect(mockPush).toHaveBeenCalledWith("/en/du-an/project-2");
  });

  it("keeps a standard project title on one controlled line", () => {
    render(
      <HomeFeaturedProjectsShowcase
        projects={[
          {
            ...item(1),
            title: "Chung cu Fancy Tower",
          },
        ]}
        labels={labels}
      />,
    );

    const heading = screen.getByRole("heading", {
      level: 3,
      name: "Chung cu Fancy Tower",
    });
    const lines = heading.querySelectorAll(":scope > span");

    expect(lines).toHaveLength(1);
    expect(lines[0]).toHaveClass("whitespace-nowrap");
    expect(heading.style.fontSize).toContain("cqw");
  });

  it("balances a long project title into two controlled lines", () => {
    render(
      <HomeFeaturedProjectsShowcase
        projects={[
          {
            ...item(1),
            title: "Khu phuc hop thuong mai dich vu Thien Duc",
          },
        ]}
        labels={labels}
      />,
    );

    const heading = screen.getByRole("heading", {
      level: 3,
      name: "Khu phuc hop thuong mai dich vu Thien Duc",
    });
    const lines = heading.querySelectorAll(":scope > span");

    expect(lines).toHaveLength(2);
    expect(
      Array.from(lines).every((line) =>
        line.classList.contains("whitespace-nowrap"),
      ),
    ).toBe(true);
  });
});
