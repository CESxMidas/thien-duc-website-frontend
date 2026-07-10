import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type SiteShellProps = {
  locale: Locale;
  children: ReactNode;
};

/**
 * Server Component: nạp dictionary một lần rồi truyền xuống header/footer
 * (client) qua props — tránh bundle cả hai file dịch vào JS phía trình duyệt.
 */
export async function SiteShell({ locale, children }: SiteShellProps) {
  const dictionary = await getDictionary(locale);

  return (
    <div className="min-h-screen bg-surface-warm text-ink-soft">
      <a href="#main-content" className="skip-link">
        {dictionary.common.skipToContent}
      </a>
      <SiteHeader locale={locale} dictionary={dictionary} />
      <main id="main-content">{children}</main>
      <SiteFooter locale={locale} dictionary={dictionary} />
    </div>
  );
}
