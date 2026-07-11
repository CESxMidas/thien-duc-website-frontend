import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BriefcaseBusiness, CalendarClock, MapPin } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { PageHeading } from "@/components/ui/page-heading";
import { siteConfig } from "@/config/site";
import {
  careersHero,
  careersProcess,
  careersValues,
  openPositions,
} from "@/data/careers";
import { formatDate } from "@/lib/format";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo";

const copy: Record<Locale, { title: string; description: string }> = {
  vi: {
    title: "Tuyển dụng | Cơ hội nghề nghiệp tại Thiên Đức",
    description:
      "Vị trí đang tuyển, quy trình ứng tuyển và thông tin nộp hồ sơ tại Công ty Thiên Đức.",
  },
  en: {
    title: "Careers | Opportunities at Thien Duc",
    description:
      "Open positions, the application process, and how to apply at Thien Duc.",
  },
};

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/tuyen-dung">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // Khung đã dựng nhưng chưa có vị trí tuyển dụng thật (câu 4) — chưa cho lập
  // chỉ mục để tránh một trang tuyển dụng rỗng lọt vào kết quả tìm kiếm.
  return buildPageMetadata({
    ...copy[locale],
    path: routes.careers,
    locale,
    noIndex: true,
  });
}

const applyHref = `mailto:${siteConfig.email}?subject=${encodeURIComponent(
  "Ứng tuyển - [Vị trí]",
)}`;

export default async function CareersPage({
  params,
}: PageProps<"/[locale]/tuyen-dung">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <SiteShell locale={locale}>
      <PageHeading
        eyebrow={careersHero.eyebrow}
        title={careersHero.title}
        description={careersHero.description}
      />

      <section className="reveal-section mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-14">
        <div className="stagger-list grid gap-4 md:grid-cols-3">
          {careersValues.map((value) => (
            <article
              key={value.title}
              className="hover-card border border-black/10 bg-white p-6 hover:border-brand/35"
            >
              <h2 className="text-xl font-semibold">{value.title}</h2>
              <p className="mt-4 text-sm leading-6 text-slate">
                {value.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="reveal-section mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-14">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-brand">
            Vị trí đang tuyển
          </p>
          <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
            Các vị trí Thiên Đức đang tìm kiếm
          </h2>
        </div>

        {openPositions.length > 0 ? (
          <div className="stagger-list mt-10 grid gap-4">
            {openPositions.map((position) => (
              <article
                key={position.title}
                className="hover-card border border-black/10 bg-white p-6 hover:border-brand md:p-8"
              >
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                  <span className="inline-flex items-center gap-1.5">
                    <BriefcaseBusiness className="size-4" aria-hidden="true" />
                    {position.department}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-4" aria-hidden="true" />
                    {position.location}
                  </span>
                  <span>{position.type}</span>
                  {position.deadline ? (
                    <span className="inline-flex items-center gap-1.5 text-slate">
                      <CalendarClock className="size-4" aria-hidden="true" />
                      Hạn nộp {formatDate(position.deadline)}
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-3 text-2xl font-semibold leading-tight">
                  {position.title}
                </h3>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink">
                      Mô tả công việc
                    </h4>
                    <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate">
                      {position.responsibilities.map((item) => (
                        <li key={item} className="border-l-2 border-gold pl-3">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink">
                      Yêu cầu ứng viên
                    </h4>
                    <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate">
                      {position.requirements.map((item) => (
                        <li key={item} className="border-l-2 border-gold pl-3">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <a
                  href={applyHref}
                  className="button-polish mt-7 inline-flex h-11 items-center bg-brand px-5 text-sm font-semibold text-white transition hover:bg-brand-dark"
                >
                  Ứng tuyển vị trí này
                </a>
              </article>
            ))}
          </div>
        ) : (
          <div className="reveal-section mt-10 border border-black/10 bg-white p-8">
            <h3 className="text-2xl font-semibold">
              Hiện chưa có vị trí đang tuyển
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate">
              Thiên Đức vẫn tiếp nhận hồ sơ ứng tuyển tự do. Gửi CV kèm vị trí
              bạn quan tâm, bộ phận nhân sự sẽ liên hệ khi có nhu cầu phù hợp.
            </p>
            <a
              href={applyHref}
              className="button-polish mt-6 inline-flex h-11 items-center bg-brand px-5 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              Gửi hồ sơ ứng tuyển
            </a>
          </div>
        )}
      </section>

      <section className="reveal-section mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-16">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-brand">
            Quy trình
          </p>
          <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
            Các bước ứng tuyển
          </h2>
        </div>

        <ol className="stagger-list mt-10 grid gap-4 md:grid-cols-3">
          {careersProcess.map((step) => (
            <li
              key={step.step}
              className="hover-card border border-black/10 bg-white p-6"
            >
              <p className="text-sm font-semibold text-brand">{step.step}</p>
              <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </SiteShell>
  );
}
