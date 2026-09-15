import Link from "next/link";
import { displayAddress, siteConfig } from "@/config/site";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";

const phoneHref = `tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`;
const emailHref = `mailto:${siteConfig.email}`;
const mapsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(siteConfig.address)}`;

export async function HomeContactCta({ locale }: { locale: Locale }) {
  const dictionary = await getDictionary(locale);

  const contactItems = [
    {
      label: dictionary.footer.phone,
      value: siteConfig.phone,
      href: phoneHref,
    },
    {
      label: dictionary.footer.email,
      value: siteConfig.email,
      href: emailHref,
    },
    {
      label: dictionary.footer.office,
      value: displayAddress(locale),
      href: mapsHref,
    },
  ];

  return (
    <section className="bg-olive text-ivory">
      <div className="mx-auto grid max-w-site gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:py-16">
        <div>
          <p className="text-eyebrow mb-4 text-warm-grey">
            {dictionary.homeContact.eyebrow}
          </p>
          <h2 className="max-w-2xl text-[2.1rem] font-medium leading-[1.08] sm:text-[3rem]">
            {dictionary.homeContact.title}
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-ivory/78">
            {dictionary.homeContact.description}
          </p>
          <Link
            href={localizePath(routes.contact, locale)}
            className="button-polish mt-8 inline-flex h-11 items-center bg-ivory px-5 text-sm font-semibold uppercase tracking-[0.12em] text-charcoal transition hover:bg-white"
          >
            {dictionary.common.contactCta}
          </Link>
        </div>

        <div className="border-y border-ivory/20">
          {contactItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noreferrer" : undefined}
              className="grid gap-2 border-b border-ivory/20 py-5 last:border-b-0 sm:grid-cols-[8rem_minmax(0,1fr)]"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-warm-grey">
                {item.label}
              </span>
              <span className="text-sm leading-6 text-ivory">{item.value}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
