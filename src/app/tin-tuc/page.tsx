import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { PageHeading } from "@/components/ui/page-heading";
import { newsPosts } from "@/data/news";
import { formatDate } from "@/lib/format";
import { getSearchQuery, matchesSearchQuery } from "@/lib/search";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Tin tức | Thiên Đức",
  description:
    "Tin tức doanh nghiệp, cập nhật dự án và hoạt động mới từ Công ty Thiên Đức.",
};

type NewsPageProps = {
  searchParams: Promise<{
    q?: string | string[];
  }>;
};

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const { q } = await searchParams;
  const query = getSearchQuery(q);
  const sortedPosts = [...newsPosts].sort((first, second) =>
    second.publishedAt.localeCompare(first.publishedAt),
  );
  const posts = query
    ? sortedPosts.filter((post) =>
        matchesSearchQuery(
          query,
          post.title,
          post.summary,
          post.category,
          post.author,
          ...(post.content ?? []),
        ),
      )
    : sortedPosts;

  return (
    <SiteShell>
      <PageHeading
        eyebrow="Tin tức"
        title={query ? "Kết quả tìm kiếm" : "Tin tức và cập nhật"}
        description={
          query
            ? `Hiển thị bài viết phù hợp với từ khóa "${query}".`
            : "Thông tin doanh nghiệp, tiến độ dự án và các hoạt động mới từ Thiên Đức."
        }
      />
      <section className="reveal-section mx-auto max-w-7xl px-6 pb-16">
        {posts.length > 0 ? (
          <div className="stagger-list grid gap-5 md:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`${routes.news}/${post.slug}`}
                className="hover-card group overflow-hidden border border-black/10 bg-white hover:border-[#B06613]"
              >
                {post.image ? (
                  <div className="image-reveal relative aspect-video bg-[#f2f2f2]">
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
                  <p className="text-sm font-medium text-[#59646a]">
                    {[post.category, formatDate(post.publishedAt)]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <h2 className="mt-3 text-xl font-semibold leading-snug">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[#59646a]">
                    {post.summary}
                  </p>
                  <span className="link-arrow mt-5 text-sm font-semibold text-[#B06613]">
                    Đọc bài viết
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : query ? (
          <div className="border border-black/10 bg-white p-8">
            <h2 className="text-2xl font-semibold">Không tìm thấy bài viết</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#59646a]">
              Không có kết quả phù hợp với &ldquo;{query}&rdquo;. Thử từ khóa
              khác hoặc xem toàn bộ tin tức.
            </p>
            <Link
              href={routes.news}
              className="button-polish mt-6 inline-flex h-11 items-center bg-[#B06613] px-5 text-sm font-semibold text-white hover:bg-[#7f4b0d]"
            >
              Xem tất cả tin tức
            </Link>
          </div>
        ) : (
          <div className="border border-black/10 bg-white p-8">
            <h2 className="text-2xl font-semibold">Chưa có bài viết</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#59646a]">
              Nội dung tin tức sẽ được cập nhật khi có thông tin chính thức từ
              Thiên Đức.
            </p>
          </div>
        )}
      </section>
    </SiteShell>
  );
}
