import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { ContactSection } from "@/components/sections/contact-section";
import { PageHeading } from "@/components/ui/page-heading";
import { getPageBySlug } from "@/lib/api/pages";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo";
const PAGE_SLUG = "lien-he";
const metaCopy: Record<Locale, { title: string; description: string }> = {
  vi: {
    title: "Liên hệ Thiên Đức | Tư vấn dự án và hợp tác",
    description:
      "Thông tin liên hệ Công ty Thiên Đức, hỗ trợ trao đổi về dự án, hợp tác phát triển và nhu cầu tư vấn bất động sản.",
  },
  en: {
    title: "Contact Thien Duc | Project advisory and partnerships",
    description:
      "Contact details for Thien Duc: project enquiries, development partnerships, and real estate advisory.",
  },
};

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/lien-he">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return buildPageMetadata({
    ...metaCopy[locale],
    path: routes.contact,
    locale,
  });
}

export default async function ContactPage({
  params,
}: PageProps<"/[locale]/lien-he">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [page, dictionary] = await Promise.all([
    getPageBySlug(PAGE_SLUG, locale),
    getDictionary(locale),
  ]);
  const contact = dictionary.contact;
  const heading = {
    title: page?.title ?? contact.heroTitle,
    description: page?.paragraphs[0] ?? contact.heroDescription,
  };

  return (
    <SiteShell
      locale={locale}
      breadcrumbs={[
        { label: dictionary.breadcrumb.home, href: locale === "en" ? "/en" : "/" },
        { label: dictionary.navLabels["/lien-he"] ?? "Liên hệ" },
      ]}
    >
      <PageHeading
        eyebrow={contact.heroEyebrow}
        title={heading.title}
        description={heading.description}
      />

      <ContactSection dictionary={dictionary} locale={locale} />
    </SiteShell>
  );
}
