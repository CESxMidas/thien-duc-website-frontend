import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

export function AboutFoundation({ about }: { about: Dictionary["about"] }) {
  return (
    <section className="about-story-section about-foundation-section reveal-section" aria-labelledby="about-foundation-title">
      <div className="page-container">
        <div className="about-editorial-grid about-foundation-grid">
          <div className="about-foundation-foliage about-foundation-foliage-start hidden sm:block" aria-hidden="true">
            <Image
              src="/images/contact/coconut-palm-frond-soft.png"
              alt=""
              fill
              sizes="(min-width: 1024px) 22rem, 16rem"
              className="object-contain object-left-top"
            />
          </div>
          <div className="about-foundation-foliage about-foundation-foliage-end hidden lg:block" aria-hidden="true">
            <Image
              src="/images/contact/coconut-palm-frond-soft.png"
              alt=""
              fill
              sizes="(min-width: 1024px) 24rem, 16rem"
              className="object-contain object-left-top"
            />
          </div>
          <div className="about-editorial-image about-foundation-image">
            <Image
              src="/images/about/about-foundation-hung-phu-mall.png"
              alt={about.imageAlt}
              fill
              className="about-story-media object-cover object-right"
              sizes="(min-width: 1024px) 64vw, 100vw"
            />
          </div>
          <div className="about-editorial-copy">
            <p className="text-eyebrow text-earth">{about.capabilityEyebrow}</p>
            <h2 id="about-foundation-title" className="about-section-title about-foundation-title mt-4">{about.capabilityTitle}</h2>
            <dl className="about-foundation-stats about-story-stagger mt-5">
              {about.stats.map((stat) => (
                <div key={stat.label} className="border-t border-divider py-4">
                  <dt className="text-sm font-semibold text-charcoal">{stat.label}</dt>
                  <dd className="font-display text-5xl font-medium leading-none text-earth sm:text-6xl">{stat.value}</dd>
                  <dd className="mt-2 text-sm leading-6 text-slate">{stat.note}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
