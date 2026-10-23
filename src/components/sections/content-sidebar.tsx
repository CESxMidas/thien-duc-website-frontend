import Image from "next/image";
import Link from "next/link";
import { Building2, Newspaper } from "lucide-react";
import type { NewsPost, Project } from "@/types/content";
import { formatDate } from "@/lib/format";
import { localizePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";

type ContentSidebarProps = {
  news: NewsPost[];
  projects: Project[];
  locale: Locale;
  labels: Dictionary["contentSidebar"];
  common: Dictionary["common"];
  statusLabels: Dictionary["projectStatus"];
  tone?: "espresso" | "gold";
};

export function ContentSidebar({
  news,
  projects,
  locale,
  labels,
  common,
  statusLabels,
  tone = "espresso",
}: ContentSidebarProps) {
  return (

    <aside className="content-sidebar flex flex-col gap-4">
      <Widget
        title={labels.newsTitle}
        icon={<Newspaper className="size-4" aria-hidden="true" />}
        tone={tone}
      >
        {news.length > 0 ? (
          <ul className="grid">
            {news.map((post) => (
              <li
                key={post.slug}
                className="border-b border-brand/10 last:border-b-0"
              >
                <Link
                  href={localizePath(`${routes.news}/${post.slug}`, locale)}
                  className="group flex gap-3 p-3 transition-colors hover:bg-cream"
                >
                 
                  <span className="relative size-16 shrink-0 overflow-hidden bg-surface">
                    {post.image ? (
                      <Image
                        src={post.image}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <span className="grid h-full place-items-center">
                        <Newspaper
                          className="size-5 text-brand/30"
                          aria-hidden="true"
                        />
                      </span>
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-3 text-sm font-semibold leading-snug text-ink group-hover:text-brand">
                      {post.title}
                    </span>
                    <span className="mt-1.5 block text-xs text-slate">
                      {formatDate(post.publishedAt, locale)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-4 text-sm leading-6 text-slate">{labels.newsEmpty}</p>
        )}

        <WidgetFooter
          href={localizePath(routes.news, locale)}
          label={common.viewAllNews}
        />
      </Widget>

      <Widget
        title={labels.projectsTitle}
        icon={<Building2 className="size-4" aria-hidden="true" />}
        tone={tone}
      >
        {projects.length > 0 ? (
          <ul className="grid gap-3 p-3">
            {projects.map((project) => (
              <li key={project.slug}>
                <Link
                  href={localizePath(
                    `${routes.projects}/${project.slug}`,
                    locale,
                  )}
                  className="group grid gap-2"
                >
                 
                  <span className="relative block aspect-16/10 overflow-hidden bg-surface">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 19rem, 100vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <span className="grid h-full place-items-center">
                        <Building2
                          className="size-6 text-brand/30"
                          aria-hidden="true"
                        />
                      </span>
                    )}
                    <span className="absolute left-0 top-0 bg-ink/70 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                      {statusLabels[project.status]}
                    </span>
                  </span>
                  <span className="text-sm font-semibold leading-snug text-ink group-hover:text-brand">
                    {project.title}
                  </span>
                  {project.location ? (
                    <span className="text-xs text-slate">
                      {project.location}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-4 text-sm leading-6 text-slate">
            {labels.projectsEmpty}
          </p>
        )}

        <WidgetFooter
          href={localizePath(routes.projects, locale)}
          label={common.viewAllProjects}
        />
      </Widget>
    </aside>
  );
}

function Widget({
  title,
  icon,
  children,
  tone,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  tone: "espresso" | "gold";
}) {
  return (
    <section className="content-panel overflow-hidden border border-brand/20 bg-white shadow-[0_12px_30px_rgba(74,48,35,0.075)]">
   
      <h2
        className={`content-panel-heading text-eyebrow flex items-center gap-2 px-4 py-3 ${
          tone === "gold"
            ? "content-panel-heading-gold"
            : "content-panel-heading-espresso"
        }`}
      >
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

function WidgetFooter({ href, label }: { href: string; label: string }) {
  return (
    <div className="border-t border-brand/10 bg-cream/60">
      <Link
        href={href}
        className="link-arrow block px-4 py-3 text-xs font-bold uppercase tracking-widest text-brand hover:text-brand-dark"
      >
        {label}
      </Link>
    </div>
  );
}
