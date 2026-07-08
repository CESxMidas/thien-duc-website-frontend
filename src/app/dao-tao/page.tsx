import { SiteShell } from "@/components/layout/site-shell";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeading } from "@/components/ui/page-heading";
import { routes } from "@/lib/routes";

export default function TrainingPage() {
  return (
    <SiteShell>
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: routes.home },
          { label: "Tuyển dụng & Nhân sự", href: routes.careers },
          { label: "Đào tạo" },
        ]}
      />
      <PageHeading
        eyebrow="Nhân sự"
        title="Đào tạo"
        description="Trang này sẽ giới thiệu hoạt động đào tạo, phát triển năng lực và văn hóa học tập của công ty."
      />
    </SiteShell>
  );
}
