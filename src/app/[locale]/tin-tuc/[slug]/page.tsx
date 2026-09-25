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

      <section className="page-container reveal-section grid gap-6 pb-5 sm:pb-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="hover-card border border-black/10 bg-white p-5 md:p-7">
          <div className="flex flex-wrap gap-3 text-sm font-medium text-slate">
        
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

          <div className="prose-content mt-6 grid gap-5 text-base leading-7 text-slate sm:mt-8 sm:leading-8">
            {content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>

        <aside className="hover-card h-fit border border-black/10 bg-white p-6">
          <h2 className="text-xl font-semibold">
            {dictionary.newsDetail.infoTitle}
          </h2>
          <dl className="mt-5 grid gap-4 text-sm">
            {post.category ? (
              <div>
                <dt className="font-semibold uppercase tracking-[0.16em] text-brand">
                  {dictionary.newsDetail.categoryLabel}
                </dt>
                <dd className="mt-1 text-slate">{post.category.name}</dd>
              </div>
            ) : null}
            <div>
              <dt className="font-semibold uppercase tracking-[0.16em] text-brand">
                {dictionary.newsDetail.publishedLabel}
              </dt>
              <dd className="mt-1 text-slate">
                {formatDate(post.publishedAt, locale)}
              </dd>
            </div>
            {post.eventDate ? (
              <div>
                <dt className="font-semibold uppercase tracking-[0.16em] text-brand">
                  {dictionary.newsDetail.eventDateLabel}
                </dt>
                <dd className="mt-1 text-slate">
                  {formatDate(post.eventDate, locale)}
                </dd>
              </div>
            ) : null}
            {post.author ? (
              <div>
                <dt className="font-semibold uppercase tracking-[0.16em] text-brand">
                  {dictionary.newsDetail.sourceLabel}
                </dt>
                <dd className="mt-1 text-slate">{post.author}</dd>
              </div>
            ) : null}
          </dl>
          <Link
            href={localizePath(routes.news, locale)}
            className="button-polish mt-7 inline-flex h-11 w-full items-center justify-center bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            {dictionary.common.viewAllNews}
          </Link>
        </aside>
      </section>
    </SiteShell>
  );
}
