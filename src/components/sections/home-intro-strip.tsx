import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { getBrandingSettings } from "@/lib/api/settings";
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
  const [dictionary, branding] = await Promise.all([
    getDictionary(locale),
    getBrandingSettings().catch(() => null),
  ]);

  const { description } = dictionary.homeIntro;

  const copy = introCopy[locale];

  const motto = dictionary.footerBrand.motto;
  const mottoLines =
    locale === "vi"
      ? ["Khách hàng hài lòng", "Thiên Đức thành công"]
      : motto.split(/\s+[—-]\s+/);

  return (
    <section className="border-y border-earth/25 bg-ivory">
      {/* =====================================================
      ABOUT
  ====================================================== */}
      <div className="w-full px-5 sm:px-8 lg:px-20 xl:px-28">
        <div className="grid w-full lg:grid-cols-[44%_40%_16%]">
          {/* IMAGE */}
          <div className="relative min-h-[17rem] overflow-hidden lg:min-h-[18rem]">
            <Image
              src={branding?.logoUrl || brandLogoImage}
              alt="Thiên Đức"
              fill
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="object-contain object-center p-6 lg:p-8"
              priority
            />
          </div>

          {/* CONTENT */}
          <div className="flex flex-col justify-center px-6 py-8 sm:px-10 lg:px-7 lg:py-7 xl:px-8">
            <p className="inline-flex w-fit items-center border border-earth/25 bg-white/75 px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-earth shadow-[0_12px_28px_rgba(41,41,41,0.08)]">
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
              className="mt-5 inline-flex h-10 w-fit items-center gap-3 border border-earth bg-earth px-5 text-[0.62rem] font-bold uppercase tracking-[0.08em] text-ivory shadow-[0_14px_30px_rgba(139,115,94,0.22)] transition hover:-translate-y-0.5 hover:bg-charcoal hover:shadow-[0_18px_36px_rgba(41,41,41,0.18)]"
            >
              {aboutLabels[locale]}
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>

          {/* QUOTE */}
          <aside className="flex items-center border-t border-earth/25 px-6 py-8 lg:border-l lg:border-t-0 lg:px-7">
            <blockquote className="font-sans text-[0.9rem] font-semibold leading-[1.75] tracking-[0.02em] text-earth/72">
              <span
                aria-hidden="true"
                className="mb-2 block font-display text-[2.6rem] leading-none text-earth/25"
              >
                “
              </span>

              {mottoLines.map((line) => (
                <span key={line} className="block whitespace-nowrap">
                  {line}
                </span>
              ))}
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
          className="grid scroll-mt-[var(--site-header-height)] border-t border-earth/25 lg:grid-cols-[1fr_1fr_1fr_1fr]"
        >
          {/* TITLE */}
          <div className="flex min-h-[11rem] flex-col justify-center bg-white/35 px-6 py-7 sm:px-10 lg:px-10 xl:px-12">
            <h3 className="max-w-[13rem] font-sans text-[1.55rem] font-semibold uppercase leading-[1.18] tracking-[0.05em] text-earth sm:text-[1.7rem]">
              {copy.fieldTitle}
            </h3>

            <p className="mt-5 max-w-[13rem] text-[0.68rem] font-bold uppercase leading-[1.7] tracking-[0.08em] text-charcoal/55">
              {copy.fieldDescription}
            </p>
          </div>

          {/* CARDS */}
          {copy.fields.map((field, index) => (
            <Link
              key={field}
              href={localizePath(routes.projects, locale)}
              className="group relative min-h-[11rem] overflow-hidden border-t border-earth/25 outline-none lg:border-l lg:border-t-0"
            >
              {/* IMAGE */}
              <Image
                src={fieldImages[index]}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, 100vw"
                className="object-cover contrast-[1.05] saturate-[1.08] transition duration-700 group-hover:scale-105 group-hover:contrast-[1.12] group-hover:saturate-[1.16]"
              />

              {/* WHITE GRADIENT FROM LEFT */}
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-ivory/90 from-[0%] via-ivory/55 via-[36%] to-ivory/0 to-[78%] transition duration-500 group-hover:from-ivory/78 group-hover:via-ivory/34"
              />
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-charcoal/30 to-transparent opacity-70 transition duration-500 group-hover:opacity-45"
              />

              {/* CONTENT */}
              <div className="relative flex h-full min-h-[11rem] flex-col justify-between px-6 py-5">
                <div>
                  <span className="block font-display text-[1.8rem] leading-none text-earth transition group-hover:text-charcoal">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="mt-3 block h-px w-10 bg-earth/55" />
                </div>

                <div className="flex items-end justify-between gap-4">
                  <div className="min-w-0">
                    <span className="block max-w-[11rem] text-[0.78rem] font-semibold uppercase leading-[1.45] tracking-[0.04em] text-olive transition group-hover:text-charcoal">
                      {field}
                    </span>
                    <span
                      aria-hidden="true"
                      className="mt-3 inline-flex translate-y-2 items-center gap-2 border border-earth/35 bg-ivory/90 px-3.5 py-2 text-[0.62rem] font-bold uppercase tracking-[0.08em] text-earth opacity-0 shadow-[0_12px_24px_rgba(41,41,41,0.12)] transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
                    >
                      {aboutLabels[locale]}
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </span>
                  </div>

                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-earth/80 text-ivory shadow-[0_10px_22px_rgba(41,41,41,0.16)] transition group-hover:translate-x-1 group-hover:bg-charcoal group-focus-visible:translate-x-1 group-focus-visible:bg-charcoal">
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
