
import { mapNewsPost, mapProject } from "./mappers";
import type { NewsPostDto, ProjectDto } from "./types";

const baseDto: ProjectDto = {
  id: "p1",
  slug: "khu-do-thi-hung-phu",
  title: { vi: "Khu đô thị Hưng Phú", en: "Hung Phu Urban Area" },
  summary: { vi: "Tóm tắt", en: "Summary" },
  status: "DA_BAN_GIAO",
  gallery: [],
  order: 0,
  quickFacts: [
    {
      label: { vi: "Tổng diện tích", en: "Total area" },
      value: { vi: "11,25 ha", en: "11.25 ha" },
    },
    { label: "Pháp lý", value: "Sổ hồng lâu dài" },
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
      description: "", 
      address: "Phường Phú Tân", 
      markerLeft: 65,
      markerTop: 27,
      labels: [

        {
          text: { vi: "Hướng đi chợ Lách", en: "To Cho Lach" },
          left: 22,
          top: 9,
          kind: "direction",
        },
        { text: "QL.60", left: 49, top: 14, kind: "road" },
      ],
    },
  };

  it("locale 'en' phân giải heading + nhãn; chuỗi cũ lùi nguyên văn", () => {
    const ml = mapProject(dto, "en").mapLocation;
    expect(ml?.heading).toBe("In the city center");
    expect(ml?.address).toBe("Phường Phú Tân");
    expect(ml?.labels?.[0]).toEqual({
      text: "To Cho Lach",
      left: 22,
      top: 9,
      kind: "direction",
    });
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

describe("mapNewsPost — chuyên mục", () => {
  const baseNews: NewsPostDto = {
    id: "n1",
    slug: "bai-viet-mau",
    title: { vi: "Tiêu đề", en: "Title" },
    summary: { vi: "Tóm tắt", en: "Summary" },
  };

  it("giữ nguyên cặp {slug, name}, tên đã phân giải theo locale", () => {
    const post = mapNewsPost(
      {
        ...baseNews,
        category: { slug: "tin-du-an", name: { vi: "Tin dự án", en: "Project news" } },
      },
      "vi",
    );

    expect(post.category).toEqual({ slug: "tin-du-an", name: "Tin dự án" });
  });

  it("locale en lấy tên tiếng Anh nhưng slug KHÔNG đổi theo ngôn ngữ", () => {
    const post = mapNewsPost(
      {
        ...baseNews,
        category: { slug: "tin-du-an", name: { vi: "Tin dự án", en: "Project news" } },
      },
      "en",
    );

    expect(post.category).toEqual({ slug: "tin-du-an", name: "Project news" });
  });

  it("bài không có chuyên mục → undefined, không phải object rỗng", () => {
    expect(mapNewsPost(baseNews, "vi").category).toBeUndefined();
    expect(mapNewsPost({ ...baseNews, category: null }, "vi").category)
      .toBeUndefined();
  });

  it("gom anh dai dien va gallery thanh danh sach khong trung lap", () => {
    const post = mapNewsPost(
      {
        ...baseNews,
        image: "/images/news/a.jpg",
        gallery: [
          "/images/news/a.jpg",
          "/images/news/b.jpg",
          "/images/news/c.jpg",
        ],
      },
      "vi",
    );

    expect(post.gallery).toEqual([
      "/images/news/a.jpg",
      "/images/news/b.jpg",
      "/images/news/c.jpg",
    ]);
  });
});
