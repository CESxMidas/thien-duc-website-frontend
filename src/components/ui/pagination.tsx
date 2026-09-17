import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { interpolate, type Dictionary } from "@/lib/i18n/get-dictionary";

export function buildPageList(
  currentPage: number,
  totalPages: number,
): (number | null)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([
    1,
    totalPages,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ]);
  const visible = [...pages]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((first, second) => first - second);

  const result: (number | null)[] = [];
  let previous = 0;
  for (const page of visible) {
    if (page - previous > 1) result.push(null);
    result.push(page);
    previous = page;
  }
  return result;
}

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
  labels: Dictionary["pagination"];
};

const CONTROL_BASE =
  "button-polish inline-flex h-11 items-center gap-1 border px-4 text-sm font-semibold transition";


export function Pagination({
  currentPage,
  totalPages,
  buildHref,
  labels,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav
      aria-label={labels.navLabel}
      data-testid="news-pagination"
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      {hasPrevious ? (
        <Link
          href={buildHref(currentPage - 1)}
          rel="prev"
          data-testid="pagination-previous"
          className={`${CONTROL_BASE} border-black/15 hover:border-brand hover:text-brand`}
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          {labels.previous}
        </Link>
      ) : (
        
        <span
          aria-disabled="true"
          data-testid="pagination-previous"
          className={`${CONTROL_BASE} cursor-not-allowed border-black/10 text-slate/50`}
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          {labels.previous}
        </span>
      )}


      <ul className="hidden list-none items-center gap-1 p-0 sm:flex">
        {buildPageList(currentPage, totalPages).map((page, index) =>
          page === null ? (
            <li
              key={`gap-${index}`}
              aria-hidden="true"
              className="px-2 text-sm text-slate"
            >
              …
            </li>
          ) : (
            <li key={page}>
              <Link
                href={buildHref(page)}
                aria-label={interpolate(
                  page === currentPage ? labels.ariaCurrent : labels.ariaPage,
                  { page: String(page) },
                )}
                aria-current={page === currentPage ? "page" : undefined}
                className={`grid h-11 min-w-11 place-items-center border px-3 text-sm font-semibold transition ${
                  page === currentPage
                    ? "border-brand bg-brand text-white"
                    : "border-black/15 hover:border-brand hover:text-brand"
                }`}
              >
                {page}
              </Link>
            </li>
          ),
        )}
      </ul>

      <p className="px-2 text-sm font-medium text-slate sm:hidden">
        {interpolate(labels.summary, {
          page: String(currentPage),
          total: String(totalPages),
        })}
      </p>

      {hasNext ? (
        <Link
          href={buildHref(currentPage + 1)}
          rel="next"
          data-testid="pagination-next"
          className={`${CONTROL_BASE} border-black/15 hover:border-brand hover:text-brand`}
        >
          {labels.next}
          <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      ) : (
        <span
          aria-disabled="true"
          data-testid="pagination-next"
          className={`${CONTROL_BASE} cursor-not-allowed border-black/10 text-slate/50`}
        >
          {labels.next}
          <ChevronRight className="size-4" aria-hidden="true" />
        </span>
      )}
    </nav>
  );
}
