import { SiteShell } from "@/components/layout/site-shell";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeading } from "@/components/ui/page-heading";
import { routes } from "@/lib/routes";

export default function OrganizationChartPage() {
  return (
    <SiteShell>
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: routes.home },
          { label: "Tuyển dụng & Nhân sự", href: routes.careers },
          { label: "Sơ đồ tổ chức công ty" },
        ]}
      />
      <PageHeading
        eyebrow="Nhân sự"
        title="Sơ đồ tổ chức công ty"
        description="Trang này sẽ trình bày cơ cấu tổ chức và các bộ phận chính của Thiên Đức."
      />
    </SiteShell>
  );
}
