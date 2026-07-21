import type { Locale } from "@/lib/i18n/config";

export const siteConfig = {
  name: "Công ty Thiên Đức",
  shortName: "Thiên Đức",
  description: "Website giới thiệu công ty, dự án và tin tức của Thiên Đức.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "dautuxaydungthienduc@yahoo.com",
  phone: "(028) 3740 7188",
  address: "1D Trần Não, Phường Bình Trưng, Thành Phố Thủ Đức, Thành phố Hồ Chí Minh",
};

export const legalInfo = {
  legalName: "CÔNG TY TNHH ĐẦU TƯ XÂY DỰNG THƯƠNG MẠI THIÊN ĐỨC",
  taxCode: "0309910290",
  licenseDate: "02/04/2010",
  operatingSince: "05/04/2010",
  authority: "Cục Thuế Thành phố Hồ Chí Minh",
  companyType: "Công ty TNHH hai thành viên trở lên",
  mainBusiness: "Xây dựng nhà các loại (mã ngành 4100)",
};

/**
 * Hiển thị thương hiệu / pháp lý / địa chỉ theo locale cho **nội dung
 * người dùng thấy** trên route `/en` (EN-FULL-A). Bản `vi` giữ **byte-identical**
 * với `siteConfig`/`legalInfo` để route tiếng Việt không đổi; bản `en` là dạng
 * hiển thị tiếng Anh (bỏ dấu, không phải bản đăng ký pháp lý gốc tiếng Việt).
 * Địa chỉ trong query Google Maps (`?q=`) vẫn dùng `siteConfig.address` gốc để
 * geocode chính xác — đó là tham số URL, không phải nội dung hiển thị.
 */
export const brandName: Record<Locale, string> = {
  vi: siteConfig.name,
  en: "Thien Duc Company",
};

export const brandShortName: Record<Locale, string> = {
  vi: siteConfig.shortName,
  en: "Thien Duc",
};

/**
 * Byline bài viết hiển thị theo locale (EN-FULL-C4). Tác giả bài tin trong CMS
 * thường chính là thương hiệu site ("Thiên Đức") — chuỗi này phải hiện
 * "Thien Duc" trên `/en` thay vì để nguyên tiếng Việt có dấu. Tên tác giả là
 * người thật (vd. "Nguyễn Văn A") **giữ nguyên**, không phiên âm/dịch. Chuỗi
 * rỗng/null → `undefined`; mọi byline khác thương hiệu trả về nguyên văn nên
 * route tiếng Việt và các byline không phải thương hiệu không đổi một chữ.
 *
 * `author` vẫn là `string` (không đổi schema/DTO): cột này còn nuôi full-text
 * search (`news_search_document`) và JSON-LD `Person.name`, nên chỉ bản đồ hiển
 * thị theo locale ở tầng frontend là đủ và an toàn nhất.
 */
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

/** Hai phần địa chỉ cho JSON-LD PostalAddress (street + locality). */
export const addressParts: Record<Locale, { street: string; locality: string }> = {
  vi: {
    street: "1D Trần Não, Phường Bình Trưng, Thành Phố Thủ Đức",
    locality: "Thành phố Hồ Chí Minh",
  },
  en: {
    street: "1D Tran Nao, Binh Trung Ward, Thu Duc City",
    locality: "Ho Chi Minh City",
  },
};

/**
 * Địa chỉ một dòng để hiển thị (footer, trang liên hệ). Bản `vi` bằng đúng
 * `siteConfig.address` cũ (street + ", " + locality) nên không đổi output VI.
 */
export function displayAddress(locale: Locale): string {
  const { street, locality } = addressParts[locale];
  return `${street}, ${locality}`;
}
