import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { SearchResults } from "@/components/sections/search-results";
import { PageHeading } from "@/components/ui/page-heading";
import { searchSafe } from "@/lib/api/search";
import { isLocale, localizePath } from "@/lib/i18n/config";
import { getDictionary, interpolate } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import { getSearchQuery } from "@/lib/search";
import { buildPageMetadata } from "@/lib/seo";

/**
 * Tìm kiếm hợp nhất — dự án + tin tức trong **một** lượt gọi `GET /search`.
 *
 * Render hoàn toàn ở server: form GET thuần ở header submit vào đây, không gọi
 * mạng theo từng phím, không thư viện tìm kiếm phía client. Nhờ vậy từ khóa nằm
 * trong URL nên chia sẻ được, Back/Forward chạy đúng, và không có bẫy focus.
 */
export async function generateMetadata({
  params,
}: PageProps<"/[locale]/tim-kiem">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = await getDictionary(locale);

  return buildPageMetadata({
    title: dictionary.search.title,
    description: dictionary.search.description,
    // Canonical trỏ về trang tìm kiếm SẠCH, không kèm `?q=`: mỗi từ khóa khác
    // nhau không được sinh ra một URL riêng trong chỉ mục. Cố ý KHÔNG đọc `q`
    // ở đây — canonical phải ổn định bất kể người dùng gõ gì.
    path: routes.search,
    locale,
    // `noindex, follow`: trang kết quả không nên vào chỉ mục, nhưng link bên
    // trong nó vẫn dẫn tới dự án và bài viết thật nên phải được đi tiếp.
    noIndex: true,
  });
}

export default async function SearchPage({
  params,
  searchParams,
}: PageProps<"/[locale]/tim-kiem">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const { q } = await searchParams;
  const query = getSearchQuery(q);
  const dictionary = await getDictionary(locale);
  const labels = dictionary.search;
  const basePath = localizePath(routes.search, locale);

  // Không có từ khóa (kể cả `?q=` rỗng/toàn khoảng trắng) → không gọi mạng, chỉ
  // mời người dùng nhập. Cố ý KHÔNG redirect như `/tin-tuc` từng làm: ở đây
  // trang rỗng vẫn là một trạng thái hợp lệ và có ích của chính trang này.
  const outcome = query ? await searchSafe(query, locale, "all") : null;

  const results = outcome?.status === "ok" ? outcome.results : null;
  const totalCount = results
    ? results.projects.length + results.news.length
    : 0;

  return (
    <SiteShell locale={locale}>
      <PageHeading
        eyebrow={labels.eyebrow}
        title={
          query
            ? interpolate(labels.titleWithQuery, { query })
            : labels.title
        }
        description={
          query
            ? interpolate(labels.descriptionWithQuery, { query })
            : labels.description
        }
      />

      <section className="reveal-section mx-auto max-w-site px-4 pb-5 sm:px-6 sm:pb-8">
        {!query ? (
          <div className="border border-black/10 bg-white p-6">
            <h2 className="text-2xl font-semibold">{labels.emptyQueryTitle}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate">
              {labels.emptyQueryDescription}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={localizePath(routes.projects, locale)}
                className="button-polish inline-flex h-11 items-center bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                {dictionary.common.viewAllProjects}
              </Link>
              <Link
                href={localizePath(routes.news, locale)}
                className="button-polish inline-flex h-11 items-center border border-brand/30 px-5 text-sm font-semibold text-brand hover:border-brand"
              >
                {dictionary.common.viewAllNews}
              </Link>
            </div>
          </div>
        ) : outcome?.status === "invalid" ? (
          /* Từ khóa không đạt hợp đồng backend (dưới 2 hoặc trên 200 ký tự).
             Nói rõ LÝ DO thay vì hiện "không tìm thấy" — người dùng đang bị
             chặn ở ô nhập, không phải kho nội dung rỗng. Cũng không để 400 nổi
             lên error boundary làm cả trang trông như hỏng. */
          <div className="border border-black/10 bg-white p-6">
            <h2 className="text-2xl font-semibold">{labels.invalidTitle}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate">
              {outcome.reason === "too-short"
                ? labels.tooShort
                : labels.tooLong}
            </p>
          </div>
        ) : outcome?.status === "error" ? (
          /* Chỉ khối này hỏng, phần khung site vẫn dùng được. "Thử lại" là link
             về đúng URL hiện tại — gọi lại server, không cần state client. */
          <div className="border border-danger/25 bg-white p-6">
            <h2 className="text-2xl font-semibold">{labels.errorTitle}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate">
              {labels.errorDescription}
            </p>
            <Link
              href={`${basePath}?q=${encodeURIComponent(query)}`}
              prefetch={false}
              className="button-polish mt-6 inline-flex h-11 items-center bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              {labels.errorRetry}
            </Link>
          </div>
        ) : results && totalCount > 0 ? (
          <>
            {/* Tổng số kết quả đứng ngay đầu: trả lời câu "tôi vừa tìm được bao
                nhiêu?" trước khi phải cuộn. Đếm theo ĐÚNG mảng API trả về —
                backend chặn ở 20 bản ghi mỗi loại. */}
            <p
              data-testid="search-total-count"
              className="mb-6 text-sm font-semibold text-slate"
            >
              {interpolate(
                totalCount === 1 ? labels.summaryOne : labels.summaryMany,
                { count: String(totalCount), query },
              )}
            </p>
            <SearchResults
              results={results}
              locale={locale}
              labels={labels}
              statusLabels={dictionary.projectStatus}
            />
          </>
        ) : (
          <div className="border border-black/10 bg-white p-6">
            <h2 className="text-2xl font-semibold">{labels.notFoundTitle}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate">
              {interpolate(labels.notFoundDescription, { query })}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={localizePath(routes.projects, locale)}
                className="button-polish inline-flex h-11 items-center bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                {dictionary.common.viewAllProjects}
              </Link>
              <Link
                href={localizePath(routes.news, locale)}
                className="button-polish inline-flex h-11 items-center border border-brand/30 px-5 text-sm font-semibold text-brand hover:border-brand"
              >
                {dictionary.common.viewAllNews}
              </Link>
            </div>
          </div>
        )}
      </section>
    </SiteShell>
  );
}
