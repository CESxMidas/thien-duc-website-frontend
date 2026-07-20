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
      className="mx-auto max-w-site px-4 pt-4 text-[13px] font-medium sm:px-6 sm:pt-6"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5 leading-6">
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
                <span aria-hidden="true" className="text-brand/40">
                  /
                </span>
              ) : null}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={`text-slate transition hover:text-brand ${
                    collapseOnMobile ? "hidden sm:inline" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="min-w-0 wrap-break-word text-ink">
                  {item.label}
                </span>
              )}
              {collapseOnMobile ? (
                <span aria-hidden="true" className="text-slate sm:hidden">
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
