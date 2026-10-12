import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { displayAddress, siteConfig } from "@/config/site";
import { footerSections } from "@/data/footer";
import type { BrandingSettings } from "@/lib/api/settings";
import { localizePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";

const phoneHref = `tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`;
const emailHref = `mailto:${siteConfig.email}`;
const mapsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(siteConfig.address)}`;

const footerLinkClassName =
  "inline-flex min-h-9 items-center text-[0.84rem] font-medium leading-5 text-ivory/82 transition hover:text-gold-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory sm:min-h-0";

const footerHeadingClassName =
  "text-[0.76rem] font-extrabold uppercase leading-none tracking-[0.12em] text-[#DCC59A]";

const contactNumberClassName =
  "block font-sans text-[0.91rem] font-extrabold leading-5 text-white [font-variant-numeric:lining-nums_tabular-nums]";

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
    <div className="lg:border-l lg:border-white/22 lg:pl-8">
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
    <footer className="mt-auto border-t border-white/20 bg-[#56614f] bg-[linear-gradient(90deg,rgba(86,97,79,0.93),rgba(67,79,63,0.88)),url('/images/banners/home/home-banner-hung-phu-aerial-01.jpg')] bg-cover bg-center text-ivory shadow-[0_-12px_28px_rgba(41,41,41,0.10)]">
      <div className="mx-auto grid max-w-site gap-x-8 gap-y-8 px-4 py-7 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.62fr_0.88fr_1.02fr_1.78fr] lg:items-start lg:py-8">
        <div className="flex items-center gap-5 sm:col-span-2 lg:col-span-1">
          <Link
            href={localizePath(routes.home, locale)}
            className="inline-flex size-20 shrink-0 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ivory"
            aria-label={dictionary.shared.homeAriaLabel}
          >
            <Image
              src={
                branding?.logoUrl ||
                "/images/brand/logo-thien-duc-footer-champagne.png"
              }
              alt={branding?.logoAlt || dictionary.shared.logoAlt}
              width={80}
              height={80}
              className="size-full object-contain drop-shadow-[0_1px_1px_rgba(0,0,0,0.18)]"
            />
          </Link>
          <div className="min-w-0">
            <p className="text-[1.02rem] font-extrabold uppercase leading-tight tracking-[0.02em] text-white">
              {dictionary.shared.companyName}
            </p>
            <p className="mt-2 max-w-sm text-[0.86rem] font-medium leading-6 text-ivory/78">
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

        <div className="sm:col-span-2 lg:col-span-1 lg:border-l lg:border-white/22 lg:pl-8">
          <h2 className={footerHeadingClassName}>
            {dictionary.footer.contact}
          </h2>

          <ul className="mt-3 space-y-2.5">
            <li>
              <a
                href={phoneHref}
                className={`${footerLinkClassName} flex items-center gap-3`}
              >
                <span className="grid size-5 shrink-0 place-items-center text-[#DCC59A]">
                  <Phone className="size-[1.05rem]" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="sr-only">{dictionary.footer.phone}: </span>
                  <span className={contactNumberClassName}>{siteConfig.phone}</span>
                </span>
              </a>
            </li>
            <li>
              <a
                href={emailHref}
                className={`${footerLinkClassName} flex items-center gap-3`}
              >
                <span className="grid size-5 shrink-0 place-items-center text-[#DCC59A]">
                  <Mail className="size-[1.05rem]" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="sr-only">{dictionary.footer.email}: </span>
                  <span className="wrap-break-word block text-[0.84rem] font-medium text-ivory/86">
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
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center text-[#DCC59A]">
                  <MapPin className="size-[1.05rem]" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="sr-only">{dictionary.footer.office}: </span>
                  <span className="block text-[0.84rem] font-medium leading-5 text-ivory/86">
                    {displayAddress(locale)}
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
