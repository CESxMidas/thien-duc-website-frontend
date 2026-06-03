import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { HomeBannerSlider } from "@/components/sections/home-banner-slider";
import { HomeCapabilities } from "@/components/sections/home-capabilities";
import { HomeContactCta } from "@/components/sections/home-contact-cta";
import { HomeFeaturedProjects } from "@/components/sections/home-featured-projects";
import { HomeHero } from "@/components/sections/home-hero";
import { HomeLatestNews } from "@/components/sections/home-latest-news";

export const metadata: Metadata = {
  title: "Công ty Thiên Đức | Đầu tư & phát triển bất động sản TP.HCM",
  description:
    "Công ty TNHH Đầu tư – Xây dựng – Thương mại Thiên Đức hoạt động trong lĩnh vực bất động sản, đầu tư xây dựng và phát triển đô thị.",
};

export default function HomePage() {
  return (
    <SiteShell>
      <HomeBannerSlider />
      <HomeHero />
      <HomeFeaturedProjects />
      <HomeCapabilities />
      <HomeLatestNews />
      <HomeContactCta />
    </SiteShell>
  );
}
