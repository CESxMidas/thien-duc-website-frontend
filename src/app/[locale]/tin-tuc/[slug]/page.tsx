import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { JsonLd } from "@/components/ui/json-ld";
import { PageHeading } from "@/components/ui/page-heading";
import { getNewsPostBySlug, getNewsPosts } from "@/lib/api/news";
import { formatDate } from "@/lib/format";
import { defaultLocale, isLocale, localizePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import { buildNewsArticleJsonLd, buildPageMetadata } from "@/lib/seo";

/** Slug không phụ thuộc ngôn ngữ — locale do `generateStaticParams` của layout sinh. */
export async function generateStaticParams() {
  const newsPosts = await getNewsPosts(defaultLocale);
  return newsPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/tin-tuc/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const post = await getNewsPostBySlug(slug, locale);
  if (!post) {
    return { title: "Tin tức không tồn tại" };
  }

  return buildPageMetadata({
    title: `${post.title} | Tin tức Thiên Đức`,
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

  return (
    <SiteShell locale={locale}>
      {/* NewsArticle JSON-LD (task →7) — publisher/author trỏ Organization ở layout. */}
      <JsonLd data={buildNewsArticleJsonLd(post, locale)} />
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: localizePath(routes.home, locale) },
          { label: "Tin tức", href: localizePath(routes.news, locale) },
          { label: post.title },
        ]}
      />
      <PageHeading
        eyebrow="Chi tiết tin tức"
        title={post.title}
        description={post.summary}
      />

      {post.image ? (
        <section className="reveal-section mx-auto max-w-7xl px-4 pb-10 sm:px-6">
          <div className="image-reveal relative aspect-video max-h-140 overflow-hidden border border-black/10 bg-surface">
            <Image
              src={post.image}
              alt={post.title}
              fill
              preload
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
            />
          </div>
        </section>
      ) : null}

      <section className="reveal-section mx-auto grid max-w-7xl gap-6 px-4 pb-10 sm:px-6 sm:pb-16 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="hover-card border border-black/10 bg-white p-6 md:p-8">
          <div className="flex flex-wrap gap-3 text-sm font-medium text-slate">
            {post.category ? <span>{post.category}</span> : null}
            <span>{formatDate(post.publishedAt)}</span>
          </div>

          <div className="mt-6 grid gap-5 text-base leading-7 text-slate sm:mt-8 sm:leading-8">
            {content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>

        <aside className="hover-card h-fit border border-black/10 bg-white p-6">
          <h2 className="text-xl font-semibold">Thông tin bài viết</h2>
          <dl className="mt-5 grid gap-4 text-sm">
            {post.category ? (
              <div>
                <dt className="font-semibold uppercase tracking-[0.16em] text-brand">
                  Chuyên mục
                </dt>
                <dd className="mt-1 text-slate">{post.category}</dd>
              </div>
            ) : null}
            <div>
              <dt className="font-semibold uppercase tracking-[0.16em] text-brand">
                Ngày đăng
              </dt>
              <dd className="mt-1 text-slate">
                {formatDate(post.publishedAt)}
              </dd>
            </div>
            {post.eventDate ? (
              <div>
                <dt className="font-semibold uppercase tracking-[0.16em] text-brand">
                  Ngày sự kiện
                </dt>
                <dd className="mt-1 text-slate">
                  {formatDate(post.eventDate)}
                </dd>
              </div>
            ) : null}
            {post.author ? (
              <div>
                <dt className="font-semibold uppercase tracking-[0.16em] text-brand">
                  Nguồn
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
