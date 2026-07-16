import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, UserRound } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { PageHeading } from "@/components/ui/page-heading";
import { legalInfo, siteConfig } from "@/config/site";
import { legalRepresentative, memberCompanies } from "@/data/member-companies";
import { isLocale, localizePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
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

  return (
    <SiteShell locale={locale}>
      <PageHeading
        eyebrow="Công ty thành viên"
        title="Hệ thống công ty thành viên"
        description="Các pháp nhân trong hệ sinh thái Thiên Đức, cùng người đại diện pháp luật."
      />

      <section className="reveal-section mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-14">
        <div className="hover-card grid gap-6 border border-black/10 bg-white p-6 md:grid-cols-[auto_1fr] md:items-center md:p-8">
          <div className="grid size-14 place-items-center rounded-full bg-gold-soft">
            <UserRound className="size-7 text-brand" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">
              {legalRepresentative.role}
            </p>
            <p className="mt-2 text-2xl font-semibold">
              {legalRepresentative.name}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate">
              Đại diện {legalInfo.legalName} và các đơn vị thành viên dưới đây.
            </p>
          </div>
        </div>
      </section>

      <section className="reveal-section mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-14">
        <div className="max-w-3xl">
          <p className="text-eyebrow mb-4 text-brand">
            Đơn vị thành viên
          </p>
          <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
            Các doanh nghiệp, đơn vị trong hệ sinh thái
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
                  {company.note}
                </p>
              ) : null}
            </li>
          ))}
        </ul>

        <p className="mt-8 max-w-3xl text-sm leading-6 text-slate">
          Thông tin chi tiết của từng đơn vị (mã số thuế, địa chỉ, ngành nghề)
          liên hệ trực tiếp với Thiên Đức qua{" "}
          <a
            href={`mailto:${siteConfig.email}`}
            className="font-semibold text-brand hover:text-brand-dark"
          >
            {siteConfig.email}
          </a>
          .
        </p>
      </section>

      <section className="reveal-section mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-16">
        <div className="grid gap-6 bg-brand-soft p-6 text-white md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div>
            <p className="text-eyebrow mb-4 text-gold">
              Hợp tác cùng Thiên Đức
            </p>
            <h2 className="text-3xl font-semibold leading-tight">
              Trao đổi về cơ hội hợp tác trong hệ sinh thái
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
