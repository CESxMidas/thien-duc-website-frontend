import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { localizePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";

export function AboutConnect({ about, locale }: { about: Dictionary["about"]; locale: Locale }) {
  return (
    <section className="about-connect reveal-section relative isolate overflow-hidden text-ivory" aria-labelledby="about-connect-title">
      <div className="about-connect-lines" aria-hidden="true" />
      <div className="page-container relative grid gap-10 py-16 sm:py-24 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-20">
        <div>
          <p className="text-eyebrow text-gold-soft">{about.ctaEyebrow}</p>
          <h2 id="about-connect-title" className="about-section-title mt-5 max-w-2xl text-ivory">{about.ctaTitle}</h2>
        </div>
        <div>
          <p className="section-subtitle max-w-xl text-base leading-8 text-ivory">{about.ctaDescription}</p>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
            <Link href={localizePath(routes.projects, locale)} className="about-text-link border-gold-soft text-ivory">
              {about.ctaPrimary}<ArrowUpRight className="size-5" aria-hidden="true" />
            </Link>
            <Link href={localizePath(routes.contact, locale)} className="about-text-link border-gold-soft text-ivory">
              {about.ctaSecondary}<ArrowUpRight className="size-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
