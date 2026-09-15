import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { localizePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";

const introImage =
  "/images/projects/hung-phu/master-plan/hung-phu-master-plan-aerial-03.jpg";

const aboutLabels: Record<Locale, string> = {
  vi: "Tìm hiểu Thiên Đức",
  en: "About Thien Duc",
};

export async function HomeIntroStrip({ locale }: { locale: Locale }) {
  const dictionary = await getDictionary(locale);
  const { eyebrow, title, description, strengths } = dictionary.homeIntro;

  return (
    <section className="border-y border-black/10 bg-ivory">
      <div className="mx-auto grid max-w-site gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:py-16">
        <div className="relative min-h-[24rem] overflow-hidden bg-surface lg:min-h-[42rem]">
          <Image
            src={introImage}
            alt=""
            fill
            sizes="(min-width: 1024px) 48vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-between gap-12">
          <div className="max-w-2xl">
            <p className="text-eyebrow text-earth">{eyebrow}</p>
            <h2 className="mt-5 text-[2.25rem] font-medium leading-[1.05] text-charcoal sm:text-[3.2rem] lg:text-[4rem]">
              {title}
            </h2>
            <p className="mt-6 max-w-[68ch] text-base leading-8 text-charcoal/75 sm:text-lg">
              {description}
            </p>
            <Link
              href={localizePath(routes.about, locale)}
              className="link-arrow mt-8 inline-flex h-11 items-center border-b border-earth text-sm font-semibold uppercase tracking-[0.14em] text-earth"
            >
              {aboutLabels[locale]}
            </Link>
          </div>

          <div className="border-t border-black/10">
            {strengths.slice(0, 4).map((item, index) => (
              <div
                key={item.title}
                className="grid gap-4 border-b border-black/10 py-5 sm:grid-cols-[4rem_minmax(0,1fr)]"
              >
                <span className="font-display text-3xl font-medium leading-none text-earth">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-charcoal/70">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
