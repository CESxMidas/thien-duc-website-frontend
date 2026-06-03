import Image from "next/image";
import Link from "next/link";
import { newsPosts } from "@/data/news";

function isProductionNews(post: (typeof newsPosts)[number]) {
  const text = `${post.title} ${post.summary}`.toLowerCase();
  return !text.includes("cap nhat") && !text.includes("se duoc cap nhat");
}

export function HomeLatestNews() {
  const latestNews = newsPosts.filter(isProductionNews).slice(0, 3);

  if (latestNews.length === 0) {
    return null;
  }

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#B06613]">
              Tin mới
            </p>
            <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
              Tin tức và hoạt động từ Thiên Đức
            </h2>
          </div>
          <Link
            href="/tin-tuc"
            className="inline-flex h-11 items-center self-start border border-black/15 px-5 text-sm font-semibold transition hover:border-[#B06613] hover:text-[#B06613] md:self-auto"
          >
            Xem tất cả
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {latestNews.map((post) => (
            <Link
              key={post.slug}
              href={`/tin-tuc/${post.slug}`}
              className="group border border-black/10 bg-[#f6f3ee] transition hover:border-[#B06613]"
            >
              {post.image ? (
                <div className="relative aspect-video overflow-hidden bg-[#191919]">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
              ) : null}
              <div className="p-5">
                <p className="text-sm text-[#59646a]">{post.publishedAt}</p>
                <h3 className="mt-3 text-xl font-semibold">{post.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#59646a]">{post.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
