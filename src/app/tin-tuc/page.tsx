import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { PageHeading } from "@/components/ui/page-heading";
import { newsPosts } from "@/data/news";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Tin tức | Thiên Đức",
  description:
    "Tin tức doanh nghiệp, cập nhật dự án và hoạt động mới từ Công ty Thiên Đức.",
};

export default function NewsPage() {
  const posts = [...newsPosts].sort((first, second) =>
    second.publishedAt.localeCompare(first.publishedAt),
  );

  return (
    <SiteShell>
      <PageHeading
        eyebrow="Tin tức"
        title="Tin tức và cập nhật"
        description="Thông tin doanh nghiệp, tiến độ dự án và các hoạt động mới từ Thiên Đức."
      />
      <section className="mx-auto max-w-7xl px-6 pb-16">
        {posts.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/tin-tuc/${post.slug}`}
                className="group overflow-hidden border border-black/10 bg-white transition hover:border-[#9b7a34]"
              >
                {post.image ? (
                  <div className="relative aspect-video bg-[#f2f2f2]">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
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
                </div>
              </Link>
            ))}
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
