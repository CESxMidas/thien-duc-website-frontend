import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Handshake, Mail, MapPin, Phone, ShieldCheck, Target } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { BusinessFieldCard } from "@/components/ui/business-field-card";
import { PageHeading } from "@/components/ui/page-heading";
import { siteConfig } from "@/config/site";
import {
  aboutCapability,
  aboutContactCta,
  aboutFields,
  aboutHero,
  aboutOverview,
  aboutPrinciples,
} from "@/data/about";

export const metadata: Metadata = {
  title:
    "Giới thiệu Công ty Thiên Đức | Đầu tư, xây dựng & bất động sản",
  description:
    "Tổng quan về Công ty TNHH Đầu tư - Xây dựng - Thương mại Thiên Đức, doanh nghiệp hoạt động trong lĩnh vực đầu tư, xây dựng, thương mại và phát triển bất động sản từ năm 2010.",
};

const principleIcons = [Target, Handshake, ShieldCheck];

export default function AboutPage() {
  return (
    <SiteShell>
      <PageHeading
        eyebrow={aboutHero.eyebrow}
        title={aboutHero.title}
        description={aboutHero.description}
      />

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#B06613]">
            {aboutOverview.eyebrow}
          </p>
          <h2 className="max-w-3xl text-3xl font-semibold leading-tight md:text-4xl">
            {aboutOverview.title}
          </h2>
          <div className="mt-6 grid gap-4 text-lg leading-8 text-[#59646a]">
            {aboutOverview.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <blockquote className="mt-8 border-l-4 border-[#fdcd04] bg-white px-5 py-4 text-lg font-semibold text-[#1d2428] shadow-sm">
            {aboutOverview.motto}
          </blockquote>
        </div>

        <div className="overflow-hidden border border-black/10 bg-white shadow-sm">
          <Image
            src="/images/projects/hung-phu/fancy-tower/fancy-tower-exterior-day-01.jpg"
            alt="Dự án bất động sản Thiên Đức phát triển"
            width={720}
            height={520}
            className="aspect-[4/3] h-auto w-full object-cover"
            sizes="(min-width: 1024px) 45vw, 100vw"
          />
          <div className="grid gap-3 p-5 text-sm leading-6 text-[#59646a] sm:grid-cols-2">
            <div>
              <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-[#B06613]">
                Thành lập
              </span>
              <span className="mt-1 block text-lg font-semibold text-[#191919]">
                2010
              </span>
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-[#B06613]">
                Địa bàn
              </span>
              <span className="mt-1 block text-lg font-semibold text-[#191919]">
                TP.HCM và các tỉnh
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-4 md:grid-cols-3">
          {aboutPrinciples.map((item, index) => {
            const Icon = principleIcons[index];

            return (
              <article key={item.title} className="border border-black/10 bg-white p-6">
                <Icon className="mb-5 size-8 text-[#B06613]" aria-hidden="true" />
                <h2 className="text-2xl font-semibold">{item.title}</h2>
                <p className="mt-4 text-sm leading-6 text-[#59646a]">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#B06613]">
            Lĩnh vực hoạt động
          </p>
          <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
            Ngành nghề kinh doanh đã đăng ký
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#59646a]">
            Các lĩnh vực được trình bày theo nhóm ngành nghề trong mục tiêu hoạt
            động và ngành nghề kinh doanh của Công ty Thiên Đức.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {aboutFields.map((item, index) => (
            <BusinessFieldCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-8 border border-black/10 bg-white p-6 shadow-sm md:grid-cols-[0.9fr_1.1fr] md:p-10">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#B06613]">
              {aboutCapability.eyebrow}
            </p>
            <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
              {aboutCapability.title}
            </h2>
          </div>
          <div>
            <p className="text-lg leading-8 text-[#59646a]">
              {aboutCapability.description}
            </p>
            <Link
              href={aboutCapability.cta.href}
              className="mt-7 inline-flex h-11 items-center bg-[#B06613] px-5 text-sm font-semibold text-white transition hover:bg-[#7f4b0d]"
            >
              {aboutCapability.cta.label}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 bg-[#191919] p-6 text-white md:grid-cols-[1fr_0.9fr] md:p-10">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#fdcd04]">
              {aboutContactCta.eyebrow}
            </p>
            <h2 className="max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
              {aboutContactCta.title}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
              {aboutContactCta.description}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={aboutContactCta.primaryCta.href}
                className="inline-flex h-11 items-center bg-[#fdcd04] px-5 text-sm font-semibold text-[#191919] transition hover:bg-white"
              >
                {aboutContactCta.primaryCta.label}
              </Link>
              <Link
                href={aboutContactCta.secondaryCta.href}
                className="inline-flex h-11 items-center border border-white/20 px-5 text-sm font-semibold text-white transition hover:border-[#fdcd04] hover:text-[#fdcd04]"
              >
                {aboutContactCta.secondaryCta.label}
              </Link>
            </div>
          </div>

          <div className="grid content-center gap-4 text-sm">
            <a
              href={`tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`}
              className="flex gap-3 border border-white/15 p-4 transition hover:border-[#fdcd04]"
            >
              <Phone className="mt-0.5 size-5 shrink-0 text-[#fdcd04]" />
              <span>
                <span className="block text-white/60">Điện thoại</span>
                <span className="mt-1 block font-semibold">{siteConfig.phone}</span>
              </span>
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex gap-3 border border-white/15 p-4 transition hover:border-[#fdcd04]"
            >
              <Mail className="mt-0.5 size-5 shrink-0 text-[#fdcd04]" />
              <span>
                <span className="block text-white/60">Email</span>
                <span className="mt-1 block font-semibold">{siteConfig.email}</span>
              </span>
            </a>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(siteConfig.address)}`}
              target="_blank"
              rel="noreferrer"
              className="flex gap-3 border border-white/15 p-4 transition hover:border-[#fdcd04]"
            >
              <MapPin className="mt-0.5 size-5 shrink-0 text-[#fdcd04]" />
              <span>
                <span className="block text-white/60">Trụ sở</span>
                <span className="mt-1 block font-semibold">{siteConfig.address}</span>
              </span>
            </a>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
