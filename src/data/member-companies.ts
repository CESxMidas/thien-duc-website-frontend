import type { Locale } from "@/lib/i18n/config";

/**
 * Hệ sinh thái Thiên Đức (câu 6 trong `docs/CAU-HOI-CAN-XAC-NHAN.md`).
 *
 * Công ty chỉ cung cấp **tên pháp nhân** và người đại diện — chưa có mã số thuế,
 * địa chỉ hay mô tả ngành nghề của từng đơn vị. Không tự suy diễn những field đó.
 *
 * `name` là **tên pháp nhân đăng ký** (danh từ riêng) → giữ nguyên tiếng Việt ở
 * mọi locale, không phiên âm/dịch. Chỉ các field mô tả (`role`, `note`) là song
 * ngữ `{vi, en}` để route `/en` không còn tiếng Việt hiển thị.
 */

/** Chuỗi mô tả song ngữ; cả hai ngôn ngữ bắt buộc để tránh render `[object Object]`. */
export type Bilingual = { vi: string; en: string };

export type MemberCompany = {
  name: string;
  /** Ghi chú ngắn khi đơn vị có quan hệ đặc biệt với công ty mẹ. */
  note?: Bilingual;
};

export const legalRepresentative = {
  /** Tên người thật (danh từ riêng) — giữ nguyên tiếng Việt. */
  name: "Trần Hữu Nghị",
  role: {
    vi: "Người đại diện pháp luật",
    en: "Legal representative",
  } satisfies Bilingual,
};

export const memberCompanies: MemberCompany[] = [
  {
    name: "Văn phòng đại diện Công ty TNHH Đầu tư Xây dựng Thương mại Thiên Đức",
    note: {
      vi: "Văn phòng đại diện của công ty mẹ",
      en: "Representative office of the parent company",
    },
  },
  {
    name: "Công ty TNHH Đầu tư - Dịch vụ - Du lịch Hưng Phú",
  },
  {
    name: "Công ty TNHH Lộc An Phát",
  },
];

/** Lấy chuỗi song ngữ theo locale (lùi về `vi` cho chắc, tránh `[object Object]`). */
export function localizeBilingual(text: Bilingual, locale: Locale): string {
  return text[locale] || text.vi;
}
