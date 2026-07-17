import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { legalInfo, siteConfig } from "@/config/site";
import { footerSections } from "@/data/footer";
import { localizePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";

const phoneHref = `tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`;
const emailHref = `mailto:${siteConfig.email}`;
const mapsHref = `https://maps.google.com/?q=${encodeURIComponent(siteConfig.address)}`;

const footerLinkClassName =
  "inline-flex min-h-11 items-center text-sm text-white/80 transition hover:text-gold sm:min-h-0";

type SiteFooterProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function SiteFooter({ locale, dictionary }: SiteFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-brand/25 bg-brand-dark text-white">
      <div className="bg-brand-soft">
        {/* Gom Liên hệ thành một cột trong hàng trên (bỏ dải full-width thưa
            thớt cũ) để lấp đầy hàng và tránh khoảng trống ngang dư thừa. */}
        <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-9 px-4 py-10 sm:grid-cols-2 sm:px-6 sm:py-12 lg:grid-cols-[1.5fr_repeat(3,minmax(0,0.85fr))_1.25fr] lg:gap-x-10">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href={localizePath(routes.home, locale)}
              className="inline-flex size-16 items-center justify-center rounded-lg border border-white/20 bg-white p-2 shadow-sm"
              aria-label={dictionary.shared.homeAriaLabel}
            >
              <Image
                src="/images/brand/logo-thien-duc.png"
                alt={dictionary.shared.logoAlt}
                width={56}
                height={56}
                className="size-full object-contain"
              />
            </Link>
            <p className="mt-5 text-lg font-semibold">{siteConfig.name}</p>
            <p className="mt-3 max-w-xs text-sm leading-6 text-white/80">
              {dictionary.footerBrand.tagline}
            </p>
            <p className="mt-4 border-l-4 border-gold pl-4 text-sm font-medium italic text-gold-soft">
              {dictionary.footerBrand.motto}
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h2 className="text-eyebrow text-gold">
                {dictionary.footerSectionTitles[section.title] ?? section.title}
              </h2>
              <ul className="mt-3 space-y-1 sm:mt-5 sm:space-y-3">
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
          ))}

          <div className="sm:col-span-2 lg:col-span-1">
            <h2 className="text-eyebrow text-gold">{dictionary.footer.contact}</h2>
            <ul className="mt-4 space-y-2 sm:mt-5 sm:space-y-4">
              <li>
                <a href={phoneHref} className={`${footerLinkClassName} flex items-start gap-3`}>
                  <Phone className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                  <span>
                    <span className="block text-xs uppercase tracking-[0.16em] text-white/55">
                      {dictionary.footer.phone}
                    </span>
                    <span className="mt-1 block font-semibold text-white">
                      {siteConfig.phone}
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a href={emailHref} className={`${footerLinkClassName} flex items-start gap-3`}>
                  <Mail className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block text-xs uppercase tracking-[0.16em] text-white/55">
                      {dictionary.footer.email}
                    </span>
                    <span className="mt-1 block wrap-break-word font-semibold text-white">
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
                  <MapPin className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                  <span>
                    <span className="block text-xs uppercase tracking-[0.16em] text-white/55">
                      {dictionary.footer.office}
                    </span>
                    <span className="mt-1 block font-semibold leading-6 text-white">
                      {siteConfig.address}
                    </span>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-brand/20">
        <div className="mx-auto max-w-7xl px-4 py-5 text-xs leading-6 text-white/65 sm:px-6">
          <p className="font-semibold uppercase tracking-[0.12em] text-white/70">
            {legalInfo.legalName}
          </p>
          <p className="mt-1">
            {dictionary.footer.taxCode}: {legalInfo.taxCode} · {legalInfo.authority}
          </p>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-sm text-white/70 sm:px-6 md:flex-row md:items-center md:justify-between">
        <p>
          © {currentYear} {siteConfig.name}. {dictionary.footer.rights}
        </p>
        <Link
          href={localizePath(routes.contact, locale)}
          className="inline-flex min-h-11 items-center font-semibold text-gold transition hover:text-white md:min-h-0"
        >
          {dictionary.common.contactCta} →
        </Link>
      </div>
    </footer>
  );
}
