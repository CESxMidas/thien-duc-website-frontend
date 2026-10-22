import Image from "next/image";
import { ArrowDown } from "lucide-react";

type CareersHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  imageAlt: string;
  ctaLabel?: string;
};

export function CareersHero({
  eyebrow,
  title,
  description,
  imageAlt,
  ctaLabel,
}: CareersHeroProps) {
  return (
    <section
      className="careers-hero careers-banner reveal-section bg-olive text-ivory"
      aria-labelledby="careers-hero-title"
    >
      <div className="careers-banner-image relative">
        <Image
          src="/images/about/about-careers-team.webp"
          alt={imageAlt}
          fill
          preload
          className="careers-hero-media object-cover object-right"
          sizes="100vw"
        />
      </div>
      <div className="careers-banner-content page-container">
        <div className="max-w-lg py-8 sm:py-10 lg:py-12">
          <p className="text-eyebrow text-gold-soft">{eyebrow}</p>
          <h1 id="careers-hero-title" className="about-section-title mt-4 text-ivory">
            {title}
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-ivory">{description}</p>
          {ctaLabel ? (
            <a href="#open-positions" className="about-text-link mt-6 border-gold-soft text-ivory">
              {ctaLabel}
              <ArrowDown className="size-5" aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
