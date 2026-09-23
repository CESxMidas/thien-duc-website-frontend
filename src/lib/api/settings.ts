import { apiFetch } from "@/lib/api/client";

export type BrandingSettings = {
  logoUrl: string | null;
  logoAlt: string | null;
  faviconUrl: string | null;
};

export async function getBrandingSettings(): Promise<BrandingSettings> {
  return apiFetch<BrandingSettings>("/settings/branding");
}
