import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeading } from "@/components/ui/page-heading";
import { newsPosts } from "@/data/news";
import { formatDate } from "@/lib/format";
import { routes } from "@/lib/routes";

type NewsDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return newsPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = newsPosts.find((item) => item.slug === slug);

  if (!post) {
    return {
      title: "Tin tức không tồn tại",
    };
  }

  return {
    title: `${post.title} | Tin tức Thiên Đức`,
    description: post.summary,
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const post = newsPosts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  const content = post.content?.length ? post.content : [post.summary];

  return (
    <SiteShell>
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: routes.home },
          { label: "Tin tức", href: routes.news },
          { label: post.title },
        ]}
      />
      <PageHeading
        eyebrow="Chi tiết tin tức"
        title={post.title}
        description={post.summary}
      />

      {post.image ? (
        <section className="reveal-section mx-auto max-w-7xl px-6 pb-10">
          <div className="image-reveal relative aspect-[16/9] max-h-[560px] overflow-hidden border border-black/10 bg-surface">
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

      <section className="reveal-section mx-auto grid max-w-7xl gap-6 px-6 pb-16 lg:grid-cols-[1fr_320px]">
        <article className="hover-card border border-black/10 bg-white p-6 md:p-8">
          <div className="flex flex-wrap gap-3 text-sm font-medium text-slate">
            {post.category ? <span>{post.category}</span> : null}
            <span>{formatDate(post.publishedAt)}</span>
          </div>

          <div className="mt-8 grid gap-5 text-base leading-8 text-[#384247]">
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
            href="/tin-tuc"
            className="button-polish mt-7 inline-flex h-11 w-full items-center justify-center bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Xem tất cả tin tức
          </Link>
        </aside>
      </section>
    </SiteShell>
  );
}
