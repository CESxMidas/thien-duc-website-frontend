import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

type CareersHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  imageAlt: string;
  positionsCtaLabel: string;
  aboutCtaLabel: string;
  aboutHref: string;
};

export function CareersHero({
  eyebrow,
  title,
  description,
  imageAlt,
  positionsCtaLabel,
  aboutCtaLabel,
  aboutHref,
}: CareersHeroProps) {
  return (
    <section
      className="careers-hero reveal-section"
      aria-labelledby="careers-hero-title"
    >
      <div className="careers-hero-image absolute inset-0 overflow-hidden">
        <Image
          src="/images/about/about-careers-team.webp"
          alt={imageAlt}
          fill
          preload
          className="object-cover object-right"
          sizes="100vw"
        />
      </div>
      <div className="careers-hero-shade absolute inset-0" aria-hidden="true" />
      <div className="careers-hero-layout page-container relative z-10">
        <div className="careers-hero-copy">
          <p className="text-eyebrow text-gold-soft">{eyebrow}</p>
          <h1 id="careers-hero-title" className="careers-section-title mt-3 text-white">
            {title}
          </h1>
          <p className="section-subtitle mt-4 max-w-xl text-base leading-7 text-white/90">{description}</p>
          <div className="careers-hero-actions mt-5">
            <a href="#open-positions" className="careers-hero-cta">
              {positionsCtaLabel}
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <Link href={aboutHref} className="careers-hero-secondary-cta">
              {aboutCtaLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
