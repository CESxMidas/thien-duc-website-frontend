
class RedirectSignal extends Error {
  constructor(readonly url: string) {
    super(`REDIRECT:${url}`);
  }
}

const permanentRedirect = jest.fn((url: string) => {
  throw new RedirectSignal(url);
});
const redirect = jest.fn((url: string) => {
  throw new RedirectSignal(url);
});

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NOT_FOUND");
  }),
  permanentRedirect: (url: string) => permanentRedirect(url),
  redirect: (url: string) => redirect(url),
}));

jest.mock("@/lib/api/news", () => ({
  NEWS_PAGE_SIZE: 9,
  getNewsPage: jest.fn(async () => ({
    items: [],
    page: 1,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  })),
  getNewsCategories: jest.fn(async () => []),
}));

jest.mock("@/lib/api/projects", () => ({
  getProjects: jest.fn(async () => []),
}));

import NewsPage from "./[locale]/tin-tuc/page";
import ProjectsPage from "./[locale]/du-an/page";

async function redirectedTo(
  page: (props: never) => Promise<unknown>,
  locale: string,
  searchParams: Record<string, string>,
): Promise<string | null> {
  try {
    await page({
      params: Promise.resolve({ locale }),
      searchParams: Promise.resolve(searchParams),
    } as never);
    return null;
  } catch (error) {
    if (error instanceof RedirectSignal) return error.url;
    throw error;
  }
}

beforeEach(() => {
  permanentRedirect.mockClear();
  redirect.mockClear();
});

describe("/tin-tuc?q= → /tim-kiem?q=", () => {
  it("chuyển hướng VĨNH VIỄN và giữ nguyên từ khóa", async () => {
    const target = await redirectedTo(NewsPage, "vi", { q: "Hưng Phú" });

    expect(permanentRedirect).toHaveBeenCalledTimes(1);
    expect(target).toBe("/tim-kiem?q=H%C6%B0ng%20Ph%C3%BA");
  });

  it("giữ locale: route EN chuyển sang /en/tim-kiem", async () => {
    const target = await redirectedTo(NewsPage, "en", { q: "hung phu" });

    expect(target).toBe("/en/tim-kiem?q=hung%20phu");
  });

  it("mã hoá an toàn ký tự đặc biệt trong từ khóa", async () => {
    const target = await redirectedTo(NewsPage, "vi", { q: "a&b=c d" });

    expect(target).toBe("/tim-kiem?q=a%26b%3Dc%20d");
  });

  it("`?q=` rỗng KHÔNG sang trang tìm kiếm mà về danh sách sạch", async () => {
    const target = await redirectedTo(NewsPage, "vi", { q: "   " });

    expect(permanentRedirect).not.toHaveBeenCalled();
    expect(target).toBe("/tin-tuc");
  });

  it("danh sách tin thường KHÔNG bị chuyển hướng", async () => {
    const target = await redirectedTo(NewsPage, "vi", {});

    expect(permanentRedirect).not.toHaveBeenCalled();
    expect(target).toBeNull();
  });

  it("phân trang KHÔNG bị chuyển hướng sang tìm kiếm", async () => {
    await redirectedTo(NewsPage, "vi", { page: "2" });

    expect(permanentRedirect).not.toHaveBeenCalled();
  });
});

describe("/du-an?q= → /tim-kiem?q=", () => {
  it("chuyển hướng VĨNH VIỄN và giữ nguyên từ khóa", async () => {
    const target = await redirectedTo(ProjectsPage, "vi", { q: "Hưng Phú" });

    expect(permanentRedirect).toHaveBeenCalledTimes(1);
    expect(target).toBe("/tim-kiem?q=H%C6%B0ng%20Ph%C3%BA");
  });

  it("giữ locale", async () => {
    const target = await redirectedTo(ProjectsPage, "en", { q: "hung phu" });

    expect(target).toBe("/en/tim-kiem?q=hung%20phu");
  });

  it("lọc theo trạng thái KHÔNG bị chuyển hướng", async () => {
    const target = await redirectedTo(ProjectsPage, "vi", {
      status: "dang-thi-cong",
    });

    expect(permanentRedirect).not.toHaveBeenCalled();
    expect(target).toBeNull();
  });

  it("danh sách dự án thường KHÔNG bị chuyển hướng", async () => {
    const target = await redirectedTo(ProjectsPage, "vi", {});

    expect(permanentRedirect).not.toHaveBeenCalled();
    expect(target).toBeNull();
  });
});
