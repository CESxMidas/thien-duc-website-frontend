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
  "inline-flex min-h-9 items-center text-[0.84rem] font-semibold leading-5 text-ivory/92 [text-shadow:0_1px_1px_rgba(23,31,22,0.16)] transition hover:text-gold-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory sm:min-h-0";

const footerHeadingClassName =
  "text-[0.76rem] font-extrabold uppercase leading-none tracking-[0.12em] text-[#E8D6B3] [text-shadow:0_1px_1px_rgba(23,31,22,0.2)]";

const contactNumberClassName =
  "block font-sans text-[0.91rem] font-extrabold leading-5 text-white [font-variant-numeric:lining-nums_tabular-nums]";

type SiteFooterProps = {
  locale: Locale;
  dictionary: Dictionary;
  branding?: BrandingSettings;
};

function getCompanyNameLines(name: string, locale: Locale) {
  if (locale === "vi") {
    const [beforeTrade, tradeName] = name.split(" THƯƠNG MẠI ");
    const [companyType, investmentName] = beforeTrade.split(" ĐẦU TƯ ");
    if (tradeName && investmentName) {
      return {
        compact: [
          companyType,
          `ĐẦU TƯ ${investmentName}`,
          `THƯƠNG MẠI ${tradeName}`,
        ],
        wide: [beforeTrade, `THƯƠNG MẠI ${tradeName}`],
      };
    }
  } else {
    const [beforeTrading, tradingName] = name.split(" TRADING ");
    const [brandName, investmentName] = beforeTrading.split(" INVESTMENT ");
    if (tradingName && investmentName) {
      return {
        compact: [
          brandName,
          `INVESTMENT ${investmentName}`,
          `TRADING ${tradingName}`,
        ],
        wide: [beforeTrading, `TRADING ${tradingName}`],
      };
    }
  }

  return { compact: [name], wide: [name] };
}

function CompanyName({ name, locale }: { name: string; locale: Locale }) {
  const lines = getCompanyNameLines(name, locale);
  const renderLines = (lines: string[]) =>
    lines.map((line, index) => (
      <span key={`${line}-${index}`} className="block whitespace-nowrap">
        {line}
        {index < lines.length - 1 ? " " : null}
      </span>
    ));

  return (
    <>
      <span className="sm:hidden">{renderLines(lines.compact)}</span>
      <span className="hidden sm:block">{renderLines(lines.wide)}</span>
    </>
  );
}

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
    <footer className="relative mt-auto border-t border-gold/35 bg-espresso bg-[linear-gradient(105deg,rgba(34,20,14,0.97),rgba(74,48,35,0.95)_52%,rgba(45,27,19,0.97)),url('/images/banners/home/home-banner-hung-phu-aerial-01.jpg')] bg-cover bg-center text-ivory shadow-[0_-18px_38px_rgba(45,27,19,0.16)] before:pointer-events-none before:absolute before:inset-x-0 before:-top-5 before:h-5 before:bg-[linear-gradient(180deg,rgba(240,225,210,0),rgba(74,48,35,0.18))]">
      <div className="mx-auto grid max-w-site gap-x-8 gap-y-8 px-4 py-7 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.76fr_0.84fr_0.98fr_1.72fr] lg:items-start lg:py-8">
        <div className="flex items-center gap-5 sm:col-span-2 lg:col-span-1">
          <Link
            href={localizePath(routes.home, locale)}
            className="inline-flex size-[7rem] shrink-0 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ivory"
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
              style={{
                filter:
                  "brightness(0) saturate(100%) invert(87%) sepia(21%) saturate(714%) hue-rotate(350deg) brightness(102%) contrast(94%) drop-shadow(0 4px 12px rgba(9, 15, 9, 0.72))",
              }}
            />
          </Link>
          <div className="min-w-0">
            <p className="text-[0.78rem] font-extrabold uppercase leading-[1.42] tracking-normal text-white [text-shadow:0_1px_2px_rgba(20,28,20,0.34)] sm:text-[0.9rem]">
              <CompanyName
                name={dictionary.shared.companyName}
                locale={locale}
              />
            </p>
            <p className="mt-2 max-w-sm text-pretty text-[0.86rem] font-medium leading-6 text-ivory/90 [text-shadow:0_1px_1px_rgba(20,28,20,0.18)]">
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
            <li className="flex items-center gap-3">
              <span className="grid size-5 shrink-0 place-items-center text-[#DCC59A]">
                <Phone className="size-[1.05rem]" aria-hidden="true" />
              </span>
              <span className={`${contactNumberClassName} min-w-0`}>
                <a
                  href={phoneHref}
                  aria-label={`${dictionary.footer.phone}: ${siteConfig.phone}`}
                  className="transition hover:text-gold-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory"
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
                <span className="grid size-5 shrink-0 place-items-center text-[#DCC59A]">
                  <Mail className="size-[1.05rem]" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="sr-only">{dictionary.footer.email}: </span>
                  <span className="wrap-break-word block text-[0.84rem] font-semibold text-ivory/92">
                    {siteConfig.email}
                  </span>
                </span>
              </a>
            </li>
            <li className="flex items-center gap-3">
              <span className="grid size-5 shrink-0 place-items-center text-[#DCC59A]">
                <FileText className="size-[1.05rem]" aria-hidden="true" />
              </span>
              <span className="text-[0.84rem] font-semibold leading-5 text-ivory/92">
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
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center text-[#DCC59A]">
                  <MapPin className="size-[1.05rem]" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="sr-only">{dictionary.footer.office}: </span>
                  <span className="block text-[0.84rem] font-semibold leading-5 text-ivory/92">
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
