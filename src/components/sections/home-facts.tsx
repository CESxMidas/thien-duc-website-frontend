import type { Locale } from "@/lib/i18n/config";

const labels: Record<
  Locale,
  {
    years: string;
    projects: string;
    customers: string;
    partners: string;
    tagline: string[];
  }
> = {
  vi: {
    years: "Năm hình thành & phát triển",
    projects: "Dự án đầu tư & phát triển",
    customers: "Khách hàng & cư dân đồng hành",
    partners: "Đối tác uy tín",
    tagline: ["Giá trị", "Kiến tạo", "Bằng thời gian"],
  },

  en: {
    years: "Years of formation & growth",
    projects: "Investment & development projects",
    customers: "Customers & residents accompanied",
    partners: "Trusted partners",
    tagline: ["Value", "Created", "Over time"],
  },
};

export function HomeFacts({ locale }: { locale: Locale }) {
  const facts = [
    {
      value: "16+",
      label: labels[locale].years,
    },
    {
      value: "20+",
      label: labels[locale].projects,
    },
    {
      value: "1000+",
      label: labels[locale].customers,
    },
    {
      value: "50+",
      label: labels[locale].partners,
    },
  ];

  return (
    <section className="bg-ivory text-charcoal">
      <div className="grid w-full border-y border-earth/15 px-5 py-6 sm:grid-cols-2 sm:px-8 lg:grid-cols-[1fr_1fr_1.25fr_1fr_0.9fr] lg:px-20 lg:py-7 xl:px-28">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="border-b border-earth/15 py-5 pr-5 sm:even:border-l sm:even:pl-8 lg:border-b-0 lg:border-r lg:px-8 lg:py-0 lg:first:pl-0 lg:even:border-l-0"
          >
            <p className="font-display text-[2.625rem] font-medium leading-none text-earth sm:text-5xl lg:text-[3.25rem]">
              {fact.value}
            </p>

            <p className="mt-3 text-[0.72rem] font-bold uppercase leading-[1.45] text-charcoal/65">
              {fact.label}
            </p>
          </div>
        ))}

        <div className="flex items-center pt-5 sm:col-span-2 lg:col-span-1 lg:border-l lg:border-earth/25 lg:pl-10 lg:pt-0">
          <div className="flex flex-col items-start">
            <p className="text-[0.68rem] font-semibold uppercase leading-[1.7] tracking-[0.015em] text-earth/75">
              {labels[locale].tagline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>

            <span className="mt-3.5 block h-px w-12 bg-earth/50" />
          </div>
        </div>
      </div>
    </section>
  );
}
