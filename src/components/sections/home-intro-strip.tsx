import Image from "next/image";

import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function HomeIntroStrip({ locale }: { locale: Locale }) {
  const dictionary = await getDictionary(locale);
  const { description, eyebrow } = dictionary.homeIntro;
  const motto = dictionary.footerBrand.motto;
  const brandTitle =
    locale === "vi" ? ["Thiên Đức", "lắng nghe"] : ["Thien Duc", "listens"];
  const brandBody =
    locale === "vi"
      ? ["Thấu hiểu từng nhu cầu", "Kiến tạo những giá trị", "bền vững."]
      : ["Understanding every need", "Creating lasting", "long-term value."];
  const mottoLines =
    locale === "vi"
      ? ["Khách hàng hài lòng -", "Thiên Đức thành công"]
      : motto.split(/\s+[—-]\s+/);

  return (
    <section className="border-y border-earth/20 bg-ivory py-5 sm:py-6 lg:py-7">
      <div className="w-full px-5 sm:px-8 lg:px-20 xl:px-28">
        <div
          className="relative min-h-[8.5rem] overflow-hidden border-x border-earth/16 bg-[linear-gradient(102deg,#eadfcf_0%,#f6efe2_28%,#fbf6eb_58%,#efe0ca_100%)] px-5 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.76)] sm:px-8 lg:min-h-[9.25rem] lg:px-16"
          style={{
            backgroundImage:
              "var(--home-intro-background, linear-gradient(102deg,#eadfcf 0%,#f6efe2 28%,#fbf6eb 58%,#efe0ca 100%))",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.78)_0%,rgba(255,255,255,0)_31%),radial-gradient(circle_at_84%_55%,rgba(160,121,77,0.18)_0%,rgba(255,255,255,0)_34%),linear-gradient(90deg,rgba(231,218,199,0.88)_0%,rgba(248,241,229,0.78)_36%,rgba(255,252,245,0.68)_64%,rgba(238,221,195,0.42)_100%)]"
          />
          <div className="relative z-10 grid min-h-[5.75rem] items-center gap-5 lg:grid-cols-[10.5rem_1px_minmax(0,1fr)_14rem] lg:gap-7 xl:grid-cols-[12rem_1px_minmax(0,1fr)_16rem] xl:gap-8">
            <div className="max-w-[9.75rem] lg:text-left">
              <p className="font-display text-[1.1rem] font-semibold uppercase leading-[0.98] tracking-[0.02em] text-earth sm:text-[1.2rem]">
                {brandTitle.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
              <span
                aria-hidden="true"
                className="mt-3 block h-px w-12 bg-earth/44"
              />
              <p className="mt-3 text-[0.72rem] font-medium leading-[1.48] text-charcoal/70 sm:text-[0.76rem]">
                {brandBody.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
              <span className="sr-only">
                {eyebrow}
              </span>
            </div>
            <span
              aria-hidden="true"
              className="hidden h-[5.8rem] w-px bg-earth/28 lg:block"
            />

            <blockquote className="max-w-[47rem] lg:pl-4 xl:pl-5">
              <div className="flex items-start gap-3 sm:gap-4">
                <span
                  aria-hidden="true"
                  className="-mt-1 font-display text-[2.8rem] leading-none text-earth sm:text-[3.55rem]"
                >
                  “
                </span>
                <div>
                  <h2 className="max-w-[40rem] font-display text-[1.9rem] font-semibold uppercase leading-[1.02] tracking-[0em] text-charcoal sm:text-[2.38rem] lg:text-[2.55rem]">
                    {mottoLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </h2>
                  <p className="mt-2.5 max-w-[35rem] text-[0.72rem] font-medium leading-[1.55] text-charcoal/64 sm:text-[0.78rem]">
                    {description}
                  </p>
                </div>
                <span
                  aria-hidden="true"
                  className="hidden self-start font-display text-[2.8rem] leading-none text-earth sm:block sm:text-[3.55rem]"
                >
                  ”
                </span>
              </div>
            </blockquote>
            <div
              aria-hidden="true"
              className="relative hidden h-[9.75rem] w-full overflow-hidden opacity-[0.18] mix-blend-multiply lg:block"
            >
              <Image
                src="/images/brand/logo-thien-duc.png"
                alt=""
                fill
                sizes="16rem"
                className="object-contain object-right"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
