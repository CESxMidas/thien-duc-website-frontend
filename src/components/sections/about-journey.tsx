import type { Dictionary } from "@/lib/i18n/get-dictionary";

export function AboutJourney({ about }: { about: Dictionary["about"] }) {
  return (
    <div className="about-journey-inline" aria-labelledby="about-journey-title">
      <p className="text-eyebrow text-earth">{about.timelineEyebrow}</p>
      <h2 id="about-journey-title" className="about-section-title mt-3">{about.timelineTitle}</h2>
      <ol className="about-timeline about-story-stagger mt-6">
        {about.timeline.map((milestone) => (
          <li key={milestone.period}>
            <p className="font-display text-4xl leading-none text-earth sm:text-5xl">{milestone.period}</p>
            <h3 className="mt-3 text-lg font-semibold text-charcoal">{milestone.title}</h3>
            <p className="content-paragraph mt-3 text-sm leading-7 text-slate">{milestone.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
