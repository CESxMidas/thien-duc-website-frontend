import Image from "next/image";
import Link from "next/link";
import { getNewsPosts } from "@/lib/api/news";
import { formatDate } from "@/lib/format";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";

export async function HomeLatestNews({ locale }: { locale: Locale }) {
  const [newsPosts, dictionary] = await Promise.all([
    getNewsPosts(locale),
    getDictionary(locale),
  ]);
  const latestNews = [...newsPosts]
    .sort((first, second) => second.publishedAt.localeCompare(first.publishedAt))
    .slice(0, 3);

  if (latestNews.length === 0) {
    return null;
  }

  return (
    <section className="reveal-section bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-brand">
              {dictionary.home.latestEyebrow}
            </p>
            <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
              {dictionary.home.latestTitle}
            </h2>
          </div>
          <Link
            href={localizePath(routes.news, locale)}
            className="button-polish inline-flex h-11 items-center self-start border border-black/15 px-5 text-sm font-semibold transition hover:border-brand hover:text-brand md:self-auto"
          >
            {dictionary.home.allPosts}
          </Link>
        </div>

        <div className="stagger-list mt-10 grid gap-5 md:grid-cols-3">
          {latestNews.map((post) => (
            <Link
              key={post.slug}
              href={localizePath(`${routes.news}/${post.slug}`, locale)}
              className="hover-card group border border-black/10 bg-surface-warm hover:border-brand"
            >
              {post.image ? (
                <div className="image-reveal relative aspect-video overflow-hidden bg-surface">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : null}
              <div className="p-5">
                <p className="text-sm text-slate">
                  {formatDate(post.publishedAt)}
                </p>
                <h3 className="mt-3 text-xl font-semibold">{post.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate">{post.summary}</p>
                <span className="link-arrow mt-5 text-sm font-semibold text-brand">
                  {dictionary.home.postDetail}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
