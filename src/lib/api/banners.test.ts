/**
 * THIEN-DUC-BANNER-CONTENT-IMPLEMENTATION-M1 — `mapBanner` phân giải nội dung
 * banner theo locale. Dữ liệu mẫu lấy đúng shape banner đã seed
 * (`backend/prisma/banner-content.json`): mọi field chữ đều có cả `vi` lẫn `en`.
 */
import { mapBanner } from "./mappers";
import type { BannerDto } from "./types";

const dto: BannerDto = {
  id: "b1",
  image: "/images/banners/home/home-banner-hung-phu-master-plan-02.jpg",
  objectPosition: "35% center",
  eyebrow: { vi: "Dự án tiêu biểu", en: "Featured project" },
  title: {
    vi: "Khu đô thị Hưng Phú, TP. Bến Tre",
    en: "Hung Phu Urban Area, Ben Tre City",
  },
  subtitle: {
    vi: "Mặt tiền Nguyễn Thị Định, phường Phú Tân.",
    en: "On Nguyen Thi Dinh Street in Phu Tan ward.",
  },
  ctaLabel: { vi: "Xem chi tiết dự án", en: "Explore the project" },
  href: "/du-an/khu-do-thi-hung-phu",
  order: 0,
};

describe("mapBanner theo locale", () => {
  it("locale 'vi' lấy toàn bộ bản tiếng Việt", () => {
    expect(mapBanner(dto, "vi")).toEqual({
      image: dto.image,
      eyebrow: "Dự án tiêu biểu",
      title: "Khu đô thị Hưng Phú, TP. Bến Tre",
      subtitle: "Mặt tiền Nguyễn Thị Định, phường Phú Tân.",
      href: "/du-an/khu-do-thi-hung-phu",
      ctaLabel: "Xem chi tiết dự án",
      objectPosition: "35% center",
    });
  });

  it("locale 'en' lấy toàn bộ bản tiếng Anh", () => {
    const en = mapBanner(dto, "en");
    expect(en.eyebrow).toBe("Featured project");
    expect(en.title).toBe("Hung Phu Urban Area, Ben Tre City");
    expect(en.subtitle).toBe("On Nguyen Thi Dinh Street in Phu Tan ward.");
    expect(en.ctaLabel).toBe("Explore the project");
    // href KHÔNG nhúng locale — `localizePath` thêm tiền tố `/en` lúc render.
    expect(en.href).toBe("/du-an/khu-do-thi-hung-phu");
  });

  it("thiếu bản dịch en → lùi về tiếng Việt, không để trống trên /en", () => {
    const en = mapBanner(
      { ...dto, title: { vi: "Chỉ có tiếng Việt" }, ctaLabel: { vi: "Xem thêm", en: "  " } },
      "en",
    );
    expect(en.title).toBe("Chỉ có tiếng Việt");
    expect(en.ctaLabel).toBe("Xem thêm");
  });

  it("field tùy chọn null → chuỗi rỗng, objectPosition undefined (không 'null')", () => {
    const bare = mapBanner(
      { ...dto, eyebrow: null, subtitle: null, ctaLabel: null, objectPosition: null },
      "vi",
    );
    expect(bare.eyebrow).toBe("");
    expect(bare.subtitle).toBe("");
    expect(bare.ctaLabel).toBe("");
    expect(bare.objectPosition).toBeUndefined();
  });
});
