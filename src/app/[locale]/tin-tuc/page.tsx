import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { PageHeading } from "@/components/ui/page-heading";
import { Pagination } from "@/components/ui/pagination";
import { getNewsPage, NEWS_PAGE_SIZE } from "@/lib/api/news";
import { searchSafe } from "@/lib/api/search";
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

  // Mỗi trang phân trang **tự trỏ canonical về chính nó** (`?page=2`), không
  // gộp hết về trang 1: gộp lại thì bài ở trang 2 trở đi mất đường vào chỉ mục.
  // Trang 1 giữ URL sạch, không `?page=1` — nên không sinh URL trùng nội dung.
  // Cố ý KHÔNG đặt noindex: mọi trang danh sách đều nên bò được.
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

  // `?q=` rỗng/toàn khoảng trắng → về URL sạch. Không giả vờ vừa tìm kiếm xong
  // trong khi thực tế đang hiện nguyên danh sách tin.
  if (hasBlankSearchParam(q)) {
    redirect(basePath);
  }

  // `?page=` không hợp lệ (0, âm, chữ, 1) → chuyển hướng về URL chuẩn, không
  // render nội dung dưới một URL sai. Chỉ áp dụng cho danh sách thường: ở chế
  // độ tìm kiếm không có phân trang, và redirect ở đây sẽ làm **mất từ khóa**.
  const requestedPage = parsePageParam(pageParam);
  if (!query && requestedPage === null) {
    redirect(basePath);
  }

  // Có từ khóa → hỏi thẳng API full-text (đã xếp theo độ liên quan), không phân
  // trang: kết quả tìm kiếm đã bị API giới hạn số lượng.
  // Không có → lấy đúng một trang từ backend.
  const outcome = query ? await searchSafe(query, locale, "news") : null;
  const newsPage =
    query || requestedPage === null
      ? null
      : await getNewsPage(locale, {
          page: requestedPage,
          limit: NEWS_PAGE_SIZE,
        });

  // Trang vượt quá trang cuối → đưa về trang cuối có thật thay vì trang trắng.
  if (newsPage && newsPage.totalPages > 0 && requestedPage !== null) {
    const safePage = clampPage(requestedPage, newsPage.totalPages);
    if (safePage !== requestedPage) {
      redirect(buildPageHref(basePath, safePage));
    }
  }

  const isSearch = Boolean(query);
  const posts =
    outcome?.status === "ok" ? outcome.results.news : (newsPage?.items ?? []);
  // Đếm theo **đúng mảng API trả về**. API chặn ở 20 bản ghi nên câu chữ là
  // "Hiển thị N kết quả", không phải "tìm thấy N kết quả trên toàn site".
  const resultCount = posts.length;

  return (
    <SiteShell locale={locale}>
      <PageHeading
        eyebrow={dictionary.news.eyebrow}
        title={
          query ? dictionary.news.searchResultsTitle : dictionary.news.title
        }
        description={
          query
            ? interpolate(dictionary.news.searchResultsDescription, { query })
            : dictionary.news.description
        }
      />
      <section
        id="danh-sach-tin"
        className="reveal-section mx-auto max-w-site px-4 pb-5 sm:px-6 sm:pb-8"
      >
        {/* Số kết quả — trả lời câu "tôi vừa tìm được bao nhiêu bài?" ngay trên
            đầu lưới. Tách hai chuỗi ít/nhiều để tiếng Anh không ra "1 results". */}
        {isSearch && outcome?.status === "ok" && resultCount > 0 ? (
          <p
            data-testid="news-search-count"
            className="mb-5 text-sm font-semibold text-slate"
          >
            {interpolate(
              resultCount === 1
                ? dictionary.news.searchCountOne
                : dictionary.news.searchCountMany,
              { count: String(resultCount), query },
            )}
          </p>
        ) : null}

        {/* Từ khóa không đạt hợp đồng backend (1 ký tự / quá 200 ký tự). Nói rõ
            LÝ DO thay vì hiện "không tìm thấy bài viết" — người dùng đang bị
            chặn ở ô nhập, không phải kho nội dung rỗng. */}
        {outcome?.status === "invalid" ? (
          <div className="border border-black/10 bg-white p-6">
            <h2 className="text-2xl font-semibold">
              {dictionary.news.searchInvalidTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate">
              {outcome.reason === "too-short"
                ? dictionary.news.searchTooShort
                : dictionary.news.searchTooLong}
            </p>
            <Link
              href={localizePath(routes.news, locale)}
              className="button-polish mt-6 inline-flex h-11 items-center bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              {dictionary.common.viewAllNews}
            </Link>
          </div>
        ) : outcome?.status === "error" ? (
          /* Lỗi gọi API tìm kiếm: chỉ khối này hỏng, phần khung site vẫn dùng
             được. "Thử lại" là link về đúng URL hiện tại — gọi lại server, không
             cần thêm state phía client. */
          <div className="border border-danger/25 bg-white p-6">
            <h2 className="text-2xl font-semibold">
              {dictionary.news.searchErrorTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate">
              {dictionary.news.searchErrorDescription}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`${basePath}?q=${encodeURIComponent(query)}`}
                prefetch={false}
                className="button-polish inline-flex h-11 items-center bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                {dictionary.news.searchErrorRetry}
              </Link>
              <Link
                href={localizePath(routes.news, locale)}
                className="button-polish inline-flex h-11 items-center border border-brand/30 px-5 text-sm font-semibold text-brand hover:border-brand"
              >
                {dictionary.common.viewAllNews}
              </Link>
            </div>
          </div>
        ) : posts.length > 0 ? (
          // Ba cột chỉ từ `lg`. Ở `md` (768px) ba cột cho thẻ rộng ~240px —
          // hẹp hơn cả một cột ở màn 375px, tiêu đề bài vỡ 4–5 dòng. Bậc trung
          // gian hai cột giữ thẻ ~294px ở 640px và ~360px ở 768px.
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
                    {[post.category, formatDate(post.publishedAt, locale)]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <h2 className="mt-3 text-xl font-semibold leading-snug">
                    {post.title}
                  </h2>
                  {/* Tóm tắt CHỈ hiện ở chế độ tìm kiếm: người dùng cần đoạn
                      trích để đoán bài nào đúng ý trước khi mở. Danh sách tin
                      thường giữ nguyên bố cục cũ (ảnh + tiêu đề) để lưới 3 cột
                      không cao thấp so le. Clamp 3 dòng cho tóm tắt dài. */}
                  {isSearch && post.summary ? (
                    // Canh TRÁI, không justify: thẻ nằm trong lưới 3 cột nên bề
                    // ngang thực chỉ ~330px (~42 ký tự/dòng) — hẹp hơn cả màn
                    // 375px. Justify ở bề rộng đó tạo "dòng sông trắng" chạy
                    // dọc, và `text-indent` đi kèm làm dòng đầu thụt vào giữa
                    // thẻ. Đây là chữ trong thẻ nhỏ, không phải văn bản dài.
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate">
                      {post.summary}
                    </p>
                  ) : null}
                  <span className="link-arrow mt-5 text-sm font-semibold text-brand">
                    {dictionary.common.readArticle}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : query ? (
          <div className="border border-black/10 bg-white p-6">
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
          <div className="border border-black/10 bg-white p-6">
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
