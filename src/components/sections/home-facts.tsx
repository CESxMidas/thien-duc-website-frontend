import type { Locale } from "@/lib/i18n/config";

const labels: Record<
  Locale,
  {
    years: string;
    projects: string;
    customers: string;
    partners: string;
    tagline: string;
  }
> = {
  vi: {
    years: "Năm hình thành & phát triển",
    projects: "Dự án đầu tư & phát triển",
    customers: "Khách hàng & cư dân đồng hành",
    partners: "Đối tác uy tín",
    tagline: "Giá trị kiến tạo bằng thời gian",
  },
  en: {
    years: "Years of formation & growth",
    projects: "Investment & development projects",
    customers: "Customers & residents accompanied",
    partners: "Trusted partners",
    tagline: "Value created over time",
  },
};

export function HomeFacts({ locale }: { locale: Locale }) {
  const facts = [
    { value: "16+", label: labels[locale].years },
    { value: "20+", label: labels[locale].projects },
    { value: "1000+", label: labels[locale].customers },
    { value: "50+", label: labels[locale].partners },
  ];

  return (
    <section className="bg-ivory text-charcoal">
      <div className="mx-auto grid max-w-site border-y border-earth/15 px-5 py-6 sm:grid-cols-2 sm:px-8 lg:grid-cols-[repeat(4,minmax(0,1fr))_0.85fr] lg:px-10 lg:py-7">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="border-b border-earth/15 py-5 pr-5 sm:even:border-l sm:even:pl-8 lg:border-b-0 lg:border-r lg:py-0 lg:pl-8 lg:first:pl-0 lg:even:border-l-0"
          >
            <p className="font-display text-[2.625rem] font-medium leading-none text-earth sm:text-5xl lg:text-[3.25rem]">
              {fact.value}
            </p>
            <p className="mt-3 max-w-36 text-[0.72rem] font-bold uppercase leading-[1.45] text-charcoal/65 sm:max-w-44">
              {fact.label}
            </p>
          </div>
        ))}
        <div className="flex items-center border-earth/20 pt-5 sm:col-span-2 lg:col-span-1 lg:border-l lg:pl-10 lg:pt-0">
          <p className="max-w-32 text-[0.72rem] font-bold uppercase leading-[1.55] text-earth/75">
            {labels[locale].tagline}
            <span className="mt-4 block h-px w-16 bg-earth/55" />
          </p>
        </div>
      </div>
    </section>
  );
}
