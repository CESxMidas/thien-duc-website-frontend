import Link from "next/link";
import { siteConfig } from "@/config/site";

export type BreadcrumbItem = {
  label: string;
  /** Bỏ trống cho phần tử cuối (trang hiện tại). */
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

/**
 * Breadcrumb dùng chung cho các trang cấp ≥ 2 (UI-UX-HANDOFF-SPEC.md mục H5).
 * Kèm JSON-LD BreadcrumbList cho SEO. Trên mobile, khi > 3 cấp thì các cấp
 * giữa thu gọn thành "…" (vẫn bấm được).
 */
export function Breadcrumb({ items }: BreadcrumbProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${siteConfig.url}${item.href}` } : {}),
    })),
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className="mx-auto max-w-7xl px-6 pt-6 text-[13px] font-medium"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          // Mobile: giữ cấp đầu + 2 cấp cuối, các cấp giữa thu thành "…"
          const collapseOnMobile =
            items.length > 3 && index > 0 && index < items.length - 2;

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center gap-2"
            >
              {index > 0 ? (
                <span aria-hidden="true" className="text-[#B06613]/40">
                  /
                </span>
              ) : null}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={`text-[#59646a] transition hover:text-[#B06613] ${
                    collapseOnMobile ? "hidden sm:inline" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-[#191919]">
                  {item.label}
                </span>
              )}
              {collapseOnMobile ? (
                <span aria-hidden="true" className="text-[#59646a] sm:hidden">
                  …
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
