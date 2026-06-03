import { SiteShell } from "@/components/layout/site-shell";
import { HomeBannerSlider } from "@/components/sections/home-banner-slider";
import { HomeHero } from "@/components/sections/home-hero";

export default function HomePage() {
  return (
    <SiteShell>
      <HomeBannerSlider />
      <HomeHero />
    </SiteShell>
  );
}
