import type { Locale } from "@/lib/i18n/config";

/**
 * Chuỗi giao diện tĩnh (nút, nhãn, tiêu đề khối). Nội dung do CMS quản lý
 * **không** nằm ở đây — nó đến từ field JSONB `{vi, en?}` của backend và được
 * `mappers.ts` chọn theo locale.
 *
 * `navLabels` / `footerLabels` đánh khóa theo `href` để dịch nhãn điều hướng mà
 * không phải sửa `data/navigation.ts` và `data/footer.ts` — hai file này là bản
 * sao tĩnh của UI, không thuộc phạm vi CMS.
 */
export type Dictionary = {
  common: {
    skipToContent: string;
    contactCta: string;
    viewDetail: string;
    readArticle: string;
    viewAllProjects: string;
    viewAllNews: string;
    languageSwitcher: string;
  };
  header: {
    searchPlaceholder: string;
    searchLabel: string;
    openMenu: string;
    closeMenu: string;
  };
  footer: {
    phone: string;
    email: string;
    office: string;
    contact: string;
    rights: string;
    taxCode: string;
  };
  home: {
    featuredEyebrow: string;
    featuredTitle: string;
    latestEyebrow: string;
    latestTitle: string;
    allPosts: string;
    postDetail: string;
  };
  projects: {
    eyebrow: string;
    title: string;
    description: string;
    searchResultsTitle: string;
    emptyTitle: string;
    emptyDescription: string;
    ctaEyebrow: string;
    ctaTitle: string;
    ctaDescription: string;
  };
  news: {
    eyebrow: string;
    title: string;
    description: string;
    searchResultsTitle: string;
    searchResultsDescription: string;
    notFoundTitle: string;
    notFoundDescription: string;
    emptyTitle: string;
    emptyDescription: string;
  };
  /** Nhãn `ProjectStatus` + khóa "all" cho chip lọc danh sách dự án. */
  projectStatus: Record<string, string>;
  breadcrumb: {
    home: string;
    projects: string;
    news: string;
  };
  projectDetail: {
    notFoundTitle: string;
    eyebrow: string;
    quickInfoEyebrow: string;
    quickInfoTitle: string;
    locationLabel: string;
    statusLabel: string;
    categoryLabel: string;
    updating: string;
    overviewEyebrow: string;
    overviewFallbackTitle: string;
    overviewFallbackDescription: string;
    highlightsLabel: string;
    itemsEyebrow: string;
    itemsTitle: string;
    galleryEyebrow: string;
    galleryTitle: string;
    highlightsEyebrow: string;
    highlightsTitle: string;
    highlightsDescription: string;
    ctaEyebrow: string;
    ctaTitle: string;
    ctaDescription: string;
  };
  projectItem: {
    notFoundTitle: string;
    metaSuffix: string;
    eyebrow: string;
    overviewEyebrow: string;
    introTitle: string;
    descriptionFallback: string;
    parentProjectLabel: string;
    highlightsLabel: string;
    siblingsEyebrow: string;
    siblingsTitle: string;
    viewItem: string;
    backToProject: string;
    ctaEyebrow: string;
    ctaTitle: string;
    ctaDescription: string;
  };
  itemsCarousel: {
    badge: string;
    viewItem: string;
    ariaView: string;
    ariaGoTo: string;
    ariaPrevious: string;
    ariaNext: string;
  };
  newsDetail: {
    notFoundTitle: string;
    metaSuffix: string;
    eyebrow: string;
    infoTitle: string;
    categoryLabel: string;
    publishedLabel: string;
    eventDateLabel: string;
    sourceLabel: string;
  };
  shared: {
    homeAriaLabel: string;
    logoAlt: string;
  };
  footerBrand: {
    tagline: string;
    motto: string;
  };
  homeIntro: {
    eyebrow: string;
    description: string;
    strengths: Array<{ title: string; description: string }>;
  };
  homeCooperation: {
    eyebrow: string;
    title: string;
    description: string;
    cardBadge: string;
    roleLabel: string;
    partnerLabel: string;
    statusLabel: string;
    ariaPrevious: string;
    ariaNext: string;
    ariaGoTo: string;
    imageAlt: string;
  };
  homeContact: {
    eyebrow: string;
    title: string;
    description: string;
  };
  homeBanner: {
    regionLabel: string;
    ariaPrevious: string;
    ariaNext: string;
    ariaGoTo: string;
  };
  navLabels: Record<string, string>;
  navOverviewLabels: Record<string, string>;
  navGroups: Record<string, string>;
  footerSectionTitles: Record<string, string>;
  footerLabels: Record<string, string>;
};

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  vi: () =>
    import("@/lib/i18n/dictionaries/vi.json").then(
      (module) => module.default as Dictionary,
    ),
  en: () =>
    import("@/lib/i18n/dictionaries/en.json").then(
      (module) => module.default as Dictionary,
    ),
};

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}

/** Thay `{query}` trong chuỗi dictionary bằng giá trị thật. */
export function interpolate(
  template: string,
  values: Record<string, string>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? values[key] : match,
  );
}
