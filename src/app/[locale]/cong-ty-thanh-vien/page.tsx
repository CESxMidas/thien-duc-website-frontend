import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, UserRound } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { PageHeading } from "@/components/ui/page-heading";
import { legalDisplayName, siteConfig } from "@/config/site";
import {
  legalRepresentative,
  localizeBilingual,
  memberCompanies,
} from "@/data/member-companies";
import { isLocale, localizePath, type Locale } from "@/lib/i18n/config";
import { getDictionary, interpolate } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo";

const copy: Record<Locale, { title: string; description: string }> = {
  vi: {
    title: "Công ty thành viên | Hệ sinh thái Thiên Đức",
    description:
      "Các đơn vị thành viên và pháp nhân liên quan trong hệ sinh thái Công ty TNHH Đầu tư Xây dựng Thương mại Thiên Đức.",
  },
  en: {
    title: "Member companies | The Thien Duc ecosystem",
    description:
      "Member companies and related legal entities within the Thien Duc ecosystem.",
  },
};

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/cong-ty-thanh-vien">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return buildPageMetadata({ ...copy[locale], path: routes.members, locale });
}

export default async function MemberCompaniesPage({
  params,
}: PageProps<"/[locale]/cong-ty-thanh-vien">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = await getDictionary(locale);
  const t = dictionary.memberCompanies;

  return (
    <SiteShell locale={locale}>
      <PageHeading
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.description}
      />

      <section className="reveal-section mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-14">
        <div className="hover-card grid gap-6 border border-black/10 bg-white p-6 md:grid-cols-[auto_1fr] md:items-center md:p-8">
          <div className="grid size-14 place-items-center rounded-full bg-gold-soft">
            <UserRound className="size-7 text-brand" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">
              {localizeBilingual(legalRepresentative.role, locale)}
            </p>
            <p className="mt-2 text-2xl font-semibold">
              {legalRepresentative.name}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate">
              {interpolate(t.repIntro, { legalName: legalDisplayName[locale] })}
            </p>
          </div>
        </div>
      </section>

      <section className="reveal-section mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-14">
        <div className="max-w-3xl">
          <p className="text-eyebrow mb-4 text-brand">
            {t.listEyebrow}
          </p>
          <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
            {t.listTitle}
          </h2>
        </div>

        <ul className="stagger-list mt-10 grid gap-4 md:grid-cols-3">
          {memberCompanies.map((company) => (
            <li
              key={company.name}
              className="hover-card flex flex-col border border-black/10 bg-white p-6 hover:border-brand/35"
            >
              <Building2
                className="icon-badge mb-5 size-8 text-brand"
                aria-hidden="true"
              />
              <h3 className="text-lg font-semibold leading-snug">
                {company.name}
              </h3>
              {company.note ? (
                <p className="mt-3 text-sm leading-6 text-slate">
                  {localizeBilingual(company.note, locale)}
                </p>
              ) : null}
            </li>
          ))}
        </ul>

        <p className="mt-8 max-w-3xl text-sm leading-6 text-slate">
          {t.detailNotePrefix}{" "}
          <a
            href={`mailto:${siteConfig.email}`}
            className="font-semibold text-brand hover:text-brand-dark"
          >
            {siteConfig.email}
          </a>
          {t.detailNoteSuffix}
        </p>
      </section>

      <section className="reveal-section mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-16">
        <div className="grid gap-6 bg-brand-soft p-6 text-white md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div>
            <p className="text-eyebrow mb-4 text-gold">
              {t.ctaEyebrow}
            </p>
            <h2 className="text-3xl font-semibold leading-tight">
              {t.ctaTitle}
            </h2>
          </div>
          <Link
            href={localizePath(routes.contact, locale)}
            className="button-polish inline-flex h-11 items-center justify-center self-start bg-gold px-5 text-sm font-semibold text-ink transition hover:bg-white md:self-center"
          >
            {dictionary.common.contactCta}
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
