/**
 * Khoá bố cục kết quả tìm kiếm hợp nhất.
 *
 * Điều quan trọng nhất và là lý do thiết kế: **không trộn** dự án với tin tức
 * vào một danh sách xếp theo độ liên quan. `ts_rank` của hai loại được tính
 * trên hai tsvector khác bảng nên không so sánh được với nhau — trộn theo rank
 * sẽ tạo ra một thứ tự trông có căn cứ nhưng thực chất không có.
 */
import { render, screen, within } from "@testing-library/react";
import { SearchResults } from "./search-results";
import type { SearchResults as SearchResultsData } from "@/lib/api/search";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import viDictionary from "@/lib/i18n/dictionaries/vi.json";

const dictionary = viDictionary as unknown as Dictionary;
const labels = dictionary.search;

const results: SearchResultsData = {
  projects: [
    {
      title: "Khu đô thị Hưng Phú",
      slug: "khu-do-thi-hung-phu",
      summary: "Tóm tắt dự án.",
      status: "da-ban-giao",
      location: "Bình Dương",
    },
  ],
  news: [
    {
      title: "Khởi công giai đoạn 2",
      slug: "khoi-cong-giai-doan-2",
      summary: "Tóm tắt bài viết.",
      publishedAt: "2026-07-01",
      category: { slug: "tin-du-an", name: "Tin dự án" },
    },
    {
      title: "Lễ bàn giao căn hộ",
      slug: "le-ban-giao-can-ho",
      summary: "Tóm tắt bài viết 2.",
      publishedAt: "2026-06-01",
    },
  ],
};

function renderResults(data: SearchResultsData = results) {
  return render(
    <SearchResults
      results={data}
      locale="vi"
      labels={labels}
      statusLabels={dictionary.projectStatus}
    />,
  );
}

describe("SearchResults", () => {
  it("nhóm theo loại nội dung, mỗi nhóm một tiêu đề h2", () => {
    renderResults();

    const headings = screen.getAllByRole("heading", { level: 2 });
    expect(headings.map((heading) => heading.textContent)).toEqual([
      labels.groupProjects,
      labels.groupNews,
    ]);
  });

  it("mỗi nhóm hiện số kết quả của RIÊNG nhóm đó", () => {
    renderResults();

    const projectGroup = screen.getByRole("region", {
      name: labels.groupProjects,
    });
    const newsGroup = screen.getByRole("region", { name: labels.groupNews });

    expect(within(projectGroup).getByText("1 kết quả")).toBeInTheDocument();
    expect(within(newsGroup).getByText("2 kết quả")).toBeInTheDocument();
  });

  it("phân cấp tiêu đề h2 (nhóm) → h3 (kết quả), không đảo ngược", () => {
    renderResults();

    const projectGroup = screen.getByRole("region", {
      name: labels.groupProjects,
    });
    expect(
      within(projectGroup).getByRole("heading", { level: 3 }),
    ).toHaveTextContent("Khu đô thị Hưng Phú");
    // Không có h1 trong component — h1 thuộc về trang.
    expect(screen.queryAllByRole("heading", { level: 1 })).toHaveLength(0);
  });

  it("kết quả trỏ đúng route theo LOẠI nội dung", () => {
    renderResults();

    expect(
      screen.getByRole("link", { name: /Khu đô thị Hưng Phú/ }),
    ).toHaveAttribute("href", "/du-an/khu-do-thi-hung-phu");
    expect(
      screen.getByRole("link", { name: /Khởi công giai đoạn 2/ }),
    ).toHaveAttribute("href", "/tin-tuc/khoi-cong-giai-doan-2");
  });

  it("giữ metadata đặc thù từng loại: dự án có trạng thái + địa điểm", () => {
    renderResults();

    const projectGroup = screen.getByRole("region", {
      name: labels.groupProjects,
    });
    expect(
      within(projectGroup).getByText(
        `${dictionary.projectStatus["da-ban-giao"]} · Bình Dương`,
      ),
    ).toBeInTheDocument();
  });

  it("tin tức hiện chuyên mục + ngày đăng", () => {
    renderResults();

    const newsGroup = screen.getByRole("region", { name: labels.groupNews });
    expect(within(newsGroup).getByText(/Tin dự án · /)).toBeInTheDocument();
  });

  it("nhóm rỗng KHÔNG được render (không có tiêu đề nhóm trống)", () => {
    renderResults({ projects: [], news: results.news });

    expect(
      screen.queryByRole("region", { name: labels.groupProjects }),
    ).toBeNull();
    expect(
      screen.getByRole("region", { name: labels.groupNews }),
    ).toBeInTheDocument();
  });

  it("giữ nguyên thứ tự backend trả về, không sắp lại ở client", () => {
    renderResults();

    const newsGroup = screen.getByRole("region", { name: labels.groupNews });
    const titles = within(newsGroup)
      .getAllByRole("heading", { level: 3 })
      .map((heading) => heading.textContent);
    expect(titles).toEqual(["Khởi công giai đoạn 2", "Lễ bàn giao căn hộ"]);
  });

  it("tóm tắt trong thẻ canh TRÁI, không justify (thẻ chỉ ~330px)", () => {
    renderResults();

    const summary = screen.getByText("Tóm tắt bài viết.");
    expect(summary.className).not.toContain("text-justified");
  });
});
