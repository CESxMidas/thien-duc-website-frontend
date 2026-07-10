import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeading } from "@/components/ui/page-heading";
import { isLocale, localizePath, type Locale } from "@/lib/i18n/config";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo";

const PATH = "/chinh-sach-nhan-su";

const copy: Record<Locale, { title: string; description: string }> = {
  vi: {
    title: "Chính sách nhân sự | Thiên Đức",
    description:
      "Chính sách nhân sự, phúc lợi và môi trường làm việc tại Công ty Thiên Đức.",
  },
  en: {
    title: "HR policy | Thien Duc",
    description:
      "Human resources policy, benefits, and the working environment at Thien Duc.",
  },
};

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/chinh-sach-nhan-su">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // Nội dung thật còn chờ công ty cung cấp (câu 5) → chưa cho lập chỉ mục.
  return buildPageMetadata({ ...copy[locale], path: PATH, locale, noIndex: true });
}

export default async function HumanResourcesPolicyPage({
  params,
}: PageProps<"/[locale]/chinh-sach-nhan-su">) {
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
          { label: "Chính sách nhân sự" },
        ]}
      />
      <PageHeading
        eyebrow="Nhân sự"
        title="Chính sách nhân sự"
        description="Trang này sẽ tổng hợp các chính sách nhân sự, phúc lợi và môi trường làm việc tại Thiên Đức."
      />
    </SiteShell>
  );
}
