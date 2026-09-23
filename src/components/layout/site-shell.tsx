import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getBrandingSettings, type BrandingSettings } from "@/lib/api/settings";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type SiteShellProps = {
  locale: Locale;
  children: ReactNode;
};


export async function SiteShell({
  locale,
  children,
}: SiteShellProps) {
  const [dictionary, branding] = await Promise.all([
    getDictionary(locale),
    getBrandingSettings().catch(
      (): BrandingSettings => ({
        logoUrl: null,
        logoAlt: null,
        faviconUrl: null,
      }),
    ),
  ]);

  return (
  
    <div className="flex min-h-screen flex-col bg-surface-warm text-ink-soft">
      <a href="#main-content" className="skip-link">
        {dictionary.common.skipToContent}
      </a>
      <SiteHeader locale={locale} dictionary={dictionary} branding={branding} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter locale={locale} dictionary={dictionary} branding={branding} />
    </div>
  );
}
