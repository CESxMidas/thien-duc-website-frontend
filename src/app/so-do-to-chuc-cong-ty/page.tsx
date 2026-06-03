import { SiteShell } from "@/components/layout/site-shell";
import { PageHeading } from "@/components/ui/page-heading";

export default function OrganizationChartPage() {
  return (
    <SiteShell>
      <PageHeading
        eyebrow="Nhân sự"
        title="Sơ đồ tổ chức công ty"
        description="Trang này sẽ trình bày cơ cấu tổ chức và các bộ phận chính của Thiên Đức."
      />
    </SiteShell>
  );
}
