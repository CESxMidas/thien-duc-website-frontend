import Link from "next/link";
import { siteConfig } from "@/config/site";
import { serializeJsonLd } from "@/lib/json-ld";

export type BreadcrumbItem = {
  label: string;
  /** Bỏ trống cho phần tử cuối (trang hiện tại). */
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

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
      className="site-breadcrumb page-container text-sm font-medium"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <ol className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5 leading-6">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const collapseOnMobile =
            items.length > 3 && index > 0 && index < items.length - 2;

          return (
            <li
              key={`${item.label}-${index}`}
              className={`min-w-0 items-center gap-2 ${collapseOnMobile ? "hidden sm:flex" : "flex"}`}
            >
              {index > 0 ? (
                <span aria-hidden="true" className="shrink-0 text-slate/60">
                  /
                </span>
              ) : null}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="min-w-0 wrap-break-word text-slate transition hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="min-w-0 wrap-break-word text-ink">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
