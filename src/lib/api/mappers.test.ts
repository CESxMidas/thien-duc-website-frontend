/**
 * Test phân giải quickFacts song ngữ theo locale (EN-FULL-C3): fact mới
 * `{ vi, en }` chọn đúng ngôn ngữ; fact cũ dạng chuỗi thuần lùi về nguyên văn ở
 * cả hai locale; không sinh `[object Object]`.
 */
import { mapProject } from "./mappers";
import type { ProjectDto } from "./types";

const baseDto: ProjectDto = {
  slug: "khu-do-thi-hung-phu",
  title: { vi: "Khu đô thị Hưng Phú", en: "Hung Phu Urban Area" },
  summary: { vi: "Tóm tắt", en: "Summary" },
  status: "DA_BAN_GIAO",
  gallery: [],
  order: 0,
  quickFacts: [
    // Fact song ngữ (mới): mỗi locale lấy đúng bản của mình.
    {
      label: { vi: "Tổng diện tích", en: "Total area" },
      value: { vi: "11,25 ha", en: "11.25 ha" },
    },
    // Fact cũ (chuỗi thuần): cả VI lẫn EN lùi về nguyên văn tiếng Việt.
    { label: "Pháp lý", value: "Sổ hồng lâu dài" },
    // Fact có en rỗng: EN cũng lùi về VI (coi rỗng như thiếu).
    {
      label: { vi: "Chủ đầu tư", en: "" },
      value: { vi: "Công ty Thiên Đức", en: "" },
    },
  ],
};

describe("mapProject quickFacts (EN-FULL-C3)", () => {
  it("locale 'en' phân giải nhãn/giá trị sang tiếng Anh khi có bản dịch", () => {
    const en = mapProject(baseDto, "en").quickFacts;
    expect(en?.[0]).toEqual({ label: "Total area", value: "11.25 ha" });
    // Chuỗi cũ giữ nguyên văn, không phải `[object Object]`.
    expect(en?.[1]).toEqual({ label: "Pháp lý", value: "Sổ hồng lâu dài" });
    // en rỗng → lùi về vi.
    expect(en?.[2]).toEqual({ label: "Chủ đầu tư", value: "Công ty Thiên Đức" });
  });

  it("locale 'vi' giữ nguyên toàn bộ nhãn/giá trị tiếng Việt", () => {
    const vi = mapProject(baseDto, "vi").quickFacts;
    expect(vi?.[0]).toEqual({ label: "Tổng diện tích", value: "11,25 ha" });
    expect(vi?.[1]).toEqual({ label: "Pháp lý", value: "Sổ hồng lâu dài" });
    expect(vi?.[2]).toEqual({ label: "Chủ đầu tư", value: "Công ty Thiên Đức" });
  });

  it("không có quickFacts → undefined (không phải mảng rỗng)", () => {
    expect(mapProject({ ...baseDto, quickFacts: null }, "en").quickFacts).toBeUndefined();
  });
});
