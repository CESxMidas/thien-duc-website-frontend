import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { PageHeading } from "@/components/ui/page-heading";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo";

const copy: Record<Locale, { title: string; description: string }> = {
  vi: {
    title: "Công ty thành viên | Hệ sinh thái Thiên Đức",
    description:
      "Các đơn vị thành viên và mối liên kết trong hệ sinh thái Công ty Thiên Đức.",
  },
  en: {
    title: "Member companies | The Thien Duc ecosystem",
    description:
      "Member companies and how they connect within the Thien Duc ecosystem.",
  },
};

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/cong-ty-thanh-vien">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // Nội dung thật còn chờ công ty cung cấp (câu 5) → chưa cho lập chỉ mục.
  return buildPageMetadata({
    ...copy[locale],
    path: routes.members,
    locale,
    noIndex: true,
  });
}

export default async function MemberCompaniesPage({
  params,
}: PageProps<"/[locale]/cong-ty-thanh-vien">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <SiteShell locale={locale}>
      <PageHeading
        eyebrow="Công ty thành viên"
        title="Hệ thống công ty thành viên"
        description="Trang này sẽ giới thiệu các đơn vị thành viên và mối liên kết trong hệ sinh thái Thiên Đức."
      />
    </SiteShell>
  );
}
