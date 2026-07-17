import type { ProjectStatus } from "@/types/content";

/**
 * Trạng thái dự án: giá trị (slug) tách khỏi nhãn hiển thị. Nhãn song ngữ nằm
 * trong dictionary (`dictionary.projectStatus[status]`, kèm khóa "all" cho chip
 * lọc) — trước đây file này hardcode nhãn tiếng Việt nên route EN vẫn hiện
 * tiếng Việt (i18n-B1).
 */
export const projectStatusFilterValues: Array<ProjectStatus | "all"> = [
  "all",
  "dang-thi-cong",
  "chuan-bi-khoi-cong",
  "da-ban-giao",
];
