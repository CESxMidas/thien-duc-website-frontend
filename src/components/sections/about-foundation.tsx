import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

export function AboutFoundation({ about }: { about: Dictionary["about"] }) {
  return (
    <section className="about-story-section reveal-section" aria-labelledby="about-foundation-title">
      <div className="about-editorial-grid about-foundation-grid page-container">
        <div className="about-editorial-image about-foundation-image">
          <Image
            src="/images/projects/hung-phu/fancy-tower/fancy-tower-exterior-plaza-02.jpg"
            alt={about.imageAlt}
            fill
            className="about-story-media object-cover"
            sizes="(min-width: 1024px) 55vw, 100vw"
          />
        </div>
        <div className="about-editorial-copy">
          <p className="text-eyebrow text-earth">{about.capabilityEyebrow}</p>
          <h2 id="about-foundation-title" className="about-section-title mt-4">{about.capabilityTitle}</h2>
          <dl className="about-foundation-stats about-story-stagger mt-8">
            {about.stats.map((stat) => (
              <div key={stat.label} className="border-t border-gold/40 py-6">
                <dt className="text-sm font-semibold text-charcoal">{stat.label}</dt>
                <dd className="font-display text-5xl font-medium leading-none text-earth sm:text-6xl">{stat.value}</dd>
                <dd className="mt-2 text-sm leading-6 text-slate">{stat.note}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
