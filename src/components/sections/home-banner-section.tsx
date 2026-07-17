import { HomeBannerSlider } from "@/components/sections/home-banner-slider";
import { getBanners } from "@/lib/api/banners";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

/** Nạp banner từ CMS (`GET /banners`) rồi bàn giao cho carousel phía client. */
export async function HomeBannerSection({ locale }: { locale: Locale }) {
  const [banners, dictionary] = await Promise.all([
    getBanners(locale),
    getDictionary(locale),
  ]);

  return (
    <HomeBannerSlider
      banners={banners}
      locale={locale}
      contactCtaLabel={dictionary.common.contactCta}
      labels={dictionary.homeBanner}
    />
  );
}
