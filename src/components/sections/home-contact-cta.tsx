import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
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
      icon: Phone,
    },
    {
      label: dictionary.footer.email,
      value: siteConfig.email,
      href: emailHref,
      icon: Mail,
    },
    {
      label: dictionary.footer.office,
      value: displayAddress(locale),
      href: mapsHref,
      icon: MapPin,
    },
  ];

  return (
    <section className="border-y border-earth/15 bg-ivory text-charcoal">
      <div className="mx-auto grid max-w-site gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14 lg:py-16">
        <div className="flex flex-col justify-center">
          <p className="text-eyebrow mb-4 text-earth">
            {dictionary.homeContact.eyebrow}
          </p>
          <h2 className="max-w-2xl font-display text-[2.15rem] font-medium uppercase leading-[1.04] text-charcoal sm:text-[3rem] lg:text-[3.25rem]">
            {dictionary.homeContact.title}
          </h2>
          <p className="mt-6 max-w-[42rem] text-base leading-8 text-charcoal/70">
            {dictionary.homeContact.description}
          </p>
          <Link
            href={localizePath(routes.contact, locale)}
            className="button-polish mt-8 inline-flex h-12 w-fit items-center gap-3 border border-earth bg-earth px-5 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-ivory shadow-[0_14px_30px_rgba(139,115,94,0.18)] transition hover:-translate-y-0.5 hover:bg-charcoal hover:shadow-[0_18px_36px_rgba(41,41,41,0.18)]"
          >
            {dictionary.common.contactCta}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid overflow-hidden border border-earth/15 bg-white/70 shadow-[0_18px_42px_rgba(41,41,41,0.07)]">
          {contactItems.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                className="group grid gap-4 border-b border-earth/12 p-5 transition hover:bg-gold-soft/55 last:border-b-0 sm:grid-cols-[3rem_minmax(7rem,0.35fr)_minmax(0,1fr)] sm:items-center sm:p-6"
              >
                <span className="grid size-12 place-items-center rounded-[7px] border border-earth/18 bg-gold-soft/65 text-earth shadow-[0_8px_18px_rgba(139,115,94,0.08)] transition group-hover:border-earth/35 group-hover:bg-earth group-hover:text-ivory">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-earth">
                  {item.label}
                </span>
                <span className="wrap-break-word min-w-0 text-sm font-semibold leading-6 text-charcoal/82 group-hover:text-charcoal">
                  {item.value}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
