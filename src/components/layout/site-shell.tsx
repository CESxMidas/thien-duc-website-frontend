import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ZaloContactLink } from "@/components/ui/zalo-contact-link";
import { zaloDisplayValue, zaloHref } from "@/config/site";
import { getBrandingSettings, type BrandingSettings } from "@/lib/api/settings";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type SiteShellProps = {
  locale: Locale;
  children: ReactNode;
  heroBeforeHeader?: ReactNode;
};

export async function SiteShell({
  locale,
  children,
  heroBeforeHeader,
}: SiteShellProps) {
  const [dictionary, branding] = await Promise.all([
    getDictionary(locale),
    getBrandingSettings().catch((): BrandingSettings => ({
      logoUrl: null,
      logoAlt: null,
      faviconUrl: null,
    })),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-surface-warm text-ink-soft">
      <a href="#main-content" className="skip-link">
        {dictionary.common.skipToContent}
      </a>
      <SiteHeader locale={locale} dictionary={dictionary} branding={branding} />
      {heroBeforeHeader}
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <ZaloContactLink
        variant="floating"
        href={zaloHref()}
        ariaLabel={dictionary.zalo.ariaLabel}
        label={dictionary.zalo.label}
        displayValue={zaloDisplayValue()}
      />
      <SiteFooter locale={locale} dictionary={dictionary} branding={branding} />
    </div>
  );
}
