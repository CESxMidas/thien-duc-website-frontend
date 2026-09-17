import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { NewsCategoryFilter } from "@/components/sections/news-category-filter";
import { PageHeading } from "@/components/ui/page-heading";
import { Pagination } from "@/components/ui/pagination";
import {
  getNewsCategories,
  getNewsPage,
  NEWS_PAGE_SIZE,
} from "@/lib/api/news";
import { formatDate } from "@/lib/format";
import { isLocale, localizePath } from "@/lib/i18n/config";
import { getDictionary, interpolate } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import { buildPageHref, clampPage, parsePageParam } from "@/lib/pagination";
import { getSearchQuery, hasBlankSearchParam } from "@/lib/search";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
  searchParams,
}: PageProps<"/[locale]/tin-tuc">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { page: pageParam } = await searchParams;
  const dictionary = await getDictionary(locale);

  const page = parsePageParam(pageParam);
  const path =
    page === null || page === 1 ? routes.news : `${routes.news}?page=${page}`;
  const title =
    page === null || page === 1
      ? dictionary.news.title
      : `${dictionary.news.title} — ${interpolate(dictionary.pagination.summaryShort, { page: String(page) })}`;

  return buildPageMetadata({
    title,
    description: dictionary.news.description,
    path,
    locale,
  });
}

export default async function NewsPage({
  params,
  searchParams,
}: PageProps<"/[locale]/tin-tuc">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const { q, page: pageParam } = await searchParams;
  const query = getSearchQuery(q);
  const dictionary = await getDictionary(locale);
  const basePath = localizePath(routes.news, locale);

  if (query) {
    permanentRedirect(
      `${localizePath(routes.search, locale)}?q=${encodeURIComponent(query)}`,
    );
  }

  if (hasBlankSearchParam(q)) {
    redirect(basePath);
  }

  const requestedPage = parsePageParam(pageParam);
  if (requestedPage === null) {
    redirect(basePath);
  }

  const [newsPage, categories] = await Promise.all([
    getNewsPage(locale, { page: requestedPage, limit: NEWS_PAGE_SIZE }),
    getNewsCategories(locale),
  ]);
  if (newsPage.totalPages > 0) {
    const safePage = clampPage(requestedPage, newsPage.totalPages);
    if (safePage !== requestedPage) {
      redirect(buildPageHref(basePath, safePage));
    }
  }

  const posts = newsPage.items;

  return (
    <SiteShell locale={locale}>
      <PageHeading
        eyebrow={dictionary.news.eyebrow}
        title={dictionary.news.title}
        description={dictionary.news.description}
      />

      <section className="mx-auto max-w-site px-4 pb-6 sm:px-6">
        <NewsCategoryFilter
          categories={categories}
          locale={locale}
          allLabel={dictionary.news.filterAll}
          regionLabel={dictionary.news.filterLabel}
        />
      </section>

      <section
        id="danh-sach-tin"
        className="reveal-section mx-auto max-w-site px-4 pb-5 sm:px-6 sm:pb-8"
      >
        {posts.length > 0 ? (

          <div className="stagger-list grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={localizePath(`${routes.news}/${post.slug}`, locale)}
                className="hover-card group overflow-hidden border border-black/10 bg-white hover:border-brand"
              >
                {post.image ? (
                  <div className="image-reveal relative aspect-video bg-surface">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      // Khớp đúng bậc cột mới của lưới (1 → 2 → 3 cột).
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <div className="p-5">
                  <p className="text-sm font-medium text-slate">
                    {[post.category?.name, formatDate(post.publishedAt, locale)]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <h2 className="mt-3 text-xl font-semibold leading-snug">
                    {post.title}
                  </h2>
              
                  <span className="link-arrow mt-5 text-sm font-semibold text-brand">
                    {dictionary.common.readArticle}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border border-black/10 bg-white p-6">
            <h2 className="text-2xl font-semibold">
              {dictionary.news.emptyTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate">
              {dictionary.news.emptyDescription}
            </p>
          </div>
        )}

        <Pagination
          currentPage={newsPage.page}
          totalPages={newsPage.totalPages}
          buildHref={(page) =>
            page <= 1
              ? `${basePath}#danh-sach-tin`
              : `${basePath}?page=${page}#danh-sach-tin`
          }
          labels={dictionary.pagination}
        />
      </section>
    </SiteShell>
  );
}
