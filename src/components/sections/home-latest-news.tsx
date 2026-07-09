import Image from "next/image";
import Link from "next/link";
import { getNewsPosts } from "@/lib/api/news";
import { formatDate } from "@/lib/format";

export async function HomeLatestNews() {
  const newsPosts = await getNewsPosts();
  const latestNews = [...newsPosts]
    .sort((first, second) => second.publishedAt.localeCompare(first.publishedAt))
    .slice(0, 3);

  if (latestNews.length === 0) {
    return null;
  }

  return (
    <section className="reveal-section bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-brand">
              Tin mới
            </p>
            <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
              Tin tức và hoạt động từ Thiên Đức
            </h2>
          </div>
          <Link
            href="/tin-tuc"
            className="button-polish inline-flex h-11 items-center self-start border border-black/15 px-5 text-sm font-semibold transition hover:border-brand hover:text-brand md:self-auto"
          >
            Tất cả bài viết
          </Link>
        </div>

        <div className="stagger-list mt-10 grid gap-5 md:grid-cols-3">
          {latestNews.map((post) => (
            <Link
              key={post.slug}
              href={`/tin-tuc/${post.slug}`}
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
                  Chi tiết bài viết
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
