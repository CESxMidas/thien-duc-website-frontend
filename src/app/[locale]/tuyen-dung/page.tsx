import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarClock,
  MapPin,
} from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { CareersHero } from "@/components/sections/careers-hero";
import { CareersCulture } from "@/components/sections/careers-culture";
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
  const hrPages = dictionary.hrPages;
  const applyHref = `mailto:${siteConfig.email}?subject=${encodeURIComponent(
    careers.applySubject,
  )}`;
  return (
    <SiteShell locale={locale}>
      <div className="careers-page">
      <CareersHero
        eyebrow={careers.eyebrow}
        title={careers.heroTitle}
        description={careers.heroDescription}
        imageAlt={careers.heroImageAlt}
        ctaLabel={careers.openEyebrow}
      />

      <CareersCulture careers={careers} hrPages={hrPages} locale={locale} />

      <section id="open-positions" className="careers-positions careers-content-container careers-section reveal-section page-container scroll-mt-36" aria-labelledby="careers-positions-title">
        <div className="max-w-3xl">
          <p className="text-eyebrow text-brand">{careers.openEyebrow}</p>
          <h2 id="careers-positions-title" className="careers-section-title mt-4">
            {careers.openTitle}
          </h2>
        </div>

        {openPositions.length > 0 ? (
          <div className="stagger-list mt-8 grid gap-4">
            {openPositions.map((position) => (
              <article
                key={position.title}
                className="border-t border-gold/40 bg-ivory p-6 md:p-8"
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
                  className="button-polish mt-7 inline-flex min-h-11 items-center bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
                >
                  {careers.applyCta}
                </a>
              </article>
            ))}
          </div>
        ) : (
          <div className="careers-empty mt-8">
            <BriefcaseBusiness className="size-7 text-earth" aria-hidden="true" />
            <div className="careers-empty-copy">
              <h3 className="text-2xl font-semibold text-charcoal">
                {careers.emptyTitle}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate">
                {careers.emptyBody}
              </p>
            </div>
            <div className="careers-empty-actions">
              <a
                href={applyHref}
                className="inline-flex min-h-11 items-center gap-2 rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth"
              >
                {careers.emptyCta}
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
              <Link
                href={localizePath(routes.contact, locale)}
                className="inline-flex min-h-11 items-center rounded-md border border-earth/35 px-5 py-3 text-sm font-semibold text-earth transition hover:bg-earth hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth"
              >
                {dictionary.common.contactCta}
              </Link>
            </div>
          </div>
        )}
      </section>

      <section className="careers-process careers-section reveal-section bg-deep-olive text-ivory" aria-labelledby="careers-process-title">
        <div className="careers-content-container page-container">
          <p className="text-eyebrow text-gold-soft">
            {careers.processEyebrow}
          </p>
          <h2 id="careers-process-title" className="careers-section-title mt-4">
            {careers.processTitle}
          </h2>

          <ol className="careers-process-list mt-8 grid gap-7 lg:grid-cols-3">
            {careers.process.map((step) => (
              <li key={step.step} className="border-t border-gold-soft/45 pt-5">
                <p className="font-display text-3xl text-gold-soft">
                  {step.step}
                </p>
                <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-ivory/80">
                  {interpolate(step.description, { email: siteConfig.email })}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      </div>
    </SiteShell>
  );
}
