import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/lib/i18n/config";
import { localizePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";

const fieldImages = [
  "/images/projects/hung-phu/master-plan/hung-phu-master-plan-aerial-01.jpg",
  "/images/projects/hung-phu/fancy-tower/fancy-tower-exterior-day-01.jpg",
  "/images/projects/hung-phu/master-plan/hung-phu-master-plan-aerial-03.jpg",
] as const;

const exploreLabels: Record<Locale, string> = {
  vi: "Khám phá",
  en: "Explore",
};

const introCopy: Record<
  Locale,
  {
    eyebrow: string;
    fieldTitle: string;
    fieldDescription: string;
    fields: [string, string, string];
  }
> = {
  vi: {
    eyebrow: "Tâm Đức",
    fieldTitle: "Lĩnh vực hoạt động",
    fieldDescription: "Kiến tạo những nền tảng cho phát triển bền vững",
    fields: [
      "Đầu tư & phát triển dự án",
      "Xây dựng & thi công",
      "Phát triển đô thị",
    ],
  },

  en: {
    eyebrow: "Thien Duc",
    fieldTitle: "Areas of operation",
    fieldDescription: "Creating foundations for sustainable development",
    fields: [
      "Investment & development",
      "Construction & delivery",
      "Urban development",
    ],
  },
};

type ActivityField = {
  id: string;
  title: string;
  href: string;
  image: string;
};

function ActivityCard({
  field,
  exploreLabel,
  priority,
}: {
  field: ActivityField;
  exploreLabel: string;
  priority: boolean;
}) {
  return (
    <Link
      href={field.href}
      className={`group relative isolate flex min-h-[20rem] overflow-hidden border border-earth/18 bg-charcoal outline-none transition-[flex,transform,border-color] duration-[560ms] ease-[cubic-bezier(.22,.61,.36,1)] focus-visible:border-earth focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-earth motion-reduce:transition-none md:min-h-[22rem] min-[75rem]:h-[clamp(20rem,30vw,30rem)] min-[75rem]:flex-1 min-[75rem]:hover:flex-[1.55] min-[75rem]:focus-visible:flex-[1.55] ${
        priority ? "md:col-span-2 min-[75rem]:col-span-1" : ""
      }`}
    >
      <Image
        src={field.image}
        alt={field.title}
        fill
        sizes="(min-width: 1024px) 28vw, (min-width: 768px) 50vw, 100vw"
        className="object-cover object-center transition duration-[900ms] ease-[cubic-bezier(.22,.61,.36,1)] group-hover:scale-[1.035] group-focus-visible:scale-[1.035] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100"
        priority={priority}
      />

      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,20,20,0.08)_0%,rgba(20,20,20,0.10)_38%,rgba(20,20,20,0.72)_100%)] transition duration-[560ms] ease-[cubic-bezier(.22,.61,.36,1)] group-hover:bg-[linear-gradient(180deg,rgba(20,20,20,0.03)_0%,rgba(20,20,20,0.08)_38%,rgba(20,20,20,0.78)_100%)] group-focus-visible:bg-[linear-gradient(180deg,rgba(20,20,20,0.03)_0%,rgba(20,20,20,0.08)_38%,rgba(20,20,20,0.78)_100%)] motion-reduce:transition-none"
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ivory/18 to-transparent"
      />

      <article className="relative z-10 flex min-h-full w-full flex-col justify-between p-5 text-ivory sm:p-6 lg:p-7">
        <header>
          <p className="font-display text-[2.15rem] leading-none text-ivory/88 transition duration-500 group-hover:text-gold-soft group-focus-visible:text-gold-soft motion-reduce:transition-none">
            {field.id}
          </p>
          <span className="mt-4 block h-px w-12 bg-ivory/55 transition duration-500 group-hover:w-16 group-hover:bg-gold-soft group-focus-visible:w-16 group-focus-visible:bg-gold-soft motion-reduce:transition-none" />
        </header>

        <div className="max-w-[18rem] translate-y-0 transition duration-500 ease-[cubic-bezier(.22,.61,.36,1)] group-hover:-translate-y-1 group-focus-visible:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none">
          <h3 className="text-[1.05rem] font-extrabold uppercase leading-[1.22] tracking-[0.04em] text-ivory sm:text-[1.16rem] lg:text-[1.22rem]">
            {field.title}
          </h3>
          <span className="mt-4 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-gold-soft">
            {exploreLabel}
            <ArrowRight
              className="size-4 transition duration-500 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none"
              aria-hidden="true"
            />
          </span>
        </div>
      </article>
    </Link>
  );
}

export async function HomeIntroStrip({ locale }: { locale: Locale }) {
  const dictionary = await getDictionary(locale);
  const { description } = dictionary.homeIntro;
  const copy = introCopy[locale];
  const motto = dictionary.footerBrand.motto;
  const mottoLines =
    locale === "vi"
      ? ["Khách hàng hài lòng -", "Thiên Đức thành công"]
      : motto.split(/\s+[—-]\s+/);
  const activityFields: ActivityField[] = copy.fields.map((title, index) => ({
    id: String(index + 1).padStart(2, "0"),
    title,
    href: localizePath(routes.projects, locale),
    image: fieldImages[index],
  }));

  return (
    <section className="border-y border-earth/25 bg-ivory">
      <div className="mt-5 w-full px-5 sm:px-8 lg:px-20 xl:px-28">
        <div
          className="relative min-h-[8.5rem] overflow-hidden border-x border-earth/18 bg-[linear-gradient(100deg,#f6f1e7_0%,#fbf9f3_42%,#f1eadc_100%)] px-5 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] sm:px-8 lg:min-h-[9.25rem] lg:px-16"
          style={{
            backgroundImage:
              "var(--home-intro-background, linear-gradient(100deg,#faf8f3 0%,#f2eee6 48%,#eee7dc 100%))",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_4%_50%,rgba(139,115,94,0.16)_0%,rgba(255,255,255,0)_24%),linear-gradient(90deg,rgba(246,244,239,0.92)_0%,rgba(246,244,239,0.84)_28%,rgba(246,244,239,0.68)_68%,rgba(246,244,239,0.25)_100%)]"
          />
          <div className="relative z-10 grid min-h-[5.75rem] items-center gap-5 lg:grid-cols-[9rem_1px_minmax(0,1fr)_15rem] lg:gap-7 xl:grid-cols-[10.5rem_1px_minmax(0,1fr)_17rem] xl:gap-8">
            <p className="max-w-[7.5rem] text-center text-[0.55rem] font-bold uppercase leading-[1.55] tracking-[0.15em] text-earth/55 lg:text-right">
              <span className="block">Thien Duc I&amp;C</span>
              <span className="mt-1 block font-medium tracking-[0.12em] text-earth/38">
                Investment
              </span>
              <span className="block font-medium tracking-[0.12em] text-earth/38">
                Construction
              </span>
              <span className="block font-medium tracking-[0.12em] text-earth/38">
                Development
              </span>
            </p>
            <span
              aria-hidden="true"
              className="hidden h-[4.75rem] w-px bg-gold/45 lg:block"
            />

            <blockquote className="max-w-[49rem] lg:pl-6">
              <div className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="font-display text-[3.25rem] leading-none text-gold sm:text-[4rem]"
                >
                  “
                </span>
                <div>
                  <h2 className="max-w-[42rem] font-display text-[1.85rem] font-medium uppercase leading-[1.03] tracking-[0.01em] text-charcoal sm:text-[2.35rem] lg:text-[2.6rem]">
                    {mottoLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </h2>
                  <p className="mt-2.5 max-w-[34rem] text-[0.72rem] font-medium leading-[1.55] text-charcoal/62 sm:text-[0.78rem]">
                    {description}
                  </p>
                </div>
              </div>
            </blockquote>
            <div
              aria-hidden="true"
              className="relative hidden h-[9.5rem] w-full opacity-58 lg:block"
            >
              <Image
                src="/images/brand/logo-thien-duc-header-transparent.png"
                alt=""
                fill
                sizes="17rem"
                className="object-contain object-center"
              />
            </div>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="h-5 bg-ivory sm:h-6 lg:h-7" />

      <div className="w-full px-5 pb-6 sm:px-8 sm:pb-8 lg:px-20 lg:pb-10 xl:px-28">
        <section
          id="linh-vuc-hoat-dong"
          aria-labelledby="linh-vuc-hoat-dong-title"
          className="grid scroll-mt-[var(--site-header-height)] gap-5 min-[75rem]:grid-cols-[0.82fr_2.55fr] min-[75rem]:gap-6"
        >
          <div className="flex min-h-[15rem] flex-col justify-between border border-earth/18 bg-white/45 px-6 py-7 sm:px-8 min-[75rem]:min-h-[20rem] min-[75rem]:px-8 min-[75rem]:py-8 xl:px-10">
            <div>
              <p className="text-[0.66rem] font-bold uppercase tracking-[0.16em] text-earth/55">
                {locale === "vi" ? "Năng lực cốt lõi" : "Core capabilities"}
              </p>
              <h2
                id="linh-vuc-hoat-dong-title"
                className="mt-4 max-w-[13rem] font-sans text-[1.55rem] font-semibold uppercase leading-[1.15] tracking-[0.04em] text-earth sm:text-[1.7rem]"
              >
                {copy.fieldTitle}
              </h2>
            </div>

            <p className="mt-7 max-w-[16rem] text-[0.78rem] font-semibold uppercase leading-[1.72] tracking-[0.08em] text-charcoal/58">
              {copy.fieldDescription}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 min-[75rem]:flex min-[75rem]:items-stretch">
            {activityFields.map((field, index) => (
              <ActivityCard
                key={field.id}
                field={field}
                exploreLabel={exploreLabels[locale]}
                priority={index === 0}
              />
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
