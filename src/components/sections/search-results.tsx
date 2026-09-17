import Image from "next/image";
import Link from "next/link";
import type { SearchResults as SearchResultsData } from "@/lib/api/search";
import { formatDate } from "@/lib/format";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { interpolate, type Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";

type SearchResultsProps = {
  results: SearchResultsData;
  locale: Locale;
  labels: Dictionary["search"];
  statusLabels: Dictionary["projectStatus"];
};

export function SearchResults({
  results,
  locale,
  labels,
  statusLabels,
}: SearchResultsProps) {
  const groups = [
    {
      key: "projects" as const,
      title: labels.groupProjects,
      count: results.projects.length,
    },
    {
      key: "news" as const,
      title: labels.groupNews,
      count: results.news.length,
    },
  ].filter((group) => group.count > 0);

  return (
    <div className="grid gap-10">
      {groups.map((group) => (
        <section key={group.key} aria-labelledby={`search-group-${group.key}`}>
          <div className="mb-5 flex flex-wrap items-baseline gap-3 border-b border-black/10 pb-3">
            <h2
              id={`search-group-${group.key}`}
              className="text-2xl font-semibold"
            >
              {group.title}
            </h2>
            <p className="text-sm font-semibold text-slate">
              {interpolate(
                group.count === 1 ? labels.countOne : labels.countMany,
                { count: String(group.count) },
              )}
            </p>
          </div>

          <div className="stagger-list grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {group.key === "projects"
              ? results.projects.map((project) => (
                  <Link
                    key={project.slug}
                    href={localizePath(
                      `${routes.projects}/${project.slug}`,
                      locale,
                    )}
                    className="hover-card group flex flex-col overflow-hidden border border-black/10 bg-white hover:border-brand"
                  >
                    {project.image ? (
                      <div className="image-reveal relative aspect-video bg-surface">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    ) : null}
                    <div className="flex flex-1 flex-col p-5">
                   
                      <p className="text-sm font-medium text-slate">
                        {[statusLabels[project.status], project.location]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                      <h3 className="mt-3 text-xl font-semibold leading-snug">
                        {project.title}
                      </h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate">
                        {project.summary}
                      </p>
                      <span className="link-arrow mt-5 text-sm font-semibold text-brand">
                        {labels.groupProjects}
                      </span>
                    </div>
                  </Link>
                ))
              : results.news.map((post) => (
                  <Link
                    key={post.slug}
                    href={localizePath(`${routes.news}/${post.slug}`, locale)}
                    className="hover-card group flex flex-col overflow-hidden border border-black/10 bg-white hover:border-brand"
                  >
                    {post.image ? (
                      <div className="image-reveal relative aspect-video bg-surface">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    ) : null}
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-sm font-medium text-slate">
                        {[
                          post.category?.name,
                          formatDate(post.publishedAt, locale),
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                      <h3 className="mt-3 text-xl font-semibold leading-snug">
                        {post.title}
                      </h3>
                  
                      {post.summary ? (
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate">
                          {post.summary}
                        </p>
                      ) : null}
                      <span className="link-arrow mt-5 text-sm font-semibold text-brand">
                        {labels.groupNews}
                      </span>
                    </div>
                  </Link>
                ))}
          </div>
        </section>
      ))}
    </div>
  );
}
