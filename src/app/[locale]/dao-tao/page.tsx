import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeading } from "@/components/ui/page-heading";
import { isLocale, localizePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
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
  const dictionary = await getDictionary(locale);
  const { training } = dictionary.hrPages;

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
          { label: training.title },
        ]}
      />
      <PageHeading
        eyebrow={dictionary.hrPages.eyebrow}
        title={training.title}
        description={training.description}
      />
    </SiteShell>
  );
}
