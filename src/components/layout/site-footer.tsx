import Image from "next/image";
import Link from "next/link";
import { FileText, Mail, MapPin, Phone } from "lucide-react";
import { addressParts, legalInfo, siteConfig } from "@/config/site";
import { footerSections } from "@/data/footer";
import type { BrandingSettings } from "@/lib/api/settings";
import { localizePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";

const phoneHref = `tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`;
const emailHref = `mailto:${siteConfig.email}`;
const mapsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(siteConfig.address)}`;

const footerLinkClassName =
  "inline-flex min-h-11 items-center text-base font-medium leading-6 text-footer-ink transition hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

const footerHeadingClassName =
  "font-display text-2xl font-bold leading-8 tracking-[0.01em] text-brand-dark";

const contactNumberClassName =
  "block font-sans text-lg font-semibold leading-7 text-brand-dark [font-variant-numeric:lining-nums_tabular-nums]";

type SiteFooterProps = {
  locale: Locale;
  dictionary: Dictionary;
  branding?: BrandingSettings;
};

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
    <div className="min-w-0 xl:border-l xl:border-divider xl:pl-6">
      <h2 className={footerHeadingClassName}>
        {dictionary.footerSectionTitles[section.title] ?? section.title}
      </h2>
      <ul className="mt-3 space-y-0.5">
        {section.links.map((link) => (
          <li key={link.href}>
            <Link
              href={localizePath(link.href, locale)}
              className={`${footerLinkClassName} xl:whitespace-nowrap`}
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
  return (
    <footer className="site-footer relative mt-auto border-t border-divider text-footer-ink">
      <div className="grid w-full gap-x-6 gap-y-9 px-5 py-10 sm:grid-cols-2 sm:px-8 lg:px-14 lg:py-12 xl:grid-cols-[minmax(16rem,1.3fr)_max-content_max-content_minmax(19rem,1.2fr)] xl:items-start xl:gap-x-8 xl:px-20">
        <div className="flex min-w-0 flex-col items-start gap-5 sm:col-span-2 sm:flex-row sm:items-center xl:col-span-1 xl:flex-col xl:items-start">
          <Link
            href={localizePath(routes.home, locale)}
            className="inline-flex size-28 shrink-0 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand sm:size-32"
            aria-label={dictionary.shared.homeAriaLabel}
          >
            <Image
              src={
                branding?.logoUrl ||
                "/images/brand/logo-thien-duc-header-transparent.png"
              }
              alt={branding?.logoAlt || dictionary.shared.logoAlt}
              width={96}
              height={96}
              className="size-full object-contain"
            />
          </Link>
          <div className="min-w-0">
            <p className="text-pretty text-lg font-semibold uppercase leading-8 tracking-[0.015em] text-brand-dark">
              {dictionary.shared.companyName}
            </p>
            <p className="mt-3 text-pretty text-base font-normal leading-7 text-footer-muted">
              {dictionary.footerBrand.tagline}
            </p>
          </div>
        </div>

        <div className="grid gap-x-6 gap-y-8 min-[430px]:grid-cols-2 sm:col-span-2 xl:contents">
          {footerSections.map((section) => (
            <FooterNavSection
              key={section.title}
              section={section}
              locale={locale}
              dictionary={dictionary}
            />
          ))}
        </div>

        <div className="min-w-0 sm:col-span-2 xl:col-span-1 xl:border-l xl:border-divider xl:pl-6">
          <h2 className={footerHeadingClassName}>
            {dictionary.footer.contact}
          </h2>

          <ul className="mt-3 space-y-3">
            <li className="flex items-center gap-3">
              <span className="grid size-5 shrink-0 place-items-center text-brand-dark">
                <Phone className="size-[1.05rem]" aria-hidden="true" />
              </span>
              <span className={`${contactNumberClassName} min-w-0`}>
                <a
                  href={phoneHref}
                  aria-label={`${dictionary.footer.phone}: ${siteConfig.phone}`}
                  className="transition hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  {siteConfig.phone}
                </a>
              </span>
            </li>
            <li>
              <a
                href={emailHref}
                className={`${footerLinkClassName} flex items-center gap-3`}
              >
                <span className="grid size-5 shrink-0 place-items-center text-brand-dark">
                  <Mail className="size-[1.05rem]" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="sr-only">{dictionary.footer.email}: </span>
                  <span className="block text-base font-medium leading-6 text-footer-ink [overflow-wrap:anywhere]">
                    {siteConfig.email}
                  </span>
                </span>
              </a>
            </li>
            <li className="flex items-center gap-3">
              <span className="grid size-5 shrink-0 place-items-center text-brand-dark">
                <FileText className="size-[1.05rem]" aria-hidden="true" />
              </span>
              <span className="text-base font-medium leading-6 text-footer-ink">
                {dictionary.footer.taxCode}: {legalInfo.taxCode}
              </span>
            </li>
            <li>
              <a
                href={mapsHref}
                target="_blank"
                rel="noreferrer"
                className={`${footerLinkClassName} flex items-start gap-3`}
              >
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center text-brand-dark">
                  <MapPin className="size-[1.05rem]" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="sr-only">{dictionary.footer.office}: </span>
                  <span className="block text-base font-medium leading-6 text-footer-ink">
                    {addressParts[locale].street}, {addressParts[locale].locality}
                  </span>
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
