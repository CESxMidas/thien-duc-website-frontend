import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeading } from "@/components/ui/page-heading";
import { isLocale, localizePath, type Locale } from "@/lib/i18n/config";
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

  return (
    <SiteShell locale={locale}>
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: localizePath(routes.home, locale) },
          {
            label: "Tuyển dụng & Nhân sự",
            href: localizePath(routes.careers, locale),
          },
          { label: "Sơ đồ tổ chức công ty" },
        ]}
      />
      <PageHeading
        eyebrow="Nhân sự"
        title="Sơ đồ tổ chức công ty"
        description="Trang này sẽ trình bày cơ cấu tổ chức và các bộ phận chính của Thiên Đức."
      />
    </SiteShell>
  );
}
