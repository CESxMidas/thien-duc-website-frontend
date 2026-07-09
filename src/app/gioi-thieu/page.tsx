import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Handshake, ShieldCheck, Target } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { BusinessFieldCard } from "@/components/ui/business-field-card";
import { PageHeading } from "@/components/ui/page-heading";
import {
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

      <section className="reveal-section mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[1fr_0.9fr] lg:items-start">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-brand">
            {aboutOverview.eyebrow}
          </p>
          <h2 className="max-w-3xl text-3xl font-semibold leading-tight md:text-4xl">
            {aboutOverview.title}
          </h2>
          <div className="mt-6 grid gap-4 text-lg leading-8 text-slate">
            {aboutOverview.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <blockquote className="mt-8 border-l-4 border-gold bg-white px-5 py-4 text-lg font-semibold text-ink-soft shadow-sm">
            {aboutOverview.motto}
          </blockquote>
        </div>

        <div className="hover-card overflow-hidden border border-black/10 bg-white shadow-sm">
          <div className="image-reveal">
          <Image
            src="/images/projects/hung-phu/fancy-tower/fancy-tower-exterior-day-01.jpg"
            alt="Dự án bất động sản Thiên Đức phát triển"
            width={720}
            height={520}
            className="aspect-4/3 h-auto w-full object-cover"
            sizes="(min-width: 1024px) 45vw, 100vw"
          />
          </div>
          <div className="grid gap-3 p-5 text-sm leading-6 text-slate sm:grid-cols-2">
            <div>
              <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                Thành lập
              </span>
              <span className="mt-1 block text-lg font-semibold text-ink">
                2010
              </span>
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                Địa bàn
              </span>
              <span className="mt-1 block text-lg font-semibold text-ink">
                TP.HCM và các tỉnh
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="reveal-section mx-auto max-w-7xl px-6 py-14">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-brand">
            Giá trị nền tảng
          </p>
          <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
            Tầm nhìn, sứ mệnh và giá trị cốt lõi
          </h2>
        </div>

        <div className="stagger-list mt-10 grid gap-4 md:grid-cols-3">
          {aboutPrinciples.map((item, index) => {
            const Icon = principleIcons[index];

            return (
              <article key={item.title} className="hover-card group border border-black/10 bg-white p-6 hover:border-brand/35">
                <Icon className="icon-badge mb-5 size-8 text-brand transition group-hover:scale-110" aria-hidden="true" />
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-4 text-sm leading-6 text-slate">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="reveal-section mx-auto max-w-7xl px-6 py-14">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-brand">
            Lĩnh vực hoạt động
          </p>
          <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
            Ngành nghề kinh doanh đã đăng ký
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate">
            Các lĩnh vực được trình bày theo nhóm ngành nghề trong mục tiêu hoạt
            động và ngành nghề kinh doanh của Công ty Thiên Đức.
          </p>
        </div>

        <div className="stagger-list mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {aboutFields.map((item, index) => (
            <BusinessFieldCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </section>

      <section className="reveal-section mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-sm bg-brand-soft p-6 text-white shadow-[0_8px_28px_rgba(176,102,19,0.18)] md:p-10">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-gold">
            {aboutContactCta.eyebrow}
          </p>
          <h2 className="max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
            {aboutContactCta.title}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white">
            {aboutContactCta.description}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={aboutContactCta.primaryCta.href}
              className="button-polish inline-flex h-11 items-center bg-gold px-5 text-sm font-semibold text-ink hover:bg-white"
            >
              {aboutContactCta.primaryCta.label}
            </Link>
            <Link
              href={aboutContactCta.secondaryCta.href}
              className="button-polish inline-flex h-11 items-center border border-white/50 px-5 text-sm font-semibold text-white hover:bg-white hover:text-ink"
            >
              {aboutContactCta.secondaryCta.label}
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
