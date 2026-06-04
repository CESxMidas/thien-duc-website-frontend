import Image from "next/image";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { PageHeading } from "@/components/ui/page-heading";
import { projects } from "@/data/projects";

type ProjectDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <SiteShell>
      <PageHeading
        eyebrow="Chi tiết dự án"
        title={project.title}
        description={project.summary}
      />
      {project.image ? (
        <section className="mx-auto max-w-7xl px-6 pb-16">
          <div className="relative aspect-[16/9] max-h-[480px] overflow-hidden border border-black/10 bg-[#f2f2f2]">
            <Image
              src={project.gallery ? project.gallery[0] : project.image}
              alt={project.title}
              fill
              preload
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
            />
          </div>
        </section>
      ) : null}
    </SiteShell>
  );
}
