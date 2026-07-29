import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { PageHeading } from "@/components/ui/page-heading";
import { Pagination } from "@/components/ui/pagination";
import { getNewsPage, NEWS_PAGE_SIZE } from "@/lib/api/news";
import { search } from "@/lib/api/search";
import { formatDate } from "@/lib/format";
import { isLocale, localizePath } from "@/lib/i18n/config";
import { getDictionary, interpolate } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import {
  buildPageHref,
  clampPage,
  parsePageParam,
} from "@/lib/pagination";
import { getSearchQuery } from "@/lib/search";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
  searchParams,
}: PageProps<"/[locale]/tin-tuc">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { page: pageParam } = await searchParams;
  const dictionary = await getDictionary(locale);

  // Mỗi trang phân trang **tự trỏ canonical về chính nó** (`?page=2`), không
  // gộp hết về trang 1: gộp lại thì bài ở trang 2 trở đi mất đường vào chỉ mục.
  // Trang 1 giữ URL sạch, không `?page=1` — nên không sinh URL trùng nội dung.
  // Cố ý KHÔNG đặt noindex: mọi trang danh sách đều nên bò được.
  const page = parsePageParam(pageParam);
  const path = page === null || page === 1 ? routes.news : `${routes.news}?page=${page}`;
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

  // `?page=` không hợp lệ (0, âm, chữ, 1) → chuyển hướng về URL chuẩn, không
  // render nội dung dưới một URL sai.
  const requestedPage = parsePageParam(pageParam);
  if (requestedPage === null) {
    redirect(basePath);
  }

  // Có từ khóa → hỏi thẳng API full-text (đã xếp theo độ liên quan), không phân
  // trang: kết quả tìm kiếm đã bị API giới hạn số lượng.
  // Không có → lấy đúng một trang từ backend.
  const results = query ? await search(query, locale, "news") : null;
  const newsPage = query
    ? null
    : await getNewsPage(locale, {
        page: requestedPage,
        limit: NEWS_PAGE_SIZE,
      });

  // Trang vượt quá trang cuối → đưa về trang cuối có thật thay vì trang trắng.
  if (newsPage && newsPage.totalPages > 0) {
    const safePage = clampPage(requestedPage, newsPage.totalPages);
    if (safePage !== requestedPage) {
      redirect(buildPageHref(basePath, safePage));
    }
  }

  const posts = results ? results.news : (newsPage?.items ?? []);

  return (
    <SiteShell locale={locale}>
      <PageHeading
        eyebrow={dictionary.news.eyebrow}
        title={query ? dictionary.news.searchResultsTitle : dictionary.news.title}
        description={
          query
            ? interpolate(dictionary.news.searchResultsDescription, { query })
            : dictionary.news.description
        }
      />
      <section
        id="danh-sach-tin"
        className="reveal-section mx-auto max-w-site px-4 pb-8 sm:px-6 sm:pb-14"
      >
        {posts.length > 0 ? (
          <div className="stagger-list grid gap-5 md:grid-cols-3">
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
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <div className="p-5">
                  <p className="text-sm font-medium text-slate">
                    {[post.category, formatDate(post.publishedAt, locale)]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <h2 className="mt-3 text-xl font-semibold leading-snug">
                    {post.title}
                  </h2>
                  {/* <p className="mt-3 text-sm leading-6 text-slate">
                    {post.summary}
                  </p> */}
                  <span className="link-arrow mt-5 text-sm font-semibold text-brand">
                    {dictionary.common.readArticle}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : query ? (
          <div className="border border-black/10 bg-white p-8">
            <h2 className="text-2xl font-semibold">
              {dictionary.news.notFoundTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate">
              {interpolate(dictionary.news.notFoundDescription, { query })}
            </p>
            <Link
              href={localizePath(routes.news, locale)}
              className="button-polish mt-6 inline-flex h-11 items-center bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              {dictionary.common.viewAllNews}
            </Link>
          </div>
        ) : (
          <div className="border border-black/10 bg-white p-8">
            <h2 className="text-2xl font-semibold">
              {dictionary.news.emptyTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate">
              {dictionary.news.emptyDescription}
            </p>
          </div>
        )}

        {/* Chỉ phân trang cho danh sách đầy đủ; kết quả tìm kiếm không phân trang. */}
        {newsPage ? (
          <Pagination
            currentPage={newsPage.page}
            totalPages={newsPage.totalPages}
            // Neo về đầu danh sách để sang trang không phải cuộn lại từ header.
            buildHref={(page) =>
              page <= 1
                ? `${basePath}#danh-sach-tin`
                : `${basePath}?page=${page}#danh-sach-tin`
            }
            labels={dictionary.pagination}
          />
        ) : null}
      </section>
    </SiteShell>
  );
}
