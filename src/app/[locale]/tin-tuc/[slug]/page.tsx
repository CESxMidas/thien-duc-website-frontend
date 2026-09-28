import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { NewsDetailGallery } from "@/components/sections/news-detail-gallery";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { JsonLd } from "@/components/ui/json-ld";
import { PageHeading } from "@/components/ui/page-heading";
import { staticParamsSafe } from "@/lib/api/client";
import { getNewsPostBySlug, getNewsPosts } from "@/lib/api/news";
import { formatDate } from "@/lib/format";
import { defaultLocale, isLocale, localizePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import { buildNewsArticleJsonLd, buildPageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return staticParamsSafe('tin-tuc/[slug]', async () => {
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
      <PageHeading
        eyebrow={dictionary.newsDetail.eyebrow}
        title={post.title}
        description={post.summary}
      />

      <NewsDetailGallery images={galleryImages} title={post.title} />

      <section className="page-container reveal-section pb-5 sm:pb-8">
        <article className="mx-auto max-w-5xl min-w-0 overflow-hidden">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-slate">
            {post.category ? (
              <Link
                href={localizePath(
                  `${routes.newsCategory}/${post.category.slug}`,
                  locale,
                )}
                className="font-semibold text-brand hover:text-brand-dark"
              >
                {post.category.name}
              </Link>
            ) : null}
            <span>{formatDate(post.publishedAt, locale)}</span>
          </div>

          <div className="prose-content mt-8 grid min-w-0 gap-5 break-words text-base leading-7 text-slate [max-width:100%] [overflow-wrap:anywhere] sm:mt-10 sm:leading-8">
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

        <aside className="mx-auto mt-10 max-w-5xl border-t border-black/10 pt-6">
          <h2 className="font-display text-xl font-semibold">
            {dictionary.newsDetail.infoTitle}
          </h2>
          <dl className="mt-5 grid gap-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
            {post.category ? (
              <div className="min-w-0">
                <dt className="font-semibold uppercase tracking-[0.16em] text-brand">
                  {dictionary.newsDetail.categoryLabel}
                </dt>
                <dd className="mt-1 text-slate">{post.category.name}</dd>
              </div>
            ) : null}
            <div className="min-w-0">
              <dt className="font-semibold uppercase tracking-[0.16em] text-brand">
                {dictionary.newsDetail.publishedLabel}
              </dt>
              <dd className="mt-1 text-slate">
                {formatDate(post.publishedAt, locale)}
              </dd>
            </div>
            {post.eventDate ? (
              <div className="min-w-0">
                <dt className="font-semibold uppercase tracking-[0.16em] text-brand">
                  {dictionary.newsDetail.eventDateLabel}
                </dt>
                <dd className="mt-1 text-slate">
                  {formatDate(post.eventDate, locale)}
                </dd>
              </div>
            ) : null}
            {post.author ? (
              <div className="min-w-0">
                <dt className="font-semibold uppercase tracking-[0.16em] text-brand">
                  {dictionary.newsDetail.sourceLabel}
                </dt>
                <dd className="mt-1 text-slate">{post.author}</dd>
              </div>
            ) : null}
          </dl>
          <Link
            href={localizePath(routes.news, locale)}
            className="button-polish mt-7 inline-flex h-11 items-center justify-center bg-brand px-6 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            {dictionary.common.viewAllNews}
          </Link>
        </aside>
      </section>
    </SiteShell>
  );
}
