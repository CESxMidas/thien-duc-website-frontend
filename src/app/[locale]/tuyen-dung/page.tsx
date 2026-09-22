import { notFound, redirect } from "next/navigation";
import { isLocale, localizePath } from "@/lib/i18n/config";
import { routes } from "@/lib/routes";

export default async function CareersPage({
  params,
}: PageProps<"/[locale]/tuyen-dung">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  redirect(localizePath(routes.about, locale));
}
