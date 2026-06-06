import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#B06613]/20 bg-[#c99248] text-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-10 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-lg font-semibold">{siteConfig.name}</p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
            {siteConfig.description}
          </p>
        </div>
        <p className="text-sm text-white/60">{siteConfig.email}</p>
      </div>
    </footer>
  );
}
