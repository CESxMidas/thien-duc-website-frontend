import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { displayAddress, siteConfig } from "@/config/site";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";

const phoneHref = `tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`;
const emailHref = `mailto:${siteConfig.email}`;
const mapsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(siteConfig.address)}`;

function formatContactTitle(title: string): string[] {
  if (title.includes(",")) {
    const [firstLine, rest] = title.split(/,\s*/, 2);
    return [firstLine, rest].filter(Boolean);
  }

  return [title];
}

function formatAddressLines(address: string): string[] {
  const parts = address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length <= 2) return [address];

  return [parts.slice(0, 2).join(", "), parts.slice(2).join(", ")];
}

function renderContactTitle(locale: Locale, title: string) {
  if (locale === "vi") {
    return (
      <>
        <span className="block sm:whitespace-nowrap">TRAO ĐỔI VỀ DỰ ÁN,</span>
        <span className="block sm:whitespace-nowrap">
          HỢP TÁC{" "}
          <span className="font-display italic text-earth/85">&amp;</span>{" "}
          TƯ VẤN
        </span>
      </>
    );
  }

  return formatContactTitle(title).map((line) => (
    <span key={line} className="block text-balanced sm:whitespace-nowrap">
      {line}
    </span>
  ));
}

export async function HomeContactCta({ locale }: { locale: Locale }) {
  const dictionary = await getDictionary(locale);

  const contactItems = [
    {
      id: "phone",
      label: dictionary.footer.phone,
      value: siteConfig.phone,
      href: phoneHref,
      icon: Phone,
    },
    {
      id: "email",
      label: dictionary.footer.email,
      value: siteConfig.email,
      href: emailHref,
      icon: Mail,
    },
    {
      id: "office",
      label: dictionary.footer.office,
      value: displayAddress(locale),
      href: mapsHref,
      icon: MapPin,
    },
  ];

  return (
    <section className="relative isolate overflow-hidden border-y border-earth/20 bg-ivory text-charcoal lg:min-h-[390px]">
      <Image
        src="/images/contact/contact-section-background.jpg"
        alt=""
        fill
        sizes="100vw"
        quality={75}
        className="absolute inset-0 -z-20 size-full object-cover object-center"
      />
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(246,244,239,0.96)_0%,rgba(246,244,239,0.9)_42%,rgba(246,244,239,0.78)_100%)] sm:bg-[linear-gradient(90deg,rgba(246,244,239,0.97)_0%,rgba(246,244,239,0.91)_46%,rgba(246,244,239,0.72)_74%,rgba(246,244,239,0.48)_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_42%,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_38%)]"
        aria-hidden="true"
      />

      <div className="grid gap-8 px-5 py-10 sm:px-8 sm:py-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,0.9fr)] lg:items-center lg:gap-14 lg:px-20 lg:py-14 xl:px-28 2xl:mx-auto 2xl:max-w-[104rem]">
        <div className="flex min-w-0 flex-col justify-center">
          <p className="mb-4 flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-earth/75">
            <span
              className="h-px w-10 bg-earth/38"
              aria-hidden="true"
            />
            {dictionary.homeContact.eyebrow}
          </p>
          <h2 className="max-w-[44rem] font-display text-[clamp(2.35rem,7vw,3.15rem)] font-normal uppercase leading-[0.94] tracking-[0.01em] text-charcoal sm:text-[clamp(3rem,5vw,3.85rem)] lg:text-[clamp(3.15rem,3.55vw,4.35rem)]">
            {renderContactTitle(locale, dictionary.homeContact.title)}
          </h2>
          <p className="text-pretty-flow mt-5 max-w-[55ch] text-[1rem] leading-[1.76] text-charcoal/68">
            {dictionary.homeContact.description}
          </p>
          <Link
            href={localizePath(routes.contact, locale)}
            className="button-polish mt-7 inline-flex h-12 w-fit items-center gap-5 border border-earth bg-earth px-7 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ivory shadow-[0_12px_24px_rgba(139,115,94,0.11)] transition hover:border-charcoal hover:bg-charcoal sm:px-8"
          >
            {dictionary.common.contactCta}
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid w-full max-w-[41rem] overflow-hidden rounded-[6px] border border-white/55 bg-white/58 shadow-[0_18px_46px_rgba(74,58,44,0.12)] backdrop-blur-[5px] lg:justify-self-end">
          {contactItems.map((item) => {
            const Icon = item.icon;
            const valueLines =
              item.id === "office" ? formatAddressLines(item.value) : [item.value];

            return (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                className="group grid gap-4 border-b border-earth/10 px-5 py-5 transition hover:bg-white/38 last:border-b-0 sm:grid-cols-[3rem_minmax(0,1fr)] sm:items-center sm:px-6 sm:py-5"
              >
                <span className="grid size-11 place-items-center rounded-full bg-ivory/78 text-earth shadow-[0_8px_18px_rgba(139,115,94,0.12)] transition group-hover:bg-earth group-hover:text-ivory">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.64rem] font-bold uppercase tracking-[0.16em] text-earth/72">
                    {item.label}
                  </span>
                  <span
                    className={`text-pretty-flow mt-1 block min-w-0 [overflow-wrap:anywhere] ${
                      item.id === "phone"
                        ? "font-display text-[1.7rem] font-semibold leading-8 text-charcoal"
                        : "text-[0.92rem] font-semibold leading-[1.6] text-charcoal/86"
                    }`}
                  >
                    {valueLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </span>
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
