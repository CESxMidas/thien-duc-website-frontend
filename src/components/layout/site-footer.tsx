import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import {
  displayAddress,
  legalDisplayName,
  legalInfo,
  siteConfig,
  taxAuthorityName,
} from "@/config/site";
import { BrandMottoCompact } from "@/components/ui/brand-motto";
import { footerSections } from "@/data/footer";
import type { BrandingSettings } from "@/lib/api/settings";
import { getVietnamCurrentYear } from "@/lib/format";
import { localizePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";

const phoneHref = `tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`;
const emailHref = `mailto:${siteConfig.email}`;
const mapsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(siteConfig.address)}`;

const footerLinkClassName =
  "inline-flex min-h-10 items-center text-[0.93rem] font-semibold leading-6 text-ivory/82 transition hover:text-gold-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory sm:min-h-0";

const footerHeadingClassName =
  "relative pb-3 text-[0.82rem] font-extrabold uppercase leading-none tracking-[0.16em] text-gold-soft after:absolute after:bottom-0 after:left-0 after:h-px after:w-9 after:bg-gold-soft/70";

type SiteFooterProps = {
  locale: Locale;
  dictionary: Dictionary;
  branding?: BrandingSettings;
};

/** Một nhóm link điều hướng trong footer (tiêu đề + danh sách). */
function FooterNavSection({
  section,
  locale,
  dictionary,
}: {
  section: (typeof footerSections)[number];
  locale: Locale;
  dictionary: Dictionary;
}) {
  return (
    <div>
      <h2 className={footerHeadingClassName}>
        {dictionary.footerSectionTitles[section.title] ?? section.title}
      </h2>
      <ul className="mt-4 space-y-1 sm:space-y-2">
        {section.links.map((link) => (
          <li key={link.href}>
            <Link
              href={localizePath(link.href, locale)}
              className={footerLinkClassName}
            >
              {dictionary.footerLabels[link.href] ?? link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter({ locale, dictionary, branding }: SiteFooterProps) {
  const currentYear = getVietnamCurrentYear();

  return (
    <footer className="mt-auto border-t border-charcoal/15 bg-olive text-ivory shadow-[0_-18px_48px_rgba(41,41,41,0.12)]">
      <div className="mx-auto grid max-w-site gap-x-8 gap-y-10 px-4 py-12 sm:grid-cols-2 sm:px-6 sm:py-14 lg:grid-cols-[1.55fr_0.95fr_1fr_1.6fr] lg:items-start">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link
            href={localizePath(routes.home, locale)}
            className="inline-flex size-16 items-center justify-center bg-ivory p-2.5 shadow-[0_10px_26px_rgba(0,0,0,0.18)]"
            aria-label={dictionary.shared.homeAriaLabel}
          >
            <Image
              src={branding?.logoUrl || "/images/brand/logo-thien-duc.png"}
              alt={branding?.logoAlt || dictionary.shared.logoAlt}
              width={56}
              height={56}
              className="size-full object-contain"
            />
          </Link>
          <p className="mt-5 text-xl font-extrabold uppercase leading-tight tracking-[0.035em] text-white">
            {dictionary.shared.companyName}
          </p>
          <p className="mt-3 max-w-sm text-[0.95rem] font-medium leading-7 text-ivory/76">
            {dictionary.footerBrand.tagline}
          </p>
          <div className="mt-6 border-l-2 border-gold-soft/80 pl-4">
            <BrandMottoCompact
              motto={dictionary.footerBrand.motto}
              className="max-w-sm text-[1.05rem] leading-snug text-white sm:text-[1.12rem]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:col-span-2 sm:grid-cols-3 lg:contents">
          {footerSections.map((section) => (
            <FooterNavSection
              key={section.title}
              section={section}
              locale={locale}
              dictionary={dictionary}
            />
          ))}
        </div>

        <div className="sm:col-span-2 lg:col-span-1">
          <h2 className={footerHeadingClassName}>
            {dictionary.footer.contact}
          </h2>

          <ul className="mt-5 space-y-4">
            <li>
              <a
                href={phoneHref}
                className={`${footerLinkClassName} flex items-start gap-3`}
              >
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center border border-gold-soft/35 bg-white/8 text-gold-soft">
                  <Phone className="size-4" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="sr-only">{dictionary.footer.phone}: </span>
                  <span className="block text-[0.72rem] font-bold uppercase tracking-[0.12em] text-ivory/55">
                    {dictionary.footer.phone}
                  </span>
                  <span className="mt-0.5 block font-extrabold text-white">
                    {siteConfig.phone}
                  </span>
                </span>
              </a>
            </li>
            <li>
              <a
                href={emailHref}
                className={`${footerLinkClassName} flex items-start gap-3`}
              >
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center border border-gold-soft/35 bg-white/8 text-gold-soft">
                  <Mail className="size-4" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="sr-only">{dictionary.footer.email}: </span>
                  <span className="block text-[0.72rem] font-bold uppercase tracking-[0.12em] text-ivory/55">
                    Email
                  </span>
                  <span className="wrap-break-word mt-0.5 block font-extrabold text-white">
                    {siteConfig.email}
                  </span>
                </span>
              </a>
            </li>
            <li>
              <a
                href={mapsHref}
                target="_blank"
                rel="noreferrer"
                className={`${footerLinkClassName} flex items-start gap-3`}
              >
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center border border-gold-soft/35 bg-white/8 text-gold-soft">
                  <MapPin className="size-4" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="sr-only">{dictionary.footer.office}: </span>
                  <span className="block text-[0.72rem] font-bold uppercase tracking-[0.12em] text-ivory/55">
                    {dictionary.footer.office}
                  </span>
                  <span className="mt-0.5 block font-semibold leading-6 text-ivory/88">
                    {displayAddress(locale)}
                  </span>
                </span>
              </a>
            </li>
          </ul>

          <Link
            href={localizePath(routes.contact, locale)}
            className="mt-6 inline-flex min-h-11 items-center gap-2 border border-gold-soft/75 bg-white/8 px-4 text-sm font-extrabold uppercase tracking-[0.08em] text-gold-soft transition hover:bg-gold-soft hover:text-olive focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {dictionary.common.contactCta}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-site flex-col gap-1.5 px-4 py-4 text-xs font-medium leading-5 text-ivory/78 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-8">
          <p>
            <span className="font-semibold uppercase tracking-[0.1em] text-white/85">
              {legalDisplayName[locale]}
            </span>
            <span className="mx-1.5" aria-hidden="true">
              ·
            </span>
            {dictionary.footer.taxCode}: {legalInfo.taxCode}{" "}
            <span className="mx-1.5" aria-hidden="true">
              ·
            </span>{" "}
            {taxAuthorityName[locale]}
          </p>
          <p className="shrink-0">
            © {currentYear} {dictionary.shared.companyName}.{" "}
            {dictionary.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
