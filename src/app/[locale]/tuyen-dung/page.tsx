import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BriefcaseBusiness, CalendarClock, MapPin } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { PageHeading } from "@/components/ui/page-heading";
import { siteConfig } from "@/config/site";
import { openPositions } from "@/data/careers";
import { formatDate } from "@/lib/format";
import { isLocale, localizePath, type Locale } from "@/lib/i18n/config";
import { getDictionary, interpolate } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo";

const metaCopy: Record<Locale, { title: string; description: string }> = {
  vi: {
    title: "Tuyển dụng | Công ty Thiên Đức",
    description:
      "Cơ hội nghề nghiệp, môi trường làm việc và quy trình ứng tuyển tại Công ty Thiên Đức.",
  },
  en: {
    title: "Careers | Thien Duc",
    description:
      "Career opportunities, workplace values, and application process at Thien Duc.",
  },
};

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/tuyen-dung">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return buildPageMetadata({
    ...metaCopy[locale],
    path: routes.careers,
    locale,
  });
}

export default async function CareersPage({
  params,
}: PageProps<"/[locale]/tuyen-dung">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dictionary = await getDictionary(locale);
  const careers = dictionary.careers;
  const applyHref = `mailto:${siteConfig.email}?subject=${encodeURIComponent(
    careers.applySubject,
  )}`;

  return (
    <SiteShell locale={locale}>
      <PageHeading
        eyebrow={careers.eyebrow}
        title={careers.heroTitle}
        description={careers.heroDescription}
      />

      <section className="reveal-section page-container py-5 sm:py-8">
        <div className="stagger-list grid gap-4 md:grid-cols-3">
          {careers.values.map((value) => (
            <article
              key={value.title}
              className="hover-card border border-black/10 bg-white p-5 hover:border-brand/35"
            >
              <h2 className="text-xl font-semibold">{value.title}</h2>
              <p className="text-justified mt-4 text-sm leading-6 text-slate">
                {value.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="reveal-section page-container py-5 sm:py-8">
        <div className="max-w-3xl">
          <p className="text-eyebrow mb-4 text-brand">
            {careers.openEyebrow}
          </p>
          <h2 className="text-2xl font-semibold leading-tight md:text-3xl">
            {careers.openTitle}
          </h2>
        </div>

        {openPositions.length > 0 ? (
          <div className="stagger-list mt-8 grid gap-4">
            {openPositions.map((position) => (
              <article
                key={position.title}
                className="hover-card border border-black/10 bg-white p-6 hover:border-brand md:p-8"
              >
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                  <span className="inline-flex items-center gap-1.5">
                    <BriefcaseBusiness className="size-4" aria-hidden="true" />
                    {position.department}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-4" aria-hidden="true" />
                    {position.location}
                  </span>
                  <span>{position.type}</span>
                  {position.deadline ? (
                    <span className="inline-flex items-center gap-1.5 text-slate">
                      <CalendarClock className="size-4" aria-hidden="true" />
                      {careers.deadlineLabel}{" "}
                      {formatDate(position.deadline, locale)}
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-3 text-2xl font-semibold leading-tight">
                  {position.title}
                </h3>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink">
                      {careers.responsibilitiesLabel}
                    </h4>
                    <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate">
                      {position.responsibilities.map((item) => (
                        <li key={item} className="border-l-2 border-gold pl-3">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink">
                      {careers.requirementsLabel}
                    </h4>
                    <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate">
                      {position.requirements.map((item) => (
                        <li key={item} className="border-l-2 border-gold pl-3">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <a
                  href={applyHref}
                  className="button-polish mt-7 inline-flex h-11 items-center bg-brand px-5 text-sm font-semibold text-white transition hover:bg-brand-dark"
                >
                  {careers.applyCta}
                </a>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 border border-black/10 bg-white p-6">
            <h3 className="text-2xl font-semibold">{careers.emptyTitle}</h3>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate">
              {careers.emptyBody}
            </p>
            <a
              href={applyHref}
              className="button-polish mt-6 inline-flex h-11 items-center bg-brand px-5 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              {careers.emptyCta}
            </a>
          </div>
        )}
      </section>

      <section className="page-container pb-5 sm:pb-8">
        <div className="reveal-sides-pair grid gap-6 bg-brand p-5 text-white md:grid-cols-[1fr_auto] md:items-center md:p-8">
          <div className="reveal-from-left">
            <p className="text-eyebrow mb-4 text-gold-soft">
              {careers.processEyebrow}
            </p>
            <h2 className="text-3xl font-semibold leading-tight">
              {careers.processTitle}
            </h2>
          </div>
          <Link
            href={localizePath(routes.contact, locale)}
            className="button-polish reveal-from-right inline-flex h-11 items-center justify-center bg-gold px-5 text-sm font-semibold text-ink transition hover:bg-white"
          >
            {dictionary.common.contactCta}
          </Link>
        </div>

        <ol className="stagger-list mt-6 grid gap-4 md:grid-cols-3">
          {careers.process.map((step) => (
            <li
              key={step.step}
              className="hover-card border border-black/10 bg-white p-6"
            >
              <p className="text-sm font-semibold text-brand">{step.step}</p>
              <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
              <p className="text-justified mt-3 text-sm leading-6 text-slate">
                {interpolate(step.description, { email: siteConfig.email })}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </SiteShell>
  );
}
