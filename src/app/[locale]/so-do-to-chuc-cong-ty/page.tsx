import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeading } from "@/components/ui/page-heading";
import { isLocale, localizePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo";

const PATH = "/so-do-to-chuc-cong-ty";

const copy: Record<Locale, { title: string; description: string }> = {
  vi: {
    title: "Sơ đồ tổ chức công ty | Thiên Đức",
    description: "Cơ cấu tổ chức và các bộ phận chính của Công ty Thiên Đức.",
  },
  en: {
    title: "Organisation chart | Thien Duc",
    description: "The organisational structure and core departments of Thien Duc.",
  },
};

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/so-do-to-chuc-cong-ty">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // Nội dung thật còn chờ công ty cung cấp (câu 5) → chưa cho lập chỉ mục.
  return buildPageMetadata({ ...copy[locale], path: PATH, locale, noIndex: true });
}

export default async function OrganizationChartPage({
  params,
}: PageProps<"/[locale]/so-do-to-chuc-cong-ty">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = await getDictionary(locale);
  const { orgChart } = dictionary.hrPages;

  return (
    <SiteShell locale={locale}>
      <Breadcrumb
        items={[
          {
            label: dictionary.breadcrumb.home,
            href: localizePath(routes.home, locale),
          },
          {
            label: dictionary.hrPages.parentLabel,
            href: localizePath(routes.careers, locale),
          },
          { label: orgChart.title },
        ]}
      />
      <PageHeading
        eyebrow={dictionary.hrPages.eyebrow}
        title={orgChart.title}
        description={orgChart.description}
      />
    </SiteShell>
  );
}
