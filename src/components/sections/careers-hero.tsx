import Image from "next/image";

type CareersHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  imageAlt: string;
};

export function CareersHero({
  eyebrow,
  title,
  description,
  imageAlt,
}: CareersHeroProps) {
  return (
    <section
      className="careers-hero reveal-section page-container pb-6 pt-5 sm:pb-10 sm:pt-8"
      aria-labelledby="careers-hero-title"
    >
      <div className="relative isolate min-h-[32rem] overflow-hidden rounded-lg bg-[#29352b] sm:min-h-[36rem] lg:min-h-[39rem]">
        <Image
          src="/images/projects/hung-phu/fancy-tower/fancy-tower-exterior-plaza-02.jpg"
          alt={imageAlt}
          fill
          priority
          className="careers-hero-media object-cover object-[57%_center] sm:object-center"
          sizes="(min-width: 1440px) 1376px, calc(100vw - 2.5rem)"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(31,38,31,0.92)_0%,rgba(38,39,31,0.76)_38%,rgba(43,38,31,0.28)_72%,rgba(38,32,27,0.16)_100%)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(27,28,23,0.82)_0%,transparent_55%)]"
          aria-hidden="true"
        />

        <div className="careers-hero-copy relative z-10 flex min-h-[32rem] max-w-3xl flex-col justify-end p-6 sm:min-h-[36rem] sm:p-10 lg:min-h-[39rem] lg:p-14">
          <p className="text-eyebrow text-gold-soft">{eyebrow}</p>
          <span className="mt-5 h-px w-16 bg-gold-soft/80" aria-hidden="true" />
          <h1
            id="careers-hero-title"
            className="mt-5 max-w-[15ch] font-display text-[clamp(2.6rem,11vw,4.1rem)] font-semibold leading-[0.98] text-white lg:text-[4.8rem]"
          >
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-ivory/90 sm:text-lg sm:leading-8">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
