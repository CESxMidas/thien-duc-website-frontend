import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

export function AboutJourney({ about }: { about: Dictionary["about"] }) {
  return (
    <section className="about-story-section reveal-section" aria-labelledby="about-journey-title">
      <div className="about-editorial-grid page-container">
        <div className="about-editorial-image about-journey-image">
          <Image
            src="/images/about/about-journey-waterfront.webp"
            alt={about.imageAlt}
            fill
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="about-story-media object-cover object-right"
          />
        </div>
        <div className="about-editorial-copy">
          <p className="text-eyebrow text-earth">{about.timelineEyebrow}</p>
          <h2 id="about-journey-title" className="about-section-title mt-4">{about.timelineTitle}</h2>
          <ol className="about-timeline about-story-stagger mt-10">
            {about.timeline.map((milestone) => (
              <li key={milestone.period}>
                <p className="font-display text-4xl leading-none text-earth sm:text-5xl">{milestone.period}</p>
                <h3 className="mt-3 text-lg font-semibold text-charcoal">{milestone.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate">{milestone.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
