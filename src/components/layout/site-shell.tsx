import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/breadcrumb";
import { ZaloContactLink } from "@/components/ui/zalo-contact-link";
import { zaloDisplayValue, zaloHref } from "@/config/site";
import {
  getBrandingSettings,
  getCompanyContact,
  type BrandingSettings,
} from "@/lib/api/settings";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type SiteShellProps = {
  locale: Locale;
  children: ReactNode;
  heroBeforeHeader?: ReactNode;
  isHomePage?: boolean;
  breadcrumbs?: BreadcrumbItem[];
};

export async function SiteShell({
  locale,
  children,
  heroBeforeHeader,
  isHomePage = false,
  breadcrumbs,
}: SiteShellProps) {
  const [dictionary, companyContact, branding] = await Promise.all([
    getDictionary(locale),
    getCompanyContact(),
    getBrandingSettings().catch((): BrandingSettings => ({
      logoUrl: null,
      logoAlt: null,
      faviconUrl: null,
    })),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_12%_0%,rgba(189,143,77,0.13),transparent_30rem),linear-gradient(180deg,#fbf7f2_0%,#f7eee5_52%,#f0e1d2_100%)] text-ink-soft">
      <a href="#main-content" className="skip-link">
        {dictionary.common.skipToContent}
      </a>
      <SiteHeader
        locale={locale}
        dictionary={dictionary}
        branding={branding}
        companyPhone={companyContact.phone}
      />
      {heroBeforeHeader}
      <main
        id="main-content"
        className="flex-1 bg-[linear-gradient(180deg,rgba(255,255,255,0.28)_0%,rgba(247,238,229,0.18)_55%,rgba(232,213,194,0.3)_100%)]"
      >
        {breadcrumbs?.length ? <Breadcrumb items={breadcrumbs} /> : null}
        {isHomePage ? (
          children
        ) : (
          <div className="site-page-content">{children}</div>
        )}
      </main>
      <ZaloContactLink
        variant="floating"
        href={zaloHref()}
        ariaLabel={dictionary.zalo.ariaLabel}
        label={dictionary.zalo.label}
        displayValue={zaloDisplayValue()}
      />
      <SiteFooter
        locale={locale}
        dictionary={dictionary}
        branding={branding}
        companyContact={companyContact}
      />
    </div>
  );
}
