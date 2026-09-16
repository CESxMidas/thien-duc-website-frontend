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
    fields: ["Đầu tư & phát triển dự án", "Xây dựng & thi công", "Phát triển đô thị"],
  },
  en: {
    eyebrow: "About Thien Duc",
    title: "More than buildings, we create lasting value over time.",
    fieldTitle: "Areas of operation",
    fieldDescription: "Creating foundations for sustainable development",
    fields: ["Investment & development", "Construction & delivery", "Urban development"],
  },
};

export async function HomeIntroStrip({ locale }: { locale: Locale }) {
  const dictionary = await getDictionary(locale);
  const { description } = dictionary.homeIntro;
  const copy = introCopy[locale];
  const motto = dictionary.footerBrand.motto;

  return (
    <section className="border-y border-earth/15 bg-ivory">
      <div className="mx-auto max-w-site">
        <div className="grid border-earth/15 lg:grid-cols-[0.95fr_1.25fr_0.75fr] lg:border-b">
          <div className="relative min-h-[16rem] overflow-hidden bg-surface-warm lg:min-h-[24rem]">
            <Image
              src={brandLogoImage}
              alt="Logo Thiên Đức"
              fill
              sizes="(min-width: 1024px) 32vw, 100vw"
              className="object-contain p-12 sm:p-16 lg:p-20"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(255,255,255,0.92),transparent_42%),linear-gradient(135deg,rgba(139,115,94,0.18),transparent_46%)]"
            />
          </div>

          <div className="px-6 py-10 sm:px-10 lg:px-14 lg:py-12">
            <p className="text-eyebrow text-earth">{copy.eyebrow}</p>
            <h2 className="mt-4 max-w-3xl font-display text-[2.35rem] font-medium uppercase leading-[1.05] text-charcoal sm:text-[3rem] lg:text-[3.3rem]">
              {copy.title}
            </h2>
            <p className="mt-6 max-w-[64ch] text-sm leading-7 text-charcoal/70 sm:text-base">
              {description}
            </p>
            <Link
              href={localizePath(routes.about, locale)}
              className="mt-7 inline-flex h-11 items-center gap-3 border border-earth/45 px-5 text-xs font-bold uppercase text-earth transition hover:border-earth hover:bg-earth hover:text-ivory"
            >
              {aboutLabels[locale]}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <aside className="flex border-t border-earth/15 px-6 py-10 sm:px-10 lg:border-l lg:border-t-0 lg:px-12">
            <blockquote className="mt-auto max-w-52 font-display text-2xl font-medium uppercase leading-[1.25] text-earth/70">
              <span aria-hidden="true" className="mb-5 block text-5xl leading-none text-earth/35">
                “
              </span>
              {motto}
            </blockquote>
          </aside>
        </div>

        <div
          id="linh-vuc-hoat-dong"
          className="grid scroll-mt-[var(--site-header-height)] lg:grid-cols-[0.9fr_repeat(3,minmax(0,1fr))]"
        >
          <div className="px-6 py-8 sm:px-10 lg:px-14">
            <h3 className="font-display text-3xl font-medium uppercase leading-tight text-charcoal sm:text-4xl">
              {copy.fieldTitle}
            </h3>
            <p className="mt-4 max-w-56 text-xs font-semibold uppercase leading-6 text-earth/75">
              {copy.fieldDescription}
            </p>
          </div>

          {copy.fields.map((field, index) => (
            <Link
              key={field}
              href={localizePath(routes.projects, locale)}
              className="group relative min-h-[13rem] overflow-hidden border-t border-earth/15 px-6 py-7 text-charcoal sm:min-h-[15rem] sm:px-8 lg:border-l lg:border-t-0"
            >
              <Image
                src={fieldImages[index]}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, 100vw"
                className="object-cover opacity-45 transition duration-700 group-hover:scale-105 group-hover:opacity-60"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-ivory via-ivory/80 to-ivory/25"
              />
              <span className="relative block font-display text-4xl leading-none text-earth">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="relative mt-4 block h-px w-12 bg-earth/60" />
              <span className="relative mt-8 flex max-w-44 items-end justify-between gap-4 text-sm font-bold uppercase leading-6 text-charcoal">
                {field}
                <span className="grid size-9 shrink-0 place-items-center rounded-full border border-earth/40 bg-earth/75 text-ivory transition group-hover:bg-charcoal">
                  <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
