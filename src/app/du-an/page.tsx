import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { PageHeading } from "@/components/ui/page-heading";
import { projects } from "@/data/projects";

export default function ProjectsPage() {
  return (
    <SiteShell>
      <PageHeading
        eyebrow="Du an"
        title="Danh sach du an"
        description="Khu vuc tong hop cac du an da ban giao, dang thi cong va chuan bi khoi cong."
      />
      <section className="mx-auto grid max-w-7xl gap-5 px-6 pb-16 md:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/du-an/${project.slug}`}
            className="border border-black/10 bg-white p-5 transition hover:border-[#9b7a34]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9b7a34]">
              {project.location}
            </p>
            <h2 className="mt-3 text-xl font-semibold">{project.title}</h2>
            <p className="mt-3 text-sm leading-6 text-[#59646a]">{project.summary}</p>
          </Link>
        ))}
      </section>
    </SiteShell>
  );
}
