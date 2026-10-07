import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { BusinessFieldsCarousel } from "@/components/sections/business-fields-carousel";
import { PageHeading } from "@/components/ui/page-heading";
import { isLocale, localizePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo";

const metaCopy: Record<Locale, { title: string; description: string }> = {
  vi: {
    title: "Lĩnh vực hoạt động | Công ty Thiên Đức",
    description:
      "Các lĩnh vực hoạt động và nhóm ngành nghề kinh doanh của Công ty Thiên Đức trong đầu tư, xây dựng, thương mại và phát triển bất động sản.",
  },
  en: {
    title: "Areas of operation | Thien Duc Company",
    description:
      "Thien Duc Company's areas of operation and business lines across investment, construction, trading, and real estate development.",
  },
};

const fieldImages = [
  "/images/projects/hung-phu/master-plan/hung-phu-master-plan-aerial-01.jpg",
  "/images/projects/hung-phu/fancy-tower/fancy-tower-exterior-day-01.jpg",
  "/images/projects/hung-phu/master-plan/hung-phu-master-plan-aerial-03.jpg",
] as const;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/linh-vuc-hoat-dong">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return buildPageMetadata({
    ...metaCopy[locale],
    path: routes.fields,
    locale,
  });
}

export default async function BusinessFieldsPage({
  params,
}: PageProps<"/[locale]/linh-vuc-hoat-dong">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dictionary = await getDictionary(locale);
  const about = dictionary.about;

  return (
    <SiteShell locale={locale}>
      <div className="page-container py-5 sm:py-8">
        <PageHeading
          bare
          eyebrow={about.fieldsEyebrow}
          title={about.fieldsTitle}
          description={about.fieldsDescription}
        />
      </div>

      <section className="page-container reveal-section pb-8 sm:pb-12">
        <div className="grid gap-4 md:grid-cols-3">
          {about.fields.slice(0, 3).map((field, index) => (
            <article
              key={field.title}
              className="group relative isolate min-h-[24rem] overflow-hidden border border-earth/18 bg-charcoal text-ivory shadow-[0_18px_42px_rgba(41,41,41,0.1)]"
            >
              <Image
                src={fieldImages[index] ?? fieldImages[0]}
                alt={field.title}
                fill
                sizes="(min-width: 768px) 30vw, 100vw"
                className="object-cover object-center transition duration-[760ms] group-hover:scale-[1.035] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                priority={index === 0}
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,20,20,0.06)_0%,rgba(20,20,20,0.16)_42%,rgba(20,20,20,0.78)_100%)]"
              />
              <div className="relative z-10 flex min-h-[24rem] flex-col justify-between p-6 lg:p-7">
                <div>
                  <p className="font-display text-[2.1rem] leading-none text-gold-soft">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <span className="mt-4 block h-px w-14 bg-gold-soft/70" />
                </div>
                <div>
                  <p className="mb-3 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-gold-soft">
                    {about.fieldCodeLabel} {field.code}
                  </p>
                  <h2 className="text-[1.25rem] font-extrabold uppercase leading-tight tracking-[0.03em]">
                    {field.title}
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-white/84">
                    {field.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="page-container reveal-section py-5 sm:py-8">
        <div className="border border-black/10 bg-white p-5 sm:p-7 lg:p-8">
          <div className="max-w-3xl">
            <p className="text-eyebrow mb-4 text-brand">
              {about.fieldsEyebrow}
            </p>
            <h2 className="text-2xl font-semibold leading-tight md:text-3xl">
              {locale === "vi" ? "Danh mục ngành nghề" : "Business line groups"}
            </h2>
          </div>

          <BusinessFieldsCarousel
            fields={about.fields}
            codeLabel={about.fieldCodeLabel}
            labels={about.fieldsCarousel}
          />
        </div>
      </section>

      <section className="page-container reveal-section pb-10 sm:pb-14">
        <div className="bg-brand p-5 text-white md:p-10">
          <p className="text-eyebrow mb-4 text-gold-soft">
            {about.ctaEyebrow}
          </p>
          <h2 className="max-w-2xl text-2xl font-semibold leading-tight md:text-3xl">
            {about.ctaTitle}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white">
            {about.ctaDescription}
          </p>
          <Link
            href={localizePath(routes.projects, locale)}
            className="button-polish mt-7 inline-flex h-11 items-center gap-3 bg-gold px-5 text-sm font-semibold text-ink hover:bg-white"
          >
            {about.ctaPrimary}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
