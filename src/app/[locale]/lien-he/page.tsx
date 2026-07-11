import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { ContactForm } from "@/components/sections/contact-form";
import { PageHeading } from "@/components/ui/page-heading";
import { siteConfig } from "@/config/site";
import {
  contactFormCopy,
  contactHero,
  contactMap,
  contactProcess,
} from "@/data/contact";
import { getPageBySlug } from "@/lib/api/pages";
import { isLocale, type Locale } from "@/lib/i18n/config";
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

  const page = await getPageBySlug(PAGE_SLUG, locale);
  const heading = {
    title: page?.title ?? contactHero.title,
    description: page?.paragraphs[0] ?? contactHero.description,
  };

  // Google Maps nhận mã ngôn ngữ 2 ký tự ở tham số `hl`.
  const mapsEmbedHref = `https://maps.google.com/maps?q=${encodeURIComponent(
    siteConfig.address,
  )}&hl=${locale}&z=15&output=embed`;

  return (
    <SiteShell locale={locale}>
      <PageHeading
        eyebrow={contactHero.eyebrow}
        title={heading.title}
        description={heading.description}
      />

      <section className="reveal-section mx-auto grid max-w-7xl gap-8 px-4 pb-10 pt-4 sm:px-6 sm:pb-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hover-card border border-black/10 bg-white p-6 md:p-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-brand">
            {contactFormCopy.eyebrow}
          </p>
          <h2 className="text-3xl font-semibold leading-tight">
            {contactFormCopy.title}
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate">
            {contactFormCopy.description}
          </p>
          <p className="mt-3 text-sm text-slate">
            Hoặc gọi ngay{" "}
            <a
              href={phoneHref}
              className="font-semibold text-brand hover:text-brand-dark"
            >
              {siteConfig.phone}
            </a>
            .
          </p>

          <div className="mt-8">
            <ContactForm />
          </div>
        </div>

        <div className="grid content-start gap-6">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-brand">
              Quy trình
            </p>
            <h2 className="text-3xl font-semibold leading-tight">
              Sau khi gửi thông tin
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate">
              Chọn đúng nhóm nội dung trong form giúp Thiên Đức phản hồi nhanh
              hơn.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {contactProcess.map((item) => (
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
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-brand">
              {contactMap.eyebrow}
            </p>
            <h2 className="text-3xl font-semibold leading-tight">
              {contactMap.title}
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate">
              {contactMap.description}
            </p>
            <p className="mt-5 font-semibold leading-7 text-ink">
              {siteConfig.address}
            </p>
            <Link
              href={mapsHref}
              target="_blank"
              rel="noreferrer"
              className="button-polish mt-6 inline-flex h-11 items-center bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              {contactMap.ctaLabel}
            </Link>
          </div>

          <div className="overflow-hidden border border-black/10 bg-white shadow-sm">
            <iframe
              title="Bản đồ vị trí Công ty Thiên Đức"
              src={mapsEmbedHref}
              className="aspect-4/3 min-h-70 w-full border-0 lg:aspect-16/10"
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
