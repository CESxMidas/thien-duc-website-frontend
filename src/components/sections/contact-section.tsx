import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/sections/contact-form";
import { getCompanyContact, companyAddress } from "@/lib/api/settings";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

export async function ContactSection({
  dictionary,
  locale,
}: {
  dictionary: Dictionary;
  locale: Locale;
}) {
  const companyContact = await getCompanyContact();
  const contact = dictionary.contact;
  const phoneHref = `tel:${companyContact.phone.replace(/[^\d+]/g, "")}`;
  const destination = encodeURIComponent(companyContact.address.vi);
  const mapsHref = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

  return (
    <section className="contact-section page-container grid items-stretch gap-6 pt-4 lg:grid-cols-[1.1fr_0.9fr] xl:gap-8">
      <div className="contact-form-panel min-w-0 rounded-2xl border border-divider bg-surface p-5 shadow-sm sm:p-7 xl:p-8">
        <div className="mb-6 border-b border-divider/70 pb-5">
          <p className="mb-2 text-sm font-semibold text-brand">
            {contact.formEyebrow}
          </p>
          <h2 className="text-3xl font-semibold leading-tight text-espresso">
            {contact.formTitle}
          </h2>
          <p className="mt-3 max-w-prose text-sm leading-6 text-slate">
            {contact.formDescription}
          </p>
          <a
            href={phoneHref}
            className="mt-3 inline-flex min-h-8 items-center gap-2 text-sm font-semibold text-brand underline-offset-4 hover:underline"
          >
            <Phone className="size-4" aria-hidden="true" />
            {contact.callPrefix} {companyContact.phone}
          </a>
        </div>
        <ContactForm
          copy={dictionary.contactForm}
          locale={locale}
          companyPhone={companyContact.phone}
        />
      </div>

      <div className="contact-aside flex min-w-0 flex-col gap-6">
        <section
          className="rounded-2xl border border-divider bg-gold-soft/25 p-5 sm:p-6"
          aria-labelledby="contact-process-title"
        >
          <h2
            id="contact-process-title"
            className="text-2xl font-semibold text-espresso"
          >
            {contact.processTitle}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate">
            {contact.processDescription}
          </p>
          <ol className="mt-4 grid gap-4">
            {contact.process.map((item) => (
              <li key={item.step} className="flex items-start gap-3">
                <span
                  className="grid size-8 shrink-0 place-items-center rounded-full border border-brand/20 bg-surface text-xs font-semibold text-brand"
                  aria-hidden="true"
                >
                  {item.step}
                </span>
                <div className="min-w-0">
                  <h3 className="font-sans text-sm font-semibold leading-6 text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-0.5 text-sm leading-6 text-slate">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section
          className="contact-office-panel flex flex-1 flex-col overflow-hidden rounded-2xl border border-divider bg-surface shadow-sm"
          aria-labelledby="contact-office-title"
        >
          <div className="p-5 sm:p-6">
            <h2
              id="contact-office-title"
              className="text-2xl font-semibold text-espresso"
            >
              {contact.mapTitle}
            </h2>
            <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-slate">
              <MapPin
                className="mt-1 size-4 shrink-0 text-brand"
                aria-hidden="true"
              />
              {companyAddress(companyContact, locale)}
            </p>
            <a
              href={`mailto:${companyContact.email}`}
              className="mt-2 inline-flex min-h-8 max-w-full items-center gap-2 break-all text-sm font-medium text-brand underline-offset-4 hover:underline"
            >
              <Mail className="size-4 shrink-0" aria-hidden="true" />
              {companyContact.email}
            </a>
            <a
              href={mapsHref}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex min-h-11 w-fit items-center gap-2 rounded-lg border border-brand/25 px-4 text-sm font-semibold text-brand transition-colors hover:bg-gold-soft/40"
            >
              {contact.mapCta}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
          <iframe
            title={contact.mapIframeTitle}
            src={`https://maps.google.com/maps?q=${destination}&hl=${locale}&z=15&output=embed`}
            className="min-h-52 w-full flex-1 border-0 border-t border-divider bg-gold-soft/25"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </section>
      </div>
    </section>
  );
}
