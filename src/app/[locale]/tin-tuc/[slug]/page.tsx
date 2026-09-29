import type { Metadata } from "next";
import { ArrowLeft, CalendarDays, FolderOpen, UserRound } from "lucide-react";
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

  const post = await getNewsPostBySlug(slug, locale);
  if (!post) {
    notFound();
  }

  const dictionary = await getDictionary(locale);
  const content = post.content?.length ? post.content : [post.summary];
  const galleryImages = post.gallery?.length
    ? post.gallery
    : post.image
      ? [post.image]
      : [];

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

      <header className="page-container py-6 sm:py-9 lg:py-10">
        <div className="border-l-2 border-earth pl-5 sm:pl-8">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate">
            {post.category ? (
              <Link
                href={localizePath(
                  `${routes.newsCategory}/${post.category.slug}`,
                  locale,
                )}
                className="inline-flex min-h-11 items-center gap-2 font-semibold text-olive transition-colors hover:text-earth"
              >
                <FolderOpen className="size-4" aria-hidden="true" />
                {post.category.name}
              </Link>
            ) : null}
            <span className="inline-flex min-h-11 items-center gap-2">
              <CalendarDays className="size-4" aria-hidden="true" />
              {formatDate(post.publishedAt, locale)}
            </span>
          </div>

          <div className="mt-3 grid items-end gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(18rem,0.92fr)] lg:gap-8 xl:grid-cols-[minmax(0,1.12fr)_minmax(20rem,0.88fr)]">
            <h1 className="max-w-[18ch] text-[2.35rem] font-medium leading-[1.04] text-balance text-charcoal sm:text-[3.25rem] lg:text-[3.9rem]">
              {post.title}
            </h1>
            <p className="max-w-[65ch] text-base leading-7 text-charcoal/75 sm:text-lg sm:leading-8 lg:pb-1">
              {post.summary}
            </p>
          </div>
        </div>
      </header>

      <section className="page-container reveal-section pb-8 sm:pb-12">
        <div className="grid min-w-0 items-start gap-y-8 border-t border-charcoal/15 pt-6 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-x-8 lg:gap-y-8 lg:pt-8 xl:grid-cols-[minmax(0,1fr)_18rem] xl:gap-x-10">
          <NewsDetailGallery
            images={galleryImages}
            title={post.title}
            galleryLabel={dictionary.newsDetail.galleryLabel}
            imageLabel={dictionary.newsDetail.imageLabel}
          />

          <aside className="border-t-2 border-earth pt-5 lg:sticky lg:top-36 lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <h2 className="font-display text-2xl font-semibold text-charcoal">
              {dictionary.newsDetail.infoTitle}
            </h2>
            <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-1">
              {post.category ? (
                <div className="min-w-0">
                  <dt className="flex items-center gap-2 font-semibold text-charcoal">
                    <FolderOpen
                      className="size-4 text-earth"
                      aria-hidden="true"
                    />
                    {dictionary.newsDetail.categoryLabel}
                  </dt>
                  <dd className="mt-1.5 pl-6 text-slate">
                    {post.category.name}
                  </dd>
                </div>
              ) : null}
              <div className="min-w-0">
                <dt className="flex items-center gap-2 font-semibold text-charcoal">
                  <CalendarDays
                    className="size-4 text-earth"
                    aria-hidden="true"
                  />
                  {dictionary.newsDetail.publishedLabel}
                </dt>
                <dd className="mt-1.5 pl-6 text-slate">
                  {formatDate(post.publishedAt, locale)}
                </dd>
              </div>
              {post.eventDate ? (
                <div className="min-w-0">
                  <dt className="flex items-center gap-2 font-semibold text-charcoal">
                    <CalendarDays
                      className="size-4 text-earth"
                      aria-hidden="true"
                    />
                    {dictionary.newsDetail.eventDateLabel}
                  </dt>
                  <dd className="mt-1.5 pl-6 text-slate">
                    {formatDate(post.eventDate, locale)}
                  </dd>
                </div>
              ) : null}
              {post.author ? (
                <div className="min-w-0">
                  <dt className="flex items-center gap-2 font-semibold text-charcoal">
                    <UserRound
                      className="size-4 text-earth"
                      aria-hidden="true"
                    />
                    {dictionary.newsDetail.sourceLabel}
                  </dt>
                  <dd className="mt-1.5 pl-6 text-slate">{post.author}</dd>
                </div>
              ) : null}
            </dl>

            <Link
              href={localizePath(routes.news, locale)}
              className="mt-7 inline-flex min-h-11 items-center gap-2 border-b border-earth pb-1 text-sm font-semibold text-olive transition-colors hover:text-earth"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              {dictionary.common.viewAllNews}
            </Link>
          </aside>

          <article className="min-w-0 border-t border-charcoal/15 pt-6 sm:pt-8 lg:col-start-1">
            <div className="grid max-w-[82ch] min-w-0 gap-5 break-words text-[1.0625rem] leading-8 text-charcoal/85 [overflow-wrap:anywhere] sm:text-lg sm:leading-9">
              {content.map((paragraph) => (
                <p
                  key={paragraph}
                  className="min-w-0 max-w-full whitespace-normal break-words [overflow-wrap:anywhere]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
