import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { PageHeading } from "@/components/ui/page-heading";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo";

const copy: Record<Locale, { title: string; description: string }> = {
  vi: {
    title: "Tuyển dụng | Cơ hội nghề nghiệp tại Thiên Đức",
    description:
      "Vị trí đang tuyển, yêu cầu ứng viên và thông tin nộp hồ sơ tại Công ty Thiên Đức.",
  },
  en: {
    title: "Careers | Opportunities at Thien Duc",
    description:
      "Open positions, candidate requirements, and how to apply at Thien Duc.",
  },
};

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/tuyen-dung">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // Nội dung thật còn chờ công ty cung cấp (câu 5) → chưa cho lập chỉ mục.
  return buildPageMetadata({
    ...copy[locale],
    path: routes.careers,
    locale,
    noIndex: true,
  });
}

export default async function CareersPage({
  params,
}: PageProps<"/[locale]/tuyen-dung">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <SiteShell locale={locale}>
      <PageHeading
        eyebrow="Tuyen dung"
        title="Cơ hội nghề nghiệp tại Thiên Đức"
        description="Trang nay se hien thi vi tri dang tuyen, yeu cau ung vien va thong tin nop ho so."
      />
    </SiteShell>
  );
}
