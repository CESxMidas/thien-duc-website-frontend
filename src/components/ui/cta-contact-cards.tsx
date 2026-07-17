import { Mail, MapPin, Phone } from "lucide-react";
import { displayAddress, siteConfig } from "@/config/site";
import type { Locale } from "@/lib/i18n/config";

const cardClassName =
  "interactive-card flex gap-3 rounded border border-brand/30 bg-gold-soft p-4 text-ink shadow-[0_4px_14px_rgba(127,75,13,0.16)] hover:border-brand hover:bg-gold";

type CtaContactCardsProps = {
  locale: Locale;
  labels: {
    phone: string;
    email: string;
    office: string;
  };
};

export function CtaContactCards({ locale, labels }: CtaContactCardsProps) {
  return (
    <div className="grid content-center gap-4 text-sm">
      <a
        href={`tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`}
        className={cardClassName}
      >
        <Phone className="mt-0.5 size-5 shrink-0 text-brand" />
        <span>
          <span className="block text-slate">{labels.phone}</span>
          <span className="mt-1 block font-semibold text-ink">
            {siteConfig.phone}
          </span>
        </span>
      </a>
      <a href={`mailto:${siteConfig.email}`} className={cardClassName}>
        <Mail className="mt-0.5 size-5 shrink-0 text-brand" />
        <span>
          <span className="block text-slate">{labels.email}</span>
          <span className="mt-1 block font-semibold text-ink">
            {siteConfig.email}
          </span>
        </span>
      </a>
      <a
        href={`https://maps.google.com/?q=${encodeURIComponent(siteConfig.address)}`}
        target="_blank"
        rel="noreferrer"
        className={cardClassName}
      >
        <MapPin className="mt-0.5 size-5 shrink-0 text-brand" />
        <span>
          <span className="block text-slate">{labels.office}</span>
          <span className="mt-1 block font-semibold text-ink">
            {displayAddress(locale)}
          </span>
        </span>
      </a>
    </div>
  );
}
