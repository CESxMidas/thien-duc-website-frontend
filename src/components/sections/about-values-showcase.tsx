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
      className="about-values-showcase reveal-section"
      aria-labelledby="about-values-title"
    >
      <div className="about-values-scene relative isolate overflow-hidden bg-olive text-ivory">
        <Image
          src={IMAGE_SRC}
          alt=""
          fill
          className="about-values-media hidden object-cover object-center xl:block"
          sizes="(min-width: 1280px) 100vw, 1px"
          aria-hidden="true"
        />

        <div
          className="about-values-shade pointer-events-none absolute inset-0 hidden xl:block"
          aria-hidden="true"
        />
        <div
          className="about-values-base pointer-events-none absolute inset-0 hidden xl:block"
          aria-hidden="true"
        />

        <div className="page-container relative z-10 flex flex-col pb-12 pt-0 sm:pb-16 xl:py-16">
          <div className="grid items-stretch gap-8 xl:block">
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

            <div className="relative order-first -mx-5 aspect-[16/10] overflow-hidden sm:-mx-8 lg:-mx-14 xl:-mx-20 xl:hidden">
              <Image
                src={IMAGE_SRC}
                alt={imageAlt}
                fill
                className="about-values-media object-cover object-center"
                sizes="(min-width: 1280px) 1px, 100vw"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_58%,rgba(33,33,27,0.28)_100%)]"
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="about-values-items mt-10 grid gap-4 lg:grid-cols-3 xl:mt-12">
            {values.map((value, index) => {
              const Icon = valueIcons[index] ?? ShieldCheck;

              return (
                <article
                  key={value.title}
                  tabIndex={0}
                  className="about-value-panel group/value border border-ivory/30 p-6 backdrop-blur-xs transition duration-300 ease-out hover:-translate-y-1 hover:border-gold-soft focus-visible:-translate-y-1 focus-visible:border-gold-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-soft sm:p-7"
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
