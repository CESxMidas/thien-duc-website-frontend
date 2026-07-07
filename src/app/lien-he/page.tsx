import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Handshake, Mail, MapPin, Phone } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { ContactForm } from "@/components/sections/contact-form";
import { PageHeading } from "@/components/ui/page-heading";
import { siteConfig } from "@/config/site";
import {
  contactCta,
  contactFormCopy,
  contactHero,
  contactIntro,
  contactMap,
  contactProcess,
  inquiryTypes,
} from "@/data/contact";

export const metadata: Metadata = {
  title: "Liên hệ Thiên Đức | Tư vấn dự án và hợp tác",
  description:
    "Thông tin liên hệ Công ty Thiên Đức, hỗ trợ trao đổi về dự án, hợp tác phát triển và nhu cầu tư vấn bất động sản.",
};

const phoneHref = `tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`;
const emailHref = `mailto:${siteConfig.email}`;
const mapsHref = `https://maps.google.com/?q=${encodeURIComponent(siteConfig.address)}`;
const mapsEmbedHref = `https://maps.google.com/maps?q=${encodeURIComponent(
  siteConfig.address,
)}&hl=vi&z=15&output=embed`;

const inquiryIcons = [Building2, Handshake, Mail];

const contactChannels = [
  {
    label: "Điện thoại",
    value: siteConfig.phone,
    href: phoneHref,
    action: "Gọi ngay",
    icon: Phone,
  },
  {
    label: "Email",
    value: siteConfig.email,
    href: emailHref,
    action: "Gửi email",
    icon: Mail,
  },
  {
    label: "Địa chỉ",
    value: siteConfig.address,
    href: mapsHref,
    action: "Xem bản đồ",
    icon: MapPin,
    external: true,
  },
];

export default function ContactPage() {
  return (
    <SiteShell>
      <PageHeading
        eyebrow={contactHero.eyebrow}
        title={contactHero.title}
        description={contactHero.description}
      />

      <section className="reveal-section mx-auto max-w-7xl px-6 pb-10">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#B06613]">
            {contactIntro.eyebrow}
          </p>
          <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
            {contactIntro.title}
          </h2>
          <p className="mt-4 text-lg leading-8 text-[#59646a]">
            {contactIntro.description}
          </p>
        </div>

        <div className="stagger-list mt-8 grid gap-4 md:grid-cols-3">
          {contactChannels.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
                className="hover-card group flex gap-4 border border-black/10 bg-white p-5 hover:border-[#B06613]"
              >
                <div className="icon-badge flex size-11 shrink-0 items-center justify-center bg-[#fff4cf] text-[#B06613] group-hover:bg-[#fdcd04] group-hover:text-[#191919]">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#B06613]">
                    {item.label}
                  </p>
                  <p className="mt-2 text-base font-semibold leading-6 text-[#191919]">
                    {item.value}
                  </p>
                  <span className="link-arrow mt-3 text-sm font-semibold text-[#59646a] group-hover:text-[#B06613]">
                    {item.action}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      <section className="reveal-section mx-auto grid max-w-7xl gap-8 px-6 pb-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hover-card border border-black/10 bg-white p-6 md:p-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#B06613]">
            {contactFormCopy.eyebrow}
          </p>
          <h2 className="text-3xl font-semibold leading-tight">
            {contactFormCopy.title}
          </h2>
          <p className="mt-4 text-sm leading-6 text-[#59646a]">
            {contactFormCopy.description}
          </p>

          <div className="mt-8">
            <ContactForm />
          </div>
        </div>

        <div className="grid content-start gap-6">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#B06613]">
              Nhu cầu liên hệ
            </p>
            <h2 className="text-3xl font-semibold leading-tight">
              Nội dung thường gặp
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#59646a]">
              Chọn đúng nhóm nội dung trong form giúp Thiên Đức phản hồi nhanh
              hơn.
            </p>
          </div>

          <div className="stagger-list grid gap-4">
            {inquiryTypes.map((item, index) => {
              const Icon = inquiryIcons[index];

              return (
                <div
                  key={item.id}
                  className="hover-card border border-black/10 bg-[#f6f3ee] p-5"
                >
                  <div className="flex items-start gap-3">
                    <Icon
                      className="mt-0.5 size-5 shrink-0 text-[#B06613]"
                      aria-hidden="true"
                    />
                    <div>
                      <h3 className="font-semibold text-[#191919]">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[#59646a]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-[#191919]">
              Sau khi gửi thông tin
            </h3>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {contactProcess.map((item) => (
                <div
                  key={item.step}
                  className="border border-black/10 bg-white p-4"
                >
                  <p className="text-sm font-semibold text-[#B06613]">
                    {item.step}
                  </p>
                  <h4 className="mt-2 font-semibold">{item.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-[#59646a]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="reveal-section mx-auto max-w-7xl px-6 pb-14">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#B06613]">
              {contactMap.eyebrow}
            </p>
            <h2 className="text-3xl font-semibold leading-tight">
              {contactMap.title}
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#59646a]">
              {contactMap.description}
            </p>
            <p className="mt-5 font-semibold leading-7 text-[#191919]">
              {siteConfig.address}
            </p>
            <Link
              href={mapsHref}
              target="_blank"
              rel="noreferrer"
              className="button-polish mt-6 inline-flex h-11 items-center bg-[#B06613] px-5 text-sm font-semibold text-white hover:bg-[#7f4b0d]"
            >
              {contactMap.ctaLabel}
            </Link>
          </div>

          <div className="overflow-hidden border border-black/10 bg-white shadow-sm">
            <iframe
              title="Bản đồ vị trí Công ty Thiên Đức"
              src={mapsEmbedHref}
              className="aspect-[4/3] min-h-[280px] w-full border-0 lg:aspect-[16/10]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <section className="reveal-section mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-8 rounded-sm bg-[#c99248] p-6 text-white shadow-[0_8px_28px_rgba(176,102,19,0.18)] md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#fdcd04]">
              {contactCta.eyebrow}
            </p>
            <h2 className="max-w-2xl text-3xl font-semibold leading-tight">
              {contactCta.title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75">
              {contactCta.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={contactCta.primaryHref}
              className="button-polish inline-flex h-11 items-center bg-[#fdcd04] px-5 text-sm font-semibold text-[#191919] hover:bg-white"
            >
              {contactCta.primaryLabel}
            </Link>
            <Link
              href={contactCta.secondaryHref}
              className="button-polish inline-flex h-11 items-center border border-white/30 px-5 text-sm font-semibold text-white hover:bg-white/10"
            >
              {contactCta.secondaryLabel}
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
