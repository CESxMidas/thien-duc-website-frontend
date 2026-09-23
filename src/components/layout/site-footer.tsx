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
import { localizePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";

const phoneHref = `tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`;
const emailHref = `mailto:${siteConfig.email}`;
const mapsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(siteConfig.address)}`;

const footerLinkClassName =
  "inline-flex min-h-10 items-center text-sm text-ivory/78 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory sm:min-h-0";

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
      <h2 className="text-eyebrow text-ivory/55">
        {dictionary.footerSectionTitles[section.title] ?? section.title}
      </h2>
      <ul className="mt-3 space-y-0.5 sm:space-y-2.5">
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
  const currentYear = new Date().getFullYear();

  return (

    <footer className="mt-auto border-t border-charcoal/15 bg-olive text-ivory">
     
      <div className="mx-auto grid max-w-site gap-x-6 gap-y-10 px-4 py-12 sm:grid-cols-2 sm:px-6 sm:py-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.5fr]">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link
            href={localizePath(routes.home, locale)}
            className="inline-flex size-14 items-center justify-center bg-ivory p-2"
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
          <p className="mt-4 text-base font-semibold">
            {dictionary.shared.companyName}
          </p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-white/80">
            {dictionary.footerBrand.tagline}
          </p>
          <BrandMottoCompact
            motto={dictionary.footerBrand.motto}
            className="mt-5 max-w-sm"
          />
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
          <h2 className="text-eyebrow text-ivory/55">
            {dictionary.footer.contact}
          </h2>
         
          <ul className="mt-3 space-y-1 sm:space-y-2.5">
            <li>
              <a
                href={phoneHref}
                className={`${footerLinkClassName} flex items-start gap-2.5`}
              >
                <Phone
                  className="mt-0.5 size-4 shrink-0 text-earth"
                  aria-hidden="true"
                />
                <span className="min-w-0">
                  <span className="sr-only">{dictionary.footer.phone}: </span>
                  <span className="font-semibold text-white">
                    {siteConfig.phone}
                  </span>
                </span>
              </a>
            </li>
            <li>
              <a
                href={emailHref}
                className={`${footerLinkClassName} flex items-start gap-2.5`}
              >
                <Mail
                  className="mt-0.5 size-4 shrink-0 text-earth"
                  aria-hidden="true"
                />
                <span className="min-w-0">
                  <span className="sr-only">{dictionary.footer.email}: </span>
                  <span className="wrap-break-word font-semibold text-white">
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
                className={`${footerLinkClassName} flex items-start gap-2.5`}
              >
                <MapPin
                  className="mt-0.5 size-4 shrink-0 text-earth"
                  aria-hidden="true"
                />
                <span className="min-w-0">
                  <span className="sr-only">{dictionary.footer.office}: </span>
                  <span className="leading-6 text-white/90">
                    {displayAddress(locale)}
                  </span>
                </span>
              </a>
            </li>
          </ul>

         
          <Link
            href={localizePath(routes.contact, locale)}
            className="mt-5 inline-flex min-h-11 items-center gap-2 border border-ivory/55 px-4 text-sm font-semibold text-ivory transition hover:bg-ivory hover:text-olive focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {dictionary.common.contactCta}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

    
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-site flex-col gap-1.5 px-4 py-4 text-xs leading-5 text-white/75 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-8">
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
