import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { PageHeading } from "@/components/ui/page-heading";
import { newsPosts } from "@/data/news";

export default function NewsPage() {
  return (
    <SiteShell>
      <PageHeading
        eyebrow="Tin tuc"
        title="Tin tuc va cap nhat"
        description="Khu vuc dang tai tin tuc doanh nghiep, tien do du an va thong tin tuyen dung."
      />
      <section className="mx-auto grid max-w-7xl gap-5 px-6 pb-16 md:grid-cols-3">
        {newsPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/tin-tuc/${post.slug}`}
            className="border border-black/10 bg-white p-5 transition hover:border-[#9b7a34]"
          >
            <p className="text-sm text-[#59646a]">{post.publishedAt}</p>
            <h2 className="mt-3 text-xl font-semibold">{post.title}</h2>
            <p className="mt-3 text-sm leading-6 text-[#59646a]">{post.summary}</p>
          </Link>
        ))}
      </section>
    </SiteShell>
  );
}
