import Image from "next/image";
import { Handshake, ShieldCheck, Target } from "lucide-react";

const valueIcons = [Target, Handshake, ShieldCheck];

type AboutValue = {
  title: string;
  description: string;
};

type AboutValuesShowcaseProps = {
  eyebrow: string;
  title: string;
  imageAlt: string;
  values: AboutValue[];
};

const IMAGE_SRC =
  "/images/projects/hung-phu/fancy-tower/fancy-tower-exterior-plaza-01.jpg";

export function AboutValuesShowcase({
  eyebrow,
  title,
  imageAlt,
  values,
}: AboutValuesShowcaseProps) {
  return (
    <section
      className="about-values-showcase reveal-section page-container py-6 sm:py-10"
      aria-labelledby="about-values-title"
    >
      <div className="relative isolate overflow-hidden rounded-lg bg-[#2f3a2f] text-ivory shadow-[0_24px_60px_rgba(47,38,31,0.16)] xl:min-h-[700px]">
        <Image
          src={IMAGE_SRC}
          alt=""
          fill
          className="about-values-media hidden object-cover object-center xl:block"
          sizes="(min-width: 1440px) 1376px, (min-width: 1280px) calc(100vw - 5rem), 1px"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(30,35,28,0.92)_0%,rgba(36,39,30,0.7)_38%,rgba(34,31,25,0.18)_67%,rgba(29,26,22,0.12)_100%)] xl:block"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(0deg,rgba(24,25,21,0.94)_0%,rgba(27,28,23,0.48)_35%,transparent_68%)] xl:block"
          aria-hidden="true"
        />

        <div className="relative z-10 flex min-h-full flex-col p-5 sm:p-7 lg:p-10 xl:min-h-[700px] xl:p-12">
          <div className="grid items-stretch gap-6 md:grid-cols-[0.85fr_1.15fr] xl:block">
            <div className="about-values-copy flex flex-col justify-center xl:max-w-[43%]">
              <p className="text-eyebrow text-gold-soft">{eyebrow}</p>
              <span
                className="mt-5 h-px w-16 bg-gold-soft/80"
                aria-hidden="true"
              />
              <h2
                id="about-values-title"
                className="mt-5 max-w-[13ch] font-display text-[clamp(2.3rem,10vw,3.5rem)] font-semibold leading-[0.98] text-white sm:text-[3.75rem] md:text-[3.4rem] xl:text-[4.6rem]"
              >
                {title}
              </h2>
            </div>

            <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-white/15 md:aspect-auto md:min-h-72 xl:hidden">
              <Image
                src={IMAGE_SRC}
                alt={imageAlt}
                fill
                className="about-values-media object-cover object-center"
                sizes="(min-width: 768px) 54vw, calc(100vw - 4.5rem)"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_58%,rgba(33,33,27,0.28)_100%)]"
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="about-values-items mt-7 grid gap-3 md:grid-cols-3 xl:mt-auto xl:gap-4">
            {values.map((value, index) => {
              const Icon = valueIcons[index] ?? ShieldCheck;

              return (
                <article
                  key={value.title}
                  tabIndex={0}
                  className="group/value rounded-lg border border-white/20 bg-[#292720]/85 p-5 shadow-[0_14px_34px_rgba(18,18,14,0.16)] backdrop-blur-sm transition duration-300 ease-out hover:-translate-y-1 hover:border-gold-soft/70 hover:bg-[#332d25]/92 focus-visible:-translate-y-1 focus-visible:border-gold-soft focus-visible:bg-[#332d25]/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-soft/80 sm:p-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full border border-gold-soft/45 bg-gold/10 text-gold-soft transition-colors duration-300 group-hover/value:border-gold-soft group-hover/value:bg-gold/20 group-focus-visible/value:border-gold-soft group-focus-visible/value:bg-gold/20">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <h3 className="text-lg font-semibold text-white sm:text-xl">
                      {value.title}
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-ivory/88">
                    {value.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
