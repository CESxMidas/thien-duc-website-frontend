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
  "inline-flex min-h-11 items-center text-base font-medium leading-6 text-ivory/90 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-soft";

const footerHeadingClassName =
  "text-base font-semibold uppercase leading-6 tracking-[0.08em] text-gold-soft";

const contactNumberClassName =
  "block font-sans text-base font-semibold leading-6 text-gold-soft [font-variant-numeric:lining-nums_tabular-nums]";

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
    <div className="lg:border-l lg:border-gold-soft/20 lg:pl-8">
      <h2 className={footerHeadingClassName}>
        {dictionary.footerSectionTitles[section.title] ?? section.title}
      </h2>
      <ul className="mt-3 space-y-0.5">
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
  return (
    <footer className="site-footer relative mt-auto border-t border-gold/50 text-ivory">
      <div className="mx-auto grid max-w-site gap-x-8 gap-y-9 px-5 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.76fr_0.84fr_0.98fr_1.72fr] lg:items-start lg:py-12">
        <div className="flex min-w-0 flex-col items-start gap-5 sm:col-span-2 sm:flex-row sm:items-center lg:col-span-1 lg:flex-col lg:items-start">
          <Link
            href={localizePath(routes.home, locale)}
            className="inline-flex size-28 shrink-0 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-soft sm:size-32"
            aria-label={dictionary.shared.homeAriaLabel}
          >
            <Image
              src={
                branding?.logoUrl ||
                "/images/brand/logo-thien-duc-footer-champagne.png"
              }
              alt={branding?.logoAlt || dictionary.shared.logoAlt}
              width={96}
              height={96}
              className="size-full object-contain"
            />
          </Link>
          <div className="min-w-0">
            <p className="max-w-[38ch] text-pretty text-base font-semibold uppercase leading-7 tracking-[0.015em] text-gold-soft">
              {dictionary.shared.companyName}
            </p>
            <p className="mt-3 max-w-md text-pretty text-base leading-7 text-ivory/80">
              {dictionary.footerBrand.tagline}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:col-span-2 lg:contents">
          {footerSections.map((section) => (
            <FooterNavSection
              key={section.title}
              section={section}
              locale={locale}
              dictionary={dictionary}
            />
          ))}
        </div>

        <div className="sm:col-span-2 lg:col-span-1 lg:border-l lg:border-gold-soft/20 lg:pl-8">
          <h2 className={footerHeadingClassName}>
            {dictionary.footer.contact}
          </h2>

          <ul className="mt-3 space-y-3">
            <li className="flex items-center gap-3">
              <span className="grid size-5 shrink-0 place-items-center text-gold-soft">
                <Phone className="size-[1.05rem]" aria-hidden="true" />
              </span>
              <span className={`${contactNumberClassName} min-w-0`}>
                <a
                  href={phoneHref}
                  aria-label={`${dictionary.footer.phone}: ${siteConfig.phone}`}
                  className="transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-soft"
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
                <span className="grid size-5 shrink-0 place-items-center text-gold-soft">
                  <Mail className="size-[1.05rem]" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="sr-only">{dictionary.footer.email}: </span>
                  <span className="block text-base font-medium leading-6 text-ivory/90 [overflow-wrap:anywhere]">
                    {siteConfig.email}
                  </span>
                </span>
              </a>
            </li>
            <li className="flex items-center gap-3">
              <span className="grid size-5 shrink-0 place-items-center text-gold-soft">
                <FileText className="size-[1.05rem]" aria-hidden="true" />
              </span>
              <span className="text-base font-medium leading-6 text-ivory/90">
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
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center text-gold-soft">
                  <MapPin className="size-[1.05rem]" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="sr-only">{dictionary.footer.office}: </span>
                  <span className="block text-base font-medium leading-6 text-ivory/90">
                    <span className="block">{addressParts[locale].street},</span>
                    <span className="block">{addressParts[locale].locality}</span>
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
