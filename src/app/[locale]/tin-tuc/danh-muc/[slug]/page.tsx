import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { NewsCategoryFilter } from "@/components/sections/news-category-filter";
import { PageHeading } from "@/components/ui/page-heading";
import { Pagination } from "@/components/ui/pagination";
import {
  getNewsCategories,
  getNewsPage,
  NEWS_PAGE_SIZE,
} from "@/lib/api/news";
import { formatDate } from "@/lib/format";
import { isLocale, localizePath, type Locale } from "@/lib/i18n/config";
import { getDictionary, interpolate } from "@/lib/i18n/get-dictionary";
import { buildPageHref, clampPage, parsePageParam } from "@/lib/pagination";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo";
import type { NewsCategory } from "@/types/content";

/**
 * Trang đích của một chuyên mục tin.
 *
 * URL dạng path (`/tin-tuc/danh-muc/<slug>`) chứ không phải query param: mỗi
 * chuyên mục cần một URL ổn định, đặt được title/description/canonical riêng và
 * nhận được liên kết nội bộ. Query param chỉ dùng cho phân trang — nhờ vậy số
 * URL lập chỉ mục vẫn hữu hạn và đếm được.
 */

/** Tìm chuyên mục theo slug; không có → `undefined` để trang gọi `notFound()`. */
async function findCategory(
  slug: string,
  locale: Locale,
): Promise<NewsCategory | undefined> {
  const categories = await getNewsCategories(locale);
  return categories.find((category) => category.slug === slug);
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps<"/[locale]/tin-tuc/danh-muc/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const dictionary = await getDictionary(locale);
  const category = await findCategory(slug, locale);
  if (!category) notFound();

  // Cùng quy tắc canonical với `/tin-tuc`: mỗi trang phân trang tự trỏ về chính
  // nó, trang 1 giữ URL sạch (không `?page=1`) nên không sinh URL trùng nội dung.
  const { page: pageParam } = await searchParams;
  const page = parsePageParam(pageParam);
  const basePath = `${routes.newsCategory}/${category.slug}`;
  const path = page === null || page === 1 ? basePath : `${basePath}?page=${page}`;

  const title = interpolate(dictionary.news.categoryTitle, {
    category: category.name,
  });

  // Chuyên mục hợp lệ nhưng chưa có bài nào → `noindex, follow`. Trang mỏng bị
  // lập chỉ mục kéo điểm cả site xuống, nhưng link trong đó vẫn nên được đi tiếp.
  // Đây là cùng chính sách đã áp cho `placeholderPaths`.
  const newsPage = await getNewsPage(locale, {
    page: 1,
    limit: 1,
    categorySlug: category.slug,
  });

  return buildPageMetadata({
    title:
      page === null || page === 1
        ? title
        : `${title} — ${interpolate(dictionary.pagination.summaryShort, { page: String(page) })}`,
    description: interpolate(dictionary.news.categoryDescription, {
      category: category.name,
    }),
    path,
    locale,
    noIndex: newsPage.totalItems === 0,
  });
}

export default async function NewsCategoryPage({
  params,
  searchParams,
}: PageProps<"/[locale]/tin-tuc/danh-muc/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const dictionary = await getDictionary(locale);
  const [categories, { page: pageParam }] = await Promise.all([
    getNewsCategories(locale),
    searchParams,
  ]);

  const category = categories.find((item) => item.slug === slug);
  // Slug không tồn tại là 404 thật, không phải danh sách rỗng: URL này không
  // tương ứng với nội dung nào cả.
  if (!category) notFound();

  const basePath = localizePath(
    `${routes.newsCategory}/${category.slug}`,
    locale,
  );

  // `?page=` không hợp lệ (0, âm, chữ, hoặc chính `1`) → về URL chuẩn thay vì
  // render nội dung dưới một URL sai. Cùng hành vi với `/tin-tuc`.
  const requestedPage = parsePageParam(pageParam);
  if (requestedPage === null) redirect(basePath);

  const newsPage = await getNewsPage(locale, {
    page: requestedPage,
    limit: NEWS_PAGE_SIZE,
    categorySlug: category.slug,
  });

  // Trang vượt quá trang cuối → đưa về trang cuối có thật, không để trang trắng.
  if (newsPage.totalPages > 0) {
    const safePage = clampPage(requestedPage, newsPage.totalPages);
    if (safePage !== requestedPage) {
      redirect(buildPageHref(basePath, safePage));
    }
  }

  const posts = newsPage.items;

  return (
    <SiteShell locale={locale}>
      {/* Cùng component (và cùng JSON-LD BreadcrumbList) với trang bài viết —
          trước đây trang chuyên mục là cấp duy nhất trong cây `/tin-tuc` không
          có breadcrumb. */}
      <Breadcrumb
        items={[
          {
            label: dictionary.breadcrumb.home,
            href: localizePath(routes.home, locale),
          },
          {
            label: dictionary.breadcrumb.news,
            href: localizePath(routes.news, locale),
          },
          { label: category.name },
        ]}
      />
      <PageHeading
        eyebrow={dictionary.news.eyebrow}
        title={interpolate(dictionary.news.categoryTitle, {
          category: category.name,
        })}
        description={interpolate(dictionary.news.categoryDescription, {
          category: category.name,
        })}
      />

      <section className="mx-auto max-w-site px-4 pb-6 sm:px-6">
        <NewsCategoryFilter
          categories={categories}
          activeSlug={category.slug}
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
              {dictionary.news.categoryEmptyTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate">
              {interpolate(dictionary.news.categoryEmptyDescription, {
                category: category.name,
              })}
            </p>
            <Link
              href={localizePath(routes.news, locale)}
              className="button-polish mt-6 inline-flex h-11 items-center bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              {dictionary.common.viewAllNews}
            </Link>
          </div>
        )}

        {/* `Pagination` tự ẩn khi chỉ có một trang. */}
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
      </section>
    </SiteShell>
  );
}
