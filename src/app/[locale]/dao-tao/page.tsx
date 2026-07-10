import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeading } from "@/components/ui/page-heading";
import { isLocale, localizePath, type Locale } from "@/lib/i18n/config";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo";

const PATH = "/dao-tao";

const copy: Record<Locale, { title: string; description: string }> = {
  vi: {
    title: "Đào tạo | Nhân sự Thiên Đức",
    description:
      "Hoạt động đào tạo, phát triển năng lực và văn hóa học tập tại Công ty Thiên Đức.",
  },
  en: {
    title: "Training | People at Thien Duc",
    description:
      "Training programmes, capability development, and the learning culture at Thien Duc.",
  },
};

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/dao-tao">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // Nội dung thật còn chờ công ty cung cấp (câu 5) → chưa cho lập chỉ mục.
  return buildPageMetadata({ ...copy[locale], path: PATH, locale, noIndex: true });
}

export default async function TrainingPage({
  params,
}: PageProps<"/[locale]/dao-tao">) {
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
          { label: "Đào tạo" },
        ]}
      />
      <PageHeading
        eyebrow="Nhân sự"
        title="Đào tạo"
        description="Trang này sẽ giới thiệu hoạt động đào tạo, phát triển năng lực và văn hóa học tập của công ty."
      />
    </SiteShell>
  );
}
