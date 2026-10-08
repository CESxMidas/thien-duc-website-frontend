import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  FolderOpen,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { NewsDetailGallery } from "@/components/sections/news-detail-gallery";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { JsonLd } from "@/components/ui/json-ld";
import { staticParamsSafe } from "@/lib/api/client";
import { getNewsPostBySlug, getNewsPosts } from "@/lib/api/news";
import { formatDate } from "@/lib/format";
import { defaultLocale, isLocale, localizePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import {
  getNewsDisplayDate,
  isArticleSubheading,
  selectRelatedNews,
} from "@/lib/news-related";
import { routes } from "@/lib/routes";
import { buildNewsArticleJsonLd, buildPageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return staticParamsSafe("tin-tuc/[slug]", async () => {
    const newsPosts = await getNewsPosts(defaultLocale);
    return newsPosts.map((post) => ({ slug: post.slug }));
  });
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/tin-tuc/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const [post, dictionary] = await Promise.all([
    getNewsPostBySlug(slug, locale),
    getDictionary(locale),
  ]);
  if (!post) {
    return { title: dictionary.newsDetail.notFoundTitle };
  }

  return buildPageMetadata({
    title: `${post.title} | ${dictionary.newsDetail.metaSuffix}`,
    description: post.summary,
    path: `${routes.news}/${post.slug}`,
    locale,
    image: post.image,
    type: "article",
    publishedTime: post.publishedAt || undefined,
  });
}

export default async function NewsDetailPage({
  params,
}: PageProps<"/[locale]/tin-tuc/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const [post, dictionary, allNewsPosts] = await Promise.all([
    getNewsPostBySlug(slug, locale),
    getDictionary(locale),
    getNewsPosts(locale),
  ]);
  if (!post) {
    notFound();
  }

  const content = post.content?.length ? post.content : [post.summary];
  const galleryImages = post.gallery?.length
    ? post.gallery
    : post.image
      ? [post.image]
      : [];
  const displayDate = getNewsDisplayDate(post);
  const relatedPosts = selectRelatedNews(allNewsPosts, post, 3);
  const relatedTitle =
    locale === "en" ? "Related news" : "Tin tức liên quan";
  const relatedEyebrow = locale === "en" ? "Continue reading" : "Đọc tiếp";

  return (
    <SiteShell locale={locale}>
      <JsonLd data={buildNewsArticleJsonLd(post, locale)} />
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
          { label: post.title },
        ]}
      />

      <section className="page-container py-7 sm:py-10 lg:py-12">
        <div className="grid min-w-0 items-start gap-9 border-y border-charcoal/15 py-6 sm:py-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10 lg:py-10 xl:grid-cols-[minmax(0,1fr)_320px]">
          <article className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-earth">
              {post.category ? (
                <Link
                  href={localizePath(
                    `${routes.newsCategory}/${post.category.slug}`,
                    locale,
                  )}
                  className="inline-flex min-h-9 items-center gap-2 transition-colors hover:text-brand"
                >
                  <FolderOpen className="size-4" aria-hidden="true" />
                  {post.category.name}
                </Link>
              ) : null}
              {displayDate ? (
                <span className="inline-flex min-h-9 items-center gap-2">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  {formatDate(displayDate, locale)}
                </span>
              ) : null}
            </div>

            <h1 className="mt-4 w-full max-w-none text-[clamp(2.2rem,3.2vw,4rem)] font-medium leading-[1.02] text-balance text-charcoal">
              {post.title}
            </h1>

            <p className="mt-5 max-w-[66ch] text-base leading-7 text-charcoal/72 sm:text-lg sm:leading-8">
              {post.summary}
            </p>

            <div className="mt-8 sm:mt-10">
              <NewsDetailGallery
                images={galleryImages}
                title={post.title}
                galleryLabel={dictionary.newsDetail.galleryLabel}
                imageLabel={dictionary.newsDetail.imageLabel}
              />
            </div>

            <div className="mt-8 border-t border-charcoal/15 pt-7 sm:mt-10 sm:pt-9">
              <div className="grid max-w-[72ch] min-w-0 gap-5 break-words text-[1.0625rem] leading-8 text-charcoal/82 [overflow-wrap:anywhere] sm:text-lg sm:leading-9">
                {content.map((paragraph) =>
                  isArticleSubheading(paragraph) ? (
                    <h2
                      key={paragraph}
                      className="mt-3 text-2xl font-semibold leading-tight text-charcoal sm:text-3xl"
                    >
                      {paragraph}
                    </h2>
                  ) : (
                    <p
                      key={paragraph}
                      className="min-w-0 max-w-full whitespace-normal break-words [overflow-wrap:anywhere]"
                    >
                      {paragraph}
                    </p>
                  ),
                )}
              </div>
            </div>
          </article>

          <aside className="self-start border-t border-charcoal/20 pt-5 lg:sticky lg:top-[calc(var(--site-header-height)+24px)] lg:flex lg:max-h-[calc(100vh-var(--site-header-height)-48px)] lg:min-h-[24rem] lg:flex-col lg:overflow-y-auto">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-charcoal">
              {dictionary.newsDetail.infoTitle}
            </h2>
            <dl className="mt-5 grid gap-5 text-sm leading-6 lg:gap-6">
              {post.category ? (
                <div className="grid min-w-0 gap-1 border-t border-charcoal/10 pt-4">
                  <dt className="flex shrink-0 items-center gap-2 font-semibold text-earth">
                    <FolderOpen
                      className="size-4"
                      aria-hidden="true"
                    />
                    {dictionary.newsDetail.categoryLabel}
                  </dt>
                  <dd className="min-w-0 text-slate">{post.category.name}</dd>
                </div>
              ) : null}
              {post.eventDate ? (
                <div className="grid min-w-0 gap-1 border-t border-charcoal/10 pt-4">
                  <dt className="flex shrink-0 items-center gap-2 font-semibold text-earth">
                    <CalendarDays className="size-4" aria-hidden="true" />
                    {dictionary.newsDetail.eventDateLabel}
                  </dt>
                  <dd className="min-w-0 text-slate">
                    {formatDate(post.eventDate, locale)}
                  </dd>
                </div>
              ) : null}
              {post.publishedAt ? (
                <div className="grid min-w-0 gap-1 border-t border-charcoal/10 pt-4">
                  <dt className="flex shrink-0 items-center gap-2 font-semibold text-earth">
                    <CalendarDays className="size-4" aria-hidden="true" />
                    {dictionary.newsDetail.publishedLabel}
                  </dt>
                  <dd className="min-w-0 text-slate">
                    {formatDate(post.publishedAt, locale)}
                  </dd>
                </div>
              ) : null}
              {!post.eventDate && !post.publishedAt && post.createdAt ? (
                <div className="grid min-w-0 gap-1 border-t border-charcoal/10 pt-4">
                  <dt className="flex shrink-0 items-center gap-2 font-semibold text-earth">
                  <CalendarDays
                    className="size-4"
                    aria-hidden="true"
                  />
                    {dictionary.newsDetail.publishedLabel}
                  </dt>
                  <dd className="min-w-0 text-slate">
                    {formatDate(post.createdAt, locale)}
                  </dd>
                </div>
              ) : null}
              {post.author ? (
                <div className="grid min-w-0 gap-1 border-t border-charcoal/10 pt-4">
                  <dt className="flex shrink-0 items-center gap-2 font-semibold text-earth">
                    <UserRound className="size-4" aria-hidden="true" />
                    {dictionary.newsDetail.sourceLabel}
                  </dt>
                  <dd className="min-w-0 text-slate">{post.author}</dd>
                </div>
              ) : null}
            </dl>

            <Link
              href={localizePath(routes.news, locale)}
              className="mt-8 inline-flex min-h-11 w-fit items-center gap-2 border-b border-earth pb-1 text-sm font-semibold text-olive transition-colors hover:text-earth lg:mt-auto"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              {dictionary.common.viewAllNews}
            </Link>
          </aside>
        </div>
      </section>

      {relatedPosts.length > 0 ? (
        <section className="page-container pb-12 sm:pb-16 lg:pb-20">
          <div className="border-t border-charcoal/15 pt-8 sm:pt-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-earth">
                  {relatedEyebrow}
                </p>
                <h2 className="mt-2 text-3xl font-medium leading-tight text-charcoal sm:text-4xl">
                  {relatedTitle}
                </h2>
              </div>
              <Link
                href={localizePath(routes.news, locale)}
                className="link-arrow inline-flex min-h-11 items-center text-sm font-semibold text-brand"
              >
                {dictionary.common.viewAllNews}
              </Link>
            </div>

            <div className="mt-7 grid gap-6 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => {
                const relatedDate = getNewsDisplayDate(relatedPost);

                return (
                  <Link
                    key={relatedPost.slug}
                    href={localizePath(
                      `${routes.news}/${relatedPost.slug}`,
                      locale,
                    )}
                    className="group grid min-w-0 gap-4 border-t border-charcoal/15 pt-4"
                  >
                    {relatedPost.image ? (
                      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
                        <Image
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          fill
                          sizes="(max-width: 767px) calc(100vw - 2.5rem), (max-width: 1023px) 33vw, 24vw"
                          className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                    ) : null}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-earth">
                        {[relatedPost.category?.name, relatedDate ? formatDate(relatedDate, locale) : undefined]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                      <h3 className="mt-3 text-xl font-semibold leading-snug text-charcoal transition-colors group-hover:text-brand">
                        {relatedPost.title}
                      </h3>
                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand">
                        {dictionary.common.readArticle}
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}
    </SiteShell>
  );
}
