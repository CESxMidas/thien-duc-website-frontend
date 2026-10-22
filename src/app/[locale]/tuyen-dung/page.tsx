import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  MapPin,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { CareersHero } from "@/components/sections/careers-hero";
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

const valueIcons = [UsersRound, Building2, BookOpen];

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
  const peopleSections = [
    { ...hrPages.training, icon: BookOpen },
    { ...hrPages.hrPolicy, icon: ShieldCheck },
  ];

  return (
    <SiteShell locale={locale}>
      <CareersHero
        eyebrow={careers.eyebrow}
        title={careers.heroTitle}
        description={careers.heroDescription}
        imageAlt={careers.heroImageAlt}
      />

      <section className="reveal-section page-container py-8 sm:py-12">
        <div className="max-w-3xl">
          <p className="text-eyebrow text-brand">{careers.whyEyebrow}</p>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-charcoal sm:text-4xl">
            {careers.whyTitle}
          </h2>
        </div>

        <div className="stagger-list mt-9 grid gap-7 md:grid-cols-3">
          {careers.values.map((value, index) => {
            const Icon = valueIcons[index] ?? UsersRound;

            return (
              <article
                key={value.title}
                className="group border-t-2 border-gold/55 pt-5 transition-colors hover:border-earth"
              >
                <div className="flex items-center justify-between gap-4">
                  <Icon
                    className="size-7 text-earth transition-transform duration-300 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                  <span className="font-display text-3xl text-earth/45" aria-hidden="true">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-charcoal">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate">
                  {value.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="reveal-section page-container py-8 sm:py-12">
        <div className="grid overflow-hidden rounded-lg border border-gold/25 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col justify-between bg-[#493224] p-7 text-white sm:p-10">
            <div>
              <p className="text-eyebrow text-gold-soft">
                {careers.peopleEyebrow}
              </p>
              <h2 className="mt-4 max-w-[13ch] font-display text-3xl font-semibold leading-tight sm:text-4xl">
                {careers.peopleTitle}
              </h2>
            </div>
            <p className="mt-8 max-w-md text-sm leading-6 text-ivory/82">
              {careers.peopleDescription}
            </p>
          </div>

          <div className="stagger-list grid gap-px bg-gold/20 sm:grid-cols-2 lg:grid-cols-1">
            {peopleSections.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="group bg-[linear-gradient(145deg,#f4e4d4_0%,#ead3bc_100%)] p-7 sm:p-9"
                >
                  <Icon
                    className="size-7 text-earth transition-transform duration-300 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                  <h3 className="mt-5 text-xl font-semibold text-charcoal">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="reveal-section page-container py-8 sm:py-12">
        <div className="max-w-3xl">
          <p className="text-eyebrow text-brand">{careers.openEyebrow}</p>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-charcoal sm:text-4xl">
            {careers.openTitle}
          </h2>
        </div>

        {openPositions.length > 0 ? (
          <div className="stagger-list mt-8 grid gap-4">
            {openPositions.map((position) => (
              <article
                key={position.title}
                className="hover-card border border-gold/25 bg-[#f5e6d7] p-6 hover:border-earth md:p-8"
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
          <div className="mt-8 rounded-lg border border-gold/30 bg-[linear-gradient(135deg,#f3dfca_0%,#ead0b4_100%)] p-6 sm:p-8">
            <BriefcaseBusiness className="size-7 text-earth" aria-hidden="true" />
            <h3 className="mt-5 text-2xl font-semibold text-charcoal">
              {careers.emptyTitle}
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate">
              {careers.emptyBody}
            </p>
            <a
              href={applyHref}
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth"
            >
              {careers.emptyCta}
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        )}
      </section>

      <section className="reveal-section page-container py-8 sm:py-12">
        <div className="rounded-lg bg-[#29352b] p-6 text-white sm:p-10">
          <p className="text-eyebrow text-gold-soft">
            {careers.processEyebrow}
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl">
            {careers.processTitle}
          </h2>

          <ol className="stagger-list mt-9 grid gap-7 md:grid-cols-3">
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

      <section className="reveal-section page-container pb-10 pt-6 sm:pb-14 sm:pt-8">
        <div className="flex flex-col gap-6 border-y border-earth/25 py-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="text-eyebrow text-brand">{careers.ctaEyebrow}</p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-charcoal sm:text-4xl">
              {careers.ctaTitle}
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={applyHref}
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-gold px-5 py-3 text-sm font-semibold text-charcoal transition hover:bg-gold-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth"
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
      </section>
    </SiteShell>
  );
}
