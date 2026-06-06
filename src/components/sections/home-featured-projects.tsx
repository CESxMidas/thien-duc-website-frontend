import Image from "next/image";
import Link from "next/link";
import { projects, projectStatusLabels } from "@/data/projects";
import { homeFeaturedProjectCopy } from "@/data/home";

export function HomeFeaturedProjects() {
  const featuredProjects = projects
    .filter(
      (project) =>
        project.slug === "khu-do-thi-hung-phu" ||
        project.status === "dang-thi-cong",
    )
    .slice(0, 3);
  const singleProject = featuredProjects.length === 1;

  if (featuredProjects.length === 0) {
    return null;
  }

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#B06613]">
              Dự án tiêu biểu
            </p>
            <h2 className="max-w-3xl text-3xl font-semibold leading-tight md:text-4xl">
              Không gian phát triển đô thị do Thiên Đức đồng hành triển khai
            </h2>
          </div>
          <Link
            href="/du-an"
            className="inline-flex h-11 items-center self-start border border-black/15 px-5 text-sm font-semibold transition hover:border-[#B06613] hover:text-[#B06613] md:self-auto"
          >
            Xem tất cả dự án
          </Link>
        </div>

        <div
          className={`mt-10 grid gap-5 ${singleProject ? "md:grid-cols-1" : "md:grid-cols-3"}`}
        >
          {featuredProjects.map((project) => {
            const display = homeFeaturedProjectCopy[
              project.slug as keyof typeof homeFeaturedProjectCopy
            ] ?? {
              title: project.title,
              location: project.location,
              summary: project.summary,
            };

            return (
              <Link
                key={project.slug}
                href={`/du-an/${project.slug}`}
                className={`group overflow-hidden border border-black/10 bg-[#f6f3ee] transition hover:border-[#B06613] ${
                  singleProject
                    ? "md:grid md:grid-cols-[1.1fr_0.9fr] md:items-stretch"
                    : ""
                }`}
              >
                <div
                  className={`relative overflow-hidden bg-[#f2f2f2] ${
                    singleProject
                      ? "aspect-[16/10] md:aspect-auto md:min-h-80"
                      : "aspect-[4/3]"
                  }`}
                >
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={display.title}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : null}
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#B06613]">
                    <span>{display.location}</span>
                    <span className="h-1 w-1 rounded-full bg-[#fdcd04]" />
                    <span>{projectStatusLabels[project.status]}</span>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold">
                    {display.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#59646a]">
                    {display.summary}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
