import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { PageHeading } from "@/components/ui/page-heading";
import { projects } from "@/data/projects";

export default function ProjectsPage() {
  return (
    <SiteShell>
      <PageHeading
        eyebrow="Dự án"
        title="Danh sách dự án"
        description="Tổng hợp các dự án đã và đang triển khai của Thien Duc Group trên toàn quốc."
      />
      <section className="mx-auto grid max-w-7xl gap-5 px-6 pb-16 md:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/du-an/${project.slug}`}
            className="overflow-hidden border border-black/10 bg-white transition hover:border-[#9b7a34]"
          >
            {project.image ? (
              <div className="relative aspect-[3/2] bg-[#f2f2f2]">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
            ) : null}
            <div className="p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9b7a34]">
              {project.location}
            </p>
            <h2 className="mt-3 text-xl font-semibold">{project.title}</h2>
            <p className="mt-3 text-sm leading-6 text-[#59646a]">{project.summary}</p>
            </div>
          </Link>
        ))}
      </section>
    </SiteShell>
  );
}
