import Link from "next/link";
import { Check } from "lucide-react";
import type { NewsCategory } from "@/types/content";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { routes } from "@/lib/routes";

type NewsCategoryFilterProps = {
  categories: NewsCategory[];
  activeSlug?: string;
  locale: Locale;
  allLabel: string;
  regionLabel: string;
};

export function NewsCategoryFilter({
  categories,
  activeSlug,
  locale,
  allLabel,
  regionLabel,
}: NewsCategoryFilterProps) {
  const visible = categories.filter((category) => category.publishedCount > 0);
  if (visible.length === 0) return null;
  const items = [
    { slug: undefined, name: allLabel, href: routes.news },
    ...visible.map((category) => ({
      slug: category.slug,
      name: category.name,
      href: `${routes.newsCategory}/${category.slug}`,
    })),
  ];

  return (
    <nav
      aria-label={regionLabel}
      data-testid="news-category-filter"
      className="flex flex-wrap gap-2"
    >
      {items.map((item) => {
        const active = item.slug === activeSlug;

        return (
          <Link
            key={item.slug ?? "all"}
            href={localizePath(item.href, locale)}
            aria-current={active ? "page" : undefined}
            className={`button-polish inline-flex min-h-11 items-center gap-1.5 border px-4 text-sm font-semibold transition ${
              active
                ? "border-brand bg-brand text-white"
                : "border-black/10 bg-white text-ink-soft hover:border-brand hover:text-brand"
            }`}
          >
            {active ? (
              <Check className="size-4 shrink-0" aria-hidden="true" />
            ) : null}
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
