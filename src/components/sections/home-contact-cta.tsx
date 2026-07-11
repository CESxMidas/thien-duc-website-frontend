import Link from "next/link";
import { CtaContactCards } from "@/components/ui/cta-contact-cards";
import { homeContactCta } from "@/data/home";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";

export async function HomeContactCta({ locale }: { locale: Locale }) {
  const dictionary = await getDictionary(locale);

  return (
    <section className="reveal-section mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="grid gap-8 rounded-sm bg-brand-soft p-6 text-white shadow-[0_8px_28px_rgba(176,102,19,0.18)] md:grid-cols-[1fr_0.9fr] md:p-10">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-gold">
            {homeContactCta.eyebrow}
          </p>
          <h2 className="max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
            {homeContactCta.title}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white">
            {homeContactCta.description}
          </p>
          <Link
            href={localizePath(routes.contact, locale)}
            className="button-polish mt-7 inline-flex h-11 items-center bg-gold px-5 text-sm font-semibold text-ink transition hover:bg-white"
          >
            {dictionary.common.contactCta}
          </Link>
        </div>

        <CtaContactCards />
      </div>
    </section>
  );
}
