import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { PageHeading } from "@/components/ui/page-heading";
import { getNewsPosts } from "@/lib/api/news";
import { search } from "@/lib/api/search";
import { formatDate } from "@/lib/format";
import { isLocale, localizePath } from "@/lib/i18n/config";
import { getDictionary, interpolate } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import { getSearchQuery } from "@/lib/search";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/tin-tuc">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = await getDictionary(locale);

  return buildPageMetadata({
    title: dictionary.news.title,
    description: dictionary.news.description,
    path: routes.news,
    locale,
  });
}

export default async function NewsPage({
  params,
  searchParams,
}: PageProps<"/[locale]/tin-tuc">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const { q } = await searchParams;
  const query = getSearchQuery(q);
  const dictionary = await getDictionary(locale);

  // Có từ khóa → hỏi thẳng API full-text (đã xếp theo độ liên quan).
  // Không có → lấy danh sách đầy đủ, sắp theo ngày đăng giảm dần.
  const posts = query
    ? (await search(query, locale, "news")).news
    : [...(await getNewsPosts(locale))].sort((first, second) =>
        second.publishedAt.localeCompare(first.publishedAt),
      );

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
      <section className="reveal-section mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-16">
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
                    {[post.category, formatDate(post.publishedAt)]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <h2 className="mt-3 text-xl font-semibold leading-snug">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate">
                    {post.summary}
                  </p>
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
      </section>
    </SiteShell>
  );
}
