import type { ProjectStatus } from "@/types/content";

/**
 * Nhãn hiển thị của `ProjectStatus`. Tách khỏi `src/data/projects.ts` để trang
 * lấy nội dung từ API (`src/lib/api/projects.ts`) không phải import file dữ liệu
 * mẫu chỉ vì cần vài nhãn tiếng Việt.
 */
export const projectStatusLabels: Record<ProjectStatus, string> = {
  "da-ban-giao": "Đã bàn giao",
  "dang-thi-cong": "Đang thi công",
  "chuan-bi-khoi-cong": "Chuẩn bị khởi công",
};

export const projectStatusFilters: Array<{
  label: string;
  value: ProjectStatus | "all";
}> = [
  { label: "Tất cả", value: "all" },
  { label: "Đang thi công", value: "dang-thi-cong" },
  { label: "Chuẩn bị khởi công", value: "chuan-bi-khoi-cong" },
  { label: "Đã bàn giao", value: "da-ban-giao" },
];
