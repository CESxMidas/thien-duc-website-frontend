import { apiFetch } from "@/lib/api/client";
import type { Locale } from "@/lib/i18n/config";

export type CompanyContact = {
  phone: string;
  email: string;
  taxCode: string;
  address: { vi: string; en?: string };
};

export function getCompanyContact(): Promise<CompanyContact> {
  return apiFetch<CompanyContact>("/settings/company-contact", {
    next: { revalidate: 60 },
  });
}

export function companyAddress(
  contact: CompanyContact,
  locale: Locale,
): string {
  return (
    (locale === "en" ? contact.address.en?.trim() : undefined) ||
    contact.address.vi
  );
}

export type BrandingSettings = {
  logoUrl: string | null;
  logoAlt: string | null;
  faviconUrl: string | null;
};

export async function getBrandingSettings(): Promise<BrandingSettings> {
  return apiFetch<BrandingSettings>("/settings/branding");
}
