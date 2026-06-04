import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { PageHeading } from "@/components/ui/page-heading";
import { projects, projectStatusLabels } from "@/data/projects";
import { routes } from "@/lib/routes";

type ProjectDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getProject(slug: string) {
  return projects.find((item) => item.slug === slug);
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return {
      title: "Dự án không tồn tại | Thiên Đức",
    };
  }

  return {
    title: `${project.title} | Dự án Thiên Đức`,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  const gallery = project.gallery ?? [];

  return (
    <SiteShell>
      <PageHeading
        eyebrow="Chi tiết dự án"
        title={project.title}
        description={project.summary}
      />

      {project.image ? (
        <section className="mx-auto max-w-7xl px-6 pb-12">
          <div className="relative aspect-[16/9] max-h-[520px] overflow-hidden border border-black/10 bg-[#f2f2f2]">
            <Image
              src={project.image}
              alt={project.title}
              fill
              preload
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
            />
          </div>
        </section>
      ) : null}

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-14 lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="border border-black/10 bg-white p-6">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-[#B06613]">
            Thông tin nhanh
          </p>
          <dl className="grid gap-5 text-sm">
            <div>
              <dt className="text-[#59646a]">Vị trí</dt>
              <dd className="mt-1 font-semibold text-[#191919]">
                {project.location ?? "Đang cập nhật"}
              </dd>
            </div>
            <div>
              <dt className="text-[#59646a]">Trạng thái</dt>
              <dd className="mt-1 font-semibold text-[#191919]">
                {projectStatusLabels[project.status]}
              </dd>
            </div>
            <div>
              <dt className="text-[#59646a]">Loại hình</dt>
              <dd className="mt-1 font-semibold text-[#191919]">
                {project.category ?? "Đang cập nhật"}
              </dd>
            </div>
          </dl>
        </aside>

        <article className="border border-black/10 bg-white p-6 md:p-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#B06613]">
            Tổng quan dự án
          </p>
          <h2 className="text-3xl font-semibold leading-tight">
            Định hướng phát triển và thông tin tổng quan
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#59646a]">
            {project.description ??
              "Thông tin tổng quan của dự án đang được cập nhật theo tài liệu được duyệt."}
          </p>
        </article>
      </section>

      {gallery.length > 0 ? (
        <section className="mx-auto max-w-7xl px-6 pb-14">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-[#B06613]">
                Hình ảnh dự án
              </p>
              <h2 className="text-3xl font-semibold leading-tight">
                Một số hình ảnh trong thư viện hiện có
              </h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {gallery.map((image, index) => (
              <div
                key={image}
                className="relative aspect-[4/3] overflow-hidden border border-black/10 bg-[#f2f2f2]"
              >
                <Image
                  src={image}
                  alt={`${project.title} - hình ảnh ${index + 1}`}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#B06613]">
              Điểm nổi bật
            </p>
            <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
              Các thông tin được trình bày ở mức an toàn
            </h2>
            <p className="mt-5 text-sm leading-6 text-[#59646a]">
              Những nội dung dưới đây dùng cách diễn đạt thận trọng, tránh công
              bố số liệu pháp lý, quy mô hoặc tiến độ khi chưa có tài liệu được
              duyệt.
            </p>
          </div>

          <div className="grid gap-4">
            {(project.highlights ?? []).map((highlight) => (
              <div key={highlight} className="border border-black/10 bg-white p-5">
                <div className="mb-4 h-1 w-12 bg-[#fdcd04]" />
                <p className="text-sm leading-6 text-[#59646a]">{highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-6 bg-[#191919] p-6 text-white md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#fdcd04]">
              Quan tâm dự án này?
            </p>
            <h2 className="text-3xl font-semibold leading-tight">
              Liên hệ Thiên Đức để được hỗ trợ thông tin
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75">
              Đội ngũ Thiên Đức sẵn sàng tiếp nhận nhu cầu tư vấn, hợp tác hoặc
              trao đổi thêm về dự án.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={routes.contact}
              className="inline-flex h-11 items-center justify-center bg-[#fdcd04] px-5 text-sm font-semibold text-[#191919] transition hover:bg-white"
            >
              Liên hệ tư vấn
            </Link>
            <Link
              href={routes.projects}
              className="inline-flex h-11 items-center justify-center border border-white/20 px-5 text-sm font-semibold text-white transition hover:border-[#fdcd04] hover:text-[#fdcd04]"
            >
              Xem dự án khác
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
