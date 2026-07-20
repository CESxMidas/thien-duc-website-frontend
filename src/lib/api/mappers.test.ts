/**
 * Test phân giải quickFacts song ngữ theo locale (EN-FULL-C3): fact mới
 * `{ vi, en }` chọn đúng ngôn ngữ; fact cũ dạng chuỗi thuần lùi về nguyên văn ở
 * cả hai locale; không sinh `[object Object]`.
 */
import { mapProject } from "./mappers";
import type { ProjectDto } from "./types";

const baseDto: ProjectDto = {
  id: "p1",
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

describe("mapProject mapLocation prose (EN-FULL-C5a)", () => {
  const dto: ProjectDto = {
    ...baseDto,
    mapLocation: {
      image: "/map.webp",
      googleMapsUrl: "https://maps.example/?q=x",
      heading: { vi: "Tọa lạc trung tâm", en: "In the city center" },
      description: "", // rỗng ở cả hai → không hiển thị
      address: "Phường Phú Tân", // dữ liệu cũ dạng chuỗi
      markerLeft: 65,
      markerTop: 27,
      labels: [
        // Nhãn song ngữ (C5b): EN chọn bản dịch, giữ nguyên left/top/kind.
        {
          text: { vi: "Hướng đi chợ Lách", en: "To Cho Lach" },
          left: 22,
          top: 9,
          kind: "direction",
        },
        // Nhãn cũ dạng chuỗi: lùi nguyên văn tiếng Việt ở cả hai locale.
        { text: "QL.60", left: 49, top: 14, kind: "road" },
      ],
    },
  };

  it("locale 'en' phân giải heading + nhãn; chuỗi cũ lùi nguyên văn", () => {
    const ml = mapProject(dto, "en").mapLocation;
    expect(ml?.heading).toBe("In the city center");
    expect(ml?.address).toBe("Phường Phú Tân");
    // Nhãn song ngữ → tiếng Anh, vị trí/kiểu giữ nguyên.
    expect(ml?.labels?.[0]).toEqual({
      text: "To Cho Lach",
      left: 22,
      top: 9,
      kind: "direction",
    });
    // Nhãn cũ (chuỗi) → giữ nguyên văn, không phải [object Object].
    expect(ml?.labels?.[1].text).toBe("QL.60");
  });

  it("locale 'vi' giữ nguyên heading + nhãn tiếng Việt", () => {
    const ml = mapProject(dto, "vi").mapLocation;
    expect(ml?.heading).toBe("Tọa lạc trung tâm");
    expect(ml?.labels?.[0].text).toBe("Hướng đi chợ Lách");
  });

  it("description rỗng → undefined (không render [object Object] hay ô trống)", () => {
    expect(mapProject(dto, "en").mapLocation?.description).toBeUndefined();
  });
});

describe("mapProject gallery source (PROJECT-GALLERY-IMAGES-FIX-M1)", () => {
  it("ưu tiên quan hệ galleryImages, chỉ lấy ảnh cấp dự án (projectItemId null)", () => {
    const project = mapProject(
      {
        ...baseDto,
        gallery: ["/legacy.webp"],
        galleryImages: [
          { id: "g1", url: "/proj-a.webp", order: 0, projectItemId: null },
          // Ảnh hạng mục — phải bị loại khỏi thư viện cấp dự án.
          { id: "g2", url: "/item.webp", order: 1, projectItemId: "item-1" },
          { id: "g3", url: "/proj-b.webp", order: 2, projectItemId: null },
        ],
      },
      "vi",
    );
    expect(project.gallery).toEqual(["/proj-a.webp", "/proj-b.webp"]);
  });

  it("quan hệ chỉ toàn ảnh hạng mục → lùi về gallery phẳng (legacy)", () => {
    const project = mapProject(
      {
        ...baseDto,
        gallery: ["/legacy.webp"],
        galleryImages: [
          { id: "g2", url: "/item.webp", order: 0, projectItemId: "item-1" },
        ],
      },
      "vi",
    );
    expect(project.gallery).toEqual(["/legacy.webp"]);
  });

  it("không có quan hệ lẫn gallery phẳng → undefined (không render khối trống)", () => {
    const project = mapProject({ ...baseDto, gallery: [] }, "vi");
    expect(project.gallery).toBeUndefined();
  });
});
