import { SiteShell } from "@/components/layout/site-shell";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeading } from "@/components/ui/page-heading";
import { routes } from "@/lib/routes";

export default function HumanResourcesPolicyPage() {
  return (
    <SiteShell>
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: routes.home },
          { label: "Tuyển dụng & Nhân sự", href: routes.careers },
          { label: "Chính sách nhân sự" },
        ]}
      />
      <PageHeading
        eyebrow="Nhân sự"
        title="Chính sách nhân sự"
        description="Trang này sẽ tổng hợp các chính sách nhân sự, phúc lợi và môi trường làm việc tại Thiên Đức."
      />
    </SiteShell>
  );
}
