import Image from "next/image";
import { BookOpen, Building2, ShieldCheck, UsersRound } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

const valueIcons = [UsersRound, Building2, BookOpen];

type CareersCultureProps = {
  careers: Dictionary["careers"];
  hrPages: Dictionary["hrPages"];
  locale: Locale;
};

export function CareersCulture({ careers, hrPages, locale }: CareersCultureProps) {
  const peopleSections = [
    { ...hrPages.training, icon: BookOpen },
    { ...hrPages.hrPolicy, icon: ShieldCheck },
  ];

  return (
    <>
      <section className="careers-culture careers-section reveal-section" aria-labelledby="careers-culture-title">
        <div className="careers-content-container page-container careers-culture-grid">
          <div className="careers-culture-image relative overflow-hidden">
            <Image
              src="/images/about/careers-team-meeting.png"
              alt={
                locale === "vi"
                  ? "Đội ngũ nhân sự cùng trao đổi công việc quanh máy tính"
                  : "Colleagues collaborating around a laptop"
              }
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="careers-culture-media object-cover object-right"
            />
          </div>
          <div className="min-w-0 self-center">
            <p className="text-eyebrow text-earth">{careers.whyEyebrow}</p>
            <h2 id="careers-culture-title" className="careers-section-title mt-3">{careers.whyTitle}</h2>
            <div className="careers-value-list mt-5">
              {careers.values.map((value, index) => {
                const Icon = valueIcons[index] ?? UsersRound;
                return (
                  <article key={value.title} className="flex gap-3 border-t border-gold/35">
                    <Icon className="mt-1 size-6 shrink-0 text-earth" aria-hidden="true" />
                    <div>
                      <h3 className="text-lg font-semibold text-charcoal">{value.title}</h3>
                      <p className="mt-1.5 text-sm leading-6 text-slate">{value.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="careers-people careers-section reveal-section bg-ivory" aria-labelledby="careers-people-title">
        <div className="careers-content-container page-container careers-people-grid">
          <div className="min-w-0">
            <p className="text-eyebrow text-earth">{careers.peopleEyebrow}</p>
            <h2 id="careers-people-title" className="careers-section-title mt-4">{careers.peopleTitle}</h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate">{careers.peopleDescription}</p>
          </div>
          <div>
            {peopleSections.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="border-t border-gold/40 py-6 first:pt-6 last:pb-0">
                  <div className="flex items-center gap-4">
                    <Icon className="size-6 shrink-0 text-earth" aria-hidden="true" />
                    <h3 className="font-display text-3xl font-medium text-charcoal">{item.title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
