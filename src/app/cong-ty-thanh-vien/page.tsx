import { SiteShell } from "@/components/layout/site-shell";
import { PageHeading } from "@/components/ui/page-heading";

export default function MemberCompaniesPage() {
  return (
    <SiteShell>
      <PageHeading
        eyebrow="Công ty thành viên"
        title="Hệ thống công ty thành viên"
        description="Trang này sẽ giới thiệu các đơn vị thành viên và mối liên kết trong hệ sinh thái Thiên Đức."
      />
    </SiteShell>
  );
}
