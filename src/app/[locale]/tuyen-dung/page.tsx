import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarClock,
  ChevronDown,
  FileSearch,
  FileText,
  MapPin,
  MessageSquareText,
} from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { CareersHero } from "@/components/sections/careers-hero";
import { CareersCulture } from "@/components/sections/careers-culture";
import { CareersApplyButton } from "@/components/sections/careers-apply-button";
import { getCompanyContact } from "@/lib/api/settings";
import { getOpenPositions } from "@/lib/api/careers";
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

const processIcons = [FileText, FileSearch, MessageSquareText];

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

  const [dictionary, companyContact] = await Promise.all([
    getDictionary(locale),
    getCompanyContact(),
  ]);
  const careers = dictionary.careers;
  const hrPages = dictionary.hrPages;
  await connection();
  const openPositions = await getOpenPositions(locale);
  const applyHref = `mailto:${companyContact.email}?subject=${encodeURIComponent(
    careers.applySubject,
  )}`;
  return (
    <SiteShell
      locale={locale}
      breadcrumbs={[
        {
          label: dictionary.breadcrumb.home,
          href: locale === "en" ? "/en" : "/",
        },
        { label: dictionary.navLabels["/tuyen-dung"] ?? "Tuyển dụng" },
      ]}
    >
      <div className="careers-page">
        <CareersHero
          eyebrow={careers.eyebrow}
          title={careers.heroTitle}
          description={careers.heroDescription}
          imageAlt={careers.heroImageAlt}
          positionsCtaLabel={careers.positionsCta}
          aboutCtaLabel={careers.aboutCta}
          aboutHref={localizePath(routes.about, locale)}
        />

        <section
          id="open-positions"
          className="careers-positions careers-content-container careers-section reveal-section page-container scroll-mt-36"
          aria-labelledby="careers-positions-title"
        >
          <div className="careers-section-heading">
            <p className="text-eyebrow text-brand">{careers.openEyebrow}</p>
            <h2
              id="careers-positions-title"
              className="careers-section-title mt-2"
            >
              {careers.openTitle}
            </h2>
          </div>

          {openPositions.length > 0 ? (
            <div className="stagger-list careers-position-list mt-6 grid gap-4">
              {openPositions.map((position) => (
                <article
                  key={position.id}
                  className="careers-position-card border border-gold/35 bg-white p-5"
                >
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                    <span className="inline-flex items-center gap-1.5">
                      <BriefcaseBusiness
                        className="size-4"
                        aria-hidden="true"
                      />
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

                  <h3 className="mt-3 text-xl font-semibold leading-tight">
                    {position.title}
                  </h3>
                  {position.summary ? (
                    <p className="content-paragraph mt-2 max-w-3xl text-sm leading-6 text-slate">
                      {position.summary}
                    </p>
                  ) : null}

                  <details className="group mt-4">
                    <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-sm text-sm font-semibold text-brand hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand [&::-webkit-details-marker]:hidden">
                      <span className="group-open:hidden">
                        {careers.showDetailsLabel}
                      </span>
                      <span className="hidden group-open:inline">
                        {careers.hideDetailsLabel}
                      </span>
                      <span className="sr-only">: {position.title}</span>
                      <ChevronDown
                        className="size-4 group-open:rotate-180"
                        aria-hidden="true"
                      />
                    </summary>
                    <div className="mt-5 grid gap-5">
                      <div>
                        <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink">
                          {careers.responsibilitiesLabel}
                        </h4>
                        <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate">
                          {position.responsibilities.map((item) => (
                            <li
                              key={item}
                              className="border-l-2 border-gold pl-3"
                            >
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
                            <li
                              key={item}
                              className="border-l-2 border-gold pl-3"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {position.benefits.length > 0 ? (
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink">
                            {careers.benefitsLabel}
                          </h4>
                          <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate">
                            {position.benefits.map((item) => (
                              <li
                                key={item}
                                className="border-l-2 border-gold pl-3"
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </details>

                  <CareersApplyButton position={position} locale={locale} label={careers.applyCta} />
                </article>
              ))}
            </div>
          ) : (
            <div className="careers-empty mt-6">
              <BriefcaseBusiness
                className="size-7 text-earth"
                aria-hidden="true"
              />
              <div className="careers-empty-copy">
                <h3 className="text-2xl font-semibold text-charcoal">
                  {careers.emptyTitle}
                </h3>
                <p className="content-paragraph mt-3 max-w-2xl text-sm leading-6 text-slate">
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

        <section
          className="careers-process careers-section reveal-section"
          aria-labelledby="careers-process-title"
        >
          <div className="careers-content-container page-container">
            <p className="text-eyebrow text-brand">{careers.processEyebrow}</p>
            <h2
              id="careers-process-title"
              className="careers-section-title mt-2"
            >
              {careers.processTitle}
            </h2>

            <ol className="careers-process-list mt-6 grid gap-5">
              {careers.process.map((step, index) => {
                const Icon = processIcons[index] ?? FileText;

                return (
                  <li key={step.step} className="careers-process-step">
                    <span className="careers-process-icon" aria-hidden="true">
                      <Icon className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="careers-process-number">{step.step}</p>
                      <h3 className="mt-1 text-base font-semibold text-charcoal">
                        {step.title}
                      </h3>
                      <p className="content-paragraph mt-1 text-sm leading-6 text-slate">
                        {interpolate(step.description, {
                          email: companyContact.email,
                        })}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        <CareersCulture careers={careers} hrPages={hrPages} locale={locale} />
      </div>
    </SiteShell>
  );
}
