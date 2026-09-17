import type { Locale } from "@/lib/i18n/config";


export type Bilingual = { vi: string; en: string };

export type MemberCompany = {
  name: string;
  note?: Bilingual;
};

export const legalRepresentative = {
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

export function localizeBilingual(text: Bilingual, locale: Locale): string {
  return text[locale] || text.vi;
}
