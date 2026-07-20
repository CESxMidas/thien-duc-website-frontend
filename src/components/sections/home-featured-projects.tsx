import Image from "next/image";
import Link from "next/link";
import { getProjects } from "@/lib/api/projects";
import { defaultLocale, localizePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import { homeFeaturedProjectCopy } from "@/data/home";

export async function HomeFeaturedProjects({ locale }: { locale: Locale }) {
  const [projects, dictionary] = await Promise.all([
    getProjects(locale),
    getDictionary(locale),
  ]);
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
    <section className="reveal-section bg-cream">
      <div className="mx-auto max-w-site px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-eyebrow mb-4 text-brand">
              {dictionary.home.featuredEyebrow}
            </p>
            <h2 className="max-w-3xl text-3xl font-semibold leading-[1.2] md:text-[2.5rem]">
              {dictionary.home.featuredTitle}
            </h2>
          </div>
          <Link
            href={localizePath(routes.projects, locale)}
            className="button-polish inline-flex h-11 items-center self-start border border-black/15 px-5 text-sm font-semibold transition hover:border-brand hover:text-brand md:self-auto"
          >
            {dictionary.common.viewAllProjects}
          </Link>
        </div>

        <div
          className={`stagger-list mt-10 grid gap-5 ${singleProject ? "md:grid-cols-1" : "md:grid-cols-3"}`}
        >
          {featuredProjects.map((project) => {
            const apiCopy = {
              title: project.title,
              location: project.location,
              summary: project.summary,
            };
            // Bản rút gọn viết tay chỉ có tiếng Việt — locale khác dùng thẳng
            // nội dung CMS thay vì hiển thị tiếng Việt trên trang tiếng Anh.
            const display =
              locale === defaultLocale
                ? (homeFeaturedProjectCopy[
                    project.slug as keyof typeof homeFeaturedProjectCopy
                  ] ?? apiCopy)
                : apiCopy;

            return (
              <Link
                key={project.slug}
                href={localizePath(`${routes.projects}/${project.slug}`, locale)}
                className={`hover-card group overflow-hidden border border-brand/10 bg-white shadow-[0_10px_28px_rgba(25,25,25,0.05)] hover:border-brand ${
                  singleProject
                    ? "md:grid md:grid-cols-[1.1fr_0.9fr] md:items-stretch"
                    : ""
                }`}
              >
                <div
                  className={`image-reveal relative overflow-hidden bg-surface ${
                    singleProject
                      ? "aspect-16/10 md:aspect-auto md:min-h-80"
                      : "aspect-4/3"
                  }`}
                >
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={display.title}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                    <span>{display.location}</span>
                    <span className="h-1 w-1 rounded-full bg-gold" />
                    <span>{dictionary.projectStatus[project.status]}</span>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold">
                    {display.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate">
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
