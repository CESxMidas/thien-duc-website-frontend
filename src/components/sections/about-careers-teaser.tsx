import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { localizePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";

export function AboutCareersTeaser({ careers, locale }: { careers: Dictionary["careers"]; locale: Locale }) {
  return (
    <section className="about-careers reveal-section bg-olive text-ivory" aria-labelledby="about-careers-title">
      <div className="about-careers-image relative">
        <Image
          src="/images/news/2021/le-khoi-cong-fancy-tower-2021-04-07.jpg"
          alt={locale === "vi" ? "Các đại biểu tại lễ khởi công Fancy Tower" : "Delegates at the Fancy Tower groundbreaking ceremony"}
          fill
          className="about-story-media object-cover"
          sizes="(min-width: 1024px) 60vw, 100vw"
        />
      </div>
      <div className="about-careers-content page-container">
        <div className="max-w-lg py-10 sm:py-16 lg:py-24">
          <p className="text-eyebrow text-gold-soft">{careers.eyebrow}</p>
          <h2 id="about-careers-title" className="about-section-title mt-5 text-ivory">{careers.heroTitle}</h2>
          <p className="mt-6 max-w-md text-base leading-8 text-ivory">{careers.heroDescription}</p>
          <Link href={localizePath(routes.careers, locale)} className="about-text-link mt-8 border-gold-soft text-ivory">
            {careers.teaserCta}<ArrowUpRight className="size-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
