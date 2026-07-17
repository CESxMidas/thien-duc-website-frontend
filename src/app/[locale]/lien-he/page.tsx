import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { ContactForm } from "@/components/sections/contact-form";
import { PageHeading } from "@/components/ui/page-heading";
import { displayAddress, siteConfig } from "@/config/site";
import { getPageBySlug } from "@/lib/api/pages";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo";

const PAGE_SLUG = "lien-he";

const metaCopy: Record<Locale, { title: string; description: string }> = {
  vi: {
    title: "Liên hệ Thiên Đức | Tư vấn dự án và hợp tác",
    description:
      "Thông tin liên hệ Công ty Thiên Đức, hỗ trợ trao đổi về dự án, hợp tác phát triển và nhu cầu tư vấn bất động sản.",
  },
  en: {
    title: "Contact Thien Duc | Project advisory and partnerships",
    description:
      "Contact details for Thien Duc: project enquiries, development partnerships, and real estate advisory.",
  },
};

const phoneHref = `tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`;
const mapsHref = `https://maps.google.com/?q=${encodeURIComponent(siteConfig.address)}`;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/lien-he">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return buildPageMetadata({
    ...metaCopy[locale],
    path: routes.contact,
    locale,
  });
}

export default async function ContactPage({
  params,
}: PageProps<"/[locale]/lien-he">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [page, dictionary] = await Promise.all([
    getPageBySlug(PAGE_SLUG, locale),
    getDictionary(locale),
  ]);
  const contact = dictionary.contact;
  const heading = {
    title: page?.title ?? contact.heroTitle,
    description: page?.paragraphs[0] ?? contact.heroDescription,
  };

  // Google Maps nhận mã ngôn ngữ 2 ký tự ở tham số `hl`.
  const mapsEmbedHref = `https://maps.google.com/maps?q=${encodeURIComponent(
    siteConfig.address,
  )}&hl=${locale}&z=15&output=embed`;

  return (
    <SiteShell locale={locale}>
      <PageHeading
        eyebrow={contact.heroEyebrow}
        title={heading.title}
        description={heading.description}
      />

      <section className="reveal-section mx-auto grid max-w-7xl gap-8 px-4 pb-10 pt-4 sm:px-6 sm:pb-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hover-card border border-black/10 bg-white p-6 md:p-8">
          <p className="text-eyebrow mb-4 text-brand">
            {contact.formEyebrow}
          </p>
          <h2 className="text-3xl font-semibold leading-tight">
            {contact.formTitle}
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate">
            {contact.formDescription}
          </p>
          <p className="mt-3 text-sm text-slate">
            {contact.callPrefix}{" "}
            <a
              href={phoneHref}
              className="font-semibold text-brand hover:text-brand-dark"
            >
              {siteConfig.phone}
            </a>
            .
          </p>

          <div className="mt-8">
            <ContactForm copy={dictionary.contactForm} locale={locale} />
          </div>
        </div>

        <div className="grid content-start gap-6">
          <div>
            <p className="text-eyebrow mb-4 text-brand">
              {contact.processEyebrow}
            </p>
            <h2 className="text-3xl font-semibold leading-tight">
              {contact.processTitle}
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate">
              {contact.processDescription}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {contact.process.map((item) => (
              <div
                key={item.step}
                className="hover-card border border-black/10 bg-white p-5"
              >
                <p className="text-sm font-semibold text-brand">
                  {item.step}
                </p>
                <h3 className="mt-2 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="reveal-section mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-16">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-eyebrow mb-4 text-brand">
              {contact.mapEyebrow}
            </p>
            <h2 className="text-3xl font-semibold leading-tight">
              {contact.mapTitle}
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate">
              {contact.mapDescription}
            </p>
            <p className="mt-5 font-semibold leading-7 text-ink">
              {displayAddress(locale)}
            </p>
            <Link
              href={mapsHref}
              target="_blank"
              rel="noreferrer"
              className="button-polish mt-6 inline-flex h-11 items-center bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              {contact.mapCta}
            </Link>
          </div>

          <div className="relative overflow-hidden border border-black/10 bg-white shadow-sm">
            {/* Skeleton nền khung bản đồ: iframe Google Maps trong suốt cho tới
                khi tiles vẽ xong, nên lớp này lộ ra trong lúc chờ thay vì khung
                trắng trơ. Không dùng chữ để khỏi phải i18n; tôn trọng
                prefers-reduced-motion (tắt nhấp nháy). */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 grid place-items-center bg-surface-warm"
            >
              <div className="flex flex-col items-center gap-3 text-brand/45">
                <MapPin className="size-8 animate-pulse motion-reduce:animate-none" />
                <span className="h-1.5 w-24 rounded-full bg-brand/15" />
              </div>
            </div>
            <iframe
              title={contact.mapIframeTitle}
              src={mapsEmbedHref}
              className="relative z-10 aspect-4/3 min-h-70 w-full border-0 lg:aspect-16/10"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
