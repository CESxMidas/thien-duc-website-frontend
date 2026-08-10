import Link from "next/link";
import { CtaContactCards } from "@/components/ui/cta-contact-cards";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";

export async function HomeContactCta({ locale }: { locale: Locale }) {
  const dictionary = await getDictionary(locale);

  return (
    <section className="reveal-section mx-auto max-w-site px-4 py-5 sm:px-6 sm:py-8">
      <div className="grid gap-8 rounded-sm bg-brand p-5 text-white shadow-[0_8px_28px_rgba(176,102,19,0.18)] md:grid-cols-[1fr_0.9fr] md:p-10">
        <div>
          <p className="text-eyebrow mb-4 text-gold-soft">
            {dictionary.homeContact.eyebrow}
          </p>
          <h2 className="max-w-2xl text-2xl font-semibold leading-tight md:text-3xl">
            {dictionary.homeContact.title}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white">
            {dictionary.homeContact.description}
          </p>
          <Link
            href={localizePath(routes.contact, locale)}
            className="button-polish mt-7 inline-flex h-11 items-center bg-gold px-5 text-sm font-semibold text-ink transition hover:bg-white"
          >
            {dictionary.common.contactCta}
          </Link>
        </div>

        <CtaContactCards
          locale={locale}
          labels={{
            phone: dictionary.footer.phone,
            email: dictionary.footer.email,
            office: dictionary.footer.office,
          }}
        />
      </div>
    </section>
  );
}
