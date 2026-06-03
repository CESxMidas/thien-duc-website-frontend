import { SiteShell } from "@/components/layout/site-shell";
import { PageHeading } from "@/components/ui/page-heading";

export default function AboutPage() {
  return (
    <SiteShell>
      <PageHeading
        eyebrow="Gioi thieu"
        title="Tong quan ve Cong ty Thien Duc"
        description="Trang nay se trinh bay lich su hinh thanh, tam nhin, linh vuc hoat dong va nang luc doanh nghiep."
      />
    </SiteShell>
  );
}
