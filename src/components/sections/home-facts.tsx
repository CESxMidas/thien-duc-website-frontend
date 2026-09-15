import { legalInfo } from "@/config/site";
import { getProjects } from "@/lib/api/projects";
import type { Locale } from "@/lib/i18n/config";

const labels: Record<
  Locale,
  {
    since: string;
    projects: string;
    bilingual: string;
  }
> = {
  vi: {
    since: "Năm bắt đầu hoạt động",
    projects: "Dự án đang giới thiệu",
    bilingual: "Trải nghiệm song ngữ",
  },
  en: {
    since: "Operating since",
    projects: "Published projects",
    bilingual: "Bilingual experience",
  },
};

export async function HomeFacts({ locale }: { locale: Locale }) {
  const projects = await getProjects(locale);
  const operatingYear = legalInfo.operatingSince.split("/").at(-1) ?? "2010";

  const facts = [
    { value: operatingYear, label: labels[locale].since },
    {
      value: String(projects.length).padStart(2, "0"),
      label: labels[locale].projects,
    },
    { value: "VI / EN", label: labels[locale].bilingual },
  ];

  return (
    <section className="bg-charcoal text-ivory">
      <div className="mx-auto grid max-w-site border-x border-ivory/15 sm:grid-cols-3">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="border-b border-ivory/15 px-4 py-6 sm:border-b-0 sm:border-r sm:px-6 sm:py-8 last:sm:border-r-0"
          >
            <p className="font-display text-4xl font-medium leading-none sm:text-5xl">
              {fact.value}
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-ivory/65">
              {fact.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
