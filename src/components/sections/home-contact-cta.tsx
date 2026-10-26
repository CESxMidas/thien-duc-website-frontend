import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { getCompanyContact, companyAddress } from "@/lib/api/settings";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";

export function formatContactTitle(title: string): string[] {
  const segments = title
    .split(/,\s*/)
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (segments.length < 2) return [title];

  return segments.map((segment, index) =>
    index < segments.length - 1 ? `${segment},` : segment,
  );
}

export function formatPhoneLines(phoneNumbers: string): string[] {
  return phoneNumbers
    .split(/\s*\/\s*/)
    .map((phoneNumber) => phoneNumber.trim())
    .filter(Boolean);
}

function renderContactTitle(locale: Locale, title: string) {
  if (locale === "vi") {
    return (
      <>
        <span className="block text-balanced xl:whitespace-nowrap">
          TRAO ĐỔI VỀ DỰ ÁN,
        </span>
        <span className="block text-balanced xl:whitespace-nowrap">
          HỢP TÁC{" "}
          <span className="font-display italic text-earth/85">&amp;</span> TƯ
          VẤN
        </span>
      </>
    );
  }

  const lines = formatContactTitle(title);

  return (
    <>
      <span className="block text-balanced xl:hidden">{title}</span>
      <span className="hidden xl:block">
        {lines.map((line) => (
          <span
            key={line}
            className="block text-balanced break-normal hyphens-none xl:whitespace-nowrap"
          >
            {line}
          </span>
        ))}
      </span>
    </>
  );
}

export async function HomeContactCta({ locale }: { locale: Locale }) {
  const [dictionary, companyContact] = await Promise.all([
    getDictionary(locale),
    getCompanyContact(),
  ]);
  const phoneHref = `tel:${companyContact.phone.replace(/[^\d+]/g, "")}`;
  const emailHref = `mailto:${companyContact.email}`;
  const mapsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(companyContact.address.vi)}`;

  const contactItems = [
    {
      id: "phone",
      label: dictionary.footer.phone,
      value: companyContact.phone,
      href: phoneHref,
      icon: Phone,
    },
    {
      id: "email",
      label: dictionary.footer.email,
      value: companyContact.email,
      href: emailHref,
      icon: Mail,
    },
    {
      id: "office",
      label: dictionary.footer.office,
      value: companyAddress(companyContact, locale),
      href: mapsHref,
      icon: MapPin,
    },
  ];

  return (
    <section className="home-contact-section relative isolate overflow-hidden border-y border-divider bg-ivory text-charcoal lg:min-h-[390px]">
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
      <div
        className="section-foliage section-foliage-start hidden sm:block"
        aria-hidden="true"
      >
        <Image
          src="/images/contact/coconut-palm-frond-soft.png"
          alt=""
          fill
          sizes="(min-width: 1024px) 36rem, 26rem"
          className="object-contain object-left-top"
        />
      </div>
      <div
        className="section-foliage section-foliage-end hidden lg:block"
        aria-hidden="true"
      >
        <Image
          src="/images/contact/coconut-palm-frond-soft.png"
          alt=""
          fill
          sizes="(min-width: 1024px) 36rem, 26rem"
          className="object-contain object-left-top"
        />
      </div>
      <div className="relative z-10 grid gap-8 px-5 py-10 sm:px-8 sm:py-12 lg:px-20 lg:py-14 xl:grid-cols-[minmax(0,0.88fr)_minmax(520px,1fr)] xl:items-center xl:gap-16 xl:px-28 2xl:mx-auto 2xl:max-w-[104rem]">
        <div className="flex min-w-0 flex-col justify-center">
          <p className="mb-4 flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-brand">
            <span className="h-px w-10 bg-earth/38" aria-hidden="true" />
            {dictionary.homeContact.eyebrow}
          </p>
          <h2 className="max-w-[44rem] break-normal font-display text-[clamp(1.85rem,9vw,2.35rem)] font-normal uppercase leading-[1] tracking-[0.01em] text-charcoal hyphens-none sm:text-[clamp(3rem,5vw,3.85rem)] sm:leading-[0.94] xl:text-[clamp(2.4rem,3.2vw,3rem)] 2xl:text-[3.6rem]">
            {renderContactTitle(locale, dictionary.homeContact.title)}
          </h2>
          <p className="content-paragraph text-pretty-flow mt-5 max-w-[55ch] text-[1rem] leading-[1.76] text-charcoal/68">
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

        <div className="grid w-full max-w-[48rem] overflow-hidden rounded-[6px] border border-white/60 bg-white/62 shadow-[0_18px_46px_rgba(74,58,44,0.12)] backdrop-blur-[5px] xl:justify-self-end">
          {contactItems.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                className="group grid gap-4 border-b border-divider px-5 py-5 transition hover:bg-white/38 last:border-b-0 sm:grid-cols-[3rem_minmax(0,1fr)] sm:items-center sm:px-6 sm:py-5 lg:gap-5 lg:px-7"
              >
                <span className="grid size-11 place-items-center rounded-full bg-ivory/78 text-earth shadow-[0_8px_18px_rgba(139,115,94,0.12)] transition group-hover:bg-earth group-hover:text-ivory">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.64rem] font-bold uppercase tracking-[0.16em] text-earth">
                    {item.label}
                  </span>
                  <span
                    className={`mt-1 block min-w-0 ${
                      item.id === "phone"
                        ? "font-sans text-[1.45rem] font-extrabold leading-8 text-charcoal [font-variant-numeric:lining-nums_tabular-nums] sm:text-[1.55rem]"
                        : item.id === "email"
                          ? "text-pretty-flow text-[0.92rem] font-semibold leading-[1.6] text-charcoal/86 [overflow-wrap:anywhere]"
                          : "break-words text-[0.92rem] font-semibold leading-[1.6] text-charcoal/86"
                    }`}
                  >
                    {item.id === "phone"
                      ? formatPhoneLines(item.value).map((phoneNumber) => (
                          <span
                            key={phoneNumber}
                            className="block whitespace-nowrap"
                          >
                            {phoneNumber}
                          </span>
                        ))
                      : item.value}
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
