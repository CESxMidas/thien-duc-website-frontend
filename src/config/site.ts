import type { Locale } from "@/lib/i18n/config";
import { resolveSiteUrl } from "@/lib/site-url";

const siteUrl = resolveSiteUrl({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL:
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL,
  NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
  NODE_ENV: process.env.NODE_ENV,
});

export const siteConfig = {
  name: "Công ty Thiên Đức",
  shortName: "Thiên Đức",
  description: "Website giới thiệu công ty, dự án và tin tức của Thiên Đức.",

  url: siteUrl,
  email: "dautuxaydungthienduc@yahoo.com",
  phone: "(028) 3740 7188",
  address:
    "1D Trần Não,Khu Phố 5, Phường Bình Trưng, Thành Phố Thủ Đức, Thành phố Hồ Chí Minh",
};


export type ZaloContact = {
  kind: "phone" | "oa";
  value: string;
};

export const zaloContact: ZaloContact = {
  kind: "phone",
  value: "0909768001",
};


export function zaloHref(contact: ZaloContact = zaloContact): string {
  return `https://zalo.me/${contact.value}`;
}


export function zaloDisplayValue(
  contact: ZaloContact = zaloContact,
): string | undefined {
  if (contact.kind !== "phone") return undefined;
  return contact.value.replace(/^(\d{4})(\d{3})(\d{3})$/, "$1 $2 $3");
}

export const legalInfo = {
  legalName: "CÔNG TY TNHH ĐẦU TƯ XÂY DỰNG THƯƠNG MẠI THIÊN ĐỨC",
  taxCode: "0309910290",
  licenseDate: "02/04/2010",
  operatingSince: "05/04/2010",
  authority: "Cục Thuế Thành phố Hồ Chí Minh",
  companyType: "Công ty TNHH hai thành viên trở lên",
  mainBusiness: "Xây dựng nhà các loại (mã ngành 4100)",
};

export const brandName: Record<Locale, string> = {
  vi: siteConfig.name,
  en: "Thien Duc Company",
};

export const brandShortName: Record<Locale, string> = {
  vi: siteConfig.shortName,
  en: "Thien Duc",
};

export function localizeAuthor(
  author: string | null | undefined,
  locale: Locale,
): string | undefined {
  if (!author) return undefined;
  return author === brandShortName.vi ? brandShortName[locale] : author;
}

export const legalDisplayName: Record<Locale, string> = {
  vi: legalInfo.legalName,
  en: "Thien Duc Investment Construction Trading Co., Ltd",
};

export const taxAuthorityName: Record<Locale, string> = {
  vi: legalInfo.authority,
  en: "Ho Chi Minh City Tax Department",
};

export const addressParts: Record<
  Locale,
  { street: string; locality: string }
> = {
  vi: {
    street: "1D Trần Não, Khu Phố 5, Phường Bình Trưng, Thành Phố Thủ Đức",
    locality: "Thành phố Hồ Chí Minh",
  },
  en: {
    street: "1D Tran Nao, Khu Phố 5, Binh Trung Ward, Thu Duc City",
    locality: "Ho Chi Minh City",
  },
};


export function displayAddress(locale: Locale): string {
  const { street, locality } = addressParts[locale];
  return `${street}, ${locality}`;
}
