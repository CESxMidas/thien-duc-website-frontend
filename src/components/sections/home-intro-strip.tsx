import Image from "next/image";

import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function HomeIntroStrip({ locale }: { locale: Locale }) {
  const dictionary = await getDictionary(locale);
  const { description } = dictionary.homeIntro;
  const motto = dictionary.footerBrand.motto;
  const mottoLines =
    locale === "vi"
      ? ["Khách hàng hài lòng -", "Thiên Đức thành công"]
      : motto.split(/\s+[—-]\s+/);

  return (
    <section className="border-y border-earth/25 bg-ivory py-5 sm:py-6 lg:py-7">
      <div className="w-full px-5 sm:px-8 lg:px-20 xl:px-28">
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
    </section>
  );
}
