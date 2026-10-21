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
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_12%_0%,rgba(200,164,95,0.14),transparent_30rem),linear-gradient(180deg,#f2e9de_0%,#eee4d8_52%,#dfcfbd_100%)] text-ink-soft">
      <a href="#main-content" className="skip-link">
        {dictionary.common.skipToContent}
      </a>
      <SiteHeader locale={locale} dictionary={dictionary} branding={branding} />
      {heroBeforeHeader}
      <main
        id="main-content"
        className="flex-1 bg-[linear-gradient(180deg,rgba(255,252,247,0.34)_0%,rgba(240,230,218,0.2)_55%,rgba(214,195,175,0.34)_100%)]"
      >
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
