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
  description: string;
  imageAlt: string;
  values: AboutValue[];
};

const IMAGE_SRC =
  "/images/projects/hung-phu/fancy-tower/fancy-tower-exterior-plaza-01.jpg";

export function AboutValuesShowcase({
  eyebrow,
  title,
  description,
  imageAlt,
  values,
}: AboutValuesShowcaseProps) {
  return (
    <section
      className="about-values-showcase reveal-section px-5 sm:px-8 lg:px-14 xl:px-20"
      aria-labelledby="about-values-title"
    >
      <div className="about-values-scene relative isolate overflow-hidden rounded-2xl bg-cream px-5 py-7 text-ink sm:px-8 sm:py-9 lg:min-h-[25rem] lg:px-9 lg:py-8 xl:min-h-[26rem] xl:px-10">
        <Image
          src={IMAGE_SRC}
          alt={imageAlt}
          fill
          className="about-values-media absolute inset-0 -z-20 size-full object-cover object-center"
          sizes="(min-width: 1280px) 90vw, 100vw"
        />
        <div
          className="about-values-overlay pointer-events-none absolute inset-0 -z-10"
          aria-hidden="true"
        />
        <div
          className="about-values-foliage about-values-foliage-start hidden sm:block"
          aria-hidden="true"
        >
          <Image
            src="/images/contact/coconut-palm-frond-soft.png"
            alt=""
            fill
            sizes="(min-width: 1024px) 22rem, 16rem"
            className="object-contain object-left-top"
          />
        </div>
        <div
          className="about-values-foliage about-values-foliage-end hidden lg:block"
          aria-hidden="true"
        >
          <Image
            src="/images/contact/coconut-palm-frond-soft.png"
            alt=""
            fill
            sizes="(min-width: 1024px) 24rem, 16rem"
            className="object-contain object-left-top"
          />
        </div>

        <div className="about-values-copy relative z-10 flex max-w-[24rem] flex-col justify-center lg:w-[46%] lg:max-w-none lg:pt-2">
          <p className="text-eyebrow text-brand">{eyebrow}</p>
          <span className="mt-4 h-px w-16 bg-brand/70" aria-hidden="true" />
          <h2
            id="about-values-title"
            className="about-values-title mt-4 font-display font-semibold leading-[0.98] text-ink"
          >
            {title}
          </h2>
          <p className="content-paragraph mt-5 max-w-[36rem] text-sm leading-6 text-ink/80 sm:text-base sm:leading-7">
            {description}
          </p>
        </div>

        <div className="about-values-items relative z-10 mt-7 grid gap-3 lg:absolute lg:inset-y-8 lg:left-[49%] lg:right-8 lg:mt-0 lg:grid-cols-3 lg:content-center lg:gap-5 xl:right-9 xl:gap-6">
          {values.map((value, index) => {
            const Icon = valueIcons[index] ?? ShieldCheck;

            return (
              <article
                key={value.title}
                tabIndex={0}
                className="about-value-panel group/value rounded-xl border border-brand/15 bg-cream/95 p-4 shadow-lg backdrop-blur-sm transition duration-300 ease-out hover:-translate-y-1 hover:border-brand/40 focus-visible:-translate-y-1 focus-visible:border-brand/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:p-4 xl:p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border border-brand/30 bg-brand/5 text-brand transition-colors duration-300 group-hover/value:border-brand/50 group-hover/value:bg-brand/10 group-focus-visible/value:border-brand/50 group-focus-visible/value:bg-brand/10">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-base font-semibold text-ink xl:text-lg">
                    {value.title}
                  </h3>
                </div>
                <p className="content-paragraph mt-3 text-xs leading-5 text-slate xl:text-sm xl:leading-6">
                  {value.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
