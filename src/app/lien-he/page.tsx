import { siteConfig } from "@/config/site";
import { SiteShell } from "@/components/layout/site-shell";
import { PageHeading } from "@/components/ui/page-heading";

export default function ContactPage() {
  return (
    <SiteShell>
      <PageHeading
        eyebrow="Lien he"
        title="Ket noi voi Thien Duc"
        description="Trang nay se chua thong tin lien he, dia chi, ban do va form gui yeu cau."
      />
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="border border-black/10 bg-white p-6">
          <p className="text-sm text-[#59646a]">Email</p>
          <p className="mt-2 font-semibold">{siteConfig.email}</p>
        </div>
      </section>
    </SiteShell>
  );
}
