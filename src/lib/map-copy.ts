import type { Locale } from "@/lib/i18n/config";

/**
 * Chuỗi a11y (alt / aria-label / nhãn) cho khối bản đồ dự án, theo locale
 * (EN-FULL-A). Trước đây hardcode tiếng Việt nên route `/en` vẫn đọc tiếng Việt.
 * Bản `vi` giữ đúng chuỗi cũ để route tiếng Việt không đổi. Dùng chung cho
 * `ProjectLocationMap` (ảnh vẽ tay + marker) và `ProjectMapEmbed` (iframe).
 */
export const mapCopy: Record<
  Locale,
  {
    aerialAlt: (title: string) => string;
    mapAlt: (title: string) => string;
    imageAlt: (title: string) => string;
    openInMaps: (title: string) => string;
    viewDetails: string;
  }
> = {
  vi: {
    aerialAlt: (title) => `Phối cảnh tổng thể ${title}`,
    mapAlt: (title) => `Bản đồ vị trí ${title}`,
    imageAlt: (title) => `Hình ảnh ${title}`,
    openInMaps: (title) => `Mở vị trí ${title} trên Google Maps`,
    viewDetails: "Xem chi tiết",
  },
  en: {
    aerialAlt: (title) => `Aerial view of ${title}`,
    mapAlt: (title) => `Location map of ${title}`,
    imageAlt: (title) => `Image of ${title}`,
    openInMaps: (title) => `Open ${title} location in Google Maps`,
    viewDetails: "View details",
  },
};
