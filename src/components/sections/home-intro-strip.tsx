import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/lib/i18n/config";
import { localizePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";

const brandLogoImage = "/images/brand/logo-thien-duc.png";

const fieldImages = [
  "/images/projects/hung-phu/master-plan/hung-phu-master-plan-aerial-01.jpg",
  "/images/projects/hung-phu/fancy-tower/fancy-tower-exterior-day-01.jpg",
  "/images/projects/hung-phu/master-plan/hung-phu-master-plan-aerial-03.jpg",
] as const;

const aboutLabels: Record<Locale, string> = {
  vi: "Tìm hiểu thêm",
  en: "Learn more",
};

const introCopy: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    fieldTitle: string;
    fieldDescription: string;
    fields: [string, string, string];
  }
> = {
  vi: {
    eyebrow: "Về Thiên Đức",
    title: "Hơn một công trình, là những giá trị được kiến tạo lâu dài.",
    fieldTitle: "Lĩnh vực hoạt động",
    fieldDescription: "Kiến tạo những nền tảng cho phát triển bền vững",
    fields: [
      "Đầu tư & phát triển dự án",
      "Xây dựng & thi công",
      "Phát triển đô thị",
    ],
  },

  en: {
    eyebrow: "About Thien Duc",
    title: "More than buildings, we create lasting value over time.",
    fieldTitle: "Areas of operation",
    fieldDescription: "Creating foundations for sustainable development",
    fields: [
      "Investment & development",
      "Construction & delivery",
      "Urban development",
    ],
  },
};

export async function HomeIntroStrip({ locale }: { locale: Locale }) {
  const dictionary = await getDictionary(locale);

  const { description } = dictionary.homeIntro;

  const copy = introCopy[locale];

  const motto = dictionary.footerBrand.motto;

  return (
    <section className="border-y border-earth/15 bg-ivory">
      {/* =====================================================
      ABOUT
  ====================================================== */}
      <div className="w-full px-5 sm:px-8 lg:px-20 xl:px-28">
        <div className="grid w-full lg:grid-cols-[44%_40%_16%]">
          {/* IMAGE */}
          <div className="relative min-h-[17rem] overflow-hidden lg:min-h-[18rem]">
            <Image
              src={brandLogoImage}
              alt="Thiên Đức"
              fill
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="object-contain object-center p-6 lg:p-8"
              priority
            />
          </div>

          {/* CONTENT */}
          <div className="flex flex-col justify-center px-6 py-8 sm:px-10 lg:px-7 lg:py-7 xl:px-8">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-earth/75">
              {copy.eyebrow}
            </p>

            <h2 className="mt-3 max-w-[31rem] font-display text-[2rem] font-medium uppercase leading-[1.02] text-charcoal sm:text-[2.25rem] lg:text-[2rem] xl:text-[2.2rem]">
              {copy.title}
            </h2>

            <p className="mt-4 max-w-[55ch] text-[0.76rem] leading-[1.65] text-charcoal/68 sm:text-[0.8rem]">
              {description}
            </p>

            <Link
              href={localizePath(routes.about, locale)}
              className="mt-5 inline-flex h-9 w-fit items-center gap-3 border border-earth/45 px-5 text-[0.62rem] font-bold uppercase text-earth transition hover:border-earth hover:bg-earth hover:text-ivory"
            >
              {aboutLabels[locale]}
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>

          {/* QUOTE */}
          <aside className="flex items-center border-t border-earth/15 px-6 py-8 lg:border-l lg:border-t-0 lg:px-7">
            <blockquote className="max-w-[9.5rem] font-display text-[1.05rem] font-medium uppercase leading-[1.45] text-earth/65">
              <span
                aria-hidden="true"
                className="mb-3 block font-display text-[2.8rem] leading-none text-earth/25"
              >
                “
              </span>

              {motto}
            </blockquote>
          </aside>
        </div>
      </div>

      {/* =====================================================
      GAP BETWEEN ABOUT & BUSINESS FIELDS
  ====================================================== */}
      <div aria-hidden="true" className="h-5 bg-ivory sm:h-6 lg:h-7" />

      {/* =====================================================
      BUSINESS FIELDS
  ====================================================== */}
      <div className="w-full px-5 sm:px-8 lg:px-20 xl:px-28">
        <div
          id="linh-vuc-hoat-dong"
          className="grid scroll-mt-[var(--site-header-height)] border-t border-earth/15 lg:grid-cols-[1fr_1fr_1fr_1fr]"
        >
          {/* TITLE */}
          <div className="flex min-h-[11rem] flex-col justify-center px-6 py-7 sm:px-10 lg:px-10 xl:px-12">
            <h3 className="max-w-[13rem] font-display text-[2rem] font-medium uppercase leading-[1.05] text-charcoal">
              {copy.fieldTitle}
            </h3>

            <p className="mt-5 max-w-[13rem] text-[0.68rem] font-semibold uppercase leading-[1.6] text-earth/70">
              {copy.fieldDescription}
            </p>
          </div>

          {/* CARDS */}
          {copy.fields.map((field, index) => (
            <Link
              key={field}
              href={localizePath(routes.projects, locale)}
              className="group relative min-h-[11rem] overflow-hidden border-t border-earth/15 lg:border-l lg:border-t-0"
            >
              {/* IMAGE */}
              <Image
                src={fieldImages[index]}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, 100vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />

              {/* WHITE GRADIENT FROM LEFT */}
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-ivory from-[0%] via-ivory/95 via-[38%] to-ivory/10 to-[78%]"
              />

              {/* CONTENT */}
              <div className="relative flex h-full min-h-[11rem] flex-col justify-between px-6 py-5">
                <div>
                  <span className="block font-display text-[1.8rem] leading-none text-earth">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="mt-3 block h-px w-10 bg-earth/55" />
                </div>

                <div className="flex items-end justify-between gap-4">
                  <span className="max-w-[9rem] text-[0.72rem] font-bold uppercase leading-[1.5] text-charcoal">
                    {field}
                  </span>

                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-earth/75 text-ivory transition group-hover:bg-charcoal">
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
